import { graphql, GraphQLArgs, GraphQLSchema } from 'graphql';
import { createGqlSchema } from '../utils/createGqlSchema';
import {
  usersOfChatroomLoader,
  chatroomsOfUserLoader,
} from '../utils/dataLoader';
interface gqlOptions {
  source: GraphQLArgs['source'];
  variableValues?: GraphQLArgs['variableValues'];
  userId?: string;
}

let schema: GraphQLSchema; // cache the schema

/**
 * Helper function to call graphql
 */
export const gqlCall = async ({
  source,
  variableValues,
  userId,
}: gqlOptions) => {
  // create and cache schema only if it doesn't exist
  if (!schema) schema = await createGqlSchema();
  // pass in context with req and res object
  const contextValue = {
    req: {
      session: {
        userId,
      },
    },
    res: {
      clearCookie: jest.fn(), // mock out
    },
    usersOfChatroomLoader: usersOfChatroomLoader(),
    chatroomsOfUserLoader: chatroomsOfUserLoader(),
  };
  return graphql({
    schema,
    source,
    variableValues,
    contextValue,
  });
};
