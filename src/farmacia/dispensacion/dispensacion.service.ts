import { Injectable } from '@nestjs/common';
import { CreateDispensacionDto } from './dto/create-dispensacion.dto';
import { UpdateDispensacionDto } from './dto/update-dispensacion.dto';

@Injectable()
export class DispensacionService {
  create(createDispensacionDto: CreateDispensacionDto) {
    return 'This action adds a new dispensacion';
  }

  findAll() {
    return `This action returns all dispensacion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dispensacion`;
  }

  update(id: number, updateDispensacionDto: UpdateDispensacionDto) {
    return `This action updates a #${id} dispensacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} dispensacion`;
  }
}
