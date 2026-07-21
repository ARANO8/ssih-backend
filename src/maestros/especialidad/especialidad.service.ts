import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class EspecialidadService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.especialidadCreateInput) {
    return this.prisma.especialidad.create({ data });
  }

  async findAll() {
    return this.prisma.especialidad.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' }
    });
  }

  async findOne(id: number) {
    const especialidad = await this.prisma.especialidad.findUnique({ where: { id } });
    if (!especialidad) throw new NotFoundException(`Especialidad ${id} no encontrada`);
    return especialidad;
  }

  async update(id: number, data: Prisma.especialidadUpdateInput) {
    await this.findOne(id);
    return this.prisma.especialidad.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.especialidad.update({
      where: { id },
      data: { activo: false }
    });
  }
}