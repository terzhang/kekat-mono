import { Resolver, Query, Arg } from 'type-graphql';
import { Chatroom } from '../../entity/Chatroom';

@Resolver()
export class ChatroomResolver {
  @Query((_type) => [Chatroom], { nullable: true })
  async getChatrooms(@Arg('limit') limit?: number): Promise<Chatroom[] | null> {
    const chatrooms = await Chatroom.find({ take: limit });
    if (!chatrooms) return null;
    return chatrooms;
  }
}
