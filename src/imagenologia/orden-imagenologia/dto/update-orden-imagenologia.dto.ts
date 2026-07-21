import { PartialType } from '@nestjs/swagger';
import { CreateOrdenImagenologiaDto } from './create-orden-imagenologia.dto';

export class UpdateOrdenImagenologiaDto extends PartialType(CreateOrdenImagenologiaDto) {}
