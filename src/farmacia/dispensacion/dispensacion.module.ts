import { Module } from '@nestjs/common';
import { DispensacionService } from './dispensacion.service';
import { DispensacionController } from './dispensacion.controller';

@Module({
  controllers: [DispensacionController],
  providers: [DispensacionService],
})
export class DispensacionModule {}
