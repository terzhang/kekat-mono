import { Context } from '../../types/context';
import { AuthChecker } from 'type-graphql';
import { verifyToken } from '../../utils/VerifyToken';

// this checks if the cookie session exist
// and if the user is authorized by checking if the user id exist in the cookie
export const userAuthChecker: AuthChecker<Context> = ({ context }) => {
  // here we can read the user from context
  // and check his permission in the db against the `roles` argument
  // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
  // if userId isn't in context -> not authenticated
  if (!context.userId) {
    // decode and verify the token in session cookie
    const userId = verifyToken(context.req.session!.userId);
    // set decoded token / userId in context
    if (userId) context.userId = userId as string;
    // authorized if it exists
    return Boolean(userId);
  } else {
    // if it exist, user is authenticated
    return Boolean(context.userId);
  }
};
