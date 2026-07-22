import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class AlertaService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return (this.prisma as any).$queryRawUnsafe(
      `SELECT id, titulo, mensaje, severidad, estado, origen, creado_en AS "creadoEn", resuelto_en AS "resueltoEn" FROM seguridad.alerta ORDER BY creado_en DESC`,
    );
  }

  async create(data: Record<string, unknown>) {
    const rows = await (this.prisma as any).$queryRawUnsafe(
      `INSERT INTO seguridad.alerta (titulo,mensaje,severidad,estado,origen) VALUES ($1,$2,$3,$4,$5) RETURNING id,titulo,mensaje,severidad,estado,origen,creado_en AS "creadoEn",resuelto_en AS "resueltoEn"`,
      data.titulo,
      data.mensaje,
      data.severidad ?? 'INFO',
      data.estado ?? 'ACTIVA',
      data.origen ?? 'SISTEMA',
    );
    return rows[0];
  }

  async update(id: string, data: Record<string, unknown>) {
    const rows = await (this.prisma as any).$queryRawUnsafe(
      `UPDATE seguridad.alerta SET titulo=COALESCE($2,titulo),mensaje=COALESCE($3,mensaje),severidad=COALESCE($4,severidad),estado=COALESCE($5,estado),origen=COALESCE($6,origen),resuelto_en=CASE WHEN $5='RESUELTA' THEN NOW() ELSE resuelto_en END WHERE id=$1::uuid RETURNING id,titulo,mensaje,severidad,estado,origen,creado_en AS "creadoEn",resuelto_en AS "resueltoEn"`,
      id,
      data.titulo ?? null,
      data.mensaje ?? null,
      data.severidad ?? null,
      data.estado ?? null,
      data.origen ?? null,
    );
    return rows[0];
  }

  async remove(id: string) {
    await (this.prisma as any).$executeRawUnsafe(
      `DELETE FROM seguridad.alerta WHERE id=$1::uuid`,
      id,
    );
    return { deleted: true };
  }
}
