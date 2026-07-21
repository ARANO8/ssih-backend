import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class SubirArchivoDto {
  @IsUUID()
  pacienteId: string;

  @IsString()
  @MaxLength(120)
  subidoPor: string;

  @IsString()
  @MaxLength(40)
  categoria: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  contenedor?: string;
}
