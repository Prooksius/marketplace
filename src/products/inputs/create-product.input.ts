import { Field, Float, InputType } from '@nestjs/graphql';
import { IsMongoId, MaxLength, Min } from 'class-validator';

@InputType()
export class CreateProductInput {
  @MaxLength(255)
  @Field({ description: 'Product title' })
  title: string;

  @Min(0)
  @Field(() => Float, { description: 'Product price' })
  price: number;

  @MaxLength(10000)
  @Field({ description: 'Product description' })
  description: string;

  @IsMongoId()
  @Field({ description: 'Product owner ID' })
  owner: string;
}
