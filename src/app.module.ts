import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './products/product.module';
import { UserModule } from './users/user.module';
// import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { DataloaderModule } from './dataloader/dataloader.module';
import { DataloaderService } from './dataloader/dataloader.service';
import { AttributeModule } from './attributes/attribute.module';
import { ProductAttributeModule } from './product-attributes/product-attribute.module';
import { MathClientModule } from './math-client/math-client.module';

@Module({
  imports: [
    MathClientModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [DataloaderModule],
      inject: [DataloaderService],
      useFactory: (dataloaderService: DataloaderService) => {
        return {
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          playground: true,
          context: ({ req, res }) => ({
            req,
            res,
            loaders: dataloaderService.createLoaders(),
          }),
        };
      },
      // plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/marketplace'),
    AttributeModule,
    ProductModule,
    ProductAttributeModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
