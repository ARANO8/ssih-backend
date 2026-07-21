import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateEspecialidadDto } from './dto/create-especialidad.dto';
import { UpdateEspecialidadDto } from './dto/update-especialidad.dto';

@Injectable()
export class EspecialidadService {
  constructor(private readonly prisma: PrismaService) {}

  private parseId(id: string): any {
    if (!id) return id;
    if (/[a-zA-Z\-]/.test(id)) return id;
    return isNaN(Number(id)) ? id : Number(id);
  }

  create(createEspecialidadDto: CreateEspecialidadDto) {
    return (this.prisma as any).especialidad.create({
      data: createEspecialidadDto as any,
    });
  }

  findAll() {
    return (this.prisma as any).especialidad.findMany();
  }

  findOne(id: string) {
    return (this.prisma as any).especialidad.findUnique({
      where: { id: this.parseId(id) },
    });
  }

  update(id: string, updateEspecialidadDto: UpdateEspecialidadDto) {
    return (this.prisma as any).especialidad.update({
      where: { id: this.parseId(id) },
      data: updateEspecialidadDto as any,
    });
  }

  remove(id: string) {
    return (this.prisma as any).especialidad.delete({
      where: { id: this.parseId(id) },
    });
  }
}
