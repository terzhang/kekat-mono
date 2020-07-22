import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/jwt';
import { JWT_SECRET } from '../env/secrets';

/** verify and decode json web token from authorization
 * return the payload
 */
export const verifyToken = (token: string): JwtPayload | undefined => {
  try {
    // Decrypt the JWT, to get the payload object containing the userId
    const payload = jwt.verify(token, JWT_SECRET);
    // req.session!.userId = userId; // store it in session
    return payload as JwtPayload;
  } catch (e) {
    // token is invalid
    return;
  }
};
