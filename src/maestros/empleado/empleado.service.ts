import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class EmpleadoService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.empleadoUncheckedCreateInput) {
    return this.prisma.empleado.create({
      data,
      include: { persona: true }
    });
  }

  async findAll() {
    return this.prisma.empleado.findMany({
      where: { activo: true },
      include: { persona: true }
    });
  }

  async findOne(id: string) {
    const empleado = await this.prisma.empleado.findUnique({
      where: { id },
      include: { persona: true }
    });
    if (!empleado) throw new NotFoundException('Empleado no encontrado');
    return empleado;
  }

  async update(id: string, data: Prisma.empleadoUpdateInput) {
    await this.findOne(id);
    return this.prisma.empleado.update({
      where: { id },
      data,
      include: { persona: true }
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.empleado.update({
      where: { id },
      data: { activo: false }
    });
  }
}