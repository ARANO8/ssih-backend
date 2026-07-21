import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly safeSelect = {
    id: true,
    personaId: true,
    nombreUsuario: true,
    estado: true,
    intentosFallidos: true,
    bloqueadoHasta: true,
    ultimoAccesoEn: true,
    cambiarContrasena: true,
    creadoEn: true,
    modificadoEn: true,
    persona: true,
    usuarioRoles: { include: { rol: true } },
  };

  private parseId(id: string): any {
    if (!id) return id;
    if (/[a-zA-Z\-]/.test(id)) return id;
    return isNaN(Number(id)) ? id : Number(id);
  }

  create(createUsuarioDto: CreateUsuarioDto) {
    return (this.prisma as any).usuario.create({
      data: createUsuarioDto as any,
    });
  }

  findAll() {
    return (this.prisma as any).usuario.findMany({ select: this.safeSelect });
  }

  findOne(id: string) {
    return (this.prisma as any).usuario.findUnique({
      where: { id: this.parseId(id) },
      select: this.safeSelect,
    });
  }

  update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    return (this.prisma as any).usuario.update({
      where: { id: this.parseId(id) },
      data: updateUsuarioDto as any,
      select: this.safeSelect,
    });
  }

  remove(id: string) {
    return (this.prisma as any).usuario.delete({
      where: { id: this.parseId(id) },
    });
  }
}
