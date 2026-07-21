import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';

@Injectable()
export class CompraService {
  constructor(private readonly prisma: PrismaService) {}

  private parseId(id: string): any {
    if (!id) return id;
    if (/[a-zA-Z\-]/.test(id)) return id;
    return isNaN(Number(id)) ? id : Number(id);
  }

  create(createCompraDto: CreateCompraDto) {
    return (this.prisma as any).compra.create({
      data: createCompraDto as any,
    });
  }

  findAll() {
    return (this.prisma as any).compra.findMany();
  }

  findOne(id: string) {
    return (this.prisma as any).compra.findUnique({
      where: { id: this.parseId(id) },
    });
  }

  update(id: string, updateCompraDto: UpdateCompraDto) {
    return (this.prisma as any).compra.update({
      where: { id: this.parseId(id) },
      data: updateCompraDto as any,
    });
  }

  remove(id: string) {
    return (this.prisma as any).compra.delete({
      where: { id: this.parseId(id) },
    });
  }
}
