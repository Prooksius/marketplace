import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt/dist';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserService } from './user.service';
import { Product, ProductSchema } from 'src/products/schemas/product.schema';
import { ProductService } from 'src/products/product.service';
import { UserResolver } from './user.resolver';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import {
  Attribute,
  AttributeSchema,
} from 'src/attributes/schemas/attribute.schema';
import {
  ProductAttribute,
  ProductAttributeSchema,
} from 'src/product-attributes/schemas/product-attribute.schema';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: 'secret_word',
        signOptions: { expiresIn: '12h' },
      }),
    }),
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: UserSchema },
      { name: Attribute.name, schema: AttributeSchema },
      { name: ProductAttribute.name, schema: ProductAttributeSchema },
    ]),
  ],
  providers: [
    JwtStrategy,
    LocalStrategy,
    JwtService,
    UserService,
    ProductService,
    UserResolver,
  ],
  exports: [UserService],
})
export class UserModule {}
