import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateEpisodioAtencionDto } from './dto/create-episodio-atencion.dto';
import { UpdateEpisodioAtencionDto } from './dto/update-episodio-atencion.dto';

@Injectable()
export class EpisodioAtencionService {
  constructor(private readonly prisma: PrismaService) {}

  private parseId(id: string): any {
    if (!id) return id;
    if (/[a-zA-Z\-]/.test(id)) return id;
    return isNaN(Number(id)) ? id : Number(id);
  }

  create(createEpisodioAtencionDto: CreateEpisodioAtencionDto) {
    return (this.prisma as any).episodioAtencion.create({
      data: createEpisodioAtencionDto as any,
    });
  }

  findAll() {
    return (this.prisma as any).episodioAtencion.findMany();
  }

  findOne(id: string) {
    return (this.prisma as any).episodioAtencion.findUnique({
      where: { id: this.parseId(id) },
    });
  }

  update(id: string, updateEpisodioAtencionDto: UpdateEpisodioAtencionDto) {
    return (this.prisma as any).episodioAtencion.update({
      where: { id: this.parseId(id) },
      data: updateEpisodioAtencionDto as any,
    });
  }

  remove(id: string) {
    return (this.prisma as any).episodioAtencion.delete({
      where: { id: this.parseId(id) },
    });
  }
}
