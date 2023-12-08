import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { ProductAttribute } from '../../product-attributes/schemas/product-attribute.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
@ObjectType()
export class Product {
  @Field(() => ID, { description: 'Product ID' })
  _id: string;

  @Prop({ required: true, unique: true })
  @Field({ description: 'Product title' })
  title: string;

  @Prop({ required: true, min: 0 })
  @Field(() => Float, { description: 'Product price' })
  price: number;

  @Prop({ maxlength: 10000 })
  @Field({ description: 'Product description' })
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @Field(() => User, { nullable: true, description: 'Product owner' })
  owner: User;

  @Field(() => [ProductAttribute], { description: 'Product attributes' })
  attributes: ProductAttribute[];

  prodAttrIds: { _id: string }[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
