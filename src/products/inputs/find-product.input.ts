import { Field, ID, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class FindProductInput {
  @IsMongoId()
  @Field(() => ID, { description: 'Product ID' })
  _id: string;
}
