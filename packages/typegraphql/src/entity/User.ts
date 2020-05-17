import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

// https://typeorm.io/#/entities/what-is-entity
// Entity is a class that maps to a database table (like a collection in MongoDB)
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column('text', { unique: true })
  email: string;

  @Column()
  password: string;
}
