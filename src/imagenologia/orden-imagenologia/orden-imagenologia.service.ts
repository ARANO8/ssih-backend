import { BadRequestException, Injectable } from '@nestjs/common';
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
      include: {
        consulta: true,
        medico: true,
        detalles: { include: { tipoEstudio: true, resultado: true } },
      },
      orderBy: { solicitadoEn: 'desc' },
    });
  }

  findOne(id: string) {
    return (this.prisma as any).ordenImagenologia.findUnique({
      where: { id: this.parseId(id) },
      include: {
        consulta: true,
        medico: true,
        detalles: { include: { tipoEstudio: true, resultado: true } },
      },
    });
  }

  async registrarResultado(ordenId: string, data: Record<string, any>) {
    if (!data.tipoEstudioCodigo || !data.tipoEstudioNombre || !data.informe || !data.registradoPor) {
      throw new BadRequestException(
        'tipoEstudioCodigo, tipoEstudioNombre, informe y registradoPor son obligatorios',
      );
    }

    return (this.prisma as any).$transaction(async (tx: any) => {
      const tipoEstudio = await tx.tipoEstudio.upsert({
        where: { codigo: data.tipoEstudioCodigo },
        update: { nombre: data.tipoEstudioNombre, descripcion: data.tipoEstudioDescripcion },
        create: {
          codigo: data.tipoEstudioCodigo,
          nombre: data.tipoEstudioNombre,
          descripcion: data.tipoEstudioDescripcion,
        },
      });
      let detalle = await tx.detalleOrdenImg.findFirst({
        where: { ordenId, tipoEstudioId: tipoEstudio.id, regionAnatomica: data.regionAnatomica ?? null },
      });
      if (detalle) {
        detalle = await tx.detalleOrdenImg.update({
          where: { id: detalle.id },
          data: { estado: data.estado === 'VALIDADO' ? 'VALIDADA' : 'COMPLETADA' },
        });
      } else {
        detalle = await tx.detalleOrdenImg.create({
          data: {
            ordenId,
            tipoEstudioId: tipoEstudio.id,
            regionAnatomica: data.regionAnatomica,
            observaciones: data.observaciones,
            estado: data.estado === 'VALIDADO' ? 'VALIDADA' : 'COMPLETADA',
          },
        });
      }
      const resultado = await tx.resultadoImg.upsert({
        where: { detalleOrdenId: detalle.id },
        update: {
          estado: data.estado ?? 'VALIDADO',
          informe: data.informe,
          conclusion: data.conclusion,
          validadoPor: data.estado === 'VALIDADO' ? data.registradoPor : undefined,
          validadoEn: data.estado === 'VALIDADO' ? new Date() : undefined,
        },
        create: {
          detalleOrdenId: detalle.id,
          estado: data.estado ?? 'VALIDADO',
          informe: data.informe,
          conclusion: data.conclusion,
          registradoPor: data.registradoPor,
          validadoPor: data.estado === 'VALIDADO' ? data.registradoPor : undefined,
          validadoEn: data.estado === 'VALIDADO' ? new Date() : undefined,
        },
      });
      await tx.ordenImagenologia.update({
        where: { id: ordenId },
        data: { estado: data.estado === 'VALIDADO' ? 'VALIDADA' : 'COMPLETADA' },
      });
      return tx.resultadoImg.findUnique({
        where: { id: resultado.id },
        include: { detalleOrden: { include: { tipoEstudio: true, orden: true } } },
      });
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
