import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'nestjs-prisma';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createHash, randomUUID } from 'crypto';
import { SubirArchivoDto } from './dto/subir-archivo.dto';

@Injectable()
export class AlmacenamientoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private get s3Client() {
    return new S3Client({
      region: this.configService.get<string>('S3_REGION') ?? 'us-east-1',
      endpoint: this.configService.get<string>('S3_ENDPOINT') || undefined,
      credentials: {
        accessKeyId: this.configService.get<string>('S3_ACCESS_KEY_ID') ?? '',
        secretAccessKey:
          this.configService.get<string>('S3_SECRET_ACCESS_KEY') ?? '',
      },
      forcePathStyle:
        this.configService.get<string>('S3_FORCE_PATH_STYLE') === 'true',
    });
  }

  private get bucketName() {
    const bucketName = this.configService.get<string>('S3_BUCKET_NAME');
    if (!bucketName) {
      throw new BadRequestException('S3_BUCKET_NAME no está configurado');
    }

    return bucketName;
  }

  private sanitizeFileName(fileName: string) {
    return fileName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9._-]/g, '_');
  }

  private buildObjectKey(pacienteId: string, originalName: string) {
    const safeName = this.sanitizeFileName(originalName);
    return `pacientes/${pacienteId}/${Date.now()}-${randomUUID()}-${safeName}`;
  }

  async subirArchivo(dto: SubirArchivoDto, archivo: any) {
    if (!archivo) {
      throw new BadRequestException('Debes enviar un archivo');
    }

    const contenedor = dto.contenedor ?? this.bucketName;
    const claveObjeto = this.buildObjectKey(
      dto.pacienteId,
      archivo.originalname,
    );
    const sha256 = createHash('sha256').update(archivo.buffer).digest('hex');

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: contenedor,
        Key: claveObjeto,
        Body: archivo.buffer,
        ContentType: archivo.mimetype,
      }),
    );

    return (this.prisma as any).archivoClinico.create({
      data: {
        pacienteId: dto.pacienteId,
        subidoPor: dto.subidoPor,
        proveedorAlmacenamiento: 'MINIO',
        contenedor,
        claveObjeto,
        nombreOriginal: archivo.originalname,
        tipoMime: archivo.mimetype,
        tamanoBytes: BigInt(archivo.size),
        hashSha256: sha256,
        categoria: dto.categoria,
      },
    });
  }

  async obtenerUrlDescarga(archivoId: string) {
    const archivo = await (this.prisma as any).archivoClinico.findUnique({
      where: { id: archivoId },
    });

    if (!archivo) {
      throw new NotFoundException('Archivo no encontrado');
    }

    return getSignedUrl(
      this.s3Client,
      new GetObjectCommand({
        Bucket: archivo.contenedor,
        Key: archivo.claveObjeto,
      }),
      { expiresIn: 60 * 15 },
    );
  }
}
