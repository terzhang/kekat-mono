import {
  Resolver,
  Mutation,
  Arg,
  Query,
  Ctx,
  ID,
  Authorized,
} from 'type-graphql';
import { Chatroom } from '../../entity/Chatroom';
import { User } from '../../entity/User';
import { UserChatroom } from '../../entity/UserChatroom';
import { Context } from '../../types/context';

@Resolver()
export class UserChatroomResolver {
  /** create a chat room with a user that belong to it
   * by passing the user id and chatroom id on creation
   * then saving it as a record in the database.
   */
  @Authorized()
  @Mutation((_type) => Chatroom, { nullable: true })
  async createChatroomWithUser(
    @Arg('roomName') roomName: string,
    @Ctx() context: Context
  ): Promise<Chatroom | Error> {
    // check if session's user id is valid
    if (!context.userId) throw new Error('Please log in');
    // cookie exist, attempt to find User with its stored userId
    const user = await User.findOne(context.userId);
    if (!user) throw new Error('Account is not valid');
    // make a new chatroom with the given name
    // with the logged in user in it.
    const newChatroom = await Chatroom.create({ name: roomName }).save();
    await UserChatroom.create({
      userId: user.id,
      chatroomId: newChatroom.id,
    })
      .save()
      .catch((err) => ({
        error: err,
      }));
    if (!newChatroom) throw new Error('could not create chatroom');
    return newChatroom;
  }

  /** HARD delete a chatroom
   * by removing the chatroom record
   * and the columns in join table that's associated to User(s)
   * optionally, you can set cascade to true to remove chatroom in one go:
   * https://typeorm.io/#/relations/cascades
   */
  @Authorized()
  @Mutation((_type) => ID)
  async deleteChatroom(@Arg('chatroomId') chatroomId: string) {
    // delete the column(s) in join table
    // made the M:M relation between User and Chatroom
    await UserChatroom.delete({ chatroomId });
    // delete the Chatroom record
    await Chatroom.delete({ id: chatroomId });
    // Note: Entity.delete(...) returns DeleteResult { raw: any[], affected: number }
    // and not the deleted entity itself
    return chatroomId; // return the ID back after deleting
  }

  /** get all the chatroom associate with this user*/
  @Authorized()
  @Query((_type) => [Chatroom])
  async chatroomsOfUser() {
    return Chatroom.find();
  }
}
