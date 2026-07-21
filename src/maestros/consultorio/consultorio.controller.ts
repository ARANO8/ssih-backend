import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConsultorioService } from './consultorio.service';
import { Prisma } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Maestros - Consultorios')
@Controller('consultorio')
export class ConsultorioController {
  constructor(private readonly consultorioService: ConsultorioService) {}

  @Post()
  create(@Body() createConsultorioDto: Prisma.consultorioCreateInput) {
    return this.consultorioService.create(createConsultorioDto);
  }

  @Get()
  findAll() {
    return this.consultorioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consultorioService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConsultorioDto: Prisma.consultorioUpdateInput) {
    return this.consultorioService.update(id, updateConsultorioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consultorioService.remove(id);
  }
}