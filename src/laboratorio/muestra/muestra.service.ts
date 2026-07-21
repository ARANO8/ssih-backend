import { Injectable } from '@nestjs/common';
import { CreateMuestraDto } from './dto/create-muestra.dto';
import { UpdateMuestraDto } from './dto/update-muestra.dto';

@Injectable()
export class MuestraService {
  create(createMuestraDto: CreateMuestraDto) {
    return 'This action adds a new muestra';
  }

  findAll() {
    return `This action returns all muestra`;
  }

  findOne(id: number) {
    return `This action returns a #${id} muestra`;
  }

  update(id: number, updateMuestraDto: UpdateMuestraDto) {
    return `This action updates a #${id} muestra`;
  }

  remove(id: number) {
    return `This action removes a #${id} muestra`;
  }
}
