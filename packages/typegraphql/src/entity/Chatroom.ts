import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { UserChatroom } from './UserChatroom';

@ObjectType()
@Entity()
export class Chatroom extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @OneToMany((_type) => UserChatroom, (UserChatroom) => UserChatroom.user)
  userLink: Promise<string[]>;
}
