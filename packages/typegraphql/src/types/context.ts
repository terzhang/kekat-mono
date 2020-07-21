import { Request, Response } from 'express';
import {
  chatroomsOfUserLoader,
  usersOfChatroomLoader,
} from '../utils/dataLoader';

export interface Context {
  req: Request;
  res: Response;
  chatroomsOfUserLoader: ReturnType<typeof chatroomsOfUserLoader>;
  usersOfChatroomLoader: ReturnType<typeof usersOfChatroomLoader>;
  userId?: string;
}
