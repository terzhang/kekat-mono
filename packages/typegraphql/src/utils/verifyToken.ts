import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../env/secrets';

/** verify and decode json web token from authorization
 */
export const verifyToken = (token: string): string | object | undefined => {
  /* const bearer = req.headers.authorization; // Format of `Bearer 1231213...`

  if (!bearer) return;

  const reg = /^Bearer\s(.*)$/;
  // Regex to check it's in the right format
  if (!/^Bearer\s.*$/.test(bearer)) return;

  // token is second entry in array from parsing JWT (bearer) with the regex
  const token = reg.exec(bearer)![1]; */
  try {
    // Decrypt the JWT, to get the userId
    const userId = jwt.verify(token, JWT_SECRET);
    // req.session!.userId = userId; // store it in session
    return userId;
  } catch (e) {
    console.log(e);
    return;
  }
};
