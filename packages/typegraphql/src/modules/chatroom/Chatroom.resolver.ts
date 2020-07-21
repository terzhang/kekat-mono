import { Resolver, Query, Arg, Mutation, Ctx } from 'type-graphql';
import { Chatroom } from '../../entity/Chatroom';
import { UserChatroom } from '../../entity/UserChatroom';
import { Context } from '../../types/context';

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
}
