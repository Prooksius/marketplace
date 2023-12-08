import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from 'src/users/schemas/user.schema';
import { IDataloaders } from 'src/dataloader/dataloader.interface';
import { CreateProductAttributeInput } from './inputs/create-product-attribute.input';
import { ProductAttribute } from './schemas/product-attribute.schema';
import { ProductAttributeService } from './product-attribute.service';
import { FindProductAttributeInput } from './inputs/find-product-attribute.input';
import { Product } from 'src/products/schemas/product.schema';
import { Attribute } from 'src/attributes/schemas/attribute.schema';

@Resolver(() => ProductAttribute)
export class ProductAttributeResolver {
  constructor(private prodAttrService: ProductAttributeService) {}

  @Query(() => ProductAttribute, { nullable: true })
  async productAttribute(
    @Args('input') { _id }: FindProductAttributeInput,
    @Context('loaders') { prodAttrLoader }: IDataloaders,
  ) {
    const prodAttr = await this.prodAttrService.findOne(_id);
    prodAttrLoader.prime(String(prodAttr._id), prodAttr);
    return prodAttr;
  }

  @Query(() => [ProductAttribute])
  async productAttributes(
    @Context('loaders') { prodAttrLoader }: IDataloaders,
  ) {
    const prodAttrs = await this.prodAttrService.findAll();
    prodAttrs.map((prodAttr) =>
      prodAttrLoader.prime(String(prodAttr._id), prodAttr),
    );
    return prodAttrs;
  }

  @Mutation(() => ProductAttribute)
  async createProductAttribute(
    @Args('input') productAttr: CreateProductAttributeInput,
  ) {
    return this.prodAttrService.create(productAttr);
  }

  @ResolveField(() => Product, { nullable: true })
  async product(
    @Parent() { product: { _id } }: ProductAttribute,
    @Context('loaders') { productsLoader }: IDataloaders,
  ): Promise<Product> {
    return productsLoader.load(String(_id));
  }

  @ResolveField(() => Attribute, { nullable: true })
  async attribute(
    @Parent() { attribute: { _id } }: ProductAttribute,
    @Context('loaders') { attributesLoader }: IDataloaders,
  ): Promise<Attribute> {
    return attributesLoader.load(String(_id));
  }
}
