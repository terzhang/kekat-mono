import { Resolver, Ctx, Mutation, Authorized } from 'type-graphql';
import { Context } from '../../types/context';
import { COOKIE_NAME } from '../../constants/names';

@Resolver()
export class logoutResolver {
  /** to logout, make a promise to delete the cookie & session and returns whether it's successful */
  @Authorized()
  @Mutation(() => Boolean)
  async logout(@Ctx() context: Context): Promise<boolean> {
    return new Promise((resolve, reject) =>
      context.req.session!.destroy((err) => {
        // onError, log it and resolve to false
        if (err) {
          console.log(err);
          return reject(false);
        }
        // onSuccess, delete the cookie and resolve to true
        context.res.clearCookie(COOKIE_NAME);
        return resolve(true);
      })
    );
  }
}
