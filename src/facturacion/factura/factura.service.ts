import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';

@Injectable()
export class FacturaService {
  constructor(private readonly prisma: PrismaService) {}

  private parseId(id: string): any {
    if (!id) return id;
    if (/[a-zA-Z\-]/.test(id)) return id;
    return isNaN(Number(id)) ? id : Number(id);
  }

  create(createFacturaDto: CreateFacturaDto) {
    return (this.prisma as any).factura.create({
      data: createFacturaDto as any,
    });
  }

  findAll() {
    return (this.prisma as any).factura.findMany();
  }

  findOne(id: string) {
    return (this.prisma as any).factura.findUnique({
      where: { id: this.parseId(id) },
    });
  }

  update(id: string, updateFacturaDto: UpdateFacturaDto) {
    return (this.prisma as any).factura.update({
      where: { id: this.parseId(id) },
      data: updateFacturaDto as any,
    });
  }

  remove(id: string) {
    return (this.prisma as any).factura.delete({
      where: { id: this.parseId(id) },
    });
  }
}
