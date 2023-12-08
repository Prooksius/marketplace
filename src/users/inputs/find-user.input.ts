import { Field, ID, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class FindUserInput {
  @Field(() => ID, { description: 'User ID' })
  @IsMongoId()
  _id: string;
}
