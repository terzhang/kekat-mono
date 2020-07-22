import { Context } from '../types/context';
import { AuthChecker } from 'type-graphql';
import { verifyToken } from './verifyToken';
import { verifyBearer } from './verifyBearer';

// this checks if the cookie session exist
// and if the user is authorized by checking if the user id exist in the cookie
export const userAuthChecker: AuthChecker<Context> = ({ context }) => {
  // here we can read the user from context
  // and check his permission in the db against the `roles` argument
  // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]

  // if userId isn't in context -> not authenticated
  if (!context.userId) {
    // first half of the token from session cookie
    const firstHalfToken = context.req.session!.userId;
    // second half from request header (also extract/verify bearer auth)
    const secondHalfToken = verifyBearer(context.req.headers.authorization!);
    // merge into full token, then decode and verify the token
    const userId = verifyToken(firstHalfToken + secondHalfToken);
    // set decoded token / userId in context
    if (userId) context.userId = userId as string;
    // authorized if merged token is valid
    return Boolean(userId);
  } else {
    // if it exist, user is authenticated
    return Boolean(context.userId);
  }
};
