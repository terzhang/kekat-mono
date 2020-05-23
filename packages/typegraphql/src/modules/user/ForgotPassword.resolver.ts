import { Resolver, Arg, Mutation, InputType, Field } from 'type-graphql';
import { User } from '../../entity/User';
import { sendMail } from '../../utils/sendMail';
import { forgotPasswordPrefix } from '../../constants/redisPrefixes';
import { confirmationUrl } from '../../utils/confirmationUrl';
import { redis } from 'src/database/redis';

import * as bcrypt from 'bcryptjs';

@InputType()
export class ChangePasswordInput {
  @Field()
  token: string;

  @Field()
  password: string;
}

// resolve request to change password given email
// always return true to disallow verifying the email
@Resolver()
export class ForgotPasswordResolver {
  // TODO: return a message or error instead
  @Mutation(() => Boolean, { nullable: true })
  async forgotPassword(@Arg('email') email: string): Promise<true> {
    // try to find user by email, but no matter what indicated that the request is sent
    // to not let client exploit the validity of an email
    const user: User | undefined = await User.findOne({ where: { email } });
    // if their email isn't confirmed also return null
    if (!user || user.confirmed) return true;

    // otherwise, generate a confirmation url and send a confirmation email for them to reset their password
    const url = await confirmationUrl({
      userId: String(user.id),
      prefix: forgotPasswordPrefix,
      urlPrefix: 'http://localhost:9999/user/change-password/',
    });
    await sendMail(email, url); // then send the email
    return true;
  }

  /** resolve request to change password
   * by verifying token in redis and then updating the password field
   * also deletes the token in redis post operation
   */
  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg('data') { token, password }: ChangePasswordInput
  ): Promise<User | null> {
    // verify token, return null if token invalid
    const userId = await redis.get(forgotPasswordPrefix + token); // key is forgot password prefix + token
    if (!userId) return null;

    // valid token and got userId, get the User entity
    const user = await User.findOne(userId); // TODO: catch error
    if (!user) return null; // TODO: return error

    // change the user password field to new password (that's encrypted/hashed)
    const newHashedPassword = await bcrypt.hash(password, 12);
    // await User.update({ id: parseInt(userId) }, { password: newHashedPassword });
    user.password = newHashedPassword; // this is another way to update the field of an entity in typeorm

    // finally, delete the token in redis
    redis.del(forgotPasswordPrefix + token);

    return user;
  }
}
