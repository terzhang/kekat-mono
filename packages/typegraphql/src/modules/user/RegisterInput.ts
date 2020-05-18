import { Field, InputType } from 'type-graphql';
import { Length, IsEmail } from 'class-validator';
import { isDuplicate } from '../../decorators/isDuplicate';

@InputType()
export class RegisterInput {
  @Field()
  @Length(1, 255)
  firstName: string;

  @Field()
  @Length(1, 255)
  lastName: string;

  @Field()
  @IsEmail()
  @isDuplicate({ message: 'Email is already in use.' })
  email: string;

  @Field()
  password: string;
}
