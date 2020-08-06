import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { Field, ID, ObjectType, Root, Ctx } from 'type-graphql';
import { UserChatroom } from './UserChatroom';
import { Chatroom } from './Chatroom';
import { Context } from '../types/context';
import { Message } from './Message';

// https://graphql.org/learn/schema/#object-types-and-fields
// ObjectType represents the type of objects fetchable/queriable
@ObjectType()
// https://typeorm.io/#/entities/what-is-entity
// Entity is a class that maps to a database table (like a collection in MongoDB)
// Add @Field to the Column that can be queried/exposed
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column('text', { unique: true })
  email: string;

  // inline field resolver
  @Field()
  name(@Root() parent: User): string {
    // the @root decorator injects the parent Object
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Column()
  password: string;

  @Column('bool', { default: false })
  confirmed: boolean;

  @OneToMany((_type) => UserChatroom, (userChatroom) => userChatroom.chatroom)
  userChatroomLink: UserChatroom[];

  /** get all the Chatrooms associated with this User id */
  @Field(() => [Chatroom], { defaultValue: [] })
  async chatrooms(@Ctx() context: Context) {
    // pass Chatroom id into userLoader
    // to get all the Chatrooms associated with this User id
    const chatroomsOfUser = await context.chatroomsOfUserLoader.load(this.id);
    // empty array if user don't belong in any chatroom
    return chatroomsOfUser ? chatroomsOfUser : [];
  }

  /** get messages sent by the user
   * NOTE: don't use this directly
   */
  @Field(() => [Message])
  @OneToMany((_type) => Message, (message) => message.user)
  messages: Message[];

  /** get messages of user using data loader */
  @Field(() => [Message])
  async getMessages(@Ctx() context: Context) {
    const messagesOfUser = await context.messagesOfUserLoader.load(this.id);
    return messagesOfUser ? messagesOfUser : [];
  }
}
