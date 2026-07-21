import { PartialType } from '@nestjs/swagger';
import { CreateEpisodioAtencionDto } from './create-episodio-atencion.dto';

export class UpdateEpisodioAtencionDto extends PartialType(
  CreateEpisodioAtencionDto,
) {}
