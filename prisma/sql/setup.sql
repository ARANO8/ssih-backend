-- setup.sql
-- Orquestación del esquema completo de la base de datos SIIH
-- Ejecutar como superusuario de PostgreSQL (postgres)
--
-- Uso:
--   psql -U postgres -d siih_hospital -f prisma/sql/setup.sql
--
-- Este script ejecuta en orden los archivos SQL de esquema.
-- Es idempotente: puede ejecutarse múltiples veces sin errores.

\echo '========================================'
\echo '  SIIH - Configuración de Base de Datos'
\echo '========================================'

\echo ''
\echo '[1/7] Extensiones...'
\i prisma/sql/01_extensions.sql

\echo ''
\echo '[2/7] Roles y permisos...'
\i prisma/sql/02_roles.sql

\echo ''
\echo '[3/7] Funciones almacenadas...'
\i prisma/sql/03_functions.sql

\echo ''
\echo '[4/7] Triggers...'
\i prisma/sql/04_triggers.sql

\echo ''
\echo '[5/7] Vistas...'
\i prisma/sql/05_views.sql

\echo ''
\echo '[6/7] Restricciones de exclusión...'
\i prisma/sql/06_exclusion_constraints.sql

\echo ''
\echo '[7/7] Datos de prueba...'
\i prisma/sql/07_seed_data.sql

\echo ''
\echo '========================================'
\echo '  SIIH - Configuración completada'
\echo '========================================'
\echo ''
\echo 'Resumen:'
\echo '  - Extensiones: pgcrypto, citext, btree_gist, unaccent, pg_trgm'
\echo '  - Roles: siih_owner, siih_app, siih_readonly, siih_backup'
\echo '  - Funciones: 17 (auditoría, validación, inventario, facturación)'
\echo '  - Triggers: auditoría + modified_at + validación'
\echo '  - Vistas: 6 (agenda, historias, órdenes, stock, KPI, cuentas por cobrar)'
\echo '  - Restricciones de exclusión: 3 (médico, paciente, consultorio)'
\echo '  - Datos de prueba: 8 usuarios, 13 pacientes, citas, consultas, etc.'
\echo ''
\echo 'Credenciales de demo (desarrollo):'
\echo '  - admin.demo / Demo2026!'
\echo '  - medico.demo / Demo2026!'
\echo '  - caja.demo / Demo2026!'
