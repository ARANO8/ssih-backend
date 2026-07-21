import { Module } from '@nestjs/common';
import { OrdenLaboratorioService } from './orden-laboratorio.service';
import { OrdenLaboratorioController } from './orden-laboratorio.controller';

@Module({
  controllers: [OrdenLaboratorioController],
  providers: [OrdenLaboratorioService],
})
export class OrdenLaboratorioModule {}
