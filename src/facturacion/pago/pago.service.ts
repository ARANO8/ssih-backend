import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';

@Injectable()
export class PagoService {
  constructor(private readonly prisma: PrismaService) {}

  private parseId(id: string): any {
    if (!id) return id;
    if (/[a-zA-Z\-]/.test(id)) return id;
    return isNaN(Number(id)) ? id : Number(id);
  }

  create(createPagoDto: CreatePagoDto) {
    return (this.prisma as any).pago.create({
      data: createPagoDto as any,
    });
  }

  findAll() {
    return (this.prisma as any).pago.findMany();
  }

  findOne(id: string) {
    return (this.prisma as any).pago.findUnique({
      where: { id: this.parseId(id) },
    });
  }

  update(id: string, updatePagoDto: UpdatePagoDto) {
    return (this.prisma as any).pago.update({
      where: { id: this.parseId(id) },
      data: updatePagoDto as any,
    });
  }

  remove(id: string) {
    return (this.prisma as any).pago.delete({
      where: { id: this.parseId(id) },
    });
  }
}
