import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { Product } from '../../products/schemas/product.schema';
import { Attribute } from 'src/attributes/schemas/attribute.schema';

export type ProductDocument = HydratedDocument<ProductAttribute>;

@Schema()
@ObjectType()
export class ProductAttribute {
  @Field(() => ID, { description: 'Product attribute ID' })
  _id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  @Field(() => Product, { nullable: true, description: 'Product' })
  product: Product;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Attribute' })
  @Field(() => Attribute, { nullable: true, description: 'Attribute' })
  attribute: Attribute;

  @Prop({ required: true, maxlength: 255 })
  @Field({ description: 'Product attribute value' })
  value: string;
}

export const ProductAttributeSchema =
  SchemaFactory.createForClass(ProductAttribute);
