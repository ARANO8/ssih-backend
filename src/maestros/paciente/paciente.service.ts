import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Injectable()
export class PacienteService {
  constructor(private readonly prisma: PrismaService) {}

  private parseId(id: string): any {
    if (!id) return id;
    if (/[a-zA-Z\-]/.test(id)) return id;
    return isNaN(Number(id)) ? id : Number(id);
  }

  create(createPacienteDto: CreatePacienteDto) {
    return (this.prisma as any).paciente.create({
      data: createPacienteDto as any,
    });
  }

  findAll() {
    return (this.prisma as any).paciente.findMany();
  }

  findOne(id: string) {
    return (this.prisma as any).paciente.findUnique({
      where: { id: this.parseId(id) },
    });
  }

  update(id: string, updatePacienteDto: UpdatePacienteDto) {
    return (this.prisma as any).paciente.update({
      where: { id: this.parseId(id) },
      data: updatePacienteDto as any,
    });
  }

  remove(id: string) {
    return (this.prisma as any).paciente.delete({
      where: { id: this.parseId(id) },
    });
  }
}
