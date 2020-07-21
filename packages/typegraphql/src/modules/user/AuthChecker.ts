import { Context } from '../../types/context';
import { AuthChecker } from 'type-graphql';

// this checks if the cookie session exist
// and if the user is authorized by checking if the user id exist in the cookie
export const userAuthChecker: AuthChecker<Context> = ({ context }) => {
  // here we can read the user from context
  // and check his permission in the db against the `roles` argument
  // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
  // take get user id from context
  const { userId } = context;
  // authorized if it exists
  return Boolean(userId);
};
