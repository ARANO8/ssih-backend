import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateMedicoDto } from './dto/create-medico.dto';
import { UpdateMedicoDto } from './dto/update-medico.dto';

@Injectable()
export class MedicoService {
  constructor(private readonly prisma: PrismaService) {}

  private parseId(id: string): any {
    if (!id) return id;
    if (/[a-zA-Z\-]/.test(id)) return id;
    return isNaN(Number(id)) ? id : Number(id);
  }

  create(createMedicoDto: CreateMedicoDto) {
    return (this.prisma as any).medico.create({
      data: createMedicoDto as any,
    });
  }

  findAll() {
    return (this.prisma as any).medico.findMany();
  }

  findOne(id: string) {
    return (this.prisma as any).medico.findUnique({
      where: { id: this.parseId(id) },
    });
  }

  update(id: string, updateMedicoDto: UpdateMedicoDto) {
    return (this.prisma as any).medico.update({
      where: { id: this.parseId(id) },
      data: updateMedicoDto as any,
    });
  }

  remove(id: string) {
    return (this.prisma as any).medico.delete({
      where: { id: this.parseId(id) },
    });
  }
}
