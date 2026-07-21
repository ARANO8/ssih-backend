import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { Prisma } from '@prisma/client';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Maestros - Pacientes')
@Controller('paciente')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo paciente (requiere persona_id)' })
  create(@Body() createPacienteDto: Prisma.pacienteUncheckedCreateInput) {
    return this.pacienteService.create(createPacienteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los pacientes activos' })
  findAll() {
    return this.pacienteService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un paciente por su ID' })
  findOne(@Param('id') id: string) {
    return this.pacienteService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar expediente del paciente' })
  update(@Param('id') id: string, @Body() updatePacienteDto: Prisma.pacienteUpdateInput) {
    return this.pacienteService.update(id, updatePacienteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Dar de baja a un paciente' })
  remove(@Param('id') id: string) {
    return this.pacienteService.remove(id);
  }
}