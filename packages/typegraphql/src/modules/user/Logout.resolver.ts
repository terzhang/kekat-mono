import { Resolver, Ctx, Mutation } from 'type-graphql';
import { UserContext } from '../../types/user';

@Resolver()
export class logoutResolver {
  /** to logout, make a promise to delete the cookie & session and returns whether it's successful */
  @Mutation(() => Boolean)
  async logout(@Ctx() context: UserContext): Promise<boolean> {
    return new Promise((resolve, reject) =>
      context.req.session!.destroy((err) => {
        // onError, log it and resolve to false
        if (err) {
          console.log(err);
          return reject(false);
        }
        // onSuccess, delete the cookie and resolve to true
        context.res.clearCookie('qid');
        return resolve(true);
      })
    );
  }
}
