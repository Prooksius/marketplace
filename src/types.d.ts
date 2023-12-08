import { IDataloaders } from './dataloader/dataloader.interface';

declare global {
  interface IGraphQLContext {
    req: any;
    res: any;
    loaders: IDataloaders;
  }
}
