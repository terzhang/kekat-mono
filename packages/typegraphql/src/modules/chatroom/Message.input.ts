import { Field } from 'type-graphql/dist/decorators/Field';
import { InputType } from 'type-graphql/dist/decorators/InputType';

@InputType()
export class MessageInput {
  @Field()
  chatroomId: string;

  @Field()
  from: string;

  @Field()
  text: string;
}
