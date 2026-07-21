-- 03_functions.sql
-- Ejecutar conectado a siih_hospital como superusuario (postgres)
-- Funciones stored del sistema SIIH

BEGIN;

-- ============================================================
-- Función: actualizar modificado_en
-- ============================================================
CREATE OR REPLACE FUNCTION auditoria.fn_actualizar_modificado_en()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.modificado_en := clock_timestamp();
    RETURN NEW;
END;
$$;

-- ============================================================
-- Función: registrar cambio de auditoría
-- ============================================================
CREATE OR REPLACE FUNCTION auditoria.fn_registrar_cambio()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auditoria, seguridad, public
AS $$
DECLARE
    v_usuario uuid;
    v_usuario_texto text;
    v_registro_id text;
    v_anterior jsonb;
    v_nuevo jsonb;
BEGIN
    v_usuario_texto := current_setting('app.usuario_id', true);
    IF v_usuario_texto IS NOT NULL AND v_usuario_texto <> '' THEN
        BEGIN
            v_usuario := v_usuario_texto::uuid;
        EXCEPTION WHEN invalid_text_representation THEN
            v_usuario := NULL;
        END;
    END IF;

    IF TG_OP = 'INSERT' THEN
        v_nuevo := to_jsonb(NEW);
        IF TG_TABLE_SCHEMA = 'seguridad' AND TG_TABLE_NAME = 'usuario' THEN
            v_nuevo := v_nuevo - 'contrasena_hash';
        END IF;
        v_registro_id := COALESCE(v_nuevo->>'id', v_nuevo->>'numero_historia', v_nuevo->>'numero_factura');
        INSERT INTO auditoria.evento (
            usuario_id, direccion_ip, esquema, tabla, operacion, registro_id, datos_nuevos
        ) VALUES (
            v_usuario, inet_client_addr(), TG_TABLE_SCHEMA, TG_TABLE_NAME, 'I', v_registro_id, v_nuevo
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        v_anterior := to_jsonb(OLD);
        v_nuevo := to_jsonb(NEW);
        IF TG_TABLE_SCHEMA = 'seguridad' AND TG_TABLE_NAME = 'usuario' THEN
            v_anterior := v_anterior - 'contrasena_hash';
            v_nuevo := v_nuevo - 'contrasena_hash';
        END IF;
        v_registro_id := COALESCE(v_nuevo->>'id', v_nuevo->>'numero_historia', v_nuevo->>'numero_factura');
        INSERT INTO auditoria.evento (
            usuario_id, direccion_ip, esquema, tabla, operacion, registro_id, datos_anteriores, datos_nuevos
        ) VALUES (
            v_usuario, inet_client_addr(), TG_TABLE_SCHEMA, TG_TABLE_NAME, 'U', v_registro_id, v_anterior, v_nuevo
        );
        RETURN NEW;
    ELSE
        v_anterior := to_jsonb(OLD);
        IF TG_TABLE_SCHEMA = 'seguridad' AND TG_TABLE_NAME = 'usuario' THEN
            v_anterior := v_anterior - 'contrasena_hash';
        END IF;
        v_registro_id := COALESCE(v_anterior->>'id', v_anterior->>'numero_historia', v_anterior->>'numero_factura');
        INSERT INTO auditoria.evento (
            usuario_id, direccion_ip, esquema, tabla, operacion, registro_id, datos_anteriores
        ) VALUES (
            v_usuario, inet_client_addr(), TG_TABLE_SCHEMA, TG_TABLE_NAME, 'D', v_registro_id, v_anterior
        );
        RETURN OLD;
    END IF;
END;
$$;

REVOKE ALL ON FUNCTION auditoria.fn_registrar_cambio() FROM PUBLIC;

-- ============================================================
-- Función: validar consulta
-- ============================================================
CREATE OR REPLACE FUNCTION clinica.fn_validar_consulta()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    v_paciente_episodio uuid;
    v_tipo_episodio clinica.tipo_episodio_enum;
    v_paciente_historia uuid;
    v_paciente_cita uuid;
    v_medico_cita uuid;
    v_estado_cita clinica.estado_cita_enum;
BEGIN
    SELECT paciente_id, tipo
    INTO v_paciente_episodio, v_tipo_episodio
    FROM clinica.episodio_atencion
    WHERE id = NEW.episodio_id;

    SELECT paciente_id
    INTO v_paciente_historia
    FROM clinica.historia_clinica
    WHERE id = NEW.historia_clinica_id;

    IF v_paciente_episodio IS DISTINCT FROM v_paciente_historia THEN
        RAISE EXCEPTION 'La historia clínica no pertenece al paciente del episodio';
    END IF;

    IF v_tipo_episodio = 'CONSULTA_EXTERNA' AND NEW.cita_id IS NULL THEN
        RAISE EXCEPTION 'Una consulta externa debe estar asociada a una cita';
    END IF;

    IF NEW.cita_id IS NOT NULL THEN
        SELECT paciente_id, medico_id, estado
        INTO v_paciente_cita, v_medico_cita, v_estado_cita
        FROM clinica.cita
        WHERE id = NEW.cita_id;

        IF v_paciente_cita IS DISTINCT FROM v_paciente_episodio THEN
            RAISE EXCEPTION 'La cita no pertenece al paciente del episodio';
        END IF;

        IF v_medico_cita IS DISTINCT FROM NEW.medico_id THEN
            RAISE EXCEPTION 'El médico de la consulta no coincide con el médico de la cita';
        END IF;

        IF v_estado_cita IN ('CANCELADA', 'NO_ASISTIO') THEN
            RAISE EXCEPTION 'No se puede registrar una consulta para una cita cancelada o no asistida';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

-- ============================================================
-- Función: sincronizar estado de consulta
-- ============================================================
CREATE OR REPLACE FUNCTION clinica.fn_sincronizar_estado_consulta()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.estado = 'ABIERTA' THEN
        UPDATE clinica.episodio_atencion
        SET estado = 'EN_CURSO', modificado_en = clock_timestamp()
        WHERE id = NEW.episodio_id AND estado = 'ABIERTO';

        IF NEW.cita_id IS NOT NULL THEN
            UPDATE clinica.cita
            SET estado = 'EN_ATENCION', modificado_en = clock_timestamp()
            WHERE id = NEW.cita_id AND estado IN ('PROGRAMADA', 'CONFIRMADA');
        END IF;
    ELSIF NEW.estado = 'CERRADA' THEN
        UPDATE clinica.episodio_atencion
        SET estado = 'FINALIZADO',
            fecha_fin = COALESCE(NEW.fecha_fin, clock_timestamp()),
            modificado_en = clock_timestamp()
        WHERE id = NEW.episodio_id;

        IF NEW.cita_id IS NOT NULL THEN
            UPDATE clinica.cita
            SET estado = 'ATENDIDA', modificado_en = clock_timestamp()
            WHERE id = NEW.cita_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

-- ============================================================
-- Función: recalcular compra
-- ============================================================
CREATE OR REPLACE FUNCTION farmacia.fn_recalcular_compra()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    v_compra_id uuid;
BEGIN
    v_compra_id := COALESCE(NEW.compra_id, OLD.compra_id);

    UPDATE farmacia.compra c
    SET subtotal = COALESCE((
            SELECT SUM(dc.subtotal)
            FROM farmacia.detalle_compra dc
            WHERE dc.compra_id = v_compra_id
        ), 0),
        total = GREATEST(
            COALESCE((
                SELECT SUM(dc.subtotal)
                FROM farmacia.detalle_compra dc
                WHERE dc.compra_id = v_compra_id
            ), 0) - c.descuento,
            0
        ),
        modificado_en = clock_timestamp()
    WHERE c.id = v_compra_id;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$;

-- ============================================================
-- Función: validar detalle compra solo borrador
-- ============================================================
CREATE OR REPLACE FUNCTION farmacia.fn_validar_detalle_compra_borrador()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    v_estado farmacia.estado_compra_enum;
BEGIN
    SELECT estado INTO v_estado
    FROM farmacia.compra
    WHERE id = COALESCE(NEW.compra_id, OLD.compra_id)
    FOR UPDATE;

    IF v_estado <> 'BORRADOR' THEN
        RAISE EXCEPTION 'Solo se pueden modificar detalles de una compra en estado BORRADOR';
    END IF;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$;

-- ============================================================
-- Función: validar detalle dispensación
-- ============================================================
CREATE OR REPLACE FUNCTION farmacia.fn_validar_detalle_dispensacion()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    v_estado farmacia.estado_dispensacion_enum;
    v_medicamento_receta uuid;
    v_medicamento_lote uuid;
BEGIN
    SELECT estado INTO v_estado
    FROM farmacia.dispensacion
    WHERE id = COALESCE(NEW.dispensacion_id, OLD.dispensacion_id)
    FOR UPDATE;

    IF v_estado <> 'BORRADOR' THEN
        RAISE EXCEPTION 'Solo se pueden modificar detalles de una dispensación en estado BORRADOR';
    END IF;

    IF TG_OP <> 'DELETE' THEN
        SELECT medicamento_id INTO v_medicamento_receta
        FROM farmacia.detalle_receta
        WHERE id = NEW.detalle_receta_id;

        SELECT medicamento_id INTO v_medicamento_lote
        FROM farmacia.lote_medicamento
        WHERE id = NEW.lote_id;

        IF v_medicamento_receta IS DISTINCT FROM v_medicamento_lote THEN
            RAISE EXCEPTION 'El lote seleccionado no corresponde al medicamento prescrito';
        END IF;
    END IF;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$;

-- ============================================================
-- Función: aplicar movimiento de inventario
-- ============================================================
CREATE OR REPLACE FUNCTION farmacia.fn_aplicar_movimiento()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    v_tipo farmacia.tipo_movimiento_enum;
    v_efecto smallint;
    v_stock numeric(12,3);
    v_vencimiento date;
    v_activo boolean;
BEGIN
    SELECT tipo INTO v_tipo
    FROM farmacia.movimiento_inventario
    WHERE id = NEW.movimiento_id;

    v_efecto := CASE
        WHEN v_tipo IN ('ENTRADA_COMPRA', 'AJUSTE_ENTRADA', 'DEVOLUCION') THEN 1
        ELSE -1
    END;

    SELECT stock_actual, fecha_vencimiento, activo
    INTO v_stock, v_vencimiento, v_activo
    FROM farmacia.lote_medicamento
    WHERE id = NEW.lote_id
    FOR UPDATE;

    IF v_efecto = -1 THEN
        IF v_activo = false THEN
            RAISE EXCEPTION 'No se puede retirar stock de un lote inactivo';
        END IF;
        IF v_vencimiento < current_date THEN
            RAISE EXCEPTION 'No se puede entregar medicamento vencido. Lote: %', NEW.lote_id;
        END IF;
        IF v_stock < NEW.cantidad THEN
            RAISE EXCEPTION 'Stock insuficiente. Disponible: %, solicitado: %', v_stock, NEW.cantidad;
        END IF;
    END IF;

    UPDATE farmacia.lote_medicamento
    SET stock_actual = stock_actual + (v_efecto * NEW.cantidad),
        modificado_en = clock_timestamp()
    WHERE id = NEW.lote_id;

    RETURN NEW;
END;
$$;

-- ============================================================
-- Función: bloquear cambio de movimiento
-- ============================================================
CREATE OR REPLACE FUNCTION farmacia.fn_bloquear_cambio_movimiento()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE EXCEPTION 'Los movimientos de inventario confirmados son inmutables; registre un movimiento compensatorio';
END;
$$;

-- ============================================================
-- Función: confirmar compra
-- ============================================================
CREATE OR REPLACE FUNCTION farmacia.confirmar_compra(p_compra_id uuid, p_usuario_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = farmacia, seguridad, public
AS $$
DECLARE
    v_estado farmacia.estado_compra_enum;
    v_movimiento_id uuid;
    v_cantidad_detalles integer;
BEGIN
    SELECT estado INTO v_estado
    FROM farmacia.compra
    WHERE id = p_compra_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Compra inexistente';
    END IF;

    IF v_estado <> 'BORRADOR' THEN
        RAISE EXCEPTION 'La compra debe estar en estado BORRADOR';
    END IF;

    SELECT COUNT(*) INTO v_cantidad_detalles
    FROM farmacia.detalle_compra
    WHERE compra_id = p_compra_id;

    IF v_cantidad_detalles = 0 THEN
        RAISE EXCEPTION 'La compra no tiene detalles';
    END IF;

    INSERT INTO farmacia.movimiento_inventario (tipo, usuario_id, compra_id, motivo)
    VALUES ('ENTRADA_COMPRA', p_usuario_id, p_compra_id, 'Recepción de compra')
    RETURNING id INTO v_movimiento_id;

    INSERT INTO farmacia.detalle_movimiento (movimiento_id, lote_id, cantidad, costo_unitario)
    SELECT v_movimiento_id, lote_id, cantidad, costo_unitario
    FROM farmacia.detalle_compra
    WHERE compra_id = p_compra_id;

    UPDATE farmacia.compra
    SET estado = 'RECIBIDA', modificado_en = clock_timestamp()
    WHERE id = p_compra_id;

    RETURN v_movimiento_id;
END;
$$;

-- ============================================================
-- Función: confirmar dispensación
-- ============================================================
CREATE OR REPLACE FUNCTION farmacia.confirmar_dispensacion(p_dispensacion_id uuid, p_usuario_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = farmacia, seguridad, public
AS $$
DECLARE
    v_estado farmacia.estado_dispensacion_enum;
    v_receta_id uuid;
    v_valida_hasta date;
    v_estado_receta farmacia.estado_receta_enum;
    v_movimiento_id uuid;
    v_linea record;
    v_ya_dispensado numeric(12,3);
BEGIN
    SELECT d.estado, d.receta_id, r.valida_hasta, r.estado
    INTO v_estado, v_receta_id, v_valida_hasta, v_estado_receta
    FROM farmacia.dispensacion d
    JOIN farmacia.receta r ON r.id = d.receta_id
    WHERE d.id = p_dispensacion_id
    FOR UPDATE OF d, r;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Dispensación inexistente';
    END IF;

    IF v_estado <> 'BORRADOR' THEN
        RAISE EXCEPTION 'La dispensación debe estar en estado BORRADOR';
    END IF;

    IF v_estado_receta IN ('ANULADA', 'DISPENSADA', 'VENCIDA') THEN
        RAISE EXCEPTION 'La receta no está disponible para dispensación';
    END IF;

    IF v_valida_hasta < current_date THEN
        UPDATE farmacia.receta SET estado = 'VENCIDA', modificado_en = clock_timestamp()
        WHERE id = v_receta_id;
        RAISE EXCEPTION 'La receta está vencida';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM farmacia.detalle_dispensacion
        WHERE dispensacion_id = p_dispensacion_id
    ) THEN
        RAISE EXCEPTION 'La dispensación no tiene detalles';
    END IF;

    FOR v_linea IN
        SELECT dd.detalle_receta_id, SUM(dd.cantidad) AS cantidad_actual, dr.cantidad_prescrita
        FROM farmacia.detalle_dispensacion dd
        JOIN farmacia.detalle_receta dr ON dr.id = dd.detalle_receta_id
        WHERE dd.dispensacion_id = p_dispensacion_id
        GROUP BY dd.detalle_receta_id, dr.cantidad_prescrita
    LOOP
        SELECT COALESCE(SUM(dd2.cantidad), 0)
        INTO v_ya_dispensado
        FROM farmacia.detalle_dispensacion dd2
        JOIN farmacia.dispensacion d2 ON d2.id = dd2.dispensacion_id
        WHERE dd2.detalle_receta_id = v_linea.detalle_receta_id
          AND d2.estado = 'ENTREGADA';

        IF v_ya_dispensado + v_linea.cantidad_actual > v_linea.cantidad_prescrita THEN
            RAISE EXCEPTION 'La cantidad dispensada supera la cantidad prescrita';
        END IF;
    END LOOP;

    INSERT INTO farmacia.movimiento_inventario (tipo, usuario_id, dispensacion_id, motivo)
    VALUES ('SALIDA_DISPENSACION', p_usuario_id, p_dispensacion_id, 'Entrega de receta')
    RETURNING id INTO v_movimiento_id;

    INSERT INTO farmacia.detalle_movimiento (movimiento_id, lote_id, cantidad)
    SELECT v_movimiento_id, lote_id, SUM(cantidad)
    FROM farmacia.detalle_dispensacion
    WHERE dispensacion_id = p_dispensacion_id
    GROUP BY lote_id;

    UPDATE farmacia.dispensacion
    SET estado = 'ENTREGADA',
        dispensada_por = p_usuario_id,
        dispensada_en = clock_timestamp(),
        modificado_en = clock_timestamp()
    WHERE id = p_dispensacion_id;

    UPDATE farmacia.receta
    SET estado = CASE
            WHEN NOT EXISTS (
                SELECT 1
                FROM farmacia.detalle_receta dr
                WHERE dr.receta_id = v_receta_id
                  AND COALESCE((
                        SELECT SUM(dd.cantidad)
                        FROM farmacia.detalle_dispensacion dd
                        JOIN farmacia.dispensacion d ON d.id = dd.dispensacion_id
                        WHERE dd.detalle_receta_id = dr.id
                          AND d.estado = 'ENTREGADA'
                    ), 0) < dr.cantidad_prescrita
            )
            THEN 'DISPENSADA'::farmacia.estado_receta_enum
            ELSE 'PARCIAL'::farmacia.estado_receta_enum
        END,
        modificado_en = clock_timestamp()
    WHERE id = v_receta_id;

    RETURN v_movimiento_id;
END;
$$;

-- ============================================================
-- Función: validar prestación
-- ============================================================
CREATE OR REPLACE FUNCTION facturacion.fn_validar_prestacion()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    v_paciente_origen uuid;
    v_categoria facturacion.categoria_servicio_enum;
BEGIN
    SELECT categoria INTO v_categoria
    FROM facturacion.servicio
    WHERE id = NEW.servicio_id;

    IF NEW.origen <> 'OTRO' AND v_categoria::text <> NEW.origen::text THEN
        RAISE EXCEPTION 'La categoría del servicio no coincide con el origen de la prestación';
    END IF;

    CASE NEW.origen
        WHEN 'CONSULTA' THEN
            SELECT ep.paciente_id INTO v_paciente_origen
            FROM clinica.consulta c
            JOIN clinica.episodio_atencion ep ON ep.id = c.episodio_id
            WHERE c.id = NEW.consulta_id;
        WHEN 'LABORATORIO' THEN
            SELECT ep.paciente_id INTO v_paciente_origen
            FROM laboratorio.detalle_orden d
            JOIN laboratorio.orden_laboratorio o ON o.id = d.orden_id
            JOIN clinica.consulta c ON c.id = o.consulta_id
            JOIN clinica.episodio_atencion ep ON ep.id = c.episodio_id
            WHERE d.id = NEW.detalle_laboratorio_id;
        WHEN 'IMAGENOLOGIA' THEN
            SELECT ep.paciente_id INTO v_paciente_origen
            FROM imagenologia.detalle_orden d
            JOIN imagenologia.orden_imagenologia o ON o.id = d.orden_id
            JOIN clinica.consulta c ON c.id = o.consulta_id
            JOIN clinica.episodio_atencion ep ON ep.id = c.episodio_id
            WHERE d.id = NEW.detalle_imagenologia_id;
        WHEN 'FARMACIA' THEN
            SELECT ep.paciente_id INTO v_paciente_origen
            FROM farmacia.dispensacion d
            JOIN farmacia.receta r ON r.id = d.receta_id
            JOIN clinica.consulta c ON c.id = r.consulta_id
            JOIN clinica.episodio_atencion ep ON ep.id = c.episodio_id
            WHERE d.id = NEW.dispensacion_id;
        ELSE
            v_paciente_origen := NEW.paciente_id;
    END CASE;

    IF v_paciente_origen IS NULL OR v_paciente_origen IS DISTINCT FROM NEW.paciente_id THEN
        RAISE EXCEPTION 'La prestación no pertenece al paciente indicado';
    END IF;

    RETURN NEW;
END;
$$;

-- ============================================================
-- Función: validar detalle factura borrador
-- ============================================================
CREATE OR REPLACE FUNCTION facturacion.fn_validar_detalle_factura_borrador()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    v_estado facturacion.estado_factura_enum;
    v_paciente_factura uuid;
    v_paciente_prestacion uuid;
BEGIN
    SELECT estado, paciente_id
    INTO v_estado, v_paciente_factura
    FROM facturacion.factura
    WHERE id = COALESCE(NEW.factura_id, OLD.factura_id)
    FOR UPDATE;

    IF v_estado <> 'BORRADOR' THEN
        RAISE EXCEPTION 'Solo se pueden modificar detalles de una factura en estado BORRADOR';
    END IF;

    IF TG_OP <> 'DELETE' THEN
        SELECT paciente_id INTO v_paciente_prestacion
        FROM facturacion.prestacion_servicio
        WHERE id = NEW.prestacion_id;

        IF v_paciente_factura IS DISTINCT FROM v_paciente_prestacion THEN
            RAISE EXCEPTION 'La prestación no pertenece al paciente de la factura';
        END IF;
    END IF;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$;

-- ============================================================
-- Función: recalcular factura
-- ============================================================
CREATE OR REPLACE FUNCTION facturacion.fn_recalcular_factura()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    v_factura_id uuid;
BEGIN
    v_factura_id := COALESCE(NEW.factura_id, OLD.factura_id);

    UPDATE facturacion.factura f
    SET subtotal = COALESCE((
            SELECT SUM(df.subtotal)
            FROM facturacion.detalle_factura df
            WHERE df.factura_id = v_factura_id
        ), 0),
        total = GREATEST(
            COALESCE((
                SELECT SUM(df.subtotal)
                FROM facturacion.detalle_factura df
                WHERE df.factura_id = v_factura_id
            ), 0) - f.descuento,
            0
        ),
        modificado_en = clock_timestamp()
    WHERE f.id = v_factura_id;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$;

-- ============================================================
-- Función: emitir factura
-- ============================================================
CREATE OR REPLACE FUNCTION facturacion.emitir_factura(p_factura_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = facturacion, public
AS $$
DECLARE
    v_estado facturacion.estado_factura_enum;
    v_total numeric(14,2);
BEGIN
    SELECT estado, total INTO v_estado, v_total
    FROM facturacion.factura
    WHERE id = p_factura_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Factura inexistente';
    END IF;

    IF v_estado <> 'BORRADOR' THEN
        RAISE EXCEPTION 'La factura debe estar en estado BORRADOR';
    END IF;

    IF v_total <= 0 OR NOT EXISTS (
        SELECT 1 FROM facturacion.detalle_factura WHERE factura_id = p_factura_id
    ) THEN
        RAISE EXCEPTION 'La factura debe tener al menos un detalle con total mayor a cero';
    END IF;

    UPDATE facturacion.factura
    SET estado = 'EMITIDA',
        fecha_emision = clock_timestamp(),
        modificado_en = clock_timestamp()
    WHERE id = p_factura_id;
END;
$$;

-- ============================================================
-- Función: validar pago
-- ============================================================
CREATE OR REPLACE FUNCTION facturacion.fn_validar_pago()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    v_estado facturacion.estado_factura_enum;
    v_total numeric(14,2);
    v_pagado numeric(14,2);
BEGIN
    SELECT estado, total
    INTO v_estado, v_total
    FROM facturacion.factura
    WHERE id = NEW.factura_id
    FOR UPDATE;

    IF v_estado NOT IN ('EMITIDA', 'PARCIAL') THEN
        RAISE EXCEPTION 'Solo se pueden registrar pagos en facturas emitidas o parciales';
    END IF;

    SELECT COALESCE(SUM(monto), 0)
    INTO v_pagado
    FROM facturacion.pago
    WHERE factura_id = NEW.factura_id
      AND anulado = false
      AND id <> NEW.id;

    IF v_pagado + NEW.monto > v_total THEN
        RAISE EXCEPTION 'El pago supera el saldo pendiente';
    END IF;

    RETURN NEW;
END;
$$;

-- ============================================================
-- Función: actualizar estado de pago
-- ============================================================
CREATE OR REPLACE FUNCTION facturacion.fn_actualizar_estado_pago()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    v_factura_id uuid;
    v_total numeric(14,2);
    v_pagado numeric(14,2);
    v_estado facturacion.estado_factura_enum;
BEGIN
    v_factura_id := COALESCE(NEW.factura_id, OLD.factura_id);

    SELECT total, estado INTO v_total, v_estado
    FROM facturacion.factura
    WHERE id = v_factura_id
    FOR UPDATE;

    IF v_estado = 'ANULADA' THEN
        IF TG_OP = 'DELETE' THEN
            RETURN OLD;
        END IF;
        RETURN NEW;
    END IF;

    SELECT COALESCE(SUM(monto), 0)
    INTO v_pagado
    FROM facturacion.pago
    WHERE factura_id = v_factura_id
      AND anulado = false;

    UPDATE facturacion.factura
    SET estado = CASE
            WHEN v_pagado = 0 THEN 'EMITIDA'::facturacion.estado_factura_enum
            WHEN v_pagado < v_total THEN 'PARCIAL'::facturacion.estado_factura_enum
            ELSE 'PAGADA'::facturacion.estado_factura_enum
        END,
        modificado_en = clock_timestamp()
    WHERE id = v_factura_id
      AND estado <> 'BORRADOR';

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$;

COMMIT;
