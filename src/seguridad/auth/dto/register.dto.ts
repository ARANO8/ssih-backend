import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: '12345678',
    description: 'Número de documento de la persona',
  })
  @IsString()
  @IsNotEmpty()
  numeroDocumento: string;

  @ApiProperty({ example: 'Juan', description: 'Nombres de la persona' })
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellidos de la persona' })
  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @ApiPropertyOptional({
    example: 'juan.perez@email.com',
    description: 'Correo de la persona',
  })
  @IsString()
  @IsOptional()
  correo?: string;

  @ApiProperty({ example: 'juanp', description: 'Nombre de usuario' })
  @IsString()
  @IsNotEmpty()
  nombreUsuario: string;

  @ApiProperty({ example: 'juanp123', description: 'Contraseña del usuario' })
  @IsString()
  @IsNotEmpty()
  contrasena: string;
}
