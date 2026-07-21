import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateConsultaDto } from './dto/create-consulta.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';

@Injectable()
export class ConsultaService {
  constructor(private readonly prisma: PrismaService) {}

  private parseId(id: string): any {
    if (!id) return id;
    if (/[a-zA-Z\-]/.test(id)) return id;
    return isNaN(Number(id)) ? id : Number(id);
  }

  create(createConsultaDto: CreateConsultaDto) {
    return (this.prisma as any).consulta.create({
      data: createConsultaDto as any,
    });
  }

  findAll() {
    return (this.prisma as any).consulta.findMany();
  }

  findOne(id: string) {
    return (this.prisma as any).consulta.findUnique({
      where: { id: this.parseId(id) },
    });
  }

  update(id: string, updateConsultaDto: UpdateConsultaDto) {
    return (this.prisma as any).consulta.update({
      where: { id: this.parseId(id) },
      data: updateConsultaDto as any,
    });
  }

  remove(id: string) {
    return (this.prisma as any).consulta.delete({
      where: { id: this.parseId(id) },
    });
  }
}
