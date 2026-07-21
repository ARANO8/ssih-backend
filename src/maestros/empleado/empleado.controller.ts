import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { Prisma } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Maestros - Empleados')
@Controller('empleado')
export class EmpleadoController {
  constructor(private readonly empleadoService: EmpleadoService) {}

  @Post()
  create(@Body() createEmpleadoDto: Prisma.empleadoUncheckedCreateInput) {
    return this.empleadoService.create(createEmpleadoDto);
  }

  @Get()
  findAll() {
    return this.empleadoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.empleadoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmpleadoDto: Prisma.empleadoUpdateInput) {
    return this.empleadoService.update(id, updateEmpleadoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.empleadoService.remove(id);
  }
}