import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Ctx,
  Subscription,
  Root,
  PubSub,
  PubSubEngine,
  Authorized,
} from 'type-graphql';
import { Chatroom } from '../../entity/Chatroom';
import { UserChatroom } from '../../entity/UserChatroom';
import { Context } from '../../types/context';
import { Message } from '../../entity/Message';
import { MessageInput } from './Message.input';
import { User } from '../../entity/User';

const enum topics {
  NEW_MESSAGE = 'NEW_MESSAGE',
}

@Resolver(Chatroom)
export class ChatroomResolver {
  /** resolve query to get all the chatrooms within the database */
  @Query((_type) => [Chatroom])
  async getAllChatrooms(
    @Arg('limit') limit: number
  ): Promise<Chatroom[] | Error> {
    const chatrooms = await Chatroom.find({ take: limit });
    if (!chatrooms) throw new Error('No chatroom exists');
    return chatrooms;
  }

  /** resolve mutation to add self to a room */
  @Mutation((_type) => Chatroom)
  async joinChatroom(
    @Arg('chatroomId') chatroomId: string,
    @Ctx() context: Context
  ): Promise<Chatroom | Error> {
    // make sure chatroom exists FIRST
    const chatroom = await Chatroom.findOne({ id: chatroomId });
    if (!chatroom)
      throw new Error('The chatroom you are joining does not exist');

    // ? check if user is already in the chatroom by looking for it
    const userExist = await UserChatroom.findOne({
      userId: context.req.session!.token,
      chatroomId,
    });
    if (userExist) throw new Error('You have already joined the chatroom.');

    // create the relationship between user and chatroom
    const userChatroom = await UserChatroom.create({
      chatroomId,
      // ! it's userId not id
      userId: context.userId,
    }).save();
    if (!userChatroom) throw new Error('Could not join room');

    return chatroom;
  }

  /** This is activated by the server to relay messages to all the clients subscribed
   * When client subscribe, they only get messages where filter returns truthy
   */
  @Authorized()
  @Subscription((_type) => Message, {
    topics: topics.NEW_MESSAGE,
    // ? payload from pubsub & args from client
    filter: ({ payload, args }) => {
      console.log(payload);
      return payload.chatroomId === args.chatroomId;
    },
  })
  async newMessage(
    // messagePayload is retrieved from a pubsub publish
    @Root() messagePayload: MessagePayload,
    @Arg('chatroomId') chatroomId: string,
    @Ctx() context: Context
  ): Promise<Message> {
    // find chatroom the client want to subscript
    const chatroom = await Chatroom.findOne(chatroomId);
    if (!chatroom) throw new Error('no such chatroom');
    // find user
    const user = await User.findOne(context.userId);
    // the chatroomId from payload is used for filter only (not here)
    const { text, from } = messagePayload;
    const messageData = {
      text: text,
      from: from,
      chatroom,
      user: user as User,
      date: new Date(),
    };
    // create new message record in database
    const message = await Message.create(messageData).save();
    // TODO: a better way to assoiate for faster lookup
    chatroom.messages = [message];
    await chatroom.save();
    return message;
  }

  /** This mutation handles the trigger to publish a new message
   * to all subscribed users
   * and also save it to the database
   */
  @Authorized()
  @Mutation((_type) => Boolean)
  async addNewMessage(
    @Arg('message') message: MessageInput,
    @PubSub() pubSub: PubSubEngine,
    @Ctx() context: Context
  ): Promise<true | Error> {
    // make sure user belongs in the said chatroom
    // by looking in the userChatroom join table
    const userChatroom = await UserChatroom.findOne({
      where: {
        chatroomId: message.chatroomId,
        userId: context.userId,
      },
    });
    if (!userChatroom)
      throw new Error('Message failed. You do not belong in this room');
    /*
      const messageData = {
        text: message.text,
        from: message.from,
        chatroom,
        user,
        date: newDate,
      };
    */
    const newMessage: MessagePayload = {
      // chatroomId: userChatroom.chatroomId,
      from: message.from,
      text: message.text,
      // user,
      chatroomId: userChatroom.chatroomId,
    };
    await pubSub.publish(topics.NEW_MESSAGE, newMessage);
    return true;
  }
}

type MessagePayload = { from: string; text: string; chatroomId: string };

// type BroadcastMessagePayload = Omit<MessagePayload, 'userId'>;
