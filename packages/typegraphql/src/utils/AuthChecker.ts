import { Context } from '../types/context';
import { AuthChecker } from 'type-graphql';
import { verifyToken } from './verifyToken';
import { verifyBearer } from './verifyBearer';
import { Request } from 'express';
import { redis } from '../database/redis';

type Session = {
  cookie: any;
  userId: string;
};

const sessionFromSessionId = async (
  sessionId: string
): Promise<Session | null> => {
  // raw sessionId has shape like: "s:" + "keyUri" + "." + "somethingElse"
  const keyUri = decodeURIComponent(sessionId).split('.')[0].substring(2);
  const sessionPrefix = 'sess:'; // default prefix
  const session = await redis.get(sessionPrefix + keyUri);
  if (!session) return null;
  return JSON.parse(session);
};

/** @deprecated No longer need to painful extract session id,
 * and format it to use as key to retrieve the session data from Redis */
export const userIdFromRaw = async (rawCookie: string, bearer: string) => {
  // get sessionId stored inside the raw Cookie
  const sessionId = rawCookie?.split('=')[1]; // TODO: better parsing
  const session = await sessionFromSessionId(sessionId);
  // second half from request header (also extract/verify bearer auth)
  const secondHalfToken = verifyBearer(bearer);
  // merge into full token, then decode and verify the token to get the payload
  const fulltoken = verifyToken(session!.userId + secondHalfToken!);
  // console.log('tokenObj-r:', fulltoken);
  return fulltoken!.userId;
};

export const userIdFromReq = (req: Request) => {
  // first half of the token from session cookie
  const firstHalfToken = req.session!.userId;
  // second half from request header (also extract/verify bearer auth)
  const secondHalfToken = verifyBearer(req.headers.authorization!);
  // merge into full token, then decode and verify the token to get the payload
  return verifyToken(firstHalfToken + secondHalfToken);
};

// this checks if the cookie session exist
// and if the user is authorized by checking if the user id exist in the cookie
export const userAuthChecker: AuthChecker<Context> = ({ context }) => {
  // here we can read the user from context
  // if userId isn't in context -> not authenticated
  if (!context.userId) {
    const payload = userIdFromReq(context.req);
    // set userId from decoded payload into context
    if (payload) context.userId = payload.userId;
  }
  // if userId is valid, user is authenticated
  return Boolean(context.userId);
};
