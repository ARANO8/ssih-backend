-- 07_seed_data.sql
-- Datos de prueba para el sistema SIIH
-- Ejecutar DESPUÉS de 01_extensions.sql, 02_roles.sql, 03_functions.sql, 04_triggers.sql, 05_views.sql, 06_exclusion_constraints.sql
-- Contraseña de todos los usuarios de demostración: Demo2026!
-- Uso exclusivo en desarrollo. Debe cambiarse en producción.

BEGIN;
SET ROLE siih_owner;
SET search_path = seguridad, maestros, clinica, laboratorio, imagenologia, farmacia, facturacion, auditoria, public;

-- ============================================================
-- 1. Roles funcionales
-- ============================================================
INSERT INTO seguridad.rol (codigo, nombre, descripcion, es_sistema) VALUES
('ADMINISTRADOR', 'Administrador', 'Control total de configuración, usuarios y auditoría.', true),
('RECEPCIONISTA', 'Recepcionista', 'Registro de pacientes y gestión de citas.', true),
('MEDICO', 'Médico', 'Historia clínica, consultas, diagnósticos, órdenes y recetas.', true),
('ENFERMERIA', 'Enfermería', 'Signos vitales y notas de evolución.', true),
('LABORATORIO', 'Laboratorio', 'Muestras y resultados de laboratorio.', true),
('FARMACIA', 'Farmacia', 'Medicamentos, dispensación e inventario.', true),
('CAJA', 'Caja', 'Facturación, cobros y recibos.', true),
('DIRECTOR', 'Director', 'Reportes e indicadores institucionales.', true),
('PACIENTE', 'Paciente', 'Consulta de citas y comprobantes.', true);

-- ============================================================
-- 2. Permisos
-- ============================================================
INSERT INTO seguridad.permiso (codigo, modulo, accion, descripcion) VALUES
('PACIENTES.LEER', 'PACIENTES', 'LEER', 'Consultar pacientes.'),
('PACIENTES.CREAR', 'PACIENTES', 'CREAR', 'Registrar pacientes.'),
('PACIENTES.ACTUALIZAR', 'PACIENTES', 'ACTUALIZAR', 'Actualizar pacientes.'),
('CITAS.LEER', 'CITAS', 'LEER', 'Consultar agenda y citas.'),
('CITAS.GESTIONAR', 'CITAS', 'GESTIONAR', 'Programar, reprogramar y cancelar citas.'),
('HISTORIA.LEER', 'HISTORIA', 'LEER', 'Consultar historia clínica.'),
('HISTORIA.ESCRIBIR', 'HISTORIA', 'ESCRIBIR', 'Registrar información clínica.'),
('LABORATORIO.LEER', 'LABORATORIO', 'LEER', 'Consultar órdenes y resultados.'),
('LABORATORIO.GESTIONAR', 'LABORATORIO', 'GESTIONAR', 'Gestionar muestras y resultados.'),
('FARMACIA.LEER', 'FARMACIA', 'LEER', 'Consultar medicamentos e inventario.'),
('FARMACIA.GESTIONAR', 'FARMACIA', 'GESTIONAR', 'Gestionar compras, recetas y dispensaciones.'),
('FACTURACION.LEER', 'FACTURACION', 'LEER', 'Consultar facturas y pagos.'),
('FACTURACION.GESTIONAR', 'FACTURACION', 'GESTIONAR', 'Emitir facturas y registrar pagos.'),
('REPORTES.LEER', 'REPORTES', 'LEER', 'Consultar indicadores y reportes.'),
('SEGURIDAD.GESTIONAR', 'SEGURIDAD', 'GESTIONAR', 'Administrar usuarios, roles y permisos.'),
('AUDITORIA.LEER', 'AUDITORIA', 'LEER', 'Consultar bitácora de auditoría.');

-- Administrador recibe todos los permisos
INSERT INTO seguridad.rol_permiso (rol_id, permiso_id)
SELECT r.id, p.id
FROM seguridad.rol r
CROSS JOIN seguridad.permiso p
WHERE r.codigo = 'ADMINISTRADOR';

-- Permisos por rol
INSERT INTO seguridad.rol_permiso (rol_id, permiso_id)
SELECT r.id, p.id
FROM seguridad.rol r
JOIN seguridad.permiso p ON
    (r.codigo = 'RECEPCIONISTA' AND p.codigo IN ('PACIENTES.LEER','PACIENTES.CREAR','PACIENTES.ACTUALIZAR','CITAS.LEER','CITAS.GESTIONAR')) OR
    (r.codigo = 'MEDICO' AND p.codigo IN ('PACIENTES.LEER','CITAS.LEER','HISTORIA.LEER','HISTORIA.ESCRIBIR','LABORATORIO.LEER','FARMACIA.LEER')) OR
    (r.codigo = 'ENFERMERIA' AND p.codigo IN ('PACIENTES.LEER','CITAS.LEER','HISTORIA.LEER','HISTORIA.ESCRIBIR')) OR
    (r.codigo = 'LABORATORIO' AND p.codigo IN ('PACIENTES.LEER','LABORATORIO.LEER','LABORATORIO.GESTIONAR')) OR
    (r.codigo = 'FARMACIA' AND p.codigo IN ('PACIENTES.LEER','FARMACIA.LEER','FARMACIA.GESTIONAR')) OR
    (r.codigo = 'CAJA' AND p.codigo IN ('PACIENTES.LEER','FACTURACION.LEER','FACTURACION.GESTIONAR')) OR
    (r.codigo = 'DIRECTOR' AND p.codigo IN ('REPORTES.LEER','FACTURACION.LEER','LABORATORIO.LEER','FARMACIA.LEER')) OR
    (r.codigo = 'PACIENTE' AND p.codigo IN ('CITAS.LEER','FACTURACION.LEER'));

-- ============================================================
-- 3. Personas del personal
-- ============================================================
INSERT INTO maestros.persona (
    id, tipo_documento, numero_documento, nombres, apellidos, fecha_nacimiento, sexo, telefono, correo
) VALUES
('10000000-0000-0000-0000-000000000001', 'CI', '9000001', 'Alex', 'Administrador Demo', '1988-02-12', 'MASCULINO', '70000001', 'admin.demo@hospital.test'),
('10000000-0000-0000-0000-000000000002', 'CI', '9000002', 'Rosa', 'Recepción Demo', '1994-05-18', 'FEMENINO', '70000002', 'recepcion.demo@hospital.test'),
('10000000-0000-0000-0000-000000000003', 'CI', '9000003', 'Mateo', 'Médico Demo', '1985-11-03', 'MASCULINO', '70000003', 'medico.demo@hospital.test'),
('10000000-0000-0000-0000-000000000004', 'CI', '9000004', 'Elena', 'Enfermería Demo', '1991-07-22', 'FEMENINO', '70000004', 'enfermeria.demo@hospital.test'),
('10000000-0000-0000-0000-000000000005', 'CI', '9000005', 'Bruno', 'Laboratorio Demo', '1990-04-09', 'MASCULINO', '70000005', 'laboratorio.demo@hospital.test'),
('10000000-0000-0000-0000-000000000006', 'CI', '9000006', 'Camila', 'Farmacia Demo', '1993-09-14', 'FEMENINO', '70000006', 'farmacia.demo@hospital.test'),
('10000000-0000-0000-0000-000000000007', 'CI', '9000007', 'Nicolás', 'Caja Demo', '1989-12-01', 'MASCULINO', '70000007', 'caja.demo@hospital.test'),
('10000000-0000-0000-0000-000000000008', 'CI', '9000008', 'Valeria', 'Dirección Demo', '1982-06-30', 'FEMENINO', '70000008', 'direccion.demo@hospital.test');

-- ============================================================
-- 4. Pacientes ficticios
-- ============================================================
INSERT INTO maestros.persona (
    id, tipo_documento, numero_documento, nombres, apellidos, fecha_nacimiento, sexo, direccion, telefono, correo
) VALUES
('10000000-0000-0000-0000-000000000101', 'CI', '8000101', 'Lucía', 'Paciente Uno', '1999-03-20', 'FEMENINO', 'Zona Central, La Paz', '71000101', 'paciente1@test.invalid'),
('10000000-0000-0000-0000-000000000102', 'CI', '8000102', 'Diego', 'Paciente Dos', '1978-08-11', 'MASCULINO', 'Zona Norte, La Paz', '71000102', 'paciente2@test.invalid'),
('10000000-0000-0000-0000-000000000103', 'PASAPORTE', 'P-DEMO-103', 'Sam', 'Paciente Tres', '2004-01-05', 'NO_ESPECIFICA', 'Zona Sur, La Paz', '71000103', NULL);

INSERT INTO maestros.paciente (
    id, persona_id, grupo_sanguineo, factor_rh, contacto_emergencia_nombre, contacto_emergencia_telefono
) VALUES
('40000000-0000-0000-0000-000000000101', '10000000-0000-0000-0000-000000000101', 'O', '+', 'Contacto Ficticio Uno', '72000101'),
('40000000-0000-0000-0000-000000000102', '10000000-0000-0000-0000-000000000102', 'A', '-', 'Contacto Ficticio Dos', '72000102'),
('40000000-0000-0000-0000-000000000103', '10000000-0000-0000-0000-000000000103', NULL, NULL, NULL, NULL);

-- ============================================================
-- 5. Empleados y médico
-- ============================================================
INSERT INTO maestros.empleado (id, persona_id, codigo_empleado, cargo, fecha_ingreso) VALUES
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'EMP-001', 'Administrador de sistemas', '2025-01-10'),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'EMP-002', 'Recepcionista', '2025-01-10'),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'EMP-003', 'Médico general', '2025-01-10'),
('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', 'EMP-004', 'Enfermera', '2025-01-10'),
('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005', 'EMP-005', 'Bioquímico', '2025-01-10'),
('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000006', 'EMP-006', 'Farmacéutica', '2025-01-10'),
('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000007', 'EMP-007', 'Cajero', '2025-01-10'),
('20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000008', 'EMP-008', 'Directora', '2025-01-10');

INSERT INTO maestros.especialidad (codigo, nombre, descripcion) VALUES
('MED-GEN', 'Medicina General', 'Atención médica general.'),
('CARD', 'Cardiología', 'Atención cardiovascular.'),
('PED', 'Pediatría', 'Atención infantil.');

INSERT INTO maestros.medico (id, empleado_id, matricula_profesional)
VALUES ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', 'MED-DEMO-001');

INSERT INTO maestros.medico_especialidad (medico_id, especialidad_id, es_principal)
SELECT '30000000-0000-0000-0000-000000000003', id, true
FROM maestros.especialidad WHERE codigo = 'MED-GEN';

INSERT INTO maestros.consultorio (id, codigo, nombre, piso, ubicacion) VALUES
('60000000-0000-0000-0000-000000000001', 'CONS-101', 'Consultorio 101', '1', 'Bloque clínico'),
('60000000-0000-0000-0000-000000000002', 'LAB-01', 'Laboratorio principal', 'PB', 'Bloque diagnóstico');

INSERT INTO maestros.horario_medico (
    id, medico_id, consultorio_id, dia_semana, hora_inicio, hora_fin, vigente_desde
) VALUES
('61000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003', '60000000-0000-0000-0000-000000000001', 1, '08:00', '12:00', '2026-01-01'),
('61000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000003', '60000000-0000-0000-0000-000000000001', 3, '14:00', '18:00', '2026-01-01');

-- ============================================================
-- 6. Usuarios de demostración
-- ============================================================
INSERT INTO seguridad.usuario (
    id, persona_id, nombre_usuario, contrasena_hash, estado, cambiar_contrasena
) VALUES
('50000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'admin.demo', crypt('Demo2026!', gen_salt('bf', 12)), 'ACTIVO', false),
('50000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'recepcion.demo', crypt('Demo2026!', gen_salt('bf', 12)), 'ACTIVO', false),
('50000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'medico.demo', crypt('Demo2026!', gen_salt('bf', 12)), 'ACTIVO', false),
('50000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', 'enfermeria.demo', crypt('Demo2026!', gen_salt('bf', 12)), 'ACTIVO', false),
('50000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005', 'laboratorio.demo', crypt('Demo2026!', gen_salt('bf', 12)), 'ACTIVO', false),
('50000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000006', 'farmacia.demo', crypt('Demo2026!', gen_salt('bf', 12)), 'ACTIVO', false),
('50000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000007', 'caja.demo', crypt('Demo2026!', gen_salt('bf', 12)), 'ACTIVO', false),
('50000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000008', 'direccion.demo', crypt('Demo2026!', gen_salt('bf', 12)), 'ACTIVO', false);

SELECT set_config('app.usuario_id', '50000000-0000-0000-0000-000000000001', false);

INSERT INTO seguridad.usuario_rol (usuario_id, rol_id, asignado_por)
SELECT u.id, r.id, '50000000-0000-0000-0000-000000000001'
FROM seguridad.usuario u
JOIN seguridad.rol r ON
    (u.nombre_usuario = 'admin.demo' AND r.codigo = 'ADMINISTRADOR') OR
    (u.nombre_usuario = 'recepcion.demo' AND r.codigo = 'RECEPCIONISTA') OR
    (u.nombre_usuario = 'medico.demo' AND r.codigo = 'MEDICO') OR
    (u.nombre_usuario = 'enfermeria.demo' AND r.codigo = 'ENFERMERIA') OR
    (u.nombre_usuario = 'laboratorio.demo' AND r.codigo = 'LABORATORIO') OR
    (u.nombre_usuario = 'farmacia.demo' AND r.codigo = 'FARMACIA') OR
    (u.nombre_usuario = 'caja.demo' AND r.codigo = 'CAJA') OR
    (u.nombre_usuario = 'direccion.demo' AND r.codigo = 'DIRECTOR');

-- ============================================================
-- 7. Historias clínicas y antecedentes
-- ============================================================
INSERT INTO clinica.historia_clinica (
    id, paciente_id, fecha_apertura, antecedentes_resumen
) VALUES
('70000000-0000-0000-0000-000000000101', '40000000-0000-0000-0000-000000000101', '2026-01-15', 'Sin antecedentes relevantes registrados.'),
('70000000-0000-0000-0000-000000000102', '40000000-0000-0000-0000-000000000102', '2026-02-01', 'Antecedente de hipertensión en seguimiento.'),
('70000000-0000-0000-0000-000000000103', '40000000-0000-0000-0000-000000000103', '2026-03-10', NULL);

INSERT INTO clinica.antecedente_clinico (
    id, historia_clinica_id, tipo, descripcion, registrado_por
) VALUES
('70100000-0000-0000-0000-000000000101', '70000000-0000-0000-0000-000000000102', 'ENFERMEDAD_CRONICA', 'Hipertensión arterial controlada.', '50000000-0000-0000-0000-000000000003'),
('70100000-0000-0000-0000-000000000102', '70000000-0000-0000-0000-000000000101', 'ALERGIA', 'Refiere sensibilidad leve a un medicamento no identificado.', '50000000-0000-0000-0000-000000000003');

-- ============================================================
-- 8. Atención clínica completa
-- ============================================================
INSERT INTO clinica.episodio_atencion (
    id, paciente_id, tipo, estado, fecha_inicio, motivo, prioridad, creado_por
) VALUES
('71000000-0000-0000-0000-000000000101', '40000000-0000-0000-0000-000000000101', 'CONSULTA_EXTERNA', 'ABIERTO', '2026-07-10 09:00:00-04', 'Dolor de garganta y fiebre leve.', 'NORMAL', '50000000-0000-0000-0000-000000000002');

INSERT INTO clinica.cita (
    id, paciente_id, medico_id, especialidad_id, consultorio_id, episodio_id,
    fecha_hora_inicio, fecha_hora_fin, estado, motivo, creada_por
)
SELECT
    '72000000-0000-0000-0000-000000000101',
    '40000000-0000-0000-0000-000000000101',
    '30000000-0000-0000-0000-000000000003',
    e.id,
    '60000000-0000-0000-0000-000000000001',
    '71000000-0000-0000-0000-000000000101',
    '2026-07-10 09:00:00-04',
    '2026-07-10 09:30:00-04',
    'CONFIRMADA',
    'Dolor de garganta y fiebre leve.',
    '50000000-0000-0000-0000-000000000002'
FROM maestros.especialidad e WHERE e.codigo = 'MED-GEN';

INSERT INTO clinica.consulta (
    id, episodio_id, cita_id, historia_clinica_id, medico_id, fecha_inicio, fecha_fin,
    estado, motivo_consulta, exploracion_fisica, impresion_diagnostica, plan_tratamiento
) VALUES
(
    '73000000-0000-0000-0000-000000000101',
    '71000000-0000-0000-0000-000000000101',
    '72000000-0000-0000-0000-000000000101',
    '70000000-0000-0000-0000-000000000101',
    '30000000-0000-0000-0000-000000000003',
    '2026-07-10 09:05:00-04',
    '2026-07-10 09:25:00-04',
    'CERRADA',
    'Dolor de garganta de dos días.',
    'Faringe eritematosa, sin signos de dificultad respiratoria.',
    'Faringitis aguda probable.',
    'Tratamiento sintomático, hidratación y control.'
);

INSERT INTO clinica.signo_vital (
    id, consulta_id, registrado_por, registrado_en, presion_sistolica, presion_diastolica,
    frecuencia_cardiaca, frecuencia_respiratoria, temperatura, saturacion_oxigeno, peso_kg, talla_cm
) VALUES
(
    '73100000-0000-0000-0000-000000000101',
    '73000000-0000-0000-0000-000000000101',
    '50000000-0000-0000-0000-000000000004',
    '2026-07-10 09:02:00-04',
    112, 74, 82, 18, 37.8, 97.0, 58.5, 164.0
);

INSERT INTO clinica.catalogo_diagnostico (
    id, codigo, nombre, descripcion
) VALUES
('74000000-0000-0000-0000-000000000001', 'J02.9', 'Faringitis aguda no especificada', 'Código de demostración para pruebas.'),
('74000000-0000-0000-0000-000000000002', 'I10', 'Hipertensión esencial', 'Código de demostración para pruebas.');

INSERT INTO clinica.consulta_diagnostico (
    consulta_id, diagnostico_id, tipo, observaciones
) VALUES
('73000000-0000-0000-0000-000000000101', '74000000-0000-0000-0000-000000000001', 'PRINCIPAL', 'Diagnóstico clínico de prueba.');

INSERT INTO clinica.nota_evolucion (
    id, episodio_id, consulta_id, tipo, contenido, autor_usuario_id, registrado_en
) VALUES
('75000000-0000-0000-0000-000000000101', '71000000-0000-0000-0000-000000000101', '73000000-0000-0000-0000-000000000101', 'ENFERMERIA', 'Paciente estable durante la atención.', '50000000-0000-0000-0000-000000000004', '2026-07-10 09:20:00-04');

-- Cita futura para comprobar agenda
INSERT INTO clinica.episodio_atencion (
    id, paciente_id, tipo, estado, fecha_inicio, motivo, prioridad, creado_por
) VALUES
('71000000-0000-0000-0000-000000000102', '40000000-0000-0000-0000-000000000102', 'CONSULTA_EXTERNA', 'ABIERTO', '2026-08-03 10:00:00-04', 'Control de presión arterial.', 'NORMAL', '50000000-0000-0000-0000-000000000002');

INSERT INTO clinica.cita (
    id, paciente_id, medico_id, especialidad_id, consultorio_id, episodio_id,
    fecha_hora_inicio, fecha_hora_fin, estado, motivo, creada_por
)
SELECT
    '72000000-0000-0000-0000-000000000102',
    '40000000-0000-0000-0000-000000000102',
    '30000000-0000-0000-0000-000000000003',
    e.id,
    '60000000-0000-0000-0000-000000000001',
    '71000000-0000-0000-0000-000000000102',
    '2026-08-03 10:00:00-04',
    '2026-08-03 10:30:00-04',
    'PROGRAMADA',
    'Control de presión arterial.',
    '50000000-0000-0000-0000-000000000002'
FROM maestros.especialidad e WHERE e.codigo = 'MED-GEN';

-- ============================================================
-- 9. Laboratorio
-- ============================================================
INSERT INTO laboratorio.tipo_examen (
    id, codigo, nombre, tipo_muestra, unidad_predeterminada, rango_referencia_predeterminado, precio_referencia
) VALUES
('80000000-0000-0000-0000-000000000001', 'HEM-COM', 'Hemograma completo', 'Sangre', NULL, 'Según parámetros del informe', 50.00),
('80000000-0000-0000-0000-000000000002', 'GLU-AYU', 'Glucosa en ayunas', 'Sangre', 'mg/dL', '70-99 mg/dL', 35.00);

INSERT INTO laboratorio.orden_laboratorio (
    id, consulta_id, solicitado_por_medico_id, prioridad, estado, indicaciones, solicitado_en
) VALUES
('81000000-0000-0000-0000-000000000101', '73000000-0000-0000-0000-000000000101', '30000000-0000-0000-0000-000000000003', 'NORMAL', 'VALIDADA', 'Control general.', '2026-07-10 09:15:00-04');

INSERT INTO laboratorio.detalle_orden (
    id, orden_id, tipo_examen_id, estado
) VALUES
('82000000-0000-0000-0000-000000000101', '81000000-0000-0000-0000-000000000101', '80000000-0000-0000-0000-000000000001', 'VALIDADA');

INSERT INTO laboratorio.muestra (
    id, detalle_orden_id, codigo_muestra, tipo_muestra, estado,
    recolectada_en, recolectada_por, recibida_en, recibida_por
) VALUES
('82100000-0000-0000-0000-000000000101', '82000000-0000-0000-0000-000000000101', 'MUE-DEMO-0001', 'Sangre', 'PROCESADA',
 '2026-07-10 10:00:00-04', '50000000-0000-0000-0000-000000000004',
 '2026-07-10 10:10:00-04', '50000000-0000-0000-0000-000000000005');

INSERT INTO laboratorio.resultado (
    id, detalle_orden_id, estado, resultado_texto, es_anormal, registrado_por,
    registrado_en, validado_por, validado_en, observaciones
) VALUES
('83000000-0000-0000-0000-000000000101', '82000000-0000-0000-0000-000000000101', 'VALIDADO',
 'Parámetros dentro de rangos de referencia para el escenario de prueba.', false,
 '50000000-0000-0000-0000-000000000005', '2026-07-10 12:00:00-04',
 '50000000-0000-0000-0000-000000000005', '2026-07-10 12:05:00-04', 'Resultado ficticio.');

-- ============================================================
-- 10. Imagenología
-- ============================================================
INSERT INTO imagenologia.tipo_estudio (
    id, codigo, nombre, descripcion, precio_referencia
) VALUES
('84000000-0000-0000-0000-000000000001', 'RX-TORAX', 'Radiografía de tórax', 'Estudio radiográfico simple.', 80.00);

INSERT INTO imagenologia.orden_imagenologia (
    id, consulta_id, solicitado_por_medico_id, prioridad, estado, indicaciones, solicitado_en
) VALUES
('85000000-0000-0000-0000-000000000101', '73000000-0000-0000-0000-000000000101', '30000000-0000-0000-0000-000000000003', 'NORMAL', 'VALIDADA', 'Descartar complicación.', '2026-07-10 09:16:00-04');

INSERT INTO imagenologia.detalle_orden (
    id, orden_id, tipo_estudio_id, estado, region_anatomica
) VALUES
('85100000-0000-0000-0000-000000000101', '85000000-0000-0000-0000-000000000101', '84000000-0000-0000-0000-000000000001', 'VALIDADA', 'Tórax');

INSERT INTO imagenologia.resultado (
    id, detalle_orden_id, estado, informe, conclusion, registrado_por, registrado_en, validado_por, validado_en
) VALUES
('85200000-0000-0000-0000-000000000101', '85100000-0000-0000-0000-000000000101', 'VALIDADO',
 'Informe radiológico ficticio sin hallazgos agudos.', 'Sin alteraciones agudas en el escenario de prueba.',
 '50000000-0000-0000-0000-000000000005', '2026-07-10 13:00:00-04',
 '50000000-0000-0000-0000-000000000005', '2026-07-10 13:05:00-04');

-- ============================================================
-- 11. Farmacia, compra y stock
-- ============================================================
INSERT INTO farmacia.medicamento (
    id, codigo, nombre_generico, nombre_comercial, forma_farmaceutica, concentracion, unidad_medida,
    requiere_receta, stock_minimo
) VALUES
('90000000-0000-0000-0000-000000000001', 'MED-PAR-500', 'Paracetamol', 'Marca Demo A', 'Tableta', '500 mg', 'tableta', true, 20),
('90000000-0000-0000-0000-000000000002', 'MED-AMO-500', 'Amoxicilina', 'Marca Demo B', 'Cápsula', '500 mg', 'cápsula', true, 30),
('90000000-0000-0000-0000-000000000003', 'MED-SAL-500', 'Solución salina', 'Marca Demo C', 'Solución', '500 mL', 'frasco', false, 10);

INSERT INTO farmacia.proveedor (
    id, nit, razon_social, contacto_nombre, telefono, correo, direccion
) VALUES
('91000000-0000-0000-0000-000000000001', 'NIT-DEMO-001', 'Proveedor Farmacéutico de Prueba S.R.L.', 'Contacto Demostración', '73000001', 'proveedor@test.invalid', 'La Paz, dirección ficticia');

INSERT INTO farmacia.lote_medicamento (
    id, medicamento_id, proveedor_id, codigo_lote, fecha_vencimiento, costo_unitario, stock_actual
) VALUES
('92000000-0000-0000-0000-000000000001', '90000000-0000-0000-0000-000000000001', '91000000-0000-0000-0000-000000000001', 'LOTE-PAR-01', '2099-12-31', 0.25, 0),
('92000000-0000-0000-0000-000000000002', '90000000-0000-0000-0000-000000000002', '91000000-0000-0000-0000-000000000001', 'LOTE-AMO-01', '2099-10-31', 0.90, 0),
('92000000-0000-0000-0000-000000000003', '90000000-0000-0000-0000-000000000003', '91000000-0000-0000-0000-000000000001', 'LOTE-SAL-01', '2099-08-31', 8.50, 0);

INSERT INTO farmacia.compra (
    id, proveedor_id, numero_documento, fecha_compra, estado, registrada_por, observaciones
) VALUES
('93000000-0000-0000-0000-000000000001', '91000000-0000-0000-0000-000000000001', 'COMP-DEMO-001', '2026-07-01', 'BORRADOR', '50000000-0000-0000-0000-000000000006', 'Compra ficticia inicial.');

INSERT INTO farmacia.detalle_compra (
    id, compra_id, lote_id, cantidad, costo_unitario
) VALUES
('93100000-0000-0000-0000-000000000001', '93000000-0000-0000-0000-000000000001', '92000000-0000-0000-0000-000000000001', 200, 0.25),
('93100000-0000-0000-0000-000000000002', '93000000-0000-0000-0000-000000000001', '92000000-0000-0000-0000-000000000002', 120, 0.90),
('93100000-0000-0000-0000-000000000003', '93000000-0000-0000-0000-000000000001', '92000000-0000-0000-0000-000000000003', 30, 8.50);

SELECT farmacia.confirmar_compra(
    '93000000-0000-0000-0000-000000000001',
    '50000000-0000-0000-0000-000000000006'
);

-- ============================================================
-- 12. Receta y dispensación parcial
-- ============================================================
INSERT INTO farmacia.receta (
    id, consulta_id, medico_id, estado, emitida_en, valida_hasta, observaciones
) VALUES
('94000000-0000-0000-0000-000000000101', '73000000-0000-0000-0000-000000000101', '30000000-0000-0000-0000-000000000003', 'EMITIDA', clock_timestamp(), current_date + 30, 'Receta ficticia.');

INSERT INTO farmacia.detalle_receta (
    id, receta_id, medicamento_id, dosis, via_administracion, frecuencia, duracion_dias, cantidad_prescrita, indicaciones
) VALUES
('94100000-0000-0000-0000-000000000101', '94000000-0000-0000-0000-000000000101', '90000000-0000-0000-0000-000000000001', '500 mg', 'Oral', 'Cada 8 horas', 3, 9, 'Tomar después de alimentos.'),
('94100000-0000-0000-0000-000000000102', '94000000-0000-0000-0000-000000000101', '90000000-0000-0000-0000-000000000002', '500 mg', 'Oral', 'Cada 8 horas', 7, 21, 'Completar el tratamiento.');

INSERT INTO farmacia.dispensacion (
    id, receta_id, estado, dispensada_por, observaciones
) VALUES
('95000000-0000-0000-0000-000000000101', '94000000-0000-0000-0000-000000000101', 'BORRADOR', '50000000-0000-0000-0000-000000000006', 'Entrega parcial ficticia.');

INSERT INTO farmacia.detalle_dispensacion (
    id, dispensacion_id, detalle_receta_id, lote_id, cantidad
) VALUES
('95100000-0000-0000-0000-000000000101', '95000000-0000-0000-0000-000000000101', '94100000-0000-0000-0000-000000000101', '92000000-0000-0000-0000-000000000001', 9),
('95100000-0000-0000-0000-000000000102', '95000000-0000-0000-0000-000000000101', '94100000-0000-0000-0000-000000000102', '92000000-0000-0000-0000-000000000002', 7);

SELECT farmacia.confirmar_dispensacion(
    '95000000-0000-0000-0000-000000000101',
    '50000000-0000-0000-0000-000000000006'
);

-- ============================================================
-- 13. Servicios, prestaciones, factura y pago parcial
-- ============================================================
INSERT INTO facturacion.servicio (
    id, codigo, nombre, categoria, precio_base
) VALUES
('a0000000-0000-0000-0000-000000000001', 'SRV-CONS-GEN', 'Consulta de medicina general', 'CONSULTA', 100.00),
('a0000000-0000-0000-0000-000000000002', 'SRV-HEM-COM', 'Hemograma completo', 'LABORATORIO', 50.00),
('a0000000-0000-0000-0000-000000000003', 'SRV-RX-TORAX', 'Radiografía de tórax', 'IMAGENOLOGIA', 80.00),
('a0000000-0000-0000-0000-000000000004', 'SRV-DISP', 'Dispensación de medicamentos', 'FARMACIA', 20.00);

INSERT INTO facturacion.prestacion_servicio (
    id, servicio_id, paciente_id, episodio_id, origen, consulta_id, descripcion,
    fecha_prestacion, cantidad, precio_unitario, estado, registrada_por
) VALUES
(
    'a1000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000101',
    '71000000-0000-0000-0000-000000000101',
    'CONSULTA',
    '73000000-0000-0000-0000-000000000101',
    'Consulta médica general',
    '2026-07-10 09:25:00-04',
    1, 100.00, 'REALIZADA',
    '50000000-0000-0000-0000-000000000007'
);

INSERT INTO facturacion.prestacion_servicio (
    id, servicio_id, paciente_id, episodio_id, origen, detalle_laboratorio_id, descripcion,
    fecha_prestacion, cantidad, precio_unitario, estado, registrada_por
) VALUES
(
    'a1000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000002',
    '40000000-0000-0000-0000-000000000101',
    '71000000-0000-0000-0000-000000000101',
    'LABORATORIO',
    '82000000-0000-0000-0000-000000000101',
    'Hemograma completo',
    '2026-07-10 12:05:00-04',
    1, 50.00, 'REALIZADA',
    '50000000-0000-0000-0000-000000000007'
);

INSERT INTO facturacion.prestacion_servicio (
    id, servicio_id, paciente_id, episodio_id, origen, detalle_imagenologia_id, descripcion,
    fecha_prestacion, cantidad, precio_unitario, estado, registrada_por
) VALUES
(
    'a1000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000003',
    '40000000-0000-0000-0000-000000000101',
    '71000000-0000-0000-0000-000000000101',
    'IMAGENOLOGIA',
    '85100000-0000-0000-0000-000000000101',
    'Radiografía de tórax',
    '2026-07-10 13:05:00-04',
    1, 80.00, 'REALIZADA',
    '50000000-0000-0000-0000-000000000007'
);

INSERT INTO facturacion.prestacion_servicio (
    id, servicio_id, paciente_id, episodio_id, origen, dispensacion_id, descripcion,
    fecha_prestacion, cantidad, precio_unitario, estado, registrada_por
) VALUES
(
    'a1000000-0000-0000-0000-000000000004',
    'a0000000-0000-0000-0000-000000000004',
    '40000000-0000-0000-0000-000000000101',
    '71000000-0000-0000-0000-000000000101',
    'FARMACIA',
    '95000000-0000-0000-0000-000000000101',
    'Dispensación parcial de medicamentos',
    '2026-07-10 14:00:00-04',
    1, 20.00, 'REALIZADA',
    '50000000-0000-0000-0000-000000000007'
);

INSERT INTO facturacion.factura (
    id, paciente_id, estado, emitida_por, observaciones
) VALUES
('a2000000-0000-0000-0000-000000000101', '40000000-0000-0000-0000-000000000101', 'BORRADOR', '50000000-0000-0000-0000-000000000007', 'Factura ficticia de atención integrada.');

INSERT INTO facturacion.detalle_factura (
    id, factura_id, prestacion_id, descripcion, cantidad, precio_unitario, descuento
) VALUES
('a2100000-0000-0000-0000-000000000101', 'a2000000-0000-0000-0000-000000000101', 'a1000000-0000-0000-0000-000000000001', 'Consulta médica general', 1, 100.00, 0),
('a2100000-0000-0000-0000-000000000102', 'a2000000-0000-0000-0000-000000000101', 'a1000000-0000-0000-0000-000000000002', 'Hemograma completo', 1, 50.00, 0),
('a2100000-0000-0000-0000-000000000103', 'a2000000-0000-0000-0000-000000000101', 'a1000000-0000-0000-0000-000000000003', 'Radiografía de tórax', 1, 80.00, 0),
('a2100000-0000-0000-0000-000000000104', 'a2000000-0000-0000-0000-000000000101', 'a1000000-0000-0000-0000-000000000004', 'Dispensación de medicamentos', 1, 20.00, 0);

SELECT facturacion.emitir_factura('a2000000-0000-0000-0000-000000000101');

INSERT INTO facturacion.pago (
    id, factura_id, fecha_pago, monto, metodo, referencia, registrado_por
) VALUES
('a3000000-0000-0000-0000-000000000101', 'a2000000-0000-0000-0000-000000000101', '2026-07-10 14:10:00-04', 100.00, 'QR', 'QR-DEMO-001', '50000000-0000-0000-0000-000000000007');

RESET ROLE;
COMMIT;
