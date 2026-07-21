import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MuestraService } from './muestra.service';
import { CreateMuestraDto } from './dto/create-muestra.dto';
import { UpdateMuestraDto } from './dto/update-muestra.dto';

@Controller('muestra')
export class MuestraController {
  constructor(private readonly muestraService: MuestraService) {}

  @Post()
  create(@Body() createMuestraDto: CreateMuestraDto) {
    return this.muestraService.create(createMuestraDto);
  }

  @Get()
  findAll() {
    return this.muestraService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.muestraService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMuestraDto: UpdateMuestraDto) {
    return this.muestraService.update(+id, updateMuestraDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.muestraService.remove(+id);
  }
}
