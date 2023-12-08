import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { MATH_SERVICE } from 'src/util';

@Injectable()
export class MathClientService implements OnApplicationBootstrap {
  constructor(@Inject(MATH_SERVICE) private readonly client: ClientProxy) {}

  async onApplicationBootstrap() {
    // console.log('Connecting to MATH_SERVICE...');
    // await this.client.connect();
    // console.log('Connected to MATH_SERVICE');
  }

  async calcSum(data: number[]): Promise<number> {
    const sum = await lastValueFrom(
      this.client.send<number>({ cmd: 'sum' }, data),
    );
    return sum;
  }

  async calcMult(data: number[]): Promise<number> {
    const mult = await lastValueFrom(
      this.client.send<number>({ cmd: 'mult' }, data),
    );
    return mult;
  }

  connectBybit() {
    this.client.emit('event_connect', {});
  }
  disconnectBybit() {
    this.client.emit('event_disconnect', {});
  }
  reconnectBybit() {
    this.client.emit('event_reconnect', {});
  }
}
