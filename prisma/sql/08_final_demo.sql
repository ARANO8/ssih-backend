BEGIN;

INSERT INTO seguridad.rol (codigo, nombre, descripcion, activo) VALUES
('ADMINISTRADOR', 'Administrador', 'Control total del sistema', true),
('RECEPCIONISTA', 'Recepcionista', 'Pacientes y citas', true),
('MEDICO', 'Medico', 'Atencion clinica', true),
('ENFERMERIA', 'Enfermeria', 'Cuidados y signos vitales', true),
('LABORATORIO', 'Laboratorio', 'Ordenes y resultados', true),
('FARMACIA', 'Farmacia', 'Medicamentos e inventario', true),
('CAJA', 'Caja', 'Facturacion y cobros', true),
('DIRECTOR', 'Director', 'Reportes institucionales', true),
('PACIENTE', 'Paciente', 'Consulta de informacion propia', true)
ON CONFLICT (codigo) DO UPDATE SET nombre = EXCLUDED.nombre, descripcion = EXCLUDED.descripcion, activo = true;

INSERT INTO maestros.persona (id, tipo_documento, numero_documento, nombres, apellidos, sexo, correo, activo) VALUES
('13000000-0000-0000-0000-000000000001', 'CI', 'DEMO-ADMIN', 'Administrador', 'SIIH', 'NO_ESPECIFICA', 'admin@siih.local', true),
('13000000-0000-0000-0000-000000000002', 'CI', 'DEMO-REC', 'Rocio', 'Recepcion', 'FEMENINO', 'recepcion.demo@siih.local', true),
('13000000-0000-0000-0000-000000000003', 'CI', 'DEMO-MED', 'Miguel', 'Medico', 'MASCULINO', 'medico.demo@siih.local', true),
('13000000-0000-0000-0000-000000000004', 'CI', 'DEMO-ENF', 'Elena', 'Enfermeria', 'FEMENINO', 'enfermeria.demo@siih.local', true),
('13000000-0000-0000-0000-000000000005', 'CI', 'DEMO-LAB', 'Laura', 'Laboratorio', 'FEMENINO', 'laboratorio.demo@siih.local', true),
('13000000-0000-0000-0000-000000000006', 'CI', 'DEMO-FAR', 'Fernando', 'Farmacia', 'MASCULINO', 'farmacia.demo@siih.local', true),
('13000000-0000-0000-0000-000000000007', 'CI', 'DEMO-CAJA', 'Camila', 'Caja', 'FEMENINO', 'caja.demo@siih.local', true),
('13000000-0000-0000-0000-000000000008', 'CI', 'DEMO-DIR', 'Diego', 'Direccion', 'MASCULINO', 'director.demo@siih.local', true),
('13000000-0000-0000-0000-000000000009', 'CI', 'DEMO-PAC', 'Paola', 'Paciente', 'FEMENINO', 'paciente.demo@siih.local', true)
ON CONFLICT DO NOTHING;

INSERT INTO seguridad.usuario (id, persona_id, nombre_usuario, contrasena_hash, estado, cambiar_contrasena) VALUES
('23000000-0000-0000-0000-000000000001', '13000000-0000-0000-0000-000000000001', 'admin', crypt('SIIH2026!', gen_salt('bf', 10)), 'ACTIVO', false),
('23000000-0000-0000-0000-000000000002', '13000000-0000-0000-0000-000000000002', 'recepcion.demo', crypt('SIIH2026!', gen_salt('bf', 10)), 'ACTIVO', false),
('23000000-0000-0000-0000-000000000003', '13000000-0000-0000-0000-000000000003', 'medico.demo', crypt('SIIH2026!', gen_salt('bf', 10)), 'ACTIVO', false),
('23000000-0000-0000-0000-000000000004', '13000000-0000-0000-0000-000000000004', 'enfermeria.demo', crypt('SIIH2026!', gen_salt('bf', 10)), 'ACTIVO', false),
('23000000-0000-0000-0000-000000000005', '13000000-0000-0000-0000-000000000005', 'laboratorio.demo', crypt('SIIH2026!', gen_salt('bf', 10)), 'ACTIVO', false),
('23000000-0000-0000-0000-000000000006', '13000000-0000-0000-0000-000000000006', 'farmacia.demo', crypt('SIIH2026!', gen_salt('bf', 10)), 'ACTIVO', false),
('23000000-0000-0000-0000-000000000007', '13000000-0000-0000-0000-000000000007', 'caja.demo', crypt('SIIH2026!', gen_salt('bf', 10)), 'ACTIVO', false),
('23000000-0000-0000-0000-000000000008', '13000000-0000-0000-0000-000000000008', 'director.demo', crypt('SIIH2026!', gen_salt('bf', 10)), 'ACTIVO', false),
('23000000-0000-0000-0000-000000000009', '13000000-0000-0000-0000-000000000009', 'paciente.demo', crypt('SIIH2026!', gen_salt('bf', 10)), 'ACTIVO', false)
ON CONFLICT (nombre_usuario) DO UPDATE SET contrasena_hash = EXCLUDED.contrasena_hash, estado = 'ACTIVO', cambiar_contrasena = false;

INSERT INTO seguridad.usuario_rol (usuario_id, rol_id)
SELECT u.id, r.id FROM seguridad.usuario u JOIN seguridad.rol r ON r.codigo = CASE u.nombre_usuario
  WHEN 'admin' THEN 'ADMINISTRADOR' WHEN 'recepcion.demo' THEN 'RECEPCIONISTA'
  WHEN 'medico.demo' THEN 'MEDICO' WHEN 'enfermeria.demo' THEN 'ENFERMERIA'
  WHEN 'laboratorio.demo' THEN 'LABORATORIO' WHEN 'farmacia.demo' THEN 'FARMACIA'
  WHEN 'caja.demo' THEN 'CAJA' WHEN 'director.demo' THEN 'DIRECTOR'
  WHEN 'paciente.demo' THEN 'PACIENTE' END
WHERE u.nombre_usuario IN ('admin','recepcion.demo','medico.demo','enfermeria.demo','laboratorio.demo','farmacia.demo','caja.demo','director.demo','paciente.demo')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS seguridad.alerta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(160) NOT NULL,
  mensaje TEXT NOT NULL,
  severidad VARCHAR(20) NOT NULL DEFAULT 'INFO',
  estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVA',
  origen VARCHAR(60) NOT NULL DEFAULT 'SISTEMA',
  creado_en TIMESTAMP NOT NULL DEFAULT NOW(),
  resuelto_en TIMESTAMP NULL
);

INSERT INTO seguridad.alerta (id, titulo, mensaje, severidad, estado, origen) VALUES
('61000000-0000-0000-0000-000000000001', 'Revisar inventario de farmacia', 'Existen medicamentos con stock minimo que requieren revision.', 'ADVERTENCIA', 'ACTIVA', 'FARMACIA'),
('61000000-0000-0000-0000-000000000002', 'Ordenes pendientes', 'Verificar las ordenes diagnosticas pendientes.', 'INFO', 'ACTIVA', 'SERVICIOS'),
('61000000-0000-0000-0000-000000000003', 'Respaldo de base de datos', 'Programar el respaldo diario de la base hospitalaria.', 'CRITICA', 'ACTIVA', 'SISTEMA')
ON CONFLICT DO NOTHING;

COMMIT;
