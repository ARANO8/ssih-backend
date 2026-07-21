import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class MedicoService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.medicoUncheckedCreateInput) {
    return this.prisma.medico.create({
      data,
      include: { 
        empleado: {
          include: { persona: true } // Traemos empleado y persona al mismo tiempo
        }
      }
    });
  }

  async findAll() {
    return this.prisma.medico.findMany({
      where: { activo: true },
      include: { 
        empleado: {
          include: { persona: true }
        }
      }
    });
  }

  async findOne(id: string) {
    const medico = await this.prisma.medico.findUnique({
      where: { id },
      include: { 
        empleado: {
          include: { persona: true }
        }
      }
    });
    if (!medico) throw new NotFoundException('Médico no encontrado');
    return medico;
  }

  async update(id: string, data: Prisma.medicoUpdateInput) {
    await this.findOne(id);
    return this.prisma.medico.update({
      where: { id },
      data,
      include: { 
        empleado: {
          include: { persona: true }
        }
      }
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.medico.update({
      where: { id },
      data: { activo: false }
    });
  }
}