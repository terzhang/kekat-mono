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
import { UserContext } from 'src/types/user';

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
  async users(@Ctx() { userOfChatroomLoader }: UserContext & any) {
    // pass user id into userLoader
    // to get all the users associated with this Chatroom id
    return userOfChatroomLoader.load(this.id);
  }
}
