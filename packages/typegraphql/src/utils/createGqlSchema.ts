import { buildSchema } from 'type-graphql';
import { userAuthChecker } from './AuthChecker';

/** helper function to promise building a typegraphql Schema */
export const createGqlSchema = () =>
  // ! note to self: remember to add '/' after concatenating __dirname
  buildSchema({
    resolvers: [__dirname + '/../modules/**/*.resolver.ts'],
    authChecker: userAuthChecker,
  });
