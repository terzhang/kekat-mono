import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { Field, ID, ObjectType, Ctx } from 'type-graphql';
import { UserChatroom } from './UserChatroom';
import { User } from './User';
import { Context } from '../types/context';
import { Message } from './Message';

@ObjectType()
@Entity()
export class Chatroom extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @OneToMany((_type) => UserChatroom, (userChatroom) => userChatroom.user)
  userChatroomLink: UserChatroom[];

  /** get all users associated to this chatroom */
  @Field(() => [User])
  async users(@Ctx() context: Context, { defaultValue: [] }) {
    // pass user id into userLoader
    // to get all the users associated with this Chatroom id
    const usersOfChatroom = await context.usersOfChatroomLoader.load(this.id);
    // empty array if this chatroom don't have any users
    return usersOfChatroom ? usersOfChatroom : [];
  }

  /** get all messages associated to this chatroom */
  @Field(() => [Message])
  messages: Message[];
}
