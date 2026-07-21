import { PartialType } from '@nestjs/swagger';
import { CreateSignoVitalDto } from './create-signo-vital.dto';

export class UpdateSignoVitalDto extends PartialType(CreateSignoVitalDto) {}
