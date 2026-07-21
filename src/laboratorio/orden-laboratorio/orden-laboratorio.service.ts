import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateOrdenLaboratorioDto } from './dto/create-orden-laboratorio.dto';
import { UpdateOrdenLaboratorioDto } from './dto/update-orden-laboratorio.dto';

@Injectable()
export class OrdenLaboratorioService {
  constructor(private readonly prisma: PrismaService) {}

  private parseId(id: string): any {
    if (!id) return id;
    if (/[a-zA-Z\-]/.test(id)) return id;
    return isNaN(Number(id)) ? id : Number(id);
  }

  create(createOrdenLaboratorioDto: CreateOrdenLaboratorioDto) {
    return (this.prisma as any).ordenLaboratorio.create({
      data: createOrdenLaboratorioDto as any,
    });
  }

  findAll() {
    return (this.prisma as any).ordenLaboratorio.findMany();
  }

  findOne(id: string) {
    return (this.prisma as any).ordenLaboratorio.findUnique({
      where: { id: this.parseId(id) },
    });
  }

  update(id: string, updateOrdenLaboratorioDto: UpdateOrdenLaboratorioDto) {
    return (this.prisma as any).ordenLaboratorio.update({
      where: { id: this.parseId(id) },
      data: updateOrdenLaboratorioDto as any,
    });
  }

  remove(id: string) {
    return (this.prisma as any).ordenLaboratorio.delete({
      where: { id: this.parseId(id) },
    });
  }
}
