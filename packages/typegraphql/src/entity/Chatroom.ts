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
  async users(@Ctx() context: Context) {
    // pass user id into userLoader
    // to get all the users associated with this Chatroom id
    return await context.usersOfChatroomLoader.load(this.id);
  }
}
