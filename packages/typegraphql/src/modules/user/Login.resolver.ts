import { Resolver, Arg, Mutation, Ctx } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User } from '../../entity/User';
import { LoginInput } from './LoginInput';
import { Context } from '../../types/context';
import { genSplitAuthToken } from 'src/utils/genSplitAuthToken';

/** handle user logins */
// Providing an object type as arg to the Resolver decorator will...
// allow this class to resolve a field within that object type
// (in this case, the fullName field within User entity)
@Resolver(User)
export class LoginResolver {
  // generate a new User modelled by the User entity
  // tells both typeGraphql and typescript that it...
  // returns a promise that gives back a User entity object
  @Mutation(() => String)
  async login(
    @Arg('data')
    { email, password }: LoginInput,
    @Ctx() ctx: Context // this gets the req object from context
  ): Promise<string | Error> {
    // try to find user, if can't return null
    const user: User | undefined = await User.findOne({ where: { email } });
    if (!user) throw new Error('Incorrect login info');

    // user exist, then compare password to check if it's valid
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Incorrect login info');

    try {
      // generate a jwt with user id but split in half half
      const [firstHalf, secondHalf] = genSplitAuthToken(user.id);
      // store first half token in session's http cookie by putting it in req.session
      ctx.req.session!.userId = firstHalf;
      // send back the second half token in body
      return secondHalf;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
