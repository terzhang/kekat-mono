import { graphql, GraphQLArgs, GraphQLSchema } from 'graphql';
import { createGqlSchema } from '../utils/createGqlSchema';

interface gqlOptions {
  source: GraphQLArgs['source'];
  variableValues: GraphQLArgs['variableValues'];
}

/**
 * Helper function to call graphql
 */
export const gqlCall = async ({ source, variableValues }: gqlOptions) => {
  const schema = (await createGqlSchema()) as GraphQLSchema;
  graphql({
    schema,
    source,
    variableValues,
  });
};
