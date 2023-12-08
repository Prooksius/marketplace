import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Product } from './schemas/product.schema';
import { ProductService } from './product.service';
import { User } from 'src/users/schemas/user.schema';
import { FindProductInput } from './inputs/find-product.input';
import { CreateProductInput } from './inputs/create-product.input';
import { IDataloaders } from 'src/dataloader/dataloader.interface';
import { ProductAttribute } from 'src/product-attributes/schemas/product-attribute.schema';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private productService: ProductService) {}

  @Query(() => Product, { nullable: true })
  async product(
    @Args('input') { _id }: FindProductInput,
    @Context('loaders') { productsLoader }: IDataloaders,
  ) {
    const product = await this.productService.findOne(_id);
    productsLoader.prime(String(product._id), product);
    return product;
  }

  @Query(() => [Product])
  async products(@Context('loaders') { productsLoader }: IDataloaders) {
    const products = await this.productService.findAll();
    products.map((product) =>
      productsLoader.prime(String(product._id), product),
    );
    return products;
  }

  @Mutation(() => Product)
  async createProduct(@Args('input') product: CreateProductInput) {
    return this.productService.create(product);
  }

  @ResolveField(() => User, { nullable: true })
  async owner(
    @Parent() { owner: { _id } }: Product,
    @Context('loaders') { usersLoader }: IDataloaders,
  ): Promise<User> {
    return usersLoader.load(String(_id));
  }

  @ResolveField(() => [ProductAttribute], { nullable: true })
  async attributes(
    @Parent() { prodAttrIds }: Product,
    @Context('loaders') { prodAttrLoader }: IDataloaders,
  ): Promise<(Error | ProductAttribute)[]> {
    return prodAttrLoader.loadMany(prodAttrIds.map((id) => String(id._id)));
  }
}
