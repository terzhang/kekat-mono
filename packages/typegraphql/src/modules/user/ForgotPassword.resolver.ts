import { Resolver, Arg, Mutation } from 'type-graphql';
import { User } from '../../entity/User';
import { sendMail } from 'src/utils/sendMail';
import { v4 } from 'uuid';
import { redis } from 'src/database/redis';

// resolve request to change password given email
// always return true to disallow verifying the email
// TODO: return a message or error instead
@Resolver()
export class ForgotPasswordResolver {
  @Mutation(() => Boolean, { nullable: true })
  async forgotPassword(@Arg('email') email: string): Promise<true> {
    // try to find user by email, but no matter what indicated that the request is sent
    // to not let client exploit the validity of an email
    const user: User | undefined = await User.findOne({ where: { email } });
    // if their email isn't confirmed also return null
    if (!user || user.confirmed) return true;

    // otherwise, send a confirmation email for them to reset their password
    // generate a new uuid then store it in redis with key being the uuid and value being the user.id
    const uniqueId = v4();
    await redis.set(uniqueId, user.id, 'ex', 60 * 60); // expire in 1 hour
    // use the uuid and create a confirmation url with it
    const confirmationUrl = `http://localhost:9999/user/change-password/${uniqueId}`;
    await sendMail(email, confirmationUrl); // then the email

    return true;
  }
}
