import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';

@Injectable()
export class EmpleadoService {
  constructor(private readonly prisma: PrismaService) {}

  private parseId(id: string): any {
    if (!id) return id;
    if (/[a-zA-Z\-]/.test(id)) return id;
    return isNaN(Number(id)) ? id : Number(id);
  }

  create(createEmpleadoDto: CreateEmpleadoDto) {
    return (this.prisma as any).empleado.create({
      data: createEmpleadoDto as any,
    });
  }

  findAll() {
    return (this.prisma as any).empleado.findMany({ include: { persona: true, medico: true } });
  }

  findOne(id: string) {
    return (this.prisma as any).empleado.findUnique({
      where: { id: this.parseId(id) },
      include: { persona: true, medico: true },
    });
  }

  update(id: string, updateEmpleadoDto: UpdateEmpleadoDto) {
    return (this.prisma as any).empleado.update({
      where: { id: this.parseId(id) },
      data: updateEmpleadoDto as any,
    });
  }

  remove(id: string) {
    return (this.prisma as any).empleado.delete({
      where: { id: this.parseId(id) },
    });
  }
}
