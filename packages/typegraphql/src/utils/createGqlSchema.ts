import path from 'path';
import { buildSchema } from 'type-graphql';
import { userAuthChecker } from './AuthChecker';

const NODE_ENV = process.env.NODE_ENV?.toLowerCase();
const isTesting = NODE_ENV === 'test' || NODE_ENV == 'testing';

/** helper function to promise building a typegraphql Schema */
export const createGqlSchema = () =>
  // ! note to self: remember to add '/' after concatenating __dirname
  buildSchema({
    resolvers: [__dirname + '/../modules/**/*.resolver.ts'],
    authChecker: userAuthChecker,
    // generate schema SDL every schema build
    emitSchemaFile: !isTesting
      ? {
          path: path.resolve(__dirname, '../schema/schema.graphql'),
          commentDescriptions: true,
          sortedSchema: false, // by default the printed schema is sorted alphabetically
        }
      : undefined,
  });
