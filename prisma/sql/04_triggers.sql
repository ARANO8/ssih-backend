-- 04_triggers.sql
-- Ejecutar conectado a siih_hospital como superusuario (postgres)
-- Triggers del sistema SIIH

BEGIN;

-- ============================================================
-- Triggers de validación clínica
-- ============================================================

CREATE TRIGGER trg_consulta_validar
BEFORE INSERT OR UPDATE ON clinica.consulta
FOR EACH ROW EXECUTE FUNCTION clinica.fn_validar_consulta();

CREATE TRIGGER trg_consulta_sincronizar_estado
AFTER INSERT OR UPDATE OF estado ON clinica.consulta
FOR EACH ROW EXECUTE FUNCTION clinica.fn_sincronizar_estado_consulta();

-- ============================================================
-- Triggers de inventario
-- ============================================================

CREATE TRIGGER trg_compra_recalcular
AFTER INSERT OR UPDATE OR DELETE ON farmacia.detalle_compra
FOR EACH ROW EXECUTE FUNCTION farmacia.fn_recalcular_compra();

CREATE TRIGGER trg_detalle_compra_solo_borrador
BEFORE INSERT OR UPDATE OR DELETE ON farmacia.detalle_compra
FOR EACH ROW EXECUTE FUNCTION farmacia.fn_validar_detalle_compra_borrador();

CREATE TRIGGER trg_detalle_dispensacion_validar
BEFORE INSERT OR UPDATE OR DELETE ON farmacia.detalle_dispensacion
FOR EACH ROW EXECUTE FUNCTION farmacia.fn_validar_detalle_dispensacion();

CREATE TRIGGER trg_movimiento_aplicar
AFTER INSERT ON farmacia.detalle_movimiento
FOR EACH ROW EXECUTE FUNCTION farmacia.fn_aplicar_movimiento();

CREATE TRIGGER trg_movimiento_inmutable
BEFORE UPDATE OR DELETE ON farmacia.movimiento_inventario
FOR EACH ROW EXECUTE FUNCTION farmacia.fn_bloquear_cambio_movimiento();

CREATE TRIGGER trg_detalle_movimiento_inmutable
BEFORE UPDATE OR DELETE ON farmacia.detalle_movimiento
FOR EACH ROW EXECUTE FUNCTION farmacia.fn_bloquear_cambio_movimiento();

-- ============================================================
-- Triggers de facturación
-- ============================================================

CREATE TRIGGER trg_prestacion_validar
BEFORE INSERT OR UPDATE ON facturacion.prestacion_servicio
FOR EACH ROW EXECUTE FUNCTION facturacion.fn_validar_prestacion();

CREATE TRIGGER trg_detalle_factura_validar
BEFORE INSERT OR UPDATE OR DELETE ON facturacion.detalle_factura
FOR EACH ROW EXECUTE FUNCTION facturacion.fn_validar_detalle_factura_borrador();

CREATE TRIGGER trg_factura_recalcular
AFTER INSERT OR UPDATE OR DELETE ON facturacion.detalle_factura
FOR EACH ROW EXECUTE FUNCTION facturacion.fn_recalcular_factura();

CREATE TRIGGER trg_pago_validar
BEFORE INSERT OR UPDATE OF monto, factura_id ON facturacion.pago
FOR EACH ROW
WHEN (NEW.anulado = false)
EXECUTE FUNCTION facturacion.fn_validar_pago();

CREATE TRIGGER trg_pago_actualizar_estado
AFTER INSERT OR UPDATE OF anulado, monto OR DELETE ON facturacion.pago
FOR EACH ROW EXECUTE FUNCTION facturacion.fn_actualizar_estado_pago();

-- ============================================================
-- Triggers de fecha de modificación
-- ============================================================

DO $$
DECLARE
    v_tabla text;
BEGIN
    FOREACH v_tabla IN ARRAY ARRAY[
        'seguridad.rol',
        'maestros.persona',
        'maestros.paciente',
        'maestros.empleado',
        'maestros.especialidad',
        'maestros.medico',
        'maestros.consultorio',
        'maestros.horario_medico',
        'seguridad.usuario',
        'clinica.historia_clinica',
        'clinica.antecedente_clinico',
        'clinica.episodio_atencion',
        'clinica.cita',
        'clinica.consulta',
        'clinica.catalogo_diagnostico',
        'laboratorio.tipo_examen',
        'laboratorio.orden_laboratorio',
        'laboratorio.detalle_orden',
        'laboratorio.muestra',
        'laboratorio.resultado',
        'imagenologia.tipo_estudio',
        'imagenologia.orden_imagenologia',
        'imagenologia.detalle_orden',
        'imagenologia.resultado',
        'farmacia.medicamento',
        'farmacia.proveedor',
        'farmacia.lote_medicamento',
        'farmacia.compra',
        'farmacia.receta',
        'farmacia.dispensacion',
        'facturacion.servicio',
        'facturacion.prestacion_servicio',
        'facturacion.factura'
    ]
    LOOP
        EXECUTE format(
            'CREATE TRIGGER trg_%s_modificado BEFORE UPDATE ON %s FOR EACH ROW EXECUTE FUNCTION auditoria.fn_actualizar_modificado_en()',
            replace(v_tabla, '.', '_'),
            v_tabla
        );
    END LOOP;
END
$$;

-- ============================================================
-- Triggers de auditoría
-- ============================================================

DO $$
DECLARE
    v_tabla text;
BEGIN
    FOREACH v_tabla IN ARRAY ARRAY[
        'seguridad.usuario',
        'seguridad.usuario_rol',
        'maestros.persona',
        'maestros.paciente',
        'clinica.historia_clinica',
        'clinica.antecedente_clinico',
        'clinica.episodio_atencion',
        'clinica.cita',
        'clinica.consulta',
        'clinica.signo_vital',
        'clinica.consulta_diagnostico',
        'laboratorio.orden_laboratorio',
        'laboratorio.resultado',
        'imagenologia.orden_imagenologia',
        'imagenologia.resultado',
        'farmacia.compra',
        'farmacia.receta',
        'farmacia.dispensacion',
        'farmacia.movimiento_inventario',
        'farmacia.detalle_movimiento',
        'facturacion.prestacion_servicio',
        'facturacion.factura',
        'facturacion.pago'
    ]
    LOOP
        EXECUTE format(
            'CREATE TRIGGER trg_%s_auditoria AFTER INSERT OR UPDATE OR DELETE ON %s FOR EACH ROW EXECUTE FUNCTION auditoria.fn_registrar_cambio()',
            replace(v_tabla, '.', '_'),
            v_tabla
        );
    END LOOP;
END
$$;

COMMIT;
