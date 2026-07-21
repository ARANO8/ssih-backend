import { PartialType } from '@nestjs/swagger';
import { CreateConsultorioDto } from './create-consultorio.dto';

export class UpdateConsultorioDto extends PartialType(CreateConsultorioDto) {}
