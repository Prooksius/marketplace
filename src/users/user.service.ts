import { Model, PipelineStage } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { CreateUserInput } from './inputs/create-user.input';
import { JwtService } from '@nestjs/jwt';
import { Product } from 'src/products/schemas/product.schema';
import { ObjectId } from 'src/util';
import { MathClientService } from 'src/math-client/math-client.service';

const productsLookup: PipelineStage = {
  $lookup: {
    from: 'products',
    localField: '_id',
    foreignField: 'owner',
    pipeline: [{ $project: { _id: 1 } }],
    as: 'productIds',
  },
};

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    private jwtService: JwtService,
    private mathClientService: MathClientService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Partial<User>> {
    const user = await this.userModel
      .findOne({ username })
      .select('-__v -confirmToken +password')
      .lean();

    if (!bcrypt.compareSync(password, user.password)) {
      return null;
    }

    return user;
  }

  async login(user: Partial<User>): Promise<Partial<User>> {
    const payload = { username: user.username, sub: user._id };
    const loggedUser = await this.findOne(user._id);

    return {
      ...loggedUser,
      accessToken: this.jwtService.sign(payload, {
        secret: 'secret_word',
      }),
    };
  }

  async create(createUserInput: CreateUserInput): Promise<Partial<User>> {
    const newUser = new this.userModel(createUserInput);
    const saved = await newUser.save();
    return this.userModel.findById(saved.id);
  }

  async findAll(): Promise<User[]> {
    const users2 = await this.userModel.aggregate<User>([
      { $project: { password: 0 } },
      productsLookup,
    ]);

    const mult = await this.mathClientService.calcMult([25, 75]);
    console.log('prices mult is: ', mult);

    this.mathClientService.disconnectBybit();

    console.log('select all users');
    return users2;
  }

  async findOne(id: string): Promise<User> {
    const users = await this.userModel.aggregate<User>([
      { $match: { _id: new ObjectId(id) } },
      { $project: { password: 0 } },
      productsLookup,
    ]);

    console.log('select one user');

    if (users.length) return users[0];
    return null;
  }

  async findByIds(ids: readonly string[]): Promise<User[]> {
    const users = await this.userModel.aggregate<User>([
      { $match: { _id: { $in: ids.map((id) => new ObjectId(id)) } } },
      { $project: { password: 0 } },
      productsLookup,
    ]);

    console.log('select users where id IN( ' + ids.join(', ') + ' )');

    return users;
  }
}
