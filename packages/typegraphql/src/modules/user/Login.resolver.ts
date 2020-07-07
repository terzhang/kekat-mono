import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Ctx,
  UseMiddleware,
} from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User } from '../../entity/User';
import { LoginInput } from './LoginInput';
import { Context } from '../../types/context';
import { isAuth } from '../../middlewares/isAuth';

/* Resolvers */
// Providing an object type as arg to the Resolver decorator will...
// allow this class to resolve a field within that object type
// (in this case, the fullName field within User entity)
@Resolver(User)
export class LoginResolver {
  // GET request for a recipe via id
  @UseMiddleware(isAuth)
  @Query(() => String) // assign a name for the query must be camelCase
  async getUser(@Arg('id') id: string) {
    return 'The id: ' + id + ' is now registered';
  }

  // generate a new User modelled by the User entity
  // tells both typeGraphql and typescript that it...
  // returns a promise that gives back a User entity object
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg('data')
    { email, password }: LoginInput,
    @Ctx() ctx: Context // this gets the req object from context
  ): Promise<User | null> {
    // try to find user, if can't return null
    const user: User | undefined = await User.findOne({ where: { email } });
    if (!user) return null;

    // user exist, then compare password to check if it's valid
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;

    // set the user id inside the request's session cookie
    // controlled by the session middleware
    ctx.req.session!.userId = user.id;

    return user;
  }
}
