import { Injectable } from '@nestjs/common';
import { CreateEpisodioAtencionDto } from './dto/create-episodio-atencion.dto';
import { UpdateEpisodioAtencionDto } from './dto/update-episodio-atencion.dto';

@Injectable()
export class EpisodioAtencionService {
  create(createEpisodioAtencionDto: CreateEpisodioAtencionDto) {
    return 'This action adds a new episodioAtencion';
  }

  findAll() {
    return `This action returns all episodioAtencion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} episodioAtencion`;
  }

  update(id: number, updateEpisodioAtencionDto: UpdateEpisodioAtencionDto) {
    return `This action updates a #${id} episodioAtencion`;
  }

  remove(id: number) {
    return `This action removes a #${id} episodioAtencion`;
  }
}
