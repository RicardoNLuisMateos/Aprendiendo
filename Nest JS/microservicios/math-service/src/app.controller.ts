import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  @MessagePattern({ cmd: 'sumar' })
  sumar(data: { num1: number; num2: number }): number {
    console.log("num1: ", data.num1);
    console.log("num2: ", data.num2);
    return data.num1 + data.num2;
  }
}
