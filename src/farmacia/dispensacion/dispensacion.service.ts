import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateDispensacionDto } from './dto/create-dispensacion.dto';
import { UpdateDispensacionDto } from './dto/update-dispensacion.dto';

@Injectable()
export class DispensacionService {
  constructor(private readonly prisma: PrismaService) {}

  private parseId(id: string): any {
    if (!id) return id;
    if (/[a-zA-Z\-]/.test(id)) return id;
    return isNaN(Number(id)) ? id : Number(id);
  }

  create(createDispensacionDto: CreateDispensacionDto) {
    return (this.prisma as any).dispensacion.create({
      data: createDispensacionDto as any,
    });
  }

  findAll() {
    return (this.prisma as any).dispensacion.findMany();
  }

  findOne(id: string) {
    return (this.prisma as any).dispensacion.findUnique({
      where: { id: this.parseId(id) },
    });
  }

  update(id: string, updateDispensacionDto: UpdateDispensacionDto) {
    return (this.prisma as any).dispensacion.update({
      where: { id: this.parseId(id) },
      data: updateDispensacionDto as any,
    });
  }

  remove(id: string) {
    return (this.prisma as any).dispensacion.delete({
      where: { id: this.parseId(id) },
    });
  }
}
