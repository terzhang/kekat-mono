import { Resolver, Query, Ctx, Authorized } from 'type-graphql';
import { User } from '../../entity/User';
import { Context } from '../../types/context';

// allow the logged in user to retrieve their own info/data
@Resolver()
export class MeResolver {
  @Authorized()
  @Query(() => User)
  async getMe(@Ctx() ctx: Context): Promise<User | Error> {
    // attempt to login using session, if no session cookie -> null
    if (!ctx.userId) throw new Error('Not logged in');

    // cookie exist, attempt to find User with its stored userId
    // TODO: use a field function in User that loads messages with data loader
    const user = await User.findOne(ctx.userId, { relations: ['messages'] });
    if (!user) throw new Error('Account is not valid');

    return user;
  }
}
