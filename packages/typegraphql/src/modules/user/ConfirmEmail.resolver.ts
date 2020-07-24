import { Resolver, Arg, Mutation } from 'type-graphql';
import { User } from '../../entity/User';
import { redis } from '../../database/redis';
import { confirmEmailPrefix } from '../../constants/redisPrefixes';
import { sendConfirmationEmail } from '../../utils/sendMail';
import { confirmEmailUrlPrefix } from '../../constants/urlPrefixes';
import { confirmationUrl } from '../../utils/confirmationUrl';

@Resolver()
export class ConfirmEmailResolver {
  /** resolve for mutation to confirm email */
  @Mutation(() => Boolean)
  async confirmEmail(@Arg('uniqueId') uniqueId: string): Promise<Boolean> {
    // given the uniqueId key, check if its corresponding value exist in the redis storage
    const userId = await redis.get(confirmEmailPrefix + uniqueId);

    // return false if id is bad or expired
    if (!userId) return false;
    try {
      // update the User entity in database for the confirmed field to be true
      await User.update({ id: userId }, { confirmed: true });
      // once the email is confirmed, delete the uniqueId from redis storage
      await redis.del(confirmEmailPrefix + uniqueId);
    } catch (e) {
      console.log(e);
      return false;
    }

    return true;
  }

  @Mutation(() => Boolean)
  async sendConfirmEmail(@Arg('email') email: string): Promise<true> {
    // verify email exist
    const user = await User.findOne({ where: { email } });
    if (!user || user.confirmed) return true;

    // TODO: make sure user don't have another confirmation token active already
    // generate confirm url and set token in redisu
    const url = await confirmationUrl({
      userId: user.id,
      prefix: confirmEmailPrefix,
      urlPrefix: confirmEmailUrlPrefix,
    });

    // safe guard in case url can't be generated or token can't be set in redis
    if (!url) {
      console.log('Failed to set token in Redis');
      throw new Error('Server is experiencing issues. Please try again later.');
    }

    // TODO: find out if nodemailer throws any error
    await sendConfirmationEmail(email, url);
    return true;
  }
}
