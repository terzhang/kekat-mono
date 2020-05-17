import { ApolloServer } from 'apollo-server-express';
import * as Express from 'express';
import { buildSchema } from 'type-graphql';
import 'reflect-metadata';
// import { MaxLength, Length, ArrayMaxSize, Min, Max } from 'class-validator';
import { createConnection } from 'typeorm';
import { RegisterResolver } from './modules/user/Register';
const PORT = 9000;

// this make it start async'ly
const main = async () => {
  // https://typeorm.io/#/connection/creating-a-new-connection
  // this read from orm config to make a connection to database
  await createConnection();

  const schema = await buildSchema({
    resolvers: [RegisterResolver],
  });

  const apolloServer = new ApolloServer({ schema });
  const app = Express();

  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log('server started on http://localhost:' + PORT + '/graphql');
  });
};

// start it
main();
