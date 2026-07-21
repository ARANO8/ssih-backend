import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateSignoVitalDto } from './dto/create-signo-vital.dto';
import { UpdateSignoVitalDto } from './dto/update-signo-vital.dto';

@Injectable()
export class SignoVitalService {
  constructor(private readonly prisma: PrismaService) {}

  private parseId(id: string): any {
    if (!id) return id;
    if (/[a-zA-Z\-]/.test(id)) return id;
    return isNaN(Number(id)) ? id : Number(id);
  }

  create(createSignoVitalDto: CreateSignoVitalDto) {
    return (this.prisma as any).signoVital.create({
      data: createSignoVitalDto as any,
    });
  }

  findAll() {
    return (this.prisma as any).signoVital.findMany();
  }

  findOne(id: string) {
    return (this.prisma as any).signoVital.findUnique({
      where: { id: this.parseId(id) },
    });
  }

  update(id: string, updateSignoVitalDto: UpdateSignoVitalDto) {
    return (this.prisma as any).signoVital.update({
      where: { id: this.parseId(id) },
      data: updateSignoVitalDto as any,
    });
  }

  remove(id: string) {
    return (this.prisma as any).signoVital.delete({
      where: { id: this.parseId(id) },
    });
  }
}
