import { Resolver, Query, Arg, Mutation } from 'type-graphql';
import * as bcrypt from 'bcryptjs';
import { User } from '../../entity/User';

/* Resolvers */
@Resolver()
export class RegisterResolver {
  // GET request for a recipe via id
  @Query(() => String, { name: 'register' }) // assign a name for the query must be camelCase
  async user(@Arg('id') id: string) {
    return 'The id: ' + id + ' is now registered';
  }

  // tells both typeGraphql and typescript that it...
  // returns a promise that gives back a User entity object
  @Mutation(() => User)
  async register(
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('email') email: string,
    @Arg('password') password: string
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
