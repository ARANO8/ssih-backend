import { PartialType } from '@nestjs/swagger';
import { CreateMuestraDto } from './create-muestra.dto';

export class UpdateMuestraDto extends PartialType(CreateMuestraDto) {}
