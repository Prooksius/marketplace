import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import { ProductService } from 'src/products/product.service';
import { UserService } from 'src/users/user.service';
import { IDataloaders } from './dataloader.interface';
import { User } from 'src/users/schemas/user.schema';
import { Product } from 'src/products/schemas/product.schema';
import { mapFromArray } from 'src/util';
import { Attribute } from 'src/attributes/schemas/attribute.schema';
import { AttributeService } from 'src/attributes/attribute.service';
import { ProductAttribute } from 'src/product-attributes/schemas/product-attribute.schema';
import { ProductAttributeService } from 'src/product-attributes/product-attribute.service';

@Injectable()
export class DataloaderService {
  constructor(
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly attributeService: AttributeService,
    private readonly prodAttrService: ProductAttributeService,
  ) {}

  createLoaders(): IDataloaders {
    const usersLoader = new DataLoader<string, User>(
      async (keys: readonly string[]) => {
        const users = await this.userService.findByIds(keys);

        const usersMap = mapFromArray(users, (user) => user._id);

        return keys.map((key) => usersMap[key]);
      },
    );

    const productsLoader = new DataLoader<string, Product>(
      async (keys: readonly string[]) => {
        const products = await this.productService.findByIds(keys);

        const productsMap = mapFromArray(products, (product) => product._id);

        return keys.map((key) => productsMap[key]);
      },
    );

    const attributesLoader = new DataLoader<string, Attribute>(
      async (keys: readonly string[]) => {
        const attributes = await this.attributeService.findByIds(keys);

        const attributesMap = mapFromArray(
          attributes,
          (attribute) => attribute._id,
        );

        return keys.map((key) => attributesMap[key]);
      },
    );

    const prodAttrLoader = new DataLoader<string, ProductAttribute>(
      async (keys: readonly string[]) => {
        const prodAttrs = await this.prodAttrService.findByIds(keys);

        const prodAttrsMap = mapFromArray(
          prodAttrs,
          (attribute) => attribute._id,
        );

        return keys.map((key) => prodAttrsMap[key]);
      },
    );

    return {
      usersLoader,
      productsLoader,
      attributesLoader,
      prodAttrLoader,
    };
  }
}
