import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';

@Injectable()
export class RolService {
  constructor(private readonly prisma: PrismaService) {}

  private parseId(id: string): any {
    if (!id) return id;
    if (/[a-zA-Z\-]/.test(id)) return id;
    return isNaN(Number(id)) ? id : Number(id);
  }

  create(createRolDto: CreateRolDto) {
    return (this.prisma as any).rol.create({
      data: createRolDto as any,
    });
  }

  findAll() {
    return (this.prisma as any).rol.findMany();
  }

  findOne(id: string) {
    return (this.prisma as any).rol.findUnique({
      where: { id: this.parseId(id) },
    });
  }

  update(id: string, updateRolDto: UpdateRolDto) {
    return (this.prisma as any).rol.update({
      where: { id: this.parseId(id) },
      data: updateRolDto as any,
    });
  }

  remove(id: string) {
    return (this.prisma as any).rol.delete({
      where: { id: this.parseId(id) },
    });
  }
}
