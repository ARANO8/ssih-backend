import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'nombreUsuario', passwordField: 'contrasena' });
  }

  async validate(nombreUsuario: string, contrasena: string): Promise<any> {
    const user = await this.authService.validateUser(nombreUsuario, contrasena);
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    return user;
  }
}
