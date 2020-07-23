import { Resolver, Arg, Mutation } from 'type-graphql';
import { User } from '../../entity/User';
import { redis } from '../../database/redis';
import { confirmEmailPrefix } from '../../constants/redisPrefixes';

// resolve mutation for mutation to confirm email
@Resolver()
export class ConfirmEmailResolver {
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
      await redis.del(uniqueId);
    } catch (e) {
      console.log(e);
      return false;
    }

    // TODO: possibly set cookie with JWT
    return true;
  }
}
