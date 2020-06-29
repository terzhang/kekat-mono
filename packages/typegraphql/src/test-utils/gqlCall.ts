import { graphql, GraphQLArgs, GraphQLSchema } from 'graphql';
import { createGqlSchema } from '../utils/createGqlSchema';

interface gqlOptions {
  source: GraphQLArgs['source'];
  variableValues: GraphQLArgs['variableValues'];
}

let schema: GraphQLSchema; // cache the schema

/**
 * Helper function to call graphql
 */
export const gqlCall = async ({ source, variableValues }: gqlOptions) => {
  if (!schema) schema = await createGqlSchema();
  return graphql({
    schema,
    source,
    variableValues,
  });
};
