import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../env/secrets';
import { AUTH_LENGTH } from '../constants/lengths';
import { JwtPayload } from '../types/jwt';

/** create a new JWT with user id and secret
 * return it split in half
 */
export const genSplitAuthToken = (
  userId: string
): [string, string] | undefined => {
  if (!userId) return;

  // expiresIn interpret strings as millsec, numbers as second
  // ! exp or expiresIn only works if payload is an object literal
  const token = jwt.sign({ userId } as JwtPayload, JWT_SECRET, {
    expiresIn: `${AUTH_LENGTH}`,
  });
  const splitIndex = Math.round(token.length / 2);
  // store first half in session's http cookie by putting it in req.session
  const firstHalf = token.substring(0, splitIndex);
  // send back the second half in body
  const secondHalf = token.substring(splitIndex);
  return [firstHalf, secondHalf];
};
