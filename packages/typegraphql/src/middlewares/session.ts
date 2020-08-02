import expressSession from 'express-session';
import { redis } from '../database/redis';
import connectRedis from 'connect-redis';
import { SESSION_SECRET } from '../env/secrets';
import { COOKIE_NAME } from '../constants/names';
import { AUTH_LENGTH } from '../constants/lengths';

// configuring session middleware to use redis as memory store
// https://www.npmjs.com/package/express-session
const RedisStore = connectRedis(expressSession);
const sessionOption: expressSession.SessionOptions = {
  store: new RedisStore({
    client: redis,
  }),
  name: COOKIE_NAME,
  secret: SESSION_SECRET || '',
  resave: false,
  saveUninitialized: false,
  // To store or access session data use req.session
  // https://www.npmjs.com/package/express-session#reqsession
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: AUTH_LENGTH, // 1 day
  },
};

export const session = expressSession(sessionOption);
