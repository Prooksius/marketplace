import {
  Args,
  Context,
  ID,
  Info,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserService } from 'src/users/user.service';
import { User } from 'src/users/schemas/user.schema';
import { ProductService } from 'src/products/product.service';
import { Product } from 'src/products/schemas/product.schema';
import { FindUserInput } from './inputs/find-user.input';
import { UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginUserInput } from './inputs/login-user.input';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserInput } from './inputs/create-user.input';
import { IDataloaders } from 'src/dataloader/dataloader.interface';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private productService: ProductService,
    private userService: UserService,
  ) {}

  @Query(() => User, { name: 'findUser' })
  async user(
    @Args('input') { _id }: FindUserInput,
    @Context('loaders') { usersLoader }: IDataloaders,
  ): Promise<User> {
    const user = await this.userService.findOne(_id);
    usersLoader.prime(String(user._id), user);
    return user;
  }

  @UseGuards(LocalAuthGuard)
  @Mutation(() => User, { name: 'login' })
  async login(
    @Args('input') login: LoginUserInput,
    @Context() { req, loaders: { usersLoader } }: IGraphQLContext,
  ): Promise<Partial<User>> {
    const user = req.user;
    const loadedUser = await this.userService.login(user);
    usersLoader.prime(String(loadedUser._id), loadedUser as User);
    return loadedUser;
  }

  @Mutation(() => User, { name: 'register' })
  async register(@Args('input') register: CreateUserInput) {
    return this.userService.create(register);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => User, { name: 'profile' })
  async profile(@Context() context: any) {
    const user = context.req.user;
    return this.userService.findOne(user._id);
  }

  @Query(() => [User], { name: 'findAllUsers' })
  async users(
    @Context('loaders') { usersLoader }: IDataloaders,
  ): Promise<User[]> {
    const users = await this.userService.findAll();
    users.map((user) => usersLoader.prime(String(user._id), user));
    return users;
  }

  @ResolveField(() => [Product])
  async products(
    @Parent() { productIds }: User,
    @Context('loaders') { productsLoader }: IDataloaders,
    @Info() info: any,
  ): Promise<(Error | Product)[]> {
    return productsLoader.loadMany(productIds.map((id) => String(id._id)));
  }
}
