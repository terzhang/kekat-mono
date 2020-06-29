import { buildSchema } from 'type-graphql';
import { userAuthChecker } from '../modules/user/AuthChecker';

/** helper function to promise building a typegraphql Schema */
export const createGqlSchema = () =>
  // ! note to self: remember to add '/' after concatenating __dirname
  buildSchema({
    resolvers: [__dirname + '/../modules/**/*.resolver.ts'],
    authChecker: userAuthChecker,
  }).catch((_err) =>
    console.log('error occurred while building schema with helper function')
  );
