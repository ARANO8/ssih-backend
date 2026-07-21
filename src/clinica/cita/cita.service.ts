import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';

@Injectable()
export class CitaService {
  constructor(private readonly prisma: PrismaService) {}

  private parseId(id: string): any {
    if (!id) return id;
    if (/[a-zA-Z\-]/.test(id)) return id;
    return isNaN(Number(id)) ? id : Number(id);
  }

  create(createCitaDto: CreateCitaDto) {
    return (this.prisma as any).cita.create({
      data: createCitaDto as any,
    });
  }

  findAll() {
    return (this.prisma as any).cita.findMany();
  }

  findOne(id: string) {
    return (this.prisma as any).cita.findUnique({
      where: { id: this.parseId(id) },
    });
  }

  update(id: string, updateCitaDto: UpdateCitaDto) {
    return (this.prisma as any).cita.update({
      where: { id: this.parseId(id) },
      data: updateCitaDto as any,
    });
  }

  remove(id: string) {
    return (this.prisma as any).cita.delete({
      where: { id: this.parseId(id) },
    });
  }
}
