import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  @MessagePattern({ cmd: 'convertir' })
  convertir(data: { valor: number; unidad: string }): string {
    if (data.unidad === 'km-a-millas') {
      return `${data.valor} km son ${(data.valor * 0.621371).toFixed(2)} millas`;
    } else if (data.unidad === 'millas-a-km') {
      return `${data.valor} millas son ${(data.valor / 0.621371).toFixed(2)} km`;
    } else {
      return 'Conversión no soportada';
    }
  }
}
