import { Resolver, Query, Arg, Mutation } from 'type-graphql';
import * as bcrypt from 'bcryptjs';
import { User } from '../../entity/User';
import { RegisterInput } from './RegisterInput';

/* Resolvers */
// Providing an object type as arg to the Resolver decorator will...
// allow this class to resolve a field within that object type
// (in this case, the fullName field within User entity)
@Resolver(User)
export class RegisterResolver {
  // GET request for a recipe via id
  @Query(() => String) // assign a name for the query must be camelCase
  async getUser(@Arg('id') id: string) {
    return 'The id: ' + id + ' is now registered';
  }

  // generate a new User modelled by the User entity
  // tells both typeGraphql and typescript that it...
  // returns a promise that gives back a User entity object
  @Mutation(() => User)
  async register(
    @Arg('data')
    { email, firstName, lastName, password }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();

    return user;
  }
}
