-- 06_exclusion_constraints.sql
-- Ejecutar conectado a siih_hospital como superusuario (postgres)
-- Restricciones de exclusión para evitar solapamiento de citas
-- Requiere la extensión btree_gist (creada en 01_extensions.sql)

BEGIN;

-- ============================================================
-- Evitar que un médico tenga citas solapadas
-- ============================================================
ALTER TABLE clinica.cita
ADD CONSTRAINT ex_cita_medico_solapada
EXCLUDE USING gist (
    medico_id WITH =,
    tstzrange(fecha_hora_inicio, fecha_hora_fin, '[)') WITH &&
)
WHERE (estado IN ('PROGRAMADA', 'CONFIRMADA', 'EN_ATENCION'));

-- ============================================================
-- Evitar que un paciente tenga citas solapadas
-- ============================================================
ALTER TABLE clinica.cita
ADD CONSTRAINT ex_cita_paciente_solapada
EXCLUDE USING gist (
    paciente_id WITH =,
    tstzrange(fecha_hora_inicio, fecha_hora_fin, '[)') WITH &&
)
WHERE (estado IN ('PROGRAMADA', 'CONFIRMADA', 'EN_ATENCION'));

-- ============================================================
-- Evitar que un consultorio tenga citas solapadas
-- ============================================================
ALTER TABLE clinica.cita
ADD CONSTRAINT ex_cita_consultorio_solapado
EXCLUDE USING gist (
    consultorio_id WITH =,
    tstzrange(fecha_hora_inicio, fecha_hora_fin, '[)') WITH &&
)
WHERE (consultorio_id IS NOT NULL AND estado IN ('PROGRAMADA', 'CONFIRMADA', 'EN_ATENCION'));

COMMIT;
