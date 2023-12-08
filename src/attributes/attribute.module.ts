import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttributeService } from './attribute.service';
import { AttributeResolver } from './attribute.resolver';
import { Attribute, AttributeSchema } from './schemas/attribute.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Attribute.name, schema: AttributeSchema },
    ]),
  ],
  providers: [AttributeService, AttributeResolver],
  exports: [AttributeService],
})
export class AttributeModule {}
