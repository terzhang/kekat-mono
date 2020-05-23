import { Resolver, Ctx, Mutation } from 'type-graphql';
import { UserContext } from '../../types/user';

@Resolver()
export class logoutResolver {
  /** to logout, make a promise to delete the cookie & session and returns whether it's successful */
  @Mutation()
  async logout(@Ctx() context: UserContext): Promise<boolean> {
    return new Promise((resolve, reject) =>
      context.req.session!.destroy((err) => {
        if (err) console.log(err), reject(false); // onError, log it and resolve to false
        // onSuccess, resolve to true
        resolve(true);
      })
    );
  }
}
