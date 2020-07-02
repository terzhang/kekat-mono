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

@Entity()
/** Custom join table entity for M:M relationship between User and chatroom
 * This strategy is documented in the typeORM doc.
 * https://typeorm.io/#/many-to-many-relations/many-to-many-relations-with-custom-properties
 */
export class UserChatroom extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryColumn()
  userId!: string;

  @PrimaryColumn()
  chatroomId!: string;

  @ManyToOne((_type) => User, (user) => user.chatroomLink, { primary: true })
  @JoinColumn()
  user: User;

  @ManyToOne((_type) => Chatroom, (chatroom) => chatroom.userLink, {
    primary: true,
  })
  @JoinColumn()
  chatroom: Chatroom;
}
