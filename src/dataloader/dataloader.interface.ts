import * as DataLoader from 'dataloader';
import { Attribute } from 'src/attributes/schemas/attribute.schema';
import { ProductAttribute } from 'src/product-attributes/schemas/product-attribute.schema';
import { Product } from 'src/products/schemas/product.schema';
import { User } from 'src/users/schemas/user.schema';

export interface IDataloaders {
  usersLoader: DataLoader<string, User>;
  attributesLoader: DataLoader<string, Attribute>;
  prodAttrLoader: DataLoader<string, ProductAttribute>;
  productsLoader: DataLoader<string, Product>;
}
