import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrdenImagenologiaService } from './orden-imagenologia.service';
import { CreateOrdenImagenologiaDto } from './dto/create-orden-imagenologia.dto';
import { UpdateOrdenImagenologiaDto } from './dto/update-orden-imagenologia.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('OrdenImagenologia')
@Controller('orden-imagenologia')
export class OrdenImagenologiaController {
  constructor(
    private readonly ordenImagenologiaService: OrdenImagenologiaService,
  ) {}

  @Post()
  create(@Body() createOrdenImagenologiaDto: CreateOrdenImagenologiaDto) {
    return this.ordenImagenologiaService.create(createOrdenImagenologiaDto);
  }

  @Get()
  findAll() {
    return this.ordenImagenologiaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordenImagenologiaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrdenImagenologiaDto: UpdateOrdenImagenologiaDto,
  ) {
    return this.ordenImagenologiaService.update(id, updateOrdenImagenologiaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordenImagenologiaService.remove(id);
  }
}
