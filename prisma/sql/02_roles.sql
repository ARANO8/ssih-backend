-- 02_roles.sql
-- Ejecutar conectado a siih_hospital como superusuario (postgres)

BEGIN;

-- Roles técnicos
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'siih_owner') THEN
        CREATE ROLE siih_owner NOLOGIN;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'siih_app') THEN
        CREATE ROLE siih_app LOGIN PASSWORD 'CAMBIAR_ESTA_CONTRASENA_APP';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'siih_readonly') THEN
        CREATE ROLE siih_readonly LOGIN PASSWORD 'CAMBIAR_ESTA_CONTRASENA_LECTURA';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'siih_backup') THEN
        CREATE ROLE siih_backup LOGIN PASSWORD 'CAMBIAR_ESTA_CONTRASENA_BACKUP';
    END IF;
END
$$;

ALTER DATABASE siih_hospital OWNER TO siih_owner;

-- Permisos de conexión
GRANT CONNECT ON DATABASE siih_hospital TO siih_app, siih_readonly, siih_backup;

-- Backup necesita pg_read_all_data
RESET ROLE;
GRANT pg_read_all_data TO siih_backup;
SET ROLE siih_owner;

-- Permisos de esquema
GRANT USAGE ON SCHEMA seguridad, maestros, clinica, laboratorio, imagenologia, farmacia, facturacion TO siih_app;
GRANT USAGE ON SCHEMA maestros, clinica, laboratorio, imagenologia, farmacia, facturacion TO siih_readonly;

-- Permisos de tablas
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA seguridad, maestros, clinica, laboratorio, imagenologia, farmacia, facturacion TO siih_app;
GRANT SELECT ON ALL TABLES IN SCHEMA auditoria TO siih_app;
GRANT SELECT ON ALL TABLES IN SCHEMA maestros, clinica, laboratorio, imagenologia, farmacia, facturacion TO siih_readonly;

-- Permisos de secuencias
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA seguridad, maestros, clinica, laboratorio, imagenologia, farmacia, facturacion TO siih_app;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA seguridad, maestros, clinica, laboratorio, imagenologia, farmacia, facturacion TO siih_readonly;

-- Permisos de funciones
GRANT EXECUTE ON FUNCTION farmacia.confirmar_compra(uuid, uuid) TO siih_app;
GRANT EXECUTE ON FUNCTION farmacia.confirmar_dispensacion(uuid, uuid) TO siih_app;
GRANT EXECUTE ON FUNCTION facturacion.emitir_factura(uuid) TO siih_app;

-- Restricciones adicionales
REVOKE INSERT, UPDATE, DELETE ON auditoria.evento FROM siih_app, siih_readonly;
REVOKE UPDATE, DELETE ON farmacia.movimiento_inventario, farmacia.detalle_movimiento FROM siih_app;
REVOKE DELETE ON clinica.historia_clinica, clinica.consulta, laboratorio.resultado, imagenologia.resultado, facturacion.factura, facturacion.pago FROM siih_app;

-- Privilegios por defecto
ALTER DEFAULT PRIVILEGES IN SCHEMA seguridad, maestros, clinica, laboratorio, imagenologia, farmacia, facturacion
GRANT SELECT, INSERT, UPDATE ON TABLES TO siih_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA seguridad, maestros, clinica, laboratorio, imagenologia, farmacia, facturacion
GRANT USAGE, SELECT ON SEQUENCES TO siih_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA maestros, clinica, laboratorio, imagenologia, farmacia, facturacion
GRANT SELECT ON TABLES TO siih_readonly;

RESET ROLE;
COMMIT;
