import { Resolver, Query, Arg } from 'type-graphql';

/* Resolvers */
@Resolver()
export class RegisterResolver {
  // GET request for a recipe via id
  @Query(() => String, { name: 'register' }) // assign a name for the query must be camelCase
  async register(@Arg('id') id: string) {
    return 'The id: ' + id + ' is now registered';
  }
}
