import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateMuestraDto } from './dto/create-muestra.dto';
import { UpdateMuestraDto } from './dto/update-muestra.dto';

@Injectable()
export class MuestraService {
  constructor(private readonly prisma: PrismaService) {}

  private parseId(id: string): any {
    if (!id) return id;
    if (/[a-zA-Z\-]/.test(id)) return id;
    return isNaN(Number(id)) ? id : Number(id);
  }

  create(createMuestraDto: CreateMuestraDto) {
    return (this.prisma as any).muestra.create({
      data: createMuestraDto as any,
    });
  }

  findAll() {
    return (this.prisma as any).muestra.findMany();
  }

  findOne(id: string) {
    return (this.prisma as any).muestra.findUnique({
      where: { id: this.parseId(id) },
    });
  }

  update(id: string, updateMuestraDto: UpdateMuestraDto) {
    return (this.prisma as any).muestra.update({
      where: { id: this.parseId(id) },
      data: updateMuestraDto as any,
    });
  }

  remove(id: string) {
    return (this.prisma as any).muestra.delete({
      where: { id: this.parseId(id) },
    });
  }
}
