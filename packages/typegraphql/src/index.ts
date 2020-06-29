import { ApolloServer } from 'apollo-server-express';
import Express from 'express';

import 'reflect-metadata';
import { createConnection } from 'typeorm';
import session from 'express-session';
import { redis } from './database/redis';
import connectRedis from 'connect-redis';
import cors from 'cors';
import { SESSION_SECRET } from './env/secrets';
import { COOKIE_NAME } from './constants/names';
import { createGqlSchema } from './utils/createGqlSchema';
import { GraphQLSchema } from 'graphql';

const PORT = 8000;

// this make it start async'ly
const main = async () => {
  // https://typeorm.io/#/connection/creating-a-new-connection
  // this read from orm config to make a connection to database
  await createConnection();

  // this build a graphQL schema to be used by the server
  const apolloServer = new ApolloServer({
    schema: (await createGqlSchema()) as GraphQLSchema,
    context: ({ req, res }: any) => ({ req, res }), // access to the request and respond object
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
