import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateConsultorioDto } from './dto/create-consultorio.dto';
import { UpdateConsultorioDto } from './dto/update-consultorio.dto';

@Injectable()
export class ConsultorioService {
  constructor(private readonly prisma: PrismaService) {}

  private parseId(id: string): any {
    if (!id) return id;
    if (/[a-zA-Z\-]/.test(id)) return id;
    return isNaN(Number(id)) ? id : Number(id);
  }

  create(createConsultorioDto: CreateConsultorioDto) {
    return (this.prisma as any).consultorio.create({
      data: createConsultorioDto as any,
    });
  }

  findAll() {
    return (this.prisma as any).consultorio.findMany();
  }

  findOne(id: string) {
    return (this.prisma as any).consultorio.findUnique({
      where: { id: this.parseId(id) },
    });
  }

  update(id: string, updateConsultorioDto: UpdateConsultorioDto) {
    return (this.prisma as any).consultorio.update({
      where: { id: this.parseId(id) },
      data: updateConsultorioDto as any,
    });
  }

  remove(id: string) {
    return (this.prisma as any).consultorio.delete({
      where: { id: this.parseId(id) },
    });
  }
}
