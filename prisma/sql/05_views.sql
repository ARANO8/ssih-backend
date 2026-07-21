-- 05_views.sql
-- Ejecutar conectado a siih_hospital como superusuario (postgres)
-- Vistas de operación y reportes del sistema SIIH

BEGIN;

-- ============================================================
-- Vista: Agenda médica
-- ============================================================
CREATE OR REPLACE VIEW clinica.vw_agenda_medica AS
SELECT
    c.id AS cita_id,
    c.fecha_hora_inicio,
    c.fecha_hora_fin,
    c.estado,
    c.motivo,
    p.numero_historia,
    per_paciente.numero_documento,
    per_paciente.nombres || ' ' || per_paciente.apellidos AS paciente,
    per_medico.nombres || ' ' || per_medico.apellidos AS medico,
    e.nombre AS especialidad,
    co.codigo AS consultorio
FROM clinica.cita c
JOIN maestros.paciente p ON p.id = c.paciente_id
JOIN maestros.persona per_paciente ON per_paciente.id = p.persona_id
JOIN maestros.medico m ON m.id = c.medico_id
JOIN maestros.empleado emp ON emp.id = m.empleado_id
JOIN maestros.persona per_medico ON per_medico.id = emp.persona_id
JOIN maestros.especialidad e ON e.id = c.especialidad_id
LEFT JOIN maestros.consultorio co ON co.id = c.consultorio_id;

-- ============================================================
-- Vista: Resumen de historia clínica
-- ============================================================
CREATE OR REPLACE VIEW clinica.vw_historia_clinica_resumen AS
SELECT
    hc.id AS historia_clinica_id,
    p.id AS paciente_id,
    p.numero_historia,
    per.numero_documento,
    per.nombres || ' ' || per.apellidos AS paciente,
    per.fecha_nacimiento,
    p.grupo_sanguineo,
    p.factor_rh,
    hc.fecha_apertura,
    COUNT(DISTINCT c.id) AS total_consultas,
    MAX(c.fecha_inicio) AS ultima_consulta
FROM clinica.historia_clinica hc
JOIN maestros.paciente p ON p.id = hc.paciente_id
JOIN maestros.persona per ON per.id = p.persona_id
LEFT JOIN clinica.consulta c ON c.historia_clinica_id = hc.id AND c.estado <> 'ANULADA'
GROUP BY hc.id, p.id, p.numero_historia, per.numero_documento, per.nombres, per.apellidos,
         per.fecha_nacimiento, p.grupo_sanguineo, p.factor_rh, hc.fecha_apertura;

-- ============================================================
-- Vista: Órdenes de laboratorio pendientes
-- ============================================================
CREATE OR REPLACE VIEW laboratorio.vw_ordenes_pendientes AS
SELECT
    o.id AS orden_id,
    o.numero_orden,
    o.prioridad,
    o.estado,
    o.solicitado_en,
    p.numero_historia,
    per.nombres || ' ' || per.apellidos AS paciente,
    COUNT(d.id) AS examenes_solicitados,
    COUNT(d.id) FILTER (WHERE d.estado IN ('COMPLETADA', 'VALIDADA')) AS examenes_completados
FROM laboratorio.orden_laboratorio o
JOIN clinica.consulta c ON c.id = o.consulta_id
JOIN clinica.episodio_atencion ep ON ep.id = c.episodio_id
JOIN maestros.paciente p ON p.id = ep.paciente_id
JOIN maestros.persona per ON per.id = p.persona_id
JOIN laboratorio.detalle_orden d ON d.orden_id = o.id
WHERE o.estado NOT IN ('VALIDADA', 'CANCELADA')
GROUP BY o.id, o.numero_orden, o.prioridad, o.estado, o.solicitado_en,
         p.numero_historia, per.nombres, per.apellidos;

-- ============================================================
-- Vista: Stock de medicamentos
-- ============================================================
CREATE OR REPLACE VIEW farmacia.vw_stock_medicamentos AS
SELECT
    m.id AS medicamento_id,
    m.codigo,
    m.nombre_generico,
    m.nombre_comercial,
    m.forma_farmaceutica,
    m.concentracion,
    m.unidad_medida,
    m.stock_minimo,
    COALESCE(SUM(l.stock_actual) FILTER (WHERE l.activo AND l.fecha_vencimiento >= current_date), 0) AS stock_disponible,
    MIN(l.fecha_vencimiento) FILTER (WHERE l.activo AND l.stock_actual > 0 AND l.fecha_vencimiento >= current_date) AS proximo_vencimiento,
    COALESCE(SUM(l.stock_actual) FILTER (WHERE l.fecha_vencimiento < current_date), 0) AS stock_vencido
FROM farmacia.medicamento m
LEFT JOIN farmacia.lote_medicamento l ON l.medicamento_id = m.id
WHERE m.activo = true
GROUP BY m.id, m.codigo, m.nombre_generico, m.nombre_comercial,
         m.forma_farmaceutica, m.concentracion, m.unidad_medida, m.stock_minimo;

-- ============================================================
-- Vista: Cuentas por cobrar
-- ============================================================
CREATE OR REPLACE VIEW facturacion.vw_cuentas_por_cobrar AS
SELECT
    f.id AS factura_id,
    f.numero_factura,
    f.fecha_emision,
    f.estado,
    p.numero_historia,
    per.nombres || ' ' || per.apellidos AS paciente,
    f.total,
    COALESCE(SUM(pg.monto) FILTER (WHERE pg.anulado = false), 0) AS pagado,
    f.total - COALESCE(SUM(pg.monto) FILTER (WHERE pg.anulado = false), 0) AS saldo
FROM facturacion.factura f
JOIN maestros.paciente p ON p.id = f.paciente_id
JOIN maestros.persona per ON per.id = p.persona_id
LEFT JOIN facturacion.pago pg ON pg.factura_id = f.id
WHERE f.estado IN ('EMITIDA', 'PARCIAL')
GROUP BY f.id, f.numero_factura, f.fecha_emision, f.estado,
         p.numero_historia, per.nombres, per.apellidos, f.total;

-- ============================================================
-- Vista: KPI diario
-- ============================================================
CREATE OR REPLACE VIEW clinica.vw_kpi_diario AS
SELECT
    d.fecha,
    d.citas_programadas,
    d.citas_atendidas,
    d.citas_canceladas,
    CASE
        WHEN d.citas_programadas = 0 THEN 0
        ELSE round((d.citas_atendidas::numeric / d.citas_programadas) * 100, 2)
    END AS porcentaje_cumplimiento
FROM (
    SELECT
        fecha_hora_inicio::date AS fecha,
        COUNT(*) FILTER (WHERE estado IN ('PROGRAMADA', 'CONFIRMADA', 'EN_ATENCION', 'ATENDIDA', 'NO_ASISTIO')) AS citas_programadas,
        COUNT(*) FILTER (WHERE estado = 'ATENDIDA') AS citas_atendidas,
        COUNT(*) FILTER (WHERE estado = 'CANCELADA') AS citas_canceladas
    FROM clinica.cita
    GROUP BY fecha_hora_inicio::date
) d;

COMMIT;
