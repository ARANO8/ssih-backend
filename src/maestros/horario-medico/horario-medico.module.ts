import { Module } from '@nestjs/common';
import { HorarioMedicoController } from './horario-medico.controller';
import { HorarioMedicoService } from './horario-medico.service';

@Module({ controllers: [HorarioMedicoController], providers: [HorarioMedicoService] })
export class HorarioMedicoModule {}
