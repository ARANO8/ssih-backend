import { Injectable } from '@nestjs/common';
import { CreateSignoVitalDto } from './dto/create-signo-vital.dto';
import { UpdateSignoVitalDto } from './dto/update-signo-vital.dto';

@Injectable()
export class SignoVitalService {
  create(createSignoVitalDto: CreateSignoVitalDto) {
    return 'This action adds a new signoVital';
  }

  findAll() {
    return `This action returns all signoVital`;
  }

  findOne(id: number) {
    return `This action returns a #${id} signoVital`;
  }

  update(id: number, updateSignoVitalDto: UpdateSignoVitalDto) {
    return `This action updates a #${id} signoVital`;
  }

  remove(id: number) {
    return `This action removes a #${id} signoVital`;
  }
}
