import { Injectable } from '@nestjs/common';
import { CreateOrdenLaboratorioDto } from './dto/create-orden-laboratorio.dto';
import { UpdateOrdenLaboratorioDto } from './dto/update-orden-laboratorio.dto';

@Injectable()
export class OrdenLaboratorioService {
  create(createOrdenLaboratorioDto: CreateOrdenLaboratorioDto) {
    return 'This action adds a new ordenLaboratorio';
  }

  findAll() {
    return `This action returns all ordenLaboratorio`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ordenLaboratorio`;
  }

  update(id: number, updateOrdenLaboratorioDto: UpdateOrdenLaboratorioDto) {
    return `This action updates a #${id} ordenLaboratorio`;
  }

  remove(id: number) {
    return `This action removes a #${id} ordenLaboratorio`;
  }
}
