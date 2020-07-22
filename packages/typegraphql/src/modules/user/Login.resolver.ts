import { Resolver, Arg, Mutation, Ctx } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User } from '../../entity/User';
import { LoginInput } from './LoginInput';
import { Context } from '../../types/context';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../env/secrets';
import { AUTH_LENGTH } from 'src/constants/lengths';

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
      // create a new JWT with user id and secret
      // then divide it in half
      // expiresIn interpret strings as millsec, numbers as second
      const token = jwt.sign(user.id, JWT_SECRET, {
        expiresIn: `${AUTH_LENGTH}`,
      });
      const splitIndex = Math.round(token.length / 2);
      // store first half in session's http cookie by putting it in req.session
      ctx.req.session!.userId = token.substring(0, splitIndex);
      // send back the second half in body
      return token.substring(splitIndex);
    } catch (e) {
      throw new e();
    }
  }
}
