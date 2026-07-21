import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';

@Injectable()
export class ProveedorService {
  constructor(private readonly prisma: PrismaService) {}

  private parseId(id: string): any {
    if (!id) return id;
    if (/[a-zA-Z\-]/.test(id)) return id;
    return isNaN(Number(id)) ? id : Number(id);
  }

  create(createProveedorDto: CreateProveedorDto) {
    return (this.prisma as any).proveedor.create({
      data: createProveedorDto as any,
    });
  }

  findAll() {
    return (this.prisma as any).proveedor.findMany();
  }

  findOne(id: string) {
    return (this.prisma as any).proveedor.findUnique({
      where: { id: this.parseId(id) },
    });
  }

  update(id: string, updateProveedorDto: UpdateProveedorDto) {
    return (this.prisma as any).proveedor.update({
      where: { id: this.parseId(id) },
      data: updateProveedorDto as any,
    });
  }

  remove(id: string) {
    return (this.prisma as any).proveedor.delete({
      where: { id: this.parseId(id) },
    });
  }
}
