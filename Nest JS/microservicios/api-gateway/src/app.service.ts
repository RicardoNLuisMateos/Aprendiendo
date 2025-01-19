import { Injectable } from '@nestjs/common';
import { ClientProxy, Client, Transport } from '@nestjs/microservices';

@Injectable()
export class AppService {
  @Client({ transport: Transport.TCP, options: { host: 'localhost', port: 3001 } })
  private mathService: ClientProxy;

  @Client({ transport: Transport.TCP, options: { host: 'localhost', port: 3002 } })
  private unitService: ClientProxy;

  async sumar(num1: number, num2: number): Promise<number> {
    return this.mathService.send({ cmd: 'sumar' }, { num1, num2 }).toPromise();
  }

  async convertir(valor: number, unidad: string): Promise<string> {
    return this.unitService.send({ cmd: 'convertir' }, { valor, unidad }).toPromise();
  }
}