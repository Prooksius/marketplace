import { Model, PipelineStage } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Attribute } from './schemas/attribute.schema';
import { CreateAttributeInput } from './inputs/create-attribute.input';
import { ObjectId } from 'src/util';
import { MathClientService } from 'src/math-client/math-client.service';

const productsLookup: PipelineStage = {
  $lookup: {
    from: 'productattributes',
    localField: '_id',
    foreignField: 'attribute',
    pipeline: [{ $project: { _id: 0, product: 1 } }],
    as: 'productIds',
  },
};

@Injectable()
export class AttributeService {
  constructor(
    @InjectModel(Attribute.name) private attributeModel: Model<Attribute>,
    private mathClientService: MathClientService,
  ) {}

  async create(createAttributeInput: CreateAttributeInput): Promise<Attribute> {
    const newAttribute = new this.attributeModel(createAttributeInput);
    return newAttribute.save();
  }

  async findAll(): Promise<Attribute[]> {
    const items = await this.attributeModel.aggregate<Attribute>([
      productsLookup,
    ]);

    console.log('select all attributes');

    this.mathClientService.reconnectBybit();

    return items;
  }

  async findOne(id: string): Promise<Attribute> {
    const items = await this.attributeModel.aggregate<Attribute>([
      { $match: { _id: new ObjectId(id) } },
      productsLookup,
    ]);

    console.log('select one attribute');

    if (items.length) return items[0];
    return null;
  }

  async findByIds(ids: readonly string[]): Promise<Attribute[]> {
    const items = await this.attributeModel.aggregate<Attribute>([
      { $match: { _id: { $in: ids.map((id) => new ObjectId(id)) } } },
      productsLookup,
    ]);

    console.log('select attributes where id IN( ' + ids.join(', ') + ' )');

    return items;
  }
}
