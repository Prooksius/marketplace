import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductService } from './product.service';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { ProductResolver } from './product.resolver';
import { UserService } from 'src/users/user.service';
import {
  Attribute,
  AttributeSchema,
} from 'src/attributes/schemas/attribute.schema';
import {
  ProductAttribute,
  ProductAttributeSchema,
} from '../product-attributes/schemas/product-attribute.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: UserSchema },
      { name: Attribute.name, schema: AttributeSchema },
      { name: ProductAttribute.name, schema: ProductAttributeSchema },
    ]),
  ],
  providers: [ProductService, UserService, JwtService, ProductResolver],
  exports: [ProductService],
})
export class ProductModule {}
