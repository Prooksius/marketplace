import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AttributeService } from './attribute.service';
import { Attribute } from './schemas/attribute.schema';
import { IDataloaders } from 'src/dataloader/dataloader.interface';
import { FindAttributeInput } from './inputs/find-attribute.input';
import { CreateAttributeInput } from './inputs/create-attribute.input';
import { Product } from 'src/products/schemas/product.schema';

@Resolver(() => Attribute)
export class AttributeResolver {
  constructor(private attributeService: AttributeService) {}

  @Query(() => Attribute, { nullable: true })
  async attribute(
    @Args('input') { _id }: FindAttributeInput,
    @Context('loaders') { attributesLoader }: IDataloaders,
  ) {
    const attribute = await this.attributeService.findOne(_id);
    attributesLoader.prime(String(attribute._id), attribute);
    return attribute;
  }

  @Query(() => [Attribute])
  async attributes(@Context('loaders') { attributesLoader }: IDataloaders) {
    const attributes = await this.attributeService.findAll();
    attributes.map((attribute) =>
      attributesLoader.prime(String(attribute._id), attribute),
    );
    return attributes;
  }

  @Mutation(() => Attribute)
  async createAttribute(@Args('input') attribute: CreateAttributeInput) {
    return this.attributeService.create(attribute);
  }

  @ResolveField(() => [Product])
  async products(
    @Parent() { productIds }: Attribute,
    @Context('loaders') { productsLoader }: IDataloaders,
  ): Promise<(Error | Product)[]> {
    return productsLoader.loadMany(
      productIds.map((id) => String(id.product._id)),
    );
  }
}
