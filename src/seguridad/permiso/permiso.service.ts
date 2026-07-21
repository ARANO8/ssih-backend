import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';

@Injectable()
export class PermisoService {
  constructor(private readonly prisma: PrismaService) {}

  private parseId(id: string): any {
    if (!id) return id;
    if (/[a-zA-Z\-]/.test(id)) return id;
    return isNaN(Number(id)) ? id : Number(id);
  }

  create(createPermisoDto: CreatePermisoDto) {
    return (this.prisma as any).permiso.create({
      data: createPermisoDto as any,
    });
  }

  findAll() {
    return (this.prisma as any).permiso.findMany();
  }

  findOne(id: string) {
    return (this.prisma as any).permiso.findUnique({
      where: { id: this.parseId(id) },
    });
  }

  update(id: string, updatePermisoDto: UpdatePermisoDto) {
    return (this.prisma as any).permiso.update({
      where: { id: this.parseId(id) },
      data: updatePermisoDto as any,
    });
  }

  remove(id: string) {
    return (this.prisma as any).permiso.delete({
      where: { id: this.parseId(id) },
    });
  }
}
