import { Resolver, Query, Ctx } from 'type-graphql';
import { User } from '../../entity/User';
import { Context } from '../../types/context';

// allow the logged in user to retrieve their own info/data
@Resolver()
export class MeResolver {
  @Query(() => User)
  async getMe(@Ctx() ctx: Context): Promise<User | Error> {
    // attempt to login using session, if no session cookie -> null
    if (!ctx.userId) throw new Error('Not logged in');

    // cookie exist, attempt to find User with its stored userId
    const user = await User.findOne(ctx.userId);
    if (!user) throw new Error('Account is not valid');

    return user;
  }
}
