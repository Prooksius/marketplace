import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';
import { Argument, MATH_SERVICE, Result, ResultOperation } from 'src/util';

interface MathService {
  accumulate(data: Argument): Observable<Result>;
  multiply(data: Argument): Observable<Result>;
  connectBybit(data: any): Observable<ResultOperation>;
  disconnectBybit(data: any): Observable<ResultOperation>;
  reconnectBybit(data: any): Observable<ResultOperation>;
}

@Injectable()
export class MathClientService implements OnModuleInit {
  private mathService: MathService;

  constructor(@Inject(MATH_SERVICE) private readonly client: ClientGrpc) {}

  async onModuleInit() {
    // console.log('Connecting to MATH_SERVICE...');
    this.mathService = this.client.getService<MathService>('MathService');
    // console.log('Connected to MATH_SERVICE');
  }

  async calcSum(data: number[]): Promise<number> {
    const { result } = await lastValueFrom(
      this.mathService.accumulate({ argument: data }),
    );
    console.log('accumulate result: ', result);
    return result;
  }

  async calcMult(data: number[]): Promise<number> {
    const { result } = await lastValueFrom(
      this.mathService.multiply({ argument: data }),
    );
    console.log('multiply result: ', result);
    return result;
  }

  async connectBybit() {
    const { success } = await lastValueFrom(this.mathService.connectBybit({}));
    console.log('connect result: ', success);
    return success;
  }
  async disconnectBybit() {
    const { success } = await lastValueFrom(
      this.mathService.disconnectBybit({}),
    );
    console.log('disconnect result: ', success);
    return success;
  }
  async reconnectBybit() {
    const { success } = await lastValueFrom(
      this.mathService.reconnectBybit({}),
    );
    console.log('reconnect result: ', success);
    return success;
  }
}
