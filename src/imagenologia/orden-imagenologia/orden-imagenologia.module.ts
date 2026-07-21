import { Module } from '@nestjs/common';
import { OrdenImagenologiaService } from './orden-imagenologia.service';
import { OrdenImagenologiaController } from './orden-imagenologia.controller';

@Module({
  controllers: [OrdenImagenologiaController],
  providers: [OrdenImagenologiaService],
})
export class OrdenImagenologiaModule {}
