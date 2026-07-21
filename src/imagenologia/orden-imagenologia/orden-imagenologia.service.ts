import { Injectable } from '@nestjs/common';
import { CreateOrdenImagenologiaDto } from './dto/create-orden-imagenologia.dto';
import { UpdateOrdenImagenologiaDto } from './dto/update-orden-imagenologia.dto';

@Injectable()
export class OrdenImagenologiaService {
  create(createOrdenImagenologiaDto: CreateOrdenImagenologiaDto) {
    return 'This action adds a new ordenImagenologia';
  }

  findAll() {
    return `This action returns all ordenImagenologia`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ordenImagenologia`;
  }

  update(id: number, updateOrdenImagenologiaDto: UpdateOrdenImagenologiaDto) {
    return `This action updates a #${id} ordenImagenologia`;
  }

  remove(id: number) {
    return `This action removes a #${id} ordenImagenologia`;
  }
}
