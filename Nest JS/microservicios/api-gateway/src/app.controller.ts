import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('sumar')
  async sumar(
    @Query('num1') num1: number,
    @Query('num2') num2: number,
  ): Promise<number> {
    return this.appService.sumar(num1, num2);
  }

  @Get('convertir')
  async convertir(
    @Query('valor') valor: number,
    @Query('unidad') unidad: string,
  ): Promise<string> {
    return this.appService.convertir(valor, unidad);
  }
}
