import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import Express, { Request, Response } from 'express';
import http from 'http';
import { createConnection } from 'typeorm';
import { session } from './middlewares/session';

import cors from 'cors';

import { createGqlSchema } from './utils/createGqlSchema';
import { GraphQLSchema, DocumentNode } from 'graphql';
import { getComplexity } from 'graphql-query-complexity/dist/QueryComplexity';
import {
  fieldExtensionsEstimator,
  simpleEstimator,
} from 'graphql-query-complexity/dist/estimators';
import {
  usersOfChatroomLoader,
  chatroomsOfUserLoader,
  messagesOfChatroomLoader,
  messagesOfUserLoader,
} from './utils/dataLoader';
import { Context } from './types/context';
import { verifyBearer } from './utils/verifyBearer';
import { verifyToken } from './utils/verifyToken';

const PORT = 8000;

interface operationOptions {
  request: {
    operationName?: string | undefined;
    variables?: Object | undefined;
  };
  document: DocumentNode;
}

// this make it start async'ly
const main = async () => {
  // https://typeorm.io/#/connection/creating-a-new-connection
  // this read from orm config to make a connection to database
  await createConnection();
  const schema = (await createGqlSchema()) as GraphQLSchema;
  // this build a graphQL schema to be used by the server
  const apolloServer = new ApolloServer({
    playground: true,
    schema,
    // context callback calls with the request and respond object
    // passes the returned object to resolvers and typegql middlewares
    // ? creating subscriptions contexts includes connection arg
    context: ({ req, res, connection }: Context) => {
      // authorizing ws transport is different from http transport
      // connection exist iff it's a ws transport
      // relay out the ws context
      if (connection) {
        // connection.context is resolved promise from subscription onConnect
        const session = connection.context.request.session;
        const authorization = connection.context.authorization;
        const secondHalf = verifyBearer(authorization);
        const firstHalf = session.userId;
        const payloadObj = verifyToken(firstHalf + secondHalf);
        // remember we provided an object for jwt
        if (!payloadObj)
          throw new Error('authentication failed. unable to verify token');
        // this will be pass as context for subscription resolvers
        return {
          userId: payloadObj!.userId,
          usersOfChatroomLoader: usersOfChatroomLoader(),
          chatroomsOfUserLoader: chatroomsOfUserLoader(),
          messagesOfChatroomLoader: messagesOfChatroomLoader(),
        };
      }

      // otherwise http context
      // NOTE: can't access session here yet until middleware is used
      return {
        req,
        res,
        usersOfChatroomLoader: usersOfChatroomLoader(),
        chatroomsOfUserLoader: chatroomsOfUserLoader(),
        messagesOfChatroomLoader: messagesOfChatroomLoader(),
        messagesOfUserLoader: messagesOfUserLoader(),
      };
    },
    subscriptions: {
      path: '/subscription',
      onConnect: async (
        connectionParams: any, // has authorization
        _webSocket: any,
        connectionContext
      ) => {
        // authenticate user on connection
        // get req session from connectionContext's HttpConnection object
        // https://github.com/apollographql/subscriptions-transport-ws/issues/466
        // We're supposed to return a promise here where
        // it will be resolved and appended to the GraphQL context of subscriptions
        // https://www.apollographql.com/docs/apollo-server/data/subscriptions/#lifecycle-events
        const req = connectionContext.request as Request;
        // pass
        const userReq: any = new Promise((resolve) =>
          session(req, {} as Response, () => {
            // since this resolved object will be available under connection.context
            return resolve({
              request: connectionContext.request,
              authorization: connectionParams.authorization,
            });
          })
        );
        return userReq;
      },
    },
    plugins: [
      {
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
            if (complexity > 0)
              console.log('Used query complexity points:', complexity);
          },
        }),
      },
    ],
  });

  const app = Express(); // express app
  // express middlewares
  app.use(
    cors({
      credentials: true,
      origin: 'http://localhost:8888',
    })
  );
  app.use(session);
  // apollo
  // override the default cors middleware to false so the express session is used
  // https://www.apollographql.com/docs/apollo-server/api/apollo-server/#Parameters-2
  apolloServer.applyMiddleware({ app, cors: false });

  const httpServer = http.createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);

  httpServer.listen(PORT, () => {
    console.log('http server started on http://localhost:' + PORT + '/graphql');
    console.log('subscription server ws://localhost:' + PORT + '/subscription');
  });
};

// start it
main();
