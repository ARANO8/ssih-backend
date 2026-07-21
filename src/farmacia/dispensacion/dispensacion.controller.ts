import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DispensacionService } from './dispensacion.service';
import { CreateDispensacionDto } from './dto/create-dispensacion.dto';
import { UpdateDispensacionDto } from './dto/update-dispensacion.dto';

@Controller('dispensacion')
export class DispensacionController {
  constructor(private readonly dispensacionService: DispensacionService) {}

  @Post()
  create(@Body() createDispensacionDto: CreateDispensacionDto) {
    return this.dispensacionService.create(createDispensacionDto);
  }

  @Get()
  findAll() {
    return this.dispensacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dispensacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDispensacionDto: UpdateDispensacionDto) {
    return this.dispensacionService.update(+id, updateDispensacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dispensacionService.remove(+id);
  }
}
