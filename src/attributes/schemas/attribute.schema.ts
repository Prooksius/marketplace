import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { HydratedDocument } from 'mongoose';
import { Product } from 'src/products/schemas/product.schema';

export type AttributeDocument = HydratedDocument<Attribute>;

@Schema({ timestamps: true })
@ObjectType()
export class Attribute {
  @Field(() => ID, { description: 'Attribute ID' })
  _id: string;

  @Prop({ required: true, unique: true })
  @Field({ description: 'Attribute name' })
  name: string;

  @Prop({ required: true })
  @Field(() => Int, { description: 'Attribute sort order' })
  sortOrder: number;

  @Field(() => [Product], { description: 'Products' })
  products: Product[];

  productIds: { product: { _id: string } }[];
}

export const AttributeSchema = SchemaFactory.createForClass(Attribute);
