import { PartialType } from '@nestjs/swagger';
import { CreateOrdenLaboratorioDto } from './create-orden-laboratorio.dto';

export class UpdateOrdenLaboratorioDto extends PartialType(
  CreateOrdenLaboratorioDto,
) {}
