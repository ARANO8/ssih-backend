-- CreateTable
CREATE TABLE "seguridad"."alerta" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "titulo" VARCHAR(160) NOT NULL,
    "mensaje" TEXT NOT NULL,
    "severidad" VARCHAR(20) NOT NULL DEFAULT 'INFO',
    "estado" VARCHAR(20) NOT NULL DEFAULT 'ACTIVA',
    "origen" VARCHAR(60) NOT NULL DEFAULT 'SISTEMA',
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resuelto_en" TIMESTAMP(3),

    CONSTRAINT "alerta_pkey" PRIMARY KEY ("id")
);
