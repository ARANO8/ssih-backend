import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { UpdateRecetaDto } from './dto/update-receta.dto';

@Injectable()
export class RecetaService {
  constructor(private readonly prisma: PrismaService) {}

  private parseId(id: string): any {
    if (!id) return id;
    if (/[a-zA-Z\-]/.test(id)) return id;
    return isNaN(Number(id)) ? id : Number(id);
  }

  create(createRecetaDto: CreateRecetaDto) {
    return (this.prisma as any).receta.create({
      data: createRecetaDto as any,
    });
  }

  findAll() {
    return (this.prisma as any).receta.findMany();
  }

  findOne(id: string) {
    return (this.prisma as any).receta.findUnique({
      where: { id: this.parseId(id) },
    });
  }

  update(id: string, updateRecetaDto: UpdateRecetaDto) {
    return (this.prisma as any).receta.update({
      where: { id: this.parseId(id) },
      data: updateRecetaDto as any,
    });
  }

  remove(id: string) {
    return (this.prisma as any).receta.delete({
      where: { id: this.parseId(id) },
    });
  }
}
