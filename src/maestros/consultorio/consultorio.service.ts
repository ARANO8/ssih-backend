import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class ConsultorioService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.consultorioCreateInput) {
    return this.prisma.consultorio.create({ data });
  }

  async findAll() {
    return this.prisma.consultorio.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' }
    });
  }

  async findOne(id: string) {
    const consultorio = await this.prisma.consultorio.findUnique({ where: { id } });
    if (!consultorio) throw new NotFoundException('Consultorio no encontrado');
    return consultorio;
  }

  async update(id: string, data: Prisma.consultorioUpdateInput) {
    await this.findOne(id);
    return this.prisma.consultorio.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.consultorio.update({
      where: { id },
      data: { activo: false }
    });
  }
}