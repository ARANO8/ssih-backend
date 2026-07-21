import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class PacienteService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.pacienteUncheckedCreateInput) {
    // Verificamos que la persona exista antes de crear el paciente
    const persona = await this.prisma.persona.findUnique({ where: { id: data.persona_id } });
    if (!persona) throw new NotFoundException('La persona no existe');

    return this.prisma.paciente.create({
      data,
      include: { persona: true } // Retorna el paciente con sus datos personales
    });
  }

  async findAll() {
    return this.prisma.paciente.findMany({
      where: { activo: true },
      include: { persona: true },
      orderBy: { fecha_registro: 'desc' }
    });
  }

  async findOne(id: string) {
    const paciente = await this.prisma.paciente.findUnique({
      where: { id },
      include: { persona: true }
    });
    if (!paciente) throw new NotFoundException(`Paciente ${id} no encontrado`);
    return paciente;
  }

  async update(id: string, data: Prisma.pacienteUpdateInput) {
    await this.findOne(id);
    return this.prisma.paciente.update({
      where: { id },
      data,
      include: { persona: true }
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.paciente.update({
      where: { id },
      data: { activo: false }
    });
  }
}