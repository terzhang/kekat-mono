import { Resolver, Query, Ctx } from 'type-graphql';
import { User } from '../../entity/User';
import { Context } from '../../types/context';

// allow the logged in user to retrieve their own info/data
@Resolver()
export class MeResolver {
  @Query(() => User, { nullable: true })
  async getMe(@Ctx() ctx: Context): Promise<User | null> {
    // attempt to login using session, if no session cookie -> null
    if (!ctx.req.session!.userId) return null;

    // cookie exist, attempt to find User with its stored userId
    const user = await User.findOne(ctx.req.session!.userId);
    if (!user) return null;

    return user;
  }
}
