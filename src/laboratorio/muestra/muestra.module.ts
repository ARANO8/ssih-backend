import { Module } from '@nestjs/common';
import { MuestraService } from './muestra.service';
import { MuestraController } from './muestra.controller';

@Module({
  controllers: [MuestraController],
  providers: [MuestraService],
})
export class MuestraModule {}
