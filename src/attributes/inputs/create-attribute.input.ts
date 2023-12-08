import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsMongoId, MaxLength, Min } from 'class-validator';

@InputType()
export class CreateAttributeInput {
  @MaxLength(255)
  @Field({ description: 'Attribute title' })
  name: string;

  @IsInt()
  @Field(() => Int, { description: 'Attribute sort order' })
  sortOrder: number;
}
