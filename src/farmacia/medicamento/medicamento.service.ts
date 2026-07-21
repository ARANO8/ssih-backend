import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateMedicamentoDto } from './dto/create-medicamento.dto';
import { UpdateMedicamentoDto } from './dto/update-medicamento.dto';

@Injectable()
export class MedicamentoService {
  constructor(private readonly prisma: PrismaService) {}

  private parseId(id: string): any {
    if (!id) return id;
    if (/[a-zA-Z\-]/.test(id)) return id;
    return isNaN(Number(id)) ? id : Number(id);
  }

  create(createMedicamentoDto: CreateMedicamentoDto) {
    return (this.prisma as any).medicamento.create({
      data: createMedicamentoDto as any,
    });
  }

  findAll() {
    return (this.prisma as any).medicamento.findMany();
  }

  findOne(id: string) {
    return (this.prisma as any).medicamento.findUnique({
      where: { id: this.parseId(id) },
    });
  }

  update(id: string, updateMedicamentoDto: UpdateMedicamentoDto) {
    return (this.prisma as any).medicamento.update({
      where: { id: this.parseId(id) },
      data: updateMedicamentoDto as any,
    });
  }

  remove(id: string) {
    return (this.prisma as any).medicamento.delete({
      where: { id: this.parseId(id) },
    });
  }
}
