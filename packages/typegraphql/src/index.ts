import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';

import { createConnection } from 'typeorm';
import session from 'express-session';
import { redis } from './database/redis';
import connectRedis from 'connect-redis';
import cors from 'cors';
import { SESSION_SECRET } from './env/secrets';
import { COOKIE_NAME } from './constants/names';
import { createGqlSchema } from './utils/createGqlSchema';
import { GraphQLSchema, DocumentNode } from 'graphql';
import { getComplexity } from 'graphql-query-complexity/dist/QueryComplexity';
import {
  fieldExtensionsEstimator,
  simpleEstimator,
} from 'graphql-query-complexity/dist/estimators';

const PORT = 8000;

interface operationOptions {
  request: {
    operationName?: string | undefined;
    variables?: Object | undefined;
  };
  document: DocumentNode;
}

const queryComplexityPlugin = (schema: GraphQLSchema) => ({
  requestDidStart: () => ({
    didResolveOperation({ request, document }: operationOptions) {
      /**
       * This provides GraphQL query analysis to be able to react on complex queries to your GraphQL server.
       * This can be used to protect your GraphQL servers against resource exhaustion and DoS attacks.
       * More documentation can be found at https://github.com/ivome/graphql-query-complexity.
       */
      const complexity = getComplexity({
        // Our built schema
        schema,
        // To calculate query complexity properly,
        // we have to check only the requested operation
        // not the whole document that may contains multiple operations
        operationName: request.operationName,
        // The GraphQL query document
        query: document,
        // The variables for our GraphQL query
        variables: request.variables,
        // Add any number of estimators. The estimators are invoked in order, the first
        // numeric value that is being returned by an estimator is used as the field complexity.
        // If no estimator returns a value, an exception is raised.
        estimators: [
          // Using fieldExtensionsEstimator is mandatory to make it work with type-graphql.
          fieldExtensionsEstimator(),
          // Add more estimators here...
          // This will assign each field a complexity of 1
          // if no other estimator returned a value.
          simpleEstimator({ defaultComplexity: 1 }),
        ],
      });
      const maxComplexity = 20;
      // Here we can react to the calculated complexity,
      // like compare it with max and throw error when the threshold is reached.
      if (complexity > maxComplexity) {
        throw new Error(
          `Query is too complicated! ${complexity} is over ${maxComplexity} that is the max allowed complexity.`
        );
      }
      // And here we can e.g. subtract the complexity point from hourly API calls limit.
      console.log('Used query complexity points:', complexity);
    },
  }),
});

// this make it start async'ly
const main = async () => {
  // https://typeorm.io/#/connection/creating-a-new-connection
  // this read from orm config to make a connection to database
  await createConnection();
  const schema = (await createGqlSchema()) as GraphQLSchema;
  // this build a graphQL schema to be used by the server
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res }), // access to the request and respond object
    plugins: [queryComplexityPlugin(schema)],
  });

  // configuring redisStore with session
  const RedisStore = connectRedis(session);
  const sessionOption: session.SessionOptions = {
    store: new RedisStore({
      client: redis,
    }),
    name: COOKIE_NAME,
    secret: SESSION_SECRET || '',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
    },
  };

  const app = Express(); // express app
  // express middleware
  app.use(
    cors({
      credentials: true,
      origin: 'http://localhost:8000',
    })
  );
  app.use(session(sessionOption));
  // apollo
  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log('server started on http://localhost:' + PORT + '/graphql');
  });
};

// start it
main();
