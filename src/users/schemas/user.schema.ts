import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import * as bcrypt from 'bcryptjs';
import { isEmail } from 'class-validator';
import { Product } from 'src/products/schemas/product.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
@ObjectType()
export class User {
  @Field(() => ID, { description: 'User ID' })
  _id: string;

  @Prop({ required: true, unique: true })
  @Field({ description: 'Username' })
  username: string;

  @Prop({
    select: false,
    set: (value: any, priorVal: any) => {
      console.log('password value', value);
      console.log('priorVal', priorVal);
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(value, salt);
      return hash;
    },
  })
  password: string;

  @Prop({
    required: true,
    validate: (value: string) => {
      return isEmail(value);
    },
  })
  @Field({ description: 'User email' })
  email: string;

  @Prop({
    required: true,
    enum: {
      values: [10, 50, 90, 100],
      message: 'Role must be in 10, 50, 90, 100',
    },
  })
  @Field({ description: 'User role' })
  role: number;

  @Field(() => String, { description: 'Access token', nullable: true })
  accessToken: string;

  @Field(() => [Product], { description: 'Owned products' })
  products: Product[];

  productIds: { _id: string }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
