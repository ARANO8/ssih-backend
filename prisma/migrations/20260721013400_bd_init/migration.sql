-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auditoria";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "clinica";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "facturacion";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "farmacia";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "imagenologia";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "laboratorio";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "maestros";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "seguridad";

-- CreateEnum
CREATE TYPE "seguridad"."EstadoUsuario" AS ENUM ('PENDIENTE', 'ACTIVO', 'BLOQUEADO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "maestros"."Sexo" AS ENUM ('FEMENINO', 'MASCULINO', 'OTRO', 'NO_ESPECIFICA');

-- CreateEnum
CREATE TYPE "maestros"."TipoDocumento" AS ENUM ('CI', 'PASAPORTE', 'OTRO');

-- CreateEnum
CREATE TYPE "maestros"."Prioridad" AS ENUM ('NORMAL', 'URGENTE', 'EMERGENCIA');

-- CreateEnum
CREATE TYPE "maestros"."EstadoOrden" AS ENUM ('PENDIENTE', 'EN_PROCESO', 'COMPLETADA', 'VALIDADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "clinica"."TipoEpisodio" AS ENUM ('CONSULTA_EXTERNA', 'EMERGENCIA', 'HOSPITALIZACION');

-- CreateEnum
CREATE TYPE "clinica"."EstadoEpisodio" AS ENUM ('ABIERTO', 'EN_CURSO', 'FINALIZADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "clinica"."EstadoCita" AS ENUM ('PROGRAMADA', 'CONFIRMADA', 'EN_ATENCION', 'ATENDIDA', 'CANCELADA', 'NO_ASISTIO');

-- CreateEnum
CREATE TYPE "clinica"."EstadoConsulta" AS ENUM ('ABIERTA', 'CERRADA', 'ANULADA');

-- CreateEnum
CREATE TYPE "clinica"."TipoAntecedente" AS ENUM ('ALERGIA', 'ENFERMEDAD_CRONICA', 'CIRUGIA', 'FAMILIAR', 'HABITO', 'OTRO');

-- CreateEnum
CREATE TYPE "clinica"."TipoDiagnostico" AS ENUM ('PRINCIPAL', 'SECUNDARIO');

-- CreateEnum
CREATE TYPE "clinica"."TipoNota" AS ENUM ('MEDICA', 'ENFERMERIA', 'ADMINISTRATIVA');

-- CreateEnum
CREATE TYPE "laboratorio"."EstadoMuestra" AS ENUM ('PENDIENTE', 'RECOLECTADA', 'RECIBIDA', 'RECHAZADA', 'PROCESADA');

-- CreateEnum
CREATE TYPE "laboratorio"."EstadoResultadoLab" AS ENUM ('BORRADOR', 'VALIDADO', 'ANULADO');

-- CreateEnum
CREATE TYPE "imagenologia"."EstadoResultadoImg" AS ENUM ('BORRADOR', 'VALIDADO', 'ANULADO');

-- CreateEnum
CREATE TYPE "farmacia"."EstadoCompra" AS ENUM ('BORRADOR', 'RECIBIDA', 'ANULADA');

-- CreateEnum
CREATE TYPE "farmacia"."EstadoReceta" AS ENUM ('EMITIDA', 'PARCIAL', 'DISPENSADA', 'VENCIDA', 'ANULADA');

-- CreateEnum
CREATE TYPE "farmacia"."EstadoDispensacion" AS ENUM ('BORRADOR', 'ENTREGADA', 'ANULADA');

-- CreateEnum
CREATE TYPE "farmacia"."TipoMovimiento" AS ENUM ('ENTRADA_COMPRA', 'SALIDA_DISPENSACION', 'AJUSTE_ENTRADA', 'AJUSTE_SALIDA', 'DEVOLUCION');

-- CreateEnum
CREATE TYPE "facturacion"."CategoriaServicio" AS ENUM ('CONSULTA', 'LABORATORIO', 'IMAGENOLOGIA', 'FARMACIA', 'OTRO');

-- CreateEnum
CREATE TYPE "facturacion"."EstadoPrestacion" AS ENUM ('PENDIENTE', 'REALIZADA', 'ANULADA');

-- CreateEnum
CREATE TYPE "facturacion"."EstadoFactura" AS ENUM ('BORRADOR', 'EMITIDA', 'PARCIAL', 'PAGADA', 'ANULADA');

-- CreateEnum
CREATE TYPE "facturacion"."MetodoPago" AS ENUM ('EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'QR', 'OTRO');

-- CreateEnum
CREATE TYPE "facturacion"."OrigenPrestacion" AS ENUM ('CONSULTA', 'LABORATORIO', 'IMAGENOLOGIA', 'FARMACIA', 'OTRO');

-- CreateTable
CREATE TABLE "seguridad"."rol" (
    "id" SMALLSERIAL NOT NULL,
    "codigo" VARCHAR(40) NOT NULL,
    "nombre" VARCHAR(80) NOT NULL,
    "descripcion" TEXT,
    "esSistema" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seguridad"."permiso" (
    "id" SMALLSERIAL NOT NULL,
    "codigo" VARCHAR(100) NOT NULL,
    "modulo" VARCHAR(40) NOT NULL,
    "accion" VARCHAR(40) NOT NULL,
    "descripcion" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permiso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seguridad"."rol_permiso" (
    "rol_id" SMALLINT NOT NULL,
    "permiso_id" SMALLINT NOT NULL,
    "concedido_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rol_permiso_pkey" PRIMARY KEY ("rol_id","permiso_id")
);

-- CreateTable
CREATE TABLE "seguridad"."usuario" (
    "id" TEXT NOT NULL,
    "persona_id" TEXT NOT NULL,
    "nombre_usuario" CITEXT NOT NULL,
    "contrasena_hash" VARCHAR(255) NOT NULL,
    "estado" "seguridad"."EstadoUsuario" NOT NULL DEFAULT 'PENDIENTE',
    "intentos_fallidos" SMALLINT NOT NULL DEFAULT 0,
    "bloqueado_hasta" TIMESTAMP(3),
    "ultimo_acceso_en" TIMESTAMP(3),
    "cambiar_contrasena" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seguridad"."usuario_rol" (
    "usuario_id" TEXT NOT NULL,
    "rol_id" SMALLINT NOT NULL,
    "asignado_por" TEXT,
    "asignado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expira_en" TIMESTAMP(3),
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "usuario_rol_pkey" PRIMARY KEY ("usuario_id","rol_id")
);

-- CreateTable
CREATE TABLE "maestros"."persona" (
    "id" TEXT NOT NULL,
    "tipo_documento" "maestros"."TipoDocumento" NOT NULL DEFAULT 'CI',
    "numero_documento" CITEXT NOT NULL,
    "complemento" VARCHAR(10),
    "nombres" VARCHAR(100) NOT NULL,
    "apellidos" VARCHAR(120) NOT NULL,
    "fecha_nacimiento" DATE,
    "sexo" "maestros"."Sexo" NOT NULL DEFAULT 'NO_ESPECIFICA',
    "direccion" VARCHAR(250),
    "telefono" VARCHAR(30),
    "correo" CITEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "eliminado_en" TIMESTAMP(3),
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "persona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maestros"."paciente" (
    "id" TEXT NOT NULL,
    "persona_id" TEXT NOT NULL,
    "numero_historia" SERIAL NOT NULL,
    "fecha_registro" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grupo_sanguineo" VARCHAR(3),
    "factor_rh" CHAR(1),
    "contacto_emergencia_nombre" VARCHAR(150),
    "contacto_emergencia_telefono" VARCHAR(30),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maestros"."empleado" (
    "id" TEXT NOT NULL,
    "persona_id" TEXT NOT NULL,
    "codigo_empleado" VARCHAR(30) NOT NULL,
    "cargo" VARCHAR(100) NOT NULL,
    "fecha_ingreso" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "empleado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maestros"."especialidad" (
    "id" SMALLSERIAL NOT NULL,
    "codigo" VARCHAR(30) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "especialidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maestros"."medico" (
    "id" TEXT NOT NULL,
    "empleado_id" TEXT NOT NULL,
    "matricula_profesional" VARCHAR(40) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maestros"."medico_especialidad" (
    "medico_id" TEXT NOT NULL,
    "especialidad_id" SMALLINT NOT NULL,
    "es_principal" BOOLEAN NOT NULL DEFAULT false,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medico_especialidad_pkey" PRIMARY KEY ("medico_id","especialidad_id")
);

-- CreateTable
CREATE TABLE "maestros"."consultorio" (
    "id" TEXT NOT NULL,
    "codigo" VARCHAR(30) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "piso" VARCHAR(30),
    "ubicacion" VARCHAR(200),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consultorio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maestros"."horario_medico" (
    "id" TEXT NOT NULL,
    "medico_id" TEXT NOT NULL,
    "consultorio_id" TEXT,
    "dia_semana" SMALLINT NOT NULL,
    "hora_inicio" TIME NOT NULL,
    "hora_fin" TIME NOT NULL,
    "vigente_desde" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vigente_hasta" DATE,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "horario_medico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinica"."historia_clinica" (
    "id" TEXT NOT NULL,
    "paciente_id" TEXT NOT NULL,
    "fecha_apertura" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "antecedentes_resumen" TEXT,
    "observaciones" TEXT,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historia_clinica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinica"."antecedente_clinico" (
    "id" TEXT NOT NULL,
    "historia_clinica_id" TEXT NOT NULL,
    "tipo" "clinica"."TipoAntecedente" NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha_aproximada" DATE,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "registrado_por" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "antecedente_clinico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinica"."episodio_atencion" (
    "id" TEXT NOT NULL,
    "paciente_id" TEXT NOT NULL,
    "tipo" "clinica"."TipoEpisodio" NOT NULL,
    "estado" "clinica"."EstadoEpisodio" NOT NULL DEFAULT 'ABIERTO',
    "fecha_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(3),
    "motivo" TEXT NOT NULL,
    "prioridad" "maestros"."Prioridad" NOT NULL DEFAULT 'NORMAL',
    "creado_por" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "episodio_atencion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinica"."cita" (
    "id" TEXT NOT NULL,
    "paciente_id" TEXT NOT NULL,
    "medico_id" TEXT NOT NULL,
    "especialidad_id" SMALLINT NOT NULL,
    "consultorio_id" TEXT,
    "episodio_id" TEXT,
    "fecha_hora_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_hora_fin" TIMESTAMP(3) NOT NULL,
    "estado" "clinica"."EstadoCita" NOT NULL DEFAULT 'PROGRAMADA',
    "motivo" VARCHAR(500) NOT NULL,
    "observaciones" TEXT,
    "creada_por" TEXT,
    "cancelada_por" TEXT,
    "cancelada_en" TIMESTAMP(3),
    "motivo_cancelacion" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinica"."consulta" (
    "id" TEXT NOT NULL,
    "episodio_id" TEXT NOT NULL,
    "cita_id" TEXT,
    "historia_clinica_id" TEXT NOT NULL,
    "medico_id" TEXT NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(3),
    "estado" "clinica"."EstadoConsulta" NOT NULL DEFAULT 'ABIERTA',
    "motivo_consulta" TEXT NOT NULL,
    "exploracion_fisica" TEXT,
    "impresion_diagnostica" TEXT,
    "plan_tratamiento" TEXT,
    "observaciones" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consulta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinica"."signo_vital" (
    "id" TEXT NOT NULL,
    "consulta_id" TEXT NOT NULL,
    "registrado_por" TEXT NOT NULL,
    "registrado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "presion_sistolica" SMALLINT,
    "presion_diastolica" SMALLINT,
    "frecuencia_cardiaca" SMALLINT,
    "frecuencia_respiratoria" SMALLINT,
    "temperatura" DECIMAL(4,1),
    "saturacion_oxigeno" DECIMAL(5,2),
    "peso_kg" DECIMAL(6,2),
    "talla_cm" DECIMAL(6,2),
    "observaciones" TEXT,

    CONSTRAINT "signo_vital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinica"."catalogo_diagnostico" (
    "id" TEXT NOT NULL,
    "codigo" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(250) NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "catalogo_diagnostico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinica"."consulta_diagnostico" (
    "consulta_id" TEXT NOT NULL,
    "diagnostico_id" TEXT NOT NULL,
    "tipo" "clinica"."TipoDiagnostico" NOT NULL DEFAULT 'SECUNDARIO',
    "observaciones" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consulta_diagnostico_pkey" PRIMARY KEY ("consulta_id","diagnostico_id")
);

-- CreateTable
CREATE TABLE "clinica"."nota_evolucion" (
    "id" TEXT NOT NULL,
    "episodio_id" TEXT NOT NULL,
    "consulta_id" TEXT,
    "tipo" "clinica"."TipoNota" NOT NULL,
    "contenido" TEXT NOT NULL,
    "autor_usuario_id" TEXT NOT NULL,
    "registrado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nota_evolucion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinica"."archivo_clinico" (
    "id" TEXT NOT NULL,
    "paciente_id" TEXT NOT NULL,
    "subido_por" TEXT NOT NULL,
    "proveedor_almacenamiento" VARCHAR(20) NOT NULL DEFAULT 'MINIO',
    "contenedor" VARCHAR(100) NOT NULL,
    "clave_objeto" VARCHAR(500) NOT NULL,
    "nombre_original" VARCHAR(255) NOT NULL,
    "tipo_mime" VARCHAR(120) NOT NULL,
    "tamano_bytes" BIGINT NOT NULL,
    "hashSha256" VARCHAR(64),
    "categoria" VARCHAR(40) NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "archivo_clinico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinica"."consulta_archivo" (
    "consulta_id" TEXT NOT NULL,
    "archivo_id" TEXT NOT NULL,

    CONSTRAINT "consulta_archivo_pkey" PRIMARY KEY ("consulta_id","archivo_id")
);

-- CreateTable
CREATE TABLE "laboratorio"."tipo_examen" (
    "id" TEXT NOT NULL,
    "codigo" VARCHAR(30) NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "tipo_muestra" VARCHAR(80),
    "unidad_predeterminada" VARCHAR(30),
    "rango_referencia_predeterminado" VARCHAR(150),
    "precio_referencia" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tipo_examen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laboratorio"."orden_laboratorio" (
    "id" TEXT NOT NULL,
    "numero_orden" SERIAL NOT NULL,
    "consulta_id" TEXT NOT NULL,
    "solicitado_por_medico_id" TEXT NOT NULL,
    "prioridad" "maestros"."Prioridad" NOT NULL DEFAULT 'NORMAL',
    "estado" "maestros"."EstadoOrden" NOT NULL DEFAULT 'PENDIENTE',
    "indicaciones" TEXT,
    "solicitado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelado_en" TIMESTAMP(3),
    "cancelado_por" TEXT,
    "motivo_cancelacion" TEXT,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orden_laboratorio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laboratorio"."detalle_orden" (
    "id" TEXT NOT NULL,
    "orden_id" TEXT NOT NULL,
    "tipo_examen_id" TEXT NOT NULL,
    "estado" "maestros"."EstadoOrden" NOT NULL DEFAULT 'PENDIENTE',
    "indicaciones" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "detalle_orden_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laboratorio"."muestra" (
    "id" TEXT NOT NULL,
    "detalle_orden_id" TEXT NOT NULL,
    "codigo_muestra" VARCHAR(50) NOT NULL,
    "tipo_muestra" VARCHAR(80) NOT NULL,
    "estado" "laboratorio"."EstadoMuestra" NOT NULL DEFAULT 'PENDIENTE',
    "recolectada_en" TIMESTAMP(3),
    "recolectada_por" TEXT,
    "recibida_en" TIMESTAMP(3),
    "recibida_por" TEXT,
    "motivo_rechazo" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "muestra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laboratorio"."resultado" (
    "id" TEXT NOT NULL,
    "detalle_orden_id" TEXT NOT NULL,
    "estado" "laboratorio"."EstadoResultadoLab" NOT NULL DEFAULT 'BORRADOR',
    "resultado_texto" TEXT,
    "valor_numerico" DECIMAL(18,6),
    "unidad" VARCHAR(30),
    "rango_referencia" VARCHAR(150),
    "es_anormal" BOOLEAN,
    "registrado_por" TEXT NOT NULL,
    "registrado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validado_por" TEXT,
    "validado_en" TIMESTAMP(3),
    "observaciones" TEXT,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resultado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laboratorio"."resultado_archivo" (
    "resultado_id" TEXT NOT NULL,
    "archivo_id" TEXT NOT NULL,

    CONSTRAINT "resultado_archivo_pkey" PRIMARY KEY ("resultado_id","archivo_id")
);

-- CreateTable
CREATE TABLE "imagenologia"."tipo_estudio" (
    "id" TEXT NOT NULL,
    "codigo" VARCHAR(30) NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "descripcion" TEXT,
    "precio_referencia" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tipo_estudio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagenologia"."orden_imagenologia" (
    "id" TEXT NOT NULL,
    "numero_orden" SERIAL NOT NULL,
    "consulta_id" TEXT NOT NULL,
    "solicitado_por_medico_id" TEXT NOT NULL,
    "prioridad" "maestros"."Prioridad" NOT NULL DEFAULT 'NORMAL',
    "estado" "maestros"."EstadoOrden" NOT NULL DEFAULT 'PENDIENTE',
    "indicaciones" TEXT,
    "solicitado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orden_imagenologia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagenologia"."detalle_orden" (
    "id" TEXT NOT NULL,
    "orden_id" TEXT NOT NULL,
    "tipo_estudio_id" TEXT NOT NULL,
    "estado" "maestros"."EstadoOrden" NOT NULL DEFAULT 'PENDIENTE',
    "region_anatomica" VARCHAR(120),
    "observaciones" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "detalle_orden_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagenologia"."resultado" (
    "id" TEXT NOT NULL,
    "detalle_orden_id" TEXT NOT NULL,
    "estado" "imagenologia"."EstadoResultadoImg" NOT NULL DEFAULT 'BORRADOR',
    "informe" TEXT NOT NULL,
    "conclusion" TEXT,
    "registrado_por" TEXT NOT NULL,
    "registrado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validado_por" TEXT,
    "validado_en" TIMESTAMP(3),
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resultado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagenologia"."resultado_archivo" (
    "resultado_id" TEXT NOT NULL,
    "archivo_id" TEXT NOT NULL,

    CONSTRAINT "resultado_archivo_pkey" PRIMARY KEY ("resultado_id","archivo_id")
);

-- CreateTable
CREATE TABLE "farmacia"."medicamento" (
    "id" TEXT NOT NULL,
    "codigo" VARCHAR(40) NOT NULL,
    "nombre_generico" VARCHAR(150) NOT NULL,
    "nombre_comercial" VARCHAR(150),
    "forma_farmaceutica" VARCHAR(80) NOT NULL,
    "concentracion" VARCHAR(80),
    "unidad_medida" VARCHAR(30) NOT NULL,
    "requiere_receta" BOOLEAN NOT NULL DEFAULT true,
    "controlado" BOOLEAN NOT NULL DEFAULT false,
    "stock_minimo" DECIMAL(12,3) NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medicamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farmacia"."proveedor" (
    "id" TEXT NOT NULL,
    "nit" VARCHAR(30),
    "razon_social" VARCHAR(180) NOT NULL,
    "contacto_nombre" VARCHAR(150),
    "telefono" VARCHAR(30),
    "correo" CITEXT,
    "direccion" VARCHAR(250),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farmacia"."lote_medicamento" (
    "id" TEXT NOT NULL,
    "medicamento_id" TEXT NOT NULL,
    "proveedor_id" TEXT,
    "codigo_lote" VARCHAR(60) NOT NULL,
    "fecha_vencimiento" DATE NOT NULL,
    "costo_unitario" DECIMAL(12,4) NOT NULL DEFAULT 0,
    "stock_actual" DECIMAL(12,3) NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lote_medicamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farmacia"."compra" (
    "id" TEXT NOT NULL,
    "proveedor_id" TEXT NOT NULL,
    "numero_documento" VARCHAR(60) NOT NULL,
    "fecha_compra" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "farmacia"."EstadoCompra" NOT NULL DEFAULT 'BORRADOR',
    "subtotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "descuento" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "registrada_por" TEXT NOT NULL,
    "observaciones" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "compra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farmacia"."detalle_compra" (
    "id" TEXT NOT NULL,
    "compra_id" TEXT NOT NULL,
    "lote_id" TEXT NOT NULL,
    "cantidad" DECIMAL(12,3) NOT NULL,
    "costo_unitario" DECIMAL(12,4) NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "detalle_compra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farmacia"."receta" (
    "id" TEXT NOT NULL,
    "numero_receta" SERIAL NOT NULL,
    "consulta_id" TEXT NOT NULL,
    "medico_id" TEXT NOT NULL,
    "estado" "farmacia"."EstadoReceta" NOT NULL DEFAULT 'EMITIDA',
    "emitida_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valida_hasta" DATE NOT NULL,
    "observaciones" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "receta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farmacia"."detalle_receta" (
    "id" TEXT NOT NULL,
    "receta_id" TEXT NOT NULL,
    "medicamento_id" TEXT NOT NULL,
    "dosis" VARCHAR(100) NOT NULL,
    "via_administracion" VARCHAR(80) NOT NULL,
    "frecuencia" VARCHAR(100) NOT NULL,
    "duracion_dias" SMALLINT,
    "cantidad_prescrita" DECIMAL(12,3) NOT NULL,
    "indicaciones" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "detalle_receta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farmacia"."dispensacion" (
    "id" TEXT NOT NULL,
    "receta_id" TEXT NOT NULL,
    "estado" "farmacia"."EstadoDispensacion" NOT NULL DEFAULT 'BORRADOR',
    "dispensada_por" TEXT NOT NULL,
    "dispensada_en" TIMESTAMP(3),
    "observaciones" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dispensacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farmacia"."detalle_dispensacion" (
    "id" TEXT NOT NULL,
    "dispensacion_id" TEXT NOT NULL,
    "detalle_receta_id" TEXT NOT NULL,
    "lote_id" TEXT NOT NULL,
    "cantidad" DECIMAL(12,3) NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "detalle_dispensacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farmacia"."movimiento_inventario" (
    "id" TEXT NOT NULL,
    "tipo" "farmacia"."TipoMovimiento" NOT NULL,
    "fecha_movimiento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuario_id" TEXT NOT NULL,
    "compra_id" TEXT,
    "dispensacion_id" TEXT,
    "motivo" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimiento_inventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farmacia"."detalle_movimiento" (
    "id" TEXT NOT NULL,
    "movimiento_id" TEXT NOT NULL,
    "lote_id" TEXT NOT NULL,
    "cantidad" DECIMAL(12,3) NOT NULL,
    "costo_unitario" DECIMAL(12,4),
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "detalle_movimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facturacion"."servicio" (
    "id" TEXT NOT NULL,
    "codigo" VARCHAR(40) NOT NULL,
    "nombre" VARCHAR(180) NOT NULL,
    "categoria" "facturacion"."CategoriaServicio" NOT NULL,
    "precio_base" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facturacion"."prestacion_servicio" (
    "id" TEXT NOT NULL,
    "servicio_id" TEXT NOT NULL,
    "paciente_id" TEXT NOT NULL,
    "episodio_id" TEXT,
    "origen" "facturacion"."OrigenPrestacion" NOT NULL,
    "consulta_id" TEXT,
    "detalle_laboratorio_id" TEXT,
    "detalle_imagenologia_id" TEXT,
    "dispensacion_id" TEXT,
    "descripcion" VARCHAR(250) NOT NULL,
    "fecha_prestacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cantidad" DECIMAL(12,3) NOT NULL DEFAULT 1,
    "precio_unitario" DECIMAL(12,2) NOT NULL,
    "estado" "facturacion"."EstadoPrestacion" NOT NULL DEFAULT 'REALIZADA',
    "registrada_por" TEXT NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prestacion_servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facturacion"."factura" (
    "id" TEXT NOT NULL,
    "numero_factura" SERIAL NOT NULL,
    "paciente_id" TEXT NOT NULL,
    "estado" "facturacion"."EstadoFactura" NOT NULL DEFAULT 'BORRADOR',
    "fecha_emision" TIMESTAMP(3),
    "subtotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "descuento" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "emitida_por" TEXT NOT NULL,
    "observaciones" TEXT,
    "anulada_en" TIMESTAMP(3),
    "anulada_por" TEXT,
    "motivo_anulacion" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "factura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facturacion"."detalle_factura" (
    "id" TEXT NOT NULL,
    "factura_id" TEXT NOT NULL,
    "prestacion_id" TEXT NOT NULL,
    "descripcion" VARCHAR(250) NOT NULL,
    "cantidad" DECIMAL(12,3) NOT NULL,
    "precio_unitario" DECIMAL(12,2) NOT NULL,
    "descuento" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "detalle_factura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facturacion"."pago" (
    "id" TEXT NOT NULL,
    "factura_id" TEXT NOT NULL,
    "fecha_pago" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monto" DECIMAL(14,2) NOT NULL,
    "metodo" "facturacion"."MetodoPago" NOT NULL,
    "referencia" VARCHAR(120),
    "registrado_por" TEXT NOT NULL,
    "anulado" BOOLEAN NOT NULL DEFAULT false,
    "anulado_en" TIMESTAMP(3),
    "anulado_por" TEXT,
    "motivo_anulacion" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditoria"."evento" (
    "id" BIGSERIAL NOT NULL,
    "usuario_id" TEXT,
    "fecha_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "direccion_ip" INET,
    "esquema" VARCHAR(63) NOT NULL,
    "tabla" VARCHAR(63) NOT NULL,
    "operacion" CHAR(1) NOT NULL,
    "registro_id" TEXT,
    "datos_anteriores" JSONB,
    "datos_nuevos" JSONB,
    "identificador_transaccion" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "evento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rol_codigo_key" ON "seguridad"."rol"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "rol_nombre_key" ON "seguridad"."rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "permiso_codigo_key" ON "seguridad"."permiso"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "permiso_modulo_accion_key" ON "seguridad"."permiso"("modulo", "accion");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_persona_id_key" ON "seguridad"."usuario"("persona_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_nombre_usuario_key" ON "seguridad"."usuario"("nombre_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "paciente_persona_id_key" ON "maestros"."paciente"("persona_id");

-- CreateIndex
CREATE UNIQUE INDEX "paciente_numero_historia_key" ON "maestros"."paciente"("numero_historia");

-- CreateIndex
CREATE UNIQUE INDEX "empleado_persona_id_key" ON "maestros"."empleado"("persona_id");

-- CreateIndex
CREATE UNIQUE INDEX "empleado_codigo_empleado_key" ON "maestros"."empleado"("codigo_empleado");

-- CreateIndex
CREATE UNIQUE INDEX "especialidad_codigo_key" ON "maestros"."especialidad"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "especialidad_nombre_key" ON "maestros"."especialidad"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "medico_empleado_id_key" ON "maestros"."medico"("empleado_id");

-- CreateIndex
CREATE UNIQUE INDEX "medico_matricula_profesional_key" ON "maestros"."medico"("matricula_profesional");

-- CreateIndex
CREATE UNIQUE INDEX "consultorio_codigo_key" ON "maestros"."consultorio"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "historia_clinica_paciente_id_key" ON "clinica"."historia_clinica"("paciente_id");

-- CreateIndex
CREATE UNIQUE INDEX "cita_episodio_id_key" ON "clinica"."cita"("episodio_id");

-- CreateIndex
CREATE UNIQUE INDEX "consulta_cita_id_key" ON "clinica"."consulta"("cita_id");

-- CreateIndex
CREATE UNIQUE INDEX "catalogo_diagnostico_codigo_key" ON "clinica"."catalogo_diagnostico"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "archivo_clinico_clave_objeto_key" ON "clinica"."archivo_clinico"("clave_objeto");

-- CreateIndex
CREATE UNIQUE INDEX "tipo_examen_codigo_key" ON "laboratorio"."tipo_examen"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "tipo_examen_nombre_key" ON "laboratorio"."tipo_examen"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "orden_laboratorio_numero_orden_key" ON "laboratorio"."orden_laboratorio"("numero_orden");

-- CreateIndex
CREATE UNIQUE INDEX "detalle_orden_orden_id_tipo_examen_id_key" ON "laboratorio"."detalle_orden"("orden_id", "tipo_examen_id");

-- CreateIndex
CREATE UNIQUE INDEX "muestra_detalle_orden_id_key" ON "laboratorio"."muestra"("detalle_orden_id");

-- CreateIndex
CREATE UNIQUE INDEX "muestra_codigo_muestra_key" ON "laboratorio"."muestra"("codigo_muestra");

-- CreateIndex
CREATE UNIQUE INDEX "resultado_detalle_orden_id_key" ON "laboratorio"."resultado"("detalle_orden_id");

-- CreateIndex
CREATE UNIQUE INDEX "tipo_estudio_codigo_key" ON "imagenologia"."tipo_estudio"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "tipo_estudio_nombre_key" ON "imagenologia"."tipo_estudio"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "orden_imagenologia_numero_orden_key" ON "imagenologia"."orden_imagenologia"("numero_orden");

-- CreateIndex
CREATE UNIQUE INDEX "detalle_orden_orden_id_tipo_estudio_id_region_anatomica_key" ON "imagenologia"."detalle_orden"("orden_id", "tipo_estudio_id", "region_anatomica");

-- CreateIndex
CREATE UNIQUE INDEX "resultado_detalle_orden_id_key" ON "imagenologia"."resultado"("detalle_orden_id");

-- CreateIndex
CREATE UNIQUE INDEX "medicamento_codigo_key" ON "farmacia"."medicamento"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "proveedor_nit_key" ON "farmacia"."proveedor"("nit");

-- CreateIndex
CREATE UNIQUE INDEX "lote_medicamento_medicamento_id_codigo_lote_key" ON "farmacia"."lote_medicamento"("medicamento_id", "codigo_lote");

-- CreateIndex
CREATE UNIQUE INDEX "compra_proveedor_id_numero_documento_key" ON "farmacia"."compra"("proveedor_id", "numero_documento");

-- CreateIndex
CREATE UNIQUE INDEX "detalle_compra_compra_id_lote_id_key" ON "farmacia"."detalle_compra"("compra_id", "lote_id");

-- CreateIndex
CREATE UNIQUE INDEX "receta_numero_receta_key" ON "farmacia"."receta"("numero_receta");

-- CreateIndex
CREATE UNIQUE INDEX "detalle_receta_receta_id_medicamento_id_key" ON "farmacia"."detalle_receta"("receta_id", "medicamento_id");

-- CreateIndex
CREATE UNIQUE INDEX "detalle_dispensacion_dispensacion_id_detalle_receta_id_lote_key" ON "farmacia"."detalle_dispensacion"("dispensacion_id", "detalle_receta_id", "lote_id");

-- CreateIndex
CREATE UNIQUE INDEX "detalle_movimiento_movimiento_id_lote_id_key" ON "farmacia"."detalle_movimiento"("movimiento_id", "lote_id");

-- CreateIndex
CREATE UNIQUE INDEX "servicio_codigo_key" ON "facturacion"."servicio"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "factura_numero_factura_key" ON "facturacion"."factura"("numero_factura");

-- CreateIndex
CREATE UNIQUE INDEX "detalle_factura_prestacion_id_key" ON "facturacion"."detalle_factura"("prestacion_id");

-- AddForeignKey
ALTER TABLE "seguridad"."rol_permiso" ADD CONSTRAINT "rol_permiso_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "seguridad"."rol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguridad"."rol_permiso" ADD CONSTRAINT "rol_permiso_permiso_id_fkey" FOREIGN KEY ("permiso_id") REFERENCES "seguridad"."permiso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguridad"."usuario" ADD CONSTRAINT "usuario_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "maestros"."persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguridad"."usuario_rol" ADD CONSTRAINT "usuario_rol_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "seguridad"."usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguridad"."usuario_rol" ADD CONSTRAINT "usuario_rol_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "seguridad"."rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maestros"."paciente" ADD CONSTRAINT "paciente_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "maestros"."persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maestros"."empleado" ADD CONSTRAINT "empleado_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "maestros"."persona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maestros"."medico" ADD CONSTRAINT "medico_empleado_id_fkey" FOREIGN KEY ("empleado_id") REFERENCES "maestros"."empleado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maestros"."medico_especialidad" ADD CONSTRAINT "medico_especialidad_medico_id_fkey" FOREIGN KEY ("medico_id") REFERENCES "maestros"."medico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maestros"."medico_especialidad" ADD CONSTRAINT "medico_especialidad_especialidad_id_fkey" FOREIGN KEY ("especialidad_id") REFERENCES "maestros"."especialidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maestros"."horario_medico" ADD CONSTRAINT "horario_medico_medico_id_fkey" FOREIGN KEY ("medico_id") REFERENCES "maestros"."medico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maestros"."horario_medico" ADD CONSTRAINT "horario_medico_consultorio_id_fkey" FOREIGN KEY ("consultorio_id") REFERENCES "maestros"."consultorio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinica"."historia_clinica" ADD CONSTRAINT "historia_clinica_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "maestros"."paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinica"."antecedente_clinico" ADD CONSTRAINT "antecedente_clinico_historia_clinica_id_fkey" FOREIGN KEY ("historia_clinica_id") REFERENCES "clinica"."historia_clinica"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinica"."episodio_atencion" ADD CONSTRAINT "episodio_atencion_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "maestros"."paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinica"."cita" ADD CONSTRAINT "cita_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "maestros"."paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinica"."cita" ADD CONSTRAINT "cita_medico_id_fkey" FOREIGN KEY ("medico_id") REFERENCES "maestros"."medico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinica"."cita" ADD CONSTRAINT "cita_especialidad_id_fkey" FOREIGN KEY ("especialidad_id") REFERENCES "maestros"."especialidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinica"."cita" ADD CONSTRAINT "cita_consultorio_id_fkey" FOREIGN KEY ("consultorio_id") REFERENCES "maestros"."consultorio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinica"."cita" ADD CONSTRAINT "cita_episodio_id_fkey" FOREIGN KEY ("episodio_id") REFERENCES "clinica"."episodio_atencion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinica"."consulta" ADD CONSTRAINT "consulta_episodio_id_fkey" FOREIGN KEY ("episodio_id") REFERENCES "clinica"."episodio_atencion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinica"."consulta" ADD CONSTRAINT "consulta_cita_id_fkey" FOREIGN KEY ("cita_id") REFERENCES "clinica"."cita"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinica"."consulta" ADD CONSTRAINT "consulta_historia_clinica_id_fkey" FOREIGN KEY ("historia_clinica_id") REFERENCES "clinica"."historia_clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinica"."consulta" ADD CONSTRAINT "consulta_medico_id_fkey" FOREIGN KEY ("medico_id") REFERENCES "maestros"."medico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinica"."signo_vital" ADD CONSTRAINT "signo_vital_consulta_id_fkey" FOREIGN KEY ("consulta_id") REFERENCES "clinica"."consulta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinica"."consulta_diagnostico" ADD CONSTRAINT "consulta_diagnostico_consulta_id_fkey" FOREIGN KEY ("consulta_id") REFERENCES "clinica"."consulta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinica"."consulta_diagnostico" ADD CONSTRAINT "consulta_diagnostico_diagnostico_id_fkey" FOREIGN KEY ("diagnostico_id") REFERENCES "clinica"."catalogo_diagnostico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinica"."nota_evolucion" ADD CONSTRAINT "nota_evolucion_episodio_id_fkey" FOREIGN KEY ("episodio_id") REFERENCES "clinica"."episodio_atencion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinica"."nota_evolucion" ADD CONSTRAINT "nota_evolucion_consulta_id_fkey" FOREIGN KEY ("consulta_id") REFERENCES "clinica"."consulta"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinica"."archivo_clinico" ADD CONSTRAINT "archivo_clinico_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "maestros"."paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinica"."consulta_archivo" ADD CONSTRAINT "consulta_archivo_consulta_id_fkey" FOREIGN KEY ("consulta_id") REFERENCES "clinica"."consulta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinica"."consulta_archivo" ADD CONSTRAINT "consulta_archivo_archivo_id_fkey" FOREIGN KEY ("archivo_id") REFERENCES "clinica"."archivo_clinico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laboratorio"."orden_laboratorio" ADD CONSTRAINT "orden_laboratorio_consulta_id_fkey" FOREIGN KEY ("consulta_id") REFERENCES "clinica"."consulta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laboratorio"."orden_laboratorio" ADD CONSTRAINT "orden_laboratorio_solicitado_por_medico_id_fkey" FOREIGN KEY ("solicitado_por_medico_id") REFERENCES "maestros"."medico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laboratorio"."detalle_orden" ADD CONSTRAINT "detalle_orden_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "laboratorio"."orden_laboratorio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laboratorio"."detalle_orden" ADD CONSTRAINT "detalle_orden_tipo_examen_id_fkey" FOREIGN KEY ("tipo_examen_id") REFERENCES "laboratorio"."tipo_examen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laboratorio"."muestra" ADD CONSTRAINT "muestra_detalle_orden_id_fkey" FOREIGN KEY ("detalle_orden_id") REFERENCES "laboratorio"."detalle_orden"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laboratorio"."resultado" ADD CONSTRAINT "resultado_detalle_orden_id_fkey" FOREIGN KEY ("detalle_orden_id") REFERENCES "laboratorio"."detalle_orden"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laboratorio"."resultado_archivo" ADD CONSTRAINT "resultado_archivo_resultado_id_fkey" FOREIGN KEY ("resultado_id") REFERENCES "laboratorio"."resultado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laboratorio"."resultado_archivo" ADD CONSTRAINT "resultado_archivo_archivo_id_fkey" FOREIGN KEY ("archivo_id") REFERENCES "clinica"."archivo_clinico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagenologia"."orden_imagenologia" ADD CONSTRAINT "orden_imagenologia_consulta_id_fkey" FOREIGN KEY ("consulta_id") REFERENCES "clinica"."consulta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagenologia"."orden_imagenologia" ADD CONSTRAINT "orden_imagenologia_solicitado_por_medico_id_fkey" FOREIGN KEY ("solicitado_por_medico_id") REFERENCES "maestros"."medico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagenologia"."detalle_orden" ADD CONSTRAINT "detalle_orden_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "imagenologia"."orden_imagenologia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagenologia"."detalle_orden" ADD CONSTRAINT "detalle_orden_tipo_estudio_id_fkey" FOREIGN KEY ("tipo_estudio_id") REFERENCES "imagenologia"."tipo_estudio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagenologia"."resultado" ADD CONSTRAINT "resultado_detalle_orden_id_fkey" FOREIGN KEY ("detalle_orden_id") REFERENCES "imagenologia"."detalle_orden"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagenologia"."resultado_archivo" ADD CONSTRAINT "resultado_archivo_resultado_id_fkey" FOREIGN KEY ("resultado_id") REFERENCES "imagenologia"."resultado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagenologia"."resultado_archivo" ADD CONSTRAINT "resultado_archivo_archivo_id_fkey" FOREIGN KEY ("archivo_id") REFERENCES "clinica"."archivo_clinico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmacia"."lote_medicamento" ADD CONSTRAINT "lote_medicamento_medicamento_id_fkey" FOREIGN KEY ("medicamento_id") REFERENCES "farmacia"."medicamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmacia"."lote_medicamento" ADD CONSTRAINT "lote_medicamento_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "farmacia"."proveedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmacia"."compra" ADD CONSTRAINT "compra_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "farmacia"."proveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmacia"."detalle_compra" ADD CONSTRAINT "detalle_compra_compra_id_fkey" FOREIGN KEY ("compra_id") REFERENCES "farmacia"."compra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmacia"."detalle_compra" ADD CONSTRAINT "detalle_compra_lote_id_fkey" FOREIGN KEY ("lote_id") REFERENCES "farmacia"."lote_medicamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmacia"."receta" ADD CONSTRAINT "receta_consulta_id_fkey" FOREIGN KEY ("consulta_id") REFERENCES "clinica"."consulta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmacia"."receta" ADD CONSTRAINT "receta_medico_id_fkey" FOREIGN KEY ("medico_id") REFERENCES "maestros"."medico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmacia"."detalle_receta" ADD CONSTRAINT "detalle_receta_receta_id_fkey" FOREIGN KEY ("receta_id") REFERENCES "farmacia"."receta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmacia"."detalle_receta" ADD CONSTRAINT "detalle_receta_medicamento_id_fkey" FOREIGN KEY ("medicamento_id") REFERENCES "farmacia"."medicamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmacia"."dispensacion" ADD CONSTRAINT "dispensacion_receta_id_fkey" FOREIGN KEY ("receta_id") REFERENCES "farmacia"."receta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmacia"."detalle_dispensacion" ADD CONSTRAINT "detalle_dispensacion_dispensacion_id_fkey" FOREIGN KEY ("dispensacion_id") REFERENCES "farmacia"."dispensacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmacia"."detalle_dispensacion" ADD CONSTRAINT "detalle_dispensacion_detalle_receta_id_fkey" FOREIGN KEY ("detalle_receta_id") REFERENCES "farmacia"."detalle_receta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmacia"."detalle_dispensacion" ADD CONSTRAINT "detalle_dispensacion_lote_id_fkey" FOREIGN KEY ("lote_id") REFERENCES "farmacia"."lote_medicamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmacia"."movimiento_inventario" ADD CONSTRAINT "movimiento_inventario_compra_id_fkey" FOREIGN KEY ("compra_id") REFERENCES "farmacia"."compra"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmacia"."movimiento_inventario" ADD CONSTRAINT "movimiento_inventario_dispensacion_id_fkey" FOREIGN KEY ("dispensacion_id") REFERENCES "farmacia"."dispensacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmacia"."detalle_movimiento" ADD CONSTRAINT "detalle_movimiento_movimiento_id_fkey" FOREIGN KEY ("movimiento_id") REFERENCES "farmacia"."movimiento_inventario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farmacia"."detalle_movimiento" ADD CONSTRAINT "detalle_movimiento_lote_id_fkey" FOREIGN KEY ("lote_id") REFERENCES "farmacia"."lote_medicamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facturacion"."prestacion_servicio" ADD CONSTRAINT "prestacion_servicio_servicio_id_fkey" FOREIGN KEY ("servicio_id") REFERENCES "facturacion"."servicio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facturacion"."prestacion_servicio" ADD CONSTRAINT "prestacion_servicio_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "maestros"."paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facturacion"."prestacion_servicio" ADD CONSTRAINT "prestacion_servicio_episodio_id_fkey" FOREIGN KEY ("episodio_id") REFERENCES "clinica"."episodio_atencion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facturacion"."factura" ADD CONSTRAINT "factura_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "maestros"."paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facturacion"."detalle_factura" ADD CONSTRAINT "detalle_factura_factura_id_fkey" FOREIGN KEY ("factura_id") REFERENCES "facturacion"."factura"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facturacion"."detalle_factura" ADD CONSTRAINT "detalle_factura_prestacion_id_fkey" FOREIGN KEY ("prestacion_id") REFERENCES "facturacion"."prestacion_servicio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facturacion"."pago" ADD CONSTRAINT "pago_factura_id_fkey" FOREIGN KEY ("factura_id") REFERENCES "facturacion"."factura"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
