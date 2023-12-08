import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductAttributeInput } from './inputs/create-product-attribute.input';
import { ProductAttribute } from './schemas/product-attribute.schema';
import { Attribute } from 'src/attributes/schemas/attribute.schema';
import { Product } from 'src/products/schemas/product.schema';

@Injectable()
export class ProductAttributeService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Attribute.name) private attributeModel: Model<Attribute>,
    @InjectModel(ProductAttribute.name)
    private productAttributeModel: Model<ProductAttribute>,
  ) {}

  async create(
    createAttributeInput: CreateProductAttributeInput,
  ): Promise<ProductAttribute> {
    const newProductAttr = new this.productAttributeModel(createAttributeInput);
    return newProductAttr.save();
  }

  async findAll(): Promise<ProductAttribute[]> {
    console.log('select all product attributes');
    const productAttributes = await this.productAttributeModel.find().lean();
    return productAttributes;
  }

  async findOne(id: string): Promise<ProductAttribute> {
    console.log('select one product attribute');
    return this.productAttributeModel.findById(id).lean();
  }

  async findByIds(ids: readonly string[]): Promise<ProductAttribute[]> {
    console.log(
      'select product attributes where id IN( ' + ids.join(', ') + ' )',
    );
    return this.productAttributeModel.find({ _id: { $in: ids } }).lean();
  }
}
