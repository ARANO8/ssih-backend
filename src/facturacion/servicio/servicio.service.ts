import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';

@Injectable()
export class ServicioService {
  constructor(private readonly prisma: PrismaService) {}

  private parseId(id: string): any {
    if (!id) return id;
    if (/[a-zA-Z\-]/.test(id)) return id;
    return isNaN(Number(id)) ? id : Number(id);
  }

  create(createServicioDto: CreateServicioDto) {
    return (this.prisma as any).servicio.create({
      data: createServicioDto as any,
    });
  }

  findAll() {
    return (this.prisma as any).servicio.findMany();
  }

  findOne(id: string) {
    return (this.prisma as any).servicio.findUnique({
      where: { id: this.parseId(id) },
    });
  }

  update(id: string, updateServicioDto: UpdateServicioDto) {
    return (this.prisma as any).servicio.update({
      where: { id: this.parseId(id) },
      data: updateServicioDto as any,
    });
  }

  remove(id: string) {
    return (this.prisma as any).servicio.delete({
      where: { id: this.parseId(id) },
    });
  }
}
