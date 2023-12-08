import { Field, ID, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType()
export class FindProductAttributeInput {
  @IsMongoId()
  @Field(() => ID, { description: 'Product attribute ID' })
  _id: string;
}
