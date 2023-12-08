import { Field, Float, InputType } from '@nestjs/graphql';
import { IsMongoId, MaxLength, Min } from 'class-validator';

@InputType()
export class CreateProductAttributeInput {
  @MaxLength(255)
  @Field({ description: 'Product attribute value' })
  value: string;

  @IsMongoId()
  @Field({ description: 'Product ID' })
  product: string;

  @IsMongoId()
  @Field({ description: 'Attribute ID' })
  attribute: string;
}
