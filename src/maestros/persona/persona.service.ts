import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';

@Injectable()
export class PersonaService {
  constructor(private readonly prisma: PrismaService) {}

  private parseId(id: string): any {
    if (!id) return id;
    if (/[a-zA-Z\-]/.test(id)) return id;
    return isNaN(Number(id)) ? id : Number(id);
  }

  create(createPersonaDto: CreatePersonaDto) {
    return (this.prisma as any).persona.create({
      data: createPersonaDto as any,
    });
  }

  findAll() {
    return (this.prisma as any).persona.findMany();
  }

  findOne(id: string) {
    return (this.prisma as any).persona.findUnique({
      where: { id: this.parseId(id) },
    });
  }

  update(id: string, updatePersonaDto: UpdatePersonaDto) {
    return (this.prisma as any).persona.update({
      where: { id: this.parseId(id) },
      data: updatePersonaDto as any,
    });
  }

  remove(id: string) {
    return (this.prisma as any).persona.delete({
      where: { id: this.parseId(id) },
    });
  }
}
