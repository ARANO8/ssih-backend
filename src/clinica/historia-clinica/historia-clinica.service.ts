import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateHistoriaClinicaDto } from './dto/create-historia-clinica.dto';
import { UpdateHistoriaClinicaDto } from './dto/update-historia-clinica.dto';

@Injectable()
export class HistoriaClinicaService {
  constructor(private readonly prisma: PrismaService) {}

  private parseId(id: string): any {
    if (!id) return id;
    if (/[a-zA-Z\-]/.test(id)) return id;
    return isNaN(Number(id)) ? id : Number(id);
  }

  create(createHistoriaClinicaDto: CreateHistoriaClinicaDto) {
    return (this.prisma as any).historiaClinica.create({
      data: createHistoriaClinicaDto as any,
    });
  }

  findAll() {
    return (this.prisma as any).historiaClinica.findMany();
  }

  findOne(id: string) {
    return (this.prisma as any).historiaClinica.findUnique({
      where: { id: this.parseId(id) },
    });
  }

  update(id: string, updateHistoriaClinicaDto: UpdateHistoriaClinicaDto) {
    return (this.prisma as any).historiaClinica.update({
      where: { id: this.parseId(id) },
      data: updateHistoriaClinicaDto as any,
    });
  }

  remove(id: string) {
    return (this.prisma as any).historiaClinica.delete({
      where: { id: this.parseId(id) },
    });
  }
}
