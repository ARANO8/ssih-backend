import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AlmacenamientoService } from './almacenamiento.service';
import { SubirArchivoDto } from './dto/subir-archivo.dto';

@ApiTags('almacenamiento')
@Controller('almacenamiento')
export class AlmacenamientoController {
  constructor(private readonly almacenamientoService: AlmacenamientoService) {}

  @Post('archivos')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        archivo: { type: 'string', format: 'binary' },
        pacienteId: { type: 'string' },
        subidoPor: { type: 'string' },
        categoria: { type: 'string' },
        contenedor: { type: 'string' },
      },
      required: ['archivo', 'pacienteId', 'subidoPor', 'categoria'],
    },
  })
  @UseInterceptors(FileInterceptor('archivo'))
  subirArchivo(@Body() dto: SubirArchivoDto, @UploadedFile() archivo: any) {
    return this.almacenamientoService.subirArchivo(dto, archivo);
  }

  @Get('archivos/:id/url')
  obtenerUrlDescarga(@Param('id') id: string) {
    return this.almacenamientoService.obtenerUrlDescarga(id);
  }
}
