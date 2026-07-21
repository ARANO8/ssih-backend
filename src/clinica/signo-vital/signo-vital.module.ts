import { Module } from '@nestjs/common';
import { SignoVitalService } from './signo-vital.service';
import { SignoVitalController } from './signo-vital.controller';

@Module({
  controllers: [SignoVitalController],
  providers: [SignoVitalService],
})
export class SignoVitalModule {}
