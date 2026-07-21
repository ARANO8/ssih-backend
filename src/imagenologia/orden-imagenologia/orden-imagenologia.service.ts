import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateOrdenImagenologiaDto } from './dto/create-orden-imagenologia.dto';
import { UpdateOrdenImagenologiaDto } from './dto/update-orden-imagenologia.dto';

@Injectable()
export class OrdenImagenologiaService {
  constructor(private readonly prisma: PrismaService) {}

  private parseId(id: string): any {
    if (!id) return id;
    if (/[a-zA-Z\-]/.test(id)) return id;
    return isNaN(Number(id)) ? id : Number(id);
  }

  create(createOrdenImagenologiaDto: CreateOrdenImagenologiaDto) {
    return (this.prisma as any).ordenImagenologia.create({
      data: createOrdenImagenologiaDto as any,
    });
  }

  findAll() {
    return (this.prisma as any).ordenImagenologia.findMany({
      include: { consulta: true, medico: true },
      orderBy: { solicitadoEn: 'desc' },
    });
  }

  findOne(id: string) {
    return (this.prisma as any).ordenImagenologia.findUnique({
      where: { id: this.parseId(id) },
      include: { consulta: true, medico: true },
    });
  }

  update(id: string, updateOrdenImagenologiaDto: UpdateOrdenImagenologiaDto) {
    return (this.prisma as any).ordenImagenologia.update({
      where: { id: this.parseId(id) },
      data: updateOrdenImagenologiaDto as any,
    });
  }

  remove(id: string) {
    return (this.prisma as any).ordenImagenologia.delete({
      where: { id: this.parseId(id) },
    });
  }
}
