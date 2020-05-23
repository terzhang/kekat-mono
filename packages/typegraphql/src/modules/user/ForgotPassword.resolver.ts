import { Resolver, Arg, Mutation } from 'type-graphql';
import { User } from '../../entity/User';
import { sendMail } from '../../utils/sendMail';
import { forgotPasswordPrefix } from '../../constants/redisPrefixes';
import { confirmationUrl } from '../../utils/confirmationUrl';

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

    // otherwise, generate a confirmation url and send a confirmation email for them to reset their password
    const url = await confirmationUrl({
      userId: String(user.id),
      prefix: forgotPasswordPrefix,
      urlPrefix: 'http://localhost:9999/user/change-password/',
    });
    await sendMail(email, url); // then send the email
    return true;
  }
}
