import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin', description: 'Nombre de usuario' })
  @IsString()
  @IsNotEmpty()
  nombreUsuario: string;

  @ApiProperty({ example: 'admin123', description: 'Contraseña del usuario' })
  @IsString()
  @IsNotEmpty()
  contrasena: string;
}
