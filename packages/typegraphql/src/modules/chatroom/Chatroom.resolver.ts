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
   * TODO: This is an off limit endpoint
   */
  @Subscription({
    topics: topics.NEW_MESSAGE,
    filter: ({ payload, args }) => args.priorities.includes(payload.priority),
  })
  async newMessage(
    @Root() messagePayload: MessagePayload
    /* @Args() args: MessageArgs */
  ): Promise<BroadcastMessagePayload> {
    return {
      ...messagePayload,
      date: new Date(),
    };
  }

  /** This mutation handles the trigger to publish a new message
   * to all subscribed users
   * and also save it to the database
   */
  @Authorized()
  @Mutation()
  async addNewMessage(
    @Arg('message') message: MessageInput,
    @PubSub() pubSub: PubSubEngine,
    @Ctx() context: Context
  ): Promise<true | Error> {
    try {
      // make sure user belongs in the said chatroom
      // by looking in the userChatroom join table
      const userChatroom = await UserChatroom.findOne({
        where: {
          chatroomId: message.chatroomId,
          userId: context.userId,
        },
      });
      if (!userChatroom)
        throw new Error(
          'You do not belong to the room in which you are trying to send message to.'
        );

      // find the chatroom to add message to
      // const chatroom = await Chatroom.findOne(message.chatroomId)
      const chatroom = userChatroom.chatroom;

      // create new message record in database
      const newMessage = await Message.create({
        text: message.text,
        from: message.from,
        chatroom,
      }).save();
      // associate it to the found chatroom
      // TODO: a better way to assoiate for faster lookup
      chatroom.messages.push(newMessage);

      // publish new message to subscribers
      const payload: MessagePayload = {
        id: newMessage.id,
        text: message.text,
        from: message.from,
        chatroomId: message.chatroomId,
      };
      await pubSub.publish(topics.NEW_MESSAGE, payload);
    } catch (e) {
      console.log(e);
      throw new Error('Failed to send message.');
    }
    return true;
  }
}

type MessagePayload = MessageInput & { id: string };

type BroadcastMessagePayload = MessagePayload & { date: Date };
