import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateOrdenLaboratorioDto } from './dto/create-orden-laboratorio.dto';
import { UpdateOrdenLaboratorioDto } from './dto/update-orden-laboratorio.dto';

@Injectable()
export class OrdenLaboratorioService {
  constructor(private readonly prisma: PrismaService) {}

  private parseId(id: string): any {
    if (!id) return id;
    if (/[a-zA-Z\-]/.test(id)) return id;
    return isNaN(Number(id)) ? id : Number(id);
  }

  create(createOrdenLaboratorioDto: CreateOrdenLaboratorioDto) {
    return (this.prisma as any).ordenLaboratorio.create({
      data: createOrdenLaboratorioDto as any,
    });
  }

  findAll() {
    return (this.prisma as any).ordenLaboratorio.findMany({
      include: {
        consulta: true,
        medico: true,
        detalles: {
          include: { tipoExamen: true, muestra: true, resultado: true },
        },
      },
      orderBy: { solicitadoEn: 'desc' },
    });
  }

  findOne(id: string) {
    return (this.prisma as any).ordenLaboratorio.findUnique({
      where: { id: this.parseId(id) },
      include: {
        consulta: true,
        medico: true,
        detalles: {
          include: { tipoExamen: true, muestra: true, resultado: true },
        },
      },
    });
  }

  async registrarResultado(ordenId: string, data: Record<string, any>) {
    if (
      !data.tipoExamenCodigo ||
      !data.tipoExamenNombre ||
      !data.registradoPor
    ) {
      throw new BadRequestException(
        'tipoExamenCodigo, tipoExamenNombre y registradoPor son obligatorios',
      );
    }

    return (this.prisma as any).$transaction(async (tx: any) => {
      const tipoExamen = await tx.tipoExamen.upsert({
        where: { codigo: data.tipoExamenCodigo },
        update: {
          nombre: data.tipoExamenNombre,
          tipoMuestra: data.tipoMuestra,
          unidadPredeterminada: data.unidad,
          rangoReferenciaPredeterminado: data.rangoReferencia,
        },
        create: {
          codigo: data.tipoExamenCodigo,
          nombre: data.tipoExamenNombre,
          tipoMuestra: data.tipoMuestra,
          unidadPredeterminada: data.unidad,
          rangoReferenciaPredeterminado: data.rangoReferencia,
        },
      });
      const detalle = await tx.detalleOrdenLab.upsert({
        where: {
          ordenId_tipoExamenId: { ordenId, tipoExamenId: tipoExamen.id },
        },
        update: {
          estado: data.estado === 'VALIDADO' ? 'VALIDADA' : 'COMPLETADA',
        },
        create: {
          ordenId,
          tipoExamenId: tipoExamen.id,
          estado: data.estado === 'VALIDADO' ? 'VALIDADA' : 'COMPLETADA',
          indicaciones: data.indicaciones,
        },
      });
      const resultado = await tx.resultadoLab.upsert({
        where: { detalleOrdenId: detalle.id },
        update: {
          estado: data.estado ?? 'VALIDADO',
          resultadoTexto: data.resultadoTexto,
          valorNumerico: data.valorNumerico,
          unidad: data.unidad,
          rangoReferencia: data.rangoReferencia,
          esAnormal: data.esAnormal,
          observaciones: data.observaciones,
          validadoPor:
            data.estado === 'VALIDADO' ? data.registradoPor : undefined,
          validadoEn: data.estado === 'VALIDADO' ? new Date() : undefined,
        },
        create: {
          detalleOrdenId: detalle.id,
          estado: data.estado ?? 'VALIDADO',
          resultadoTexto: data.resultadoTexto,
          valorNumerico: data.valorNumerico,
          unidad: data.unidad,
          rangoReferencia: data.rangoReferencia,
          esAnormal: data.esAnormal,
          observaciones: data.observaciones,
          registradoPor: data.registradoPor,
          validadoPor:
            data.estado === 'VALIDADO' ? data.registradoPor : undefined,
          validadoEn: data.estado === 'VALIDADO' ? new Date() : undefined,
        },
      });
      await tx.ordenLaboratorio.update({
        where: { id: ordenId },
        data: {
          estado: data.estado === 'VALIDADO' ? 'VALIDADA' : 'COMPLETADA',
        },
      });
      return tx.resultadoLab.findUnique({
        where: { id: resultado.id },
        include: {
          detalleOrden: { include: { tipoExamen: true, orden: true } },
        },
      });
    });
  }

  update(id: string, updateOrdenLaboratorioDto: UpdateOrdenLaboratorioDto) {
    return (this.prisma as any).ordenLaboratorio.update({
      where: { id: this.parseId(id) },
      data: updateOrdenLaboratorioDto as any,
    });
  }

  remove(id: string) {
    return (this.prisma as any).ordenLaboratorio.delete({
      where: { id: this.parseId(id) },
    });
  }
}
