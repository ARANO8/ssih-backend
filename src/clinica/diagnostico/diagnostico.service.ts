import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateDiagnosticoDto } from './dto/create-diagnostico.dto';
import { UpdateDiagnosticoDto } from './dto/update-diagnostico.dto';

@Injectable()
export class DiagnosticoService {
  constructor(private readonly prisma: PrismaService) {}

  private parseId(id: string): any {
    if (!id) return id;
    if (/[a-zA-Z\-]/.test(id)) return id;
    return isNaN(Number(id)) ? id : Number(id);
  }

  create(createDiagnosticoDto: CreateDiagnosticoDto) {
    return (this.prisma as any).diagnostico.create({
      data: createDiagnosticoDto as any,
    });
  }

  findAll() {
    return (this.prisma as any).diagnostico.findMany();
  }

  findOne(id: string) {
    return (this.prisma as any).diagnostico.findUnique({
      where: { id: this.parseId(id) },
    });
  }

  update(id: string, updateDiagnosticoDto: UpdateDiagnosticoDto) {
    return (this.prisma as any).diagnostico.update({
      where: { id: this.parseId(id) },
      data: updateDiagnosticoDto as any,
    });
  }

  remove(id: string) {
    return (this.prisma as any).diagnostico.delete({
      where: { id: this.parseId(id) },
    });
  }
}
