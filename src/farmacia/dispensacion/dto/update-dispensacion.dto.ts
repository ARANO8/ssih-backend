import { PartialType } from '@nestjs/swagger';
import { CreateDispensacionDto } from './create-dispensacion.dto';

export class UpdateDispensacionDto extends PartialType(CreateDispensacionDto) {}
