import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(nombreUsuario: string, contrasena: string): Promise<any> {
    const usuario = await (this.prisma as any).usuario.findUnique({
      where: { nombreUsuario },
      include: { usuarioRoles: { include: { rol: true } } },
    });

    if (usuario && (await bcrypt.compare(contrasena, usuario.contrasenaHash))) {
      const { contrasenaHash, ...result } = usuario;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      nombreUsuario: user.nombreUsuario,
      personaId: user.personaId,
      roles: user.usuarioRoles?.map((ur: any) => ur.rol.codigo) || [],
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const {
      numeroDocumento,
      nombres,
      apellidos,
      correo,
      nombreUsuario,
      contrasena,
    } = registerDto;

    // Check if user or person already exists
    const existingUser = await (this.prisma as any).usuario.findUnique({
      where: { nombreUsuario },
    });
    if (existingUser) {
      throw new ConflictException('El nombre de usuario ya está en uso');
    }

    const salt = await bcrypt.genSalt(10);
    const contrasenaHash = await bcrypt.hash(contrasena, salt);

    // Create Persona and Usuario in a transaction
    const newUser = await (this.prisma as any).$transaction(async (tx: any) => {
      const persona = await tx.persona.create({
        data: {
          numeroDocumento,
          nombres,
          apellidos,
          correo,
        },
      });

      const usuario = await tx.usuario.create({
        data: {
          nombreUsuario,
          contrasenaHash,
          personaId: persona.id,
          estado: 'ACTIVO',
        },
      });

      return usuario;
    });

    return {
      message: 'Usuario registrado exitosamente',
      usuarioId: newUser.id,
    };
  }
}
