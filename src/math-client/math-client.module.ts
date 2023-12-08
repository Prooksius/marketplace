import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MathClientService } from './math-client.service';
import { MATH_SERVICE } from 'src/util';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MATH_SERVICE,
        useFactory: async () => ({
          transport: Transport.TCP,
          options: { host: 'localhost', port: 4000 },
        }),
      },
    ]),
  ],
  providers: [MathClientService],
  exports: [MathClientService],
})
export class MathClientModule {}
