import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EspecialidadService } from './especialidad.service';
import { Prisma } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Maestros - Especialidades')
@Controller('especialidad')
export class EspecialidadController {
  constructor(private readonly especialidadService: EspecialidadService) {}

  @Post()
  create(@Body() createEspecialidadDto: Prisma.especialidadCreateInput) {
    return this.especialidadService.create(createEspecialidadDto);
  }

  @Get()
  findAll() {
    return this.especialidadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.especialidadService.findOne(+id); // Convertimos a número con el +
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEspecialidadDto: Prisma.especialidadUpdateInput) {
    return this.especialidadService.update(+id, updateEspecialidadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.especialidadService.remove(+id);
  }
}