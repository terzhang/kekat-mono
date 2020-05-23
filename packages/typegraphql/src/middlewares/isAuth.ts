import { MiddlewareFn } from 'type-graphql';
import { UserContext } from 'src/types/user';

export const isAuth: MiddlewareFn<UserContext> = async ({ context }, next) => {
  if (!context.req.session!.userId) throw new Error('not authenticated');
  return next();
};
