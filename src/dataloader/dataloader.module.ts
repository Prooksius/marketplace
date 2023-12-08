import { Module } from '@nestjs/common';
import { DataloaderService } from './dataloader.service';
import { ProductModule } from 'src/products/product.module';
import { UserModule } from 'src/users/user.module';
import { AttributeModule } from 'src/attributes/attribute.module';
import { ProductAttributeModule } from 'src/product-attributes/product-attribute.module';

@Module({
  imports: [ProductModule, UserModule, AttributeModule, ProductAttributeModule],
  providers: [DataloaderService],
  exports: [DataloaderService],
})
export class DataloaderModule {}
