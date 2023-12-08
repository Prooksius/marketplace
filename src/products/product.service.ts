import { Model, PipelineStage } from 'mongoose';
import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { CreateProductInput } from './inputs/create-product.input';
import { CreateProductAttributeInput } from '../product-attributes/inputs/create-product-attribute.input';
import { ProductAttribute } from '../product-attributes/schemas/product-attribute.schema';
import { MATH_SERVICE, ObjectId } from 'src/util';
import { lastValueFrom } from 'rxjs';
import { MathClientService } from 'src/math-client/math-client.service';

const prodAttrsLookup: PipelineStage = {
  $lookup: {
    from: 'productattributes',
    localField: '_id',
    foreignField: 'product',
    pipeline: [{ $project: { _id: 1 } }],
    as: 'prodAttrIds',
  },
};

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(ProductAttribute.name)
    private productAttributeModel: Model<ProductAttribute>,
    private mathClientService: MathClientService,
  ) {}

  async create(createProductInput: CreateProductInput): Promise<Product> {
    const newProduct = new this.productModel(createProductInput);
    return newProduct.save();
  }

  async createAttribute(
    createAttributeInput: CreateProductAttributeInput,
  ): Promise<ProductAttribute> {
    const newProductAttr = new this.productAttributeModel(createAttributeInput);
    return newProductAttr.save();
  }

  async findAll(): Promise<Product[]> {
    console.log('select all products');
    const products = await this.productModel.aggregate<Product>([
      prodAttrsLookup,
    ]);

    const data = products.map((product) => product.price);

    const sum = await this.mathClientService.calcSum(data);
    console.log('prices sum is: ', sum);

    this.mathClientService.connectBybit();

    return products;
  }

  async findOne(id: string): Promise<Product> {
    const products = await this.productModel.aggregate<Product>([
      { $match: { _id: new ObjectId(id) } },
      prodAttrsLookup,
    ]);
    console.log('select one products');

    if (products.length) return products[0];
    return null;
  }

  async findByIds(ids: readonly string[]): Promise<Product[]> {
    const users = await this.productModel.aggregate<Product>([
      { $match: { _id: { $in: ids.map((id) => new ObjectId(id)) } } },
      prodAttrsLookup,
    ]);

    console.log('select products where id IN( ' + ids.join(', ') + ' )');

    return users;
  }
}
