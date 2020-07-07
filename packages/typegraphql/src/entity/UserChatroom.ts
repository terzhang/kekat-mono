import {
  Entity,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { Chatroom } from './Chatroom';
import { Field } from 'type-graphql';

/** Custom join table entity for M:M relationship between User and chatroom
 * This strategy is documented in the typeORM doc.
 * https://typeorm.io/#/many-to-many-relations/many-to-many-relations-with-custom-properties
 */
@Entity()
export class UserChatroom extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryColumn()
  @Field()
  userId!: string;

  @PrimaryColumn()
  @Field()
  chatroomId!: string;

  @ManyToOne((_type) => User, (user) => user.userChatroomLink, {
    primary: true,
  })
  @JoinColumn({ name: 'userId' })
  @Field((_type) => User)
  user: User;

  @ManyToOne((_type) => Chatroom, (chatroom) => chatroom.userChatroomLink, {
    primary: true,
  })
  @JoinColumn({ name: 'chatroomId' })
  @Field((_type) => Chatroom)
  chatroom: Chatroom;
}
