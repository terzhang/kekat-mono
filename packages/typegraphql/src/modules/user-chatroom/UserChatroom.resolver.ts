import { Resolver, Mutation, Arg, Query, Ctx } from 'type-graphql';
import { Chatroom } from '../../entity/Chatroom';
import { User } from '../../entity/User';
import { UserChatroom } from '../../entity/UserChatroom';
import { UserContext } from '../../types/user';

@Resolver()
export class UserChatroomResolver {
  /** create a chat room with a user that belong to it
   * by passing the user id and chatroom id on creation
   * then saving it as a record in the database.
   */
  @Mutation((_type) => Boolean, { nullable: true })
  async createChatroomWithUser(
    @Arg('roomName') roomName: string,
    @Ctx() context: UserContext
  ): Promise<true | null> {
    // check if session's user id is valid
    if (!context.req.session!.userId) return null;
    console.log('has userId in session');
    // cookie exist, attempt to find User with its stored userId
    const user = await User.findOne(context.req.session!.userId);
    if (!user) return null;
    console.log('found user');
    // make a new chatroom with the given name
    // with the logged in user in it.
    const newChatroom = await Chatroom.create({ name: roomName }).save();
    await UserChatroom.create({
      userId: user.id,
      chatroomId: newChatroom.id,
    }).save();
    return true;
  }

  /** HARD delete a chatroom
   * by removing the chatroom record
   * and the columns in join table that's associated to User(s)
   * optionally, you can set cascade to true to remove chatroom in one go:
   * https://typeorm.io/#/relations/cascades
   */
  @Mutation((_type) => Boolean)
  async deleteChatroom(@Arg('id') id: string) {
    // delete the column(s) in join table
    // made the M:M relation between User and Chatroom
    await UserChatroom.delete({ chatroomId: id });
    // delete the Chatroom record
    await Chatroom.delete({ id });
    return true;
  }

  /** get all the chatroom associate with this user*/
  @Query((_type) => [Chatroom])
  async chatroomsOfUser() {
    return Chatroom.find();
  }

  /** get all the users associate to this chatroom*/
  @Query((_type) => [Chatroom])
  async usersOfChatroom() {
    return User.find();
  }
}
