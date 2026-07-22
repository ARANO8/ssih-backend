import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AlertaService } from './alerta.service';

@ApiTags('Alertas')
@Controller('alerta')
export class AlertaController {
  constructor(private readonly service: AlertaService) {}
  @Get() findAll() { return this.service.findAll(); }
  @Post() create(@Body() data: Record<string, unknown>) { return this.service.create(data); }
  @Patch(':id') update(@Param('id') id: string, @Body() data: Record<string, unknown>) { return this.service.update(id, data); }
  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(id); }
}
