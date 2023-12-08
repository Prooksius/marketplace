import { Field, ID, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class FindAttributeInput {
  @IsMongoId()
  @Field(() => ID, { description: 'Attribute ID' })
  _id: string;
}
