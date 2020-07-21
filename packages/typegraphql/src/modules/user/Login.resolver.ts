import { Resolver, Arg, Mutation, Ctx } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User } from '../../entity/User';
import { LoginInput } from './LoginInput';
import { Context } from '../../types/context';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../env/secrets';

/** handle user logins */
// Providing an object type as arg to the Resolver decorator will...
// allow this class to resolve a field within that object type
// (in this case, the fullName field within User entity)
@Resolver(User)
export class LoginResolver {
  // generate a new User modelled by the User entity
  // tells both typeGraphql and typescript that it...
  // returns a promise that gives back a User entity object
  @Mutation(() => User)
  async login(
    @Arg('data')
    { email, password }: LoginInput,
    @Ctx() ctx: Context // this gets the req object from context
  ): Promise<User | Error> {
    // try to find user, if can't return null
    const user: User | undefined = await User.findOne({ where: { email } });
    if (!user) throw new Error('Incorrect login info');

    // user exist, then compare password to check if it's valid
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Incorrect login info');

    // create a new JWT with user id and secret
    // and store it in session's cookie by putting it in req.session
    ctx.req.session!.userId = jwt.sign(user.id, JWT_SECRET);

    return user;
  }
}
