import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

// https://graphql.org/learn/schema/#object-types-and-fields
// ObjectType represents the type of objects fetchable/queriable
@ObjectType()
// https://typeorm.io/#/entities/what-is-entity
// Entity is a class that maps to a database table (like a collection in MongoDB)
// Add @Field to the Column that can be queried/exposed
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column('text', { unique: true })
  email: string;

  @Column()
  password: string;
}
