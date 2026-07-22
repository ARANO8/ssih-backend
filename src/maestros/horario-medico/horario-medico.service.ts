import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class HorarioMedicoService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Record<string, unknown>) {
    return (this.prisma as any).horarioMedico.create({ data });
  }

  findAll() {
    return (this.prisma as any).horarioMedico.findMany({
      include: {
        medico: { include: { empleado: { include: { persona: true } } } },
        consultorio: true,
      },
      orderBy: [{ diaSemana: 'asc' }, { horaInicio: 'asc' }],
    });
  }

  findOne(id: string) {
    return (this.prisma as any).horarioMedico.findUnique({
      where: { id },
      include: {
        medico: { include: { empleado: { include: { persona: true } } } },
        consultorio: true,
      },
    });
  }

  update(id: string, data: Record<string, unknown>) {
    return (this.prisma as any).horarioMedico.update({ where: { id }, data });
  }

  remove(id: string) {
    return (this.prisma as any).horarioMedico.delete({ where: { id } });
  }
}
