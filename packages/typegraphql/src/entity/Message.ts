import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { Chatroom } from './Chatroom';
import { User } from './User';

@ObjectType()
@Entity()
export class Message extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  from: string;

  @Field()
  @Column()
  text: string;

  @Field()
  @Column()
  date: Date;

  @Field(() => Chatroom)
  @ManyToOne((_type) => Chatroom, (chatroom) => chatroom.messages)
  chatroom: Chatroom;

  @Field(() => User)
  @ManyToOne((_type) => User, (user) => user.messages)
  user: User;
}
