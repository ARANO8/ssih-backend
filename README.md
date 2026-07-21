<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://img.shields.io/badge/Backers-Open%20Collective-ff3f59.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://img.shields.io/badge/Sponsors-Open%20Collective-41B883.svg" alt="Sponsors on Open Collective" /></a>
</p>

## Description

Backend API del proyecto SSIH construido con [NestJS](https://github.com/nestjs/nest), [Prisma](https://www.prisma.io/) y [PostgreSQL](https://www.postgresql.org/).

## Requisitos previos

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) (para PostgreSQL)

## Levantar el proyecto

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Configurar variables de entorno

```bash
cp .env.sample .env
```

Modifica `.env` si es necesario (puerto, credenciales, etc.).

### 3. Iniciar base de datos

```bash
docker compose up -d
```

Esto levanta PostgreSQL en el puerto `5432` con:
- Usuario: `admin`
- Contraseña: `root`
- Base de datos: `siih_hospital`

### 4. Ejecutar migraciones de Prisma

```bash
npx prisma migrate dev
```

### 5. Configurar SQL raw (funciones, triggers, vistas, datos)

La base de datos tiene componentes SQL que Prisma no maneja (funciones, triggers, vistas, restricciones de exclusión). Ejecutar como superusuario:

```bash
psql -U postgres -d siih_hospital -f prisma/sql/setup.sql
```

> **Nota**: El usuario de Docker (`admin`) no tiene permisos de superusuario. Conectarse como `postgres` (superusuario del contenedor) o pedir al administrador que ejecute los scripts SQL.

### 6. Iniciar servidor de desarrollo

```bash
pnpm run start:dev
```

El servidor estará disponible en `http://localhost:3000`.

## Swagger (Documentación API)

Una vez iniciado el servidor, la documentación Swagger está disponible en:

```
http://localhost:3000/api
```

Desde ahí puedes explorar y probar todos los endpoints de la API.

## Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `pnpm run start:dev` | Servidor en modo desarrollo (watch) |
| `pnpm run build` | Compilar a `dist/` |
| `pnpm run start:prod` | Ejecutar versión compilada |
| `pnpm run lint` | Lint con `--fix` automático |
| `pnpm run test` | Tests unitarios |
| `pnpm run test:e2e` | Tests end-to-end |
| `pnpm run format` | Formatear con Prettier |
| `npx prisma migrate dev` | Crear migración tras cambios en schema |
| `npx prisma generate` | Regenerar Prisma Client |
| `npx prisma studio` | Abrir Prisma Studio (UI de BD) |
| `psql -U postgres -d siih_hospital -f prisma/sql/setup.sql` | Configurar SQL raw completo |

## Estructura del proyecto

```
src/
├── main.ts              # Entry point de la aplicación
├── app.module.ts        # Módulo raíz
└── prisma/              # (si se crea) Módulo de Prisma
prisma/
├── schema.prisma        # Schema de la base de datos (52 tablas, 20+ enums)
└── sql/                 # SQL raw (funciones, triggers, vistas, datos)
    ├── 01_extensions.sql
    ├── 02_roles.sql
    ├── 03_functions.sql
    ├── 04_triggers.sql
    ├── 05_views.sql
    ├── 06_exclusion_constraints.sql
    ├── 07_seed_data.sql
    └── setup.sql        # Orquestador (ejecuta todo en orden)
prisma.config.ts         # Configuración de Prisma (DATABASE_URL)
docker-compose.yml       # Contenedor PostgreSQL
```

## Tecnologías

- **Framework**: NestJS 11
- **ORM**: Prisma 7
- **Base de datos**: PostgreSQL 16
- **Documentación**: Swagger / OpenAPI
- **Package manager**: pnpm

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
