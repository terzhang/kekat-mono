import { Resolver, Arg, Mutation } from 'type-graphql';
import { User } from '../../entity/User';
import { redis } from '../../database/redis';

// resolve mutation for mutation to confirm email
@Resolver()
export class ConfirmEmailResolver {
  @Mutation(() => Boolean)
  async confirmEmail(@Arg('uniqueId') uniqueId: string): Promise<Boolean> {
    // given the uniqueId key, check if its corresponding value exist in the redis storage
    const userId = await redis.get(uniqueId);
    // return false if id is bad or expired
    if (!userId) return false;

    // update the User entity in database for the confirmed field to be true
    await User.update({ id: parseInt(userId) }, { confirmed: true });
    // once the email is confirmed, delete the uniqueId from redis storage
    redis.del(uniqueId);

    return true;
  }
}
