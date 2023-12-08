import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Attribute,
  AttributeSchema,
} from 'src/attributes/schemas/attribute.schema';
import {
  ProductAttribute,
  ProductAttributeSchema,
} from './schemas/product-attribute.schema';
import { Product, ProductSchema } from 'src/products/schemas/product.schema';
import { ProductAttributeService } from './product-attribute.service';
import { ProductAttributeResolver } from './product-attribute.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Attribute.name, schema: AttributeSchema },
      { name: ProductAttribute.name, schema: ProductAttributeSchema },
    ]),
  ],
  providers: [ProductAttributeService, ProductAttributeResolver],
  exports: [ProductAttributeService],
})
export class ProductAttributeModule {}
