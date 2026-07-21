import { Module } from '@nestjs/common';
import { EpisodioAtencionService } from './episodio-atencion.service';
import { EpisodioAtencionController } from './episodio-atencion.controller';

@Module({
  controllers: [EpisodioAtencionController],
  providers: [EpisodioAtencionService],
})
export class EpisodioAtencionModule {}
