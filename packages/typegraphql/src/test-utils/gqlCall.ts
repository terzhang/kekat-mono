import { graphql, GraphQLArgs, GraphQLSchema } from 'graphql';
import { genSplitAuthToken } from '../utils/genSplitAuthToken';
import { createGqlSchema } from '../utils/createGqlSchema';
import {
  usersOfChatroomLoader,
  chatroomsOfUserLoader,
  messagesOfChatroomLoader,
  messagesOfUserLoader,
} from '../utils/dataLoader';
import { Context } from '../types/context';
interface gqlOptions {
  source: GraphQLArgs['source'];
  variableValues?: GraphQLArgs['variableValues'];
  userId?: string;
}

interface mockContext extends Omit<Context, 'req' | 'res'> {
  req: {
    session: { userId?: string };
    headers: { authorization?: string };
  };
  res: {
    clearCookie: Function;
  };
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

  let firstHalf;
  let secondHalf;

  if (userId) {
    const result = genSplitAuthToken(userId as string);
    firstHalf = result && result[0];
    secondHalf = result && result[1];
  }

  // pass in context with req and res object
  const contextValue: mockContext = {
    req: {
      session: {
        userId: firstHalf,
      },
      headers: {
        authorization: `bearer ${secondHalf}`,
      },
    },
    res: {
      clearCookie: jest.fn(), // mock out
    },
    // ! remember to put dataloader functions that will be used into context
    usersOfChatroomLoader: usersOfChatroomLoader(),
    chatroomsOfUserLoader: chatroomsOfUserLoader(),
    messagesOfChatroomLoader: messagesOfChatroomLoader(),
    messagesOfUserLoader: messagesOfUserLoader(),
  };
  return graphql({
    schema,
    source,
    variableValues,
    contextValue,
  });
};
