import { Injectable } from '@nestjs/common';
import { CreateConsultorioDto } from './dto/create-consultorio.dto';
import { UpdateConsultorioDto } from './dto/update-consultorio.dto';

@Injectable()
export class ConsultorioService {
  create(createConsultorioDto: CreateConsultorioDto) {
    return 'This action adds a new consultorio';
  }

  findAll() {
    return `This action returns all consultorio`;
  }

  findOne(id: number) {
    return `This action returns a #${id} consultorio`;
  }

  update(id: number, updateConsultorioDto: UpdateConsultorioDto) {
    return `This action updates a #${id} consultorio`;
  }

  remove(id: number) {
    return `This action removes a #${id} consultorio`;
  }
}
