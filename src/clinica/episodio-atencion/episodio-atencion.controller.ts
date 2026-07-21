import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EpisodioAtencionService } from './episodio-atencion.service';
import { CreateEpisodioAtencionDto } from './dto/create-episodio-atencion.dto';
import { UpdateEpisodioAtencionDto } from './dto/update-episodio-atencion.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('EpisodioAtencion')
@Controller('episodio-atencion')
export class EpisodioAtencionController {
  constructor(
    private readonly episodioAtencionService: EpisodioAtencionService,
  ) {}

  @Post()
  create(@Body() createEpisodioAtencionDto: CreateEpisodioAtencionDto) {
    return this.episodioAtencionService.create(createEpisodioAtencionDto);
  }

  @Get()
  findAll() {
    return this.episodioAtencionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.episodioAtencionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEpisodioAtencionDto: UpdateEpisodioAtencionDto,
  ) {
    return this.episodioAtencionService.update(id, updateEpisodioAtencionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.episodioAtencionService.remove(id);
  }
}
