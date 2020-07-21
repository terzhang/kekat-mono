import { MiddlewareFn } from 'type-graphql';
import { Context } from '../types/context';

/** Middleware for type-graphql */
export const isAuth: MiddlewareFn<Context> = async ({ context }, next) => {
  if (!context.userId) throw new Error('not authenticated');
  return next();
};
