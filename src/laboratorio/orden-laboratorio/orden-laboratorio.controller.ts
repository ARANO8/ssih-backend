import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrdenLaboratorioService } from './orden-laboratorio.service';
import { CreateOrdenLaboratorioDto } from './dto/create-orden-laboratorio.dto';
import { UpdateOrdenLaboratorioDto } from './dto/update-orden-laboratorio.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('OrdenLaboratorio')
@Controller('orden-laboratorio')
export class OrdenLaboratorioController {
  constructor(
    private readonly ordenLaboratorioService: OrdenLaboratorioService,
  ) {}

  @Post()
  create(@Body() createOrdenLaboratorioDto: CreateOrdenLaboratorioDto) {
    return this.ordenLaboratorioService.create(createOrdenLaboratorioDto);
  }

  @Get()
  findAll() {
    return this.ordenLaboratorioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordenLaboratorioService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrdenLaboratorioDto: UpdateOrdenLaboratorioDto,
  ) {
    return this.ordenLaboratorioService.update(id, updateOrdenLaboratorioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordenLaboratorioService.remove(id);
  }
}
