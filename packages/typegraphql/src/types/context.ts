import { Request, Response } from 'express';
import {
  chatroomsOfUserLoader,
  messagesOfChatroomLoader,
  usersOfChatroomLoader,
} from '../utils/dataLoader';

export interface Context {
  req: Request;
  res: Response;
  connection: any; // TODO: correctly type this
  chatroomsOfUserLoader: ReturnType<typeof chatroomsOfUserLoader>;
  usersOfChatroomLoader: ReturnType<typeof usersOfChatroomLoader>;
  messagesOfChatroomLoader: ReturnType<typeof messagesOfChatroomLoader>;
  userId?: string;
}
