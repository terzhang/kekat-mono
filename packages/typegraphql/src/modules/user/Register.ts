import {
  Resolver,
  Query,
  Arg,
  Mutation,
  FieldResolver,
  Root,
} from 'type-graphql';
import * as bcrypt from 'bcryptjs';
import { User } from '../../entity/User';

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

  // this field resolver resolves fields in User entity / object type (fullName in this case)
  // by taking the first and last name column from User and returning them as string
  @FieldResolver(() => String)
  // the @root decorator injects the parent Object
  // func name should mirror the column name in the parent/ object type btw
  async fullName(@Root() parent: User) {
    return `${parent.firstName} ${parent.lastName}`;
  }
}
