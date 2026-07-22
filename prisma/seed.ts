import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;
const DEFAULT_PASSWORD = 'SIIH2026!';

function hash(pw: string): Promise<string> {
  return bcrypt.hash(pw, SALT_ROUNDS);
}

function uid(): string {
  return crypto.randomUUID();
}

function date(daysAgo: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
}

function time(hour: number, minute = 0): Date {
  const d = new Date(2000, 0, 1, hour, minute, 0);
  return d;
}

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const p = new PrismaClient({ adapter });

  // Check if already seeded
  const userCount = await p.usuario.count();
  if (userCount > 0) {
    console.log(`Database already has ${userCount} users. Skipping seed.`);
    await p.$disconnect();
    return;
  }

  console.log('Starting seed...');
  const pwHash = await hash(DEFAULT_PASSWORD);

  // ═══════════════════════════════════════════════════════════
  // NIVEL 0 — Sin dependencias
  // ═══════════════════════════════════════════════════════════

  console.log('  Creating roles...');
  const roles = await Promise.all([
    p.rol.create({ data: { id: 1, codigo: 'ADMINISTRADOR', nombre: 'Administrador', descripcion: 'Administrador del sistema con acceso total', esSistema: true } }),
    p.rol.create({ data: { id: 2, codigo: 'RECEPCIONISTA', nombre: 'Recepcionista', descripcion: 'Gestión de citas y admisión de pacientes' } }),
    p.rol.create({ data: { id: 3, codigo: 'MEDICO', nombre: 'Médico', descripcion: 'Profesional médico' } }),
    p.rol.create({ data: { id: 4, codigo: 'ENFERMERIA', nombre: 'Enfermería', descripcion: 'Personal de enfermería' } }),
    p.rol.create({ data: { id: 5, codigo: 'LABORATORIO', nombre: 'Laboratorio', descripcion: 'Personal de laboratorio clínico' } }),
    p.rol.create({ data: { id: 6, codigo: 'FARMACIA', nombre: 'Farmacia', descripcion: 'Personal de farmacia' } }),
    p.rol.create({ data: { id: 7, codigo: 'CAJA', nombre: 'Caja', descripcion: 'Personal de facturación y cobros' } }),
    p.rol.create({ data: { id: 8, codigo: 'DIRECTOR', nombre: 'Director', descripcion: 'Dirección del centro médico' } }),
    p.rol.create({ data: { id: 9, codigo: 'PACIENTE', nombre: 'Paciente', descripcion: 'Paciente del sistema' } }),
  ]);

  console.log('  Creating permissions...');
  const permisos = await Promise.all([
    p.permiso.create({ data: { codigo: 'SEGURIDAD_LEER', modulo: 'SEGURIDAD', accion: 'LEER' } }),
    p.permiso.create({ data: { codigo: 'SEGURIDAD_CREAR', modulo: 'SEGURIDAD', accion: 'CREAR' } }),
    p.permiso.create({ data: { codigo: 'SEGURIDAD_MODIFICAR', modulo: 'SEGURIDAD', accion: 'MODIFICAR' } }),
    p.permiso.create({ data: { codigo: 'SEGURIDAD_ELIMINAR', modulo: 'SEGURIDAD', accion: 'ELIMINAR' } }),
    p.permiso.create({ data: { codigo: 'CLINICA_LEER', modulo: 'CLINICA', accion: 'LEER' } }),
    p.permiso.create({ data: { codigo: 'CLINICA_CREAR', modulo: 'CLINICA', accion: 'CREAR' } }),
    p.permiso.create({ data: { codigo: 'CLINICA_MODIFICAR', modulo: 'CLINICA', accion: 'MODIFICAR' } }),
    p.permiso.create({ data: { codigo: 'CLINICA_ELIMINAR', modulo: 'CLINICA', accion: 'ELIMINAR' } }),
    p.permiso.create({ data: { codigo: 'LABORATORIO_LEER', modulo: 'LABORATORIO', accion: 'LEER' } }),
    p.permiso.create({ data: { codigo: 'LABORATORIO_CREAR', modulo: 'LABORATORIO', accion: 'CREAR' } }),
    p.permiso.create({ data: { codigo: 'LABORATORIO_MODIFICAR', modulo: 'LABORATORIO', accion: 'MODIFICAR' } }),
    p.permiso.create({ data: { codigo: 'IMAGENOLOGIA_LEER', modulo: 'IMAGENOLOGIA', accion: 'LEER' } }),
    p.permiso.create({ data: { codigo: 'IMAGENOLOGIA_CREAR', modulo: 'IMAGENOLOGIA', accion: 'CREAR' } }),
    p.permiso.create({ data: { codigo: 'IMAGENOLOGIA_MODIFICAR', modulo: 'IMAGENOLOGIA', accion: 'MODIFICAR' } }),
    p.permiso.create({ data: { codigo: 'FARMACIA_LEER', modulo: 'FARMACIA', accion: 'LEER' } }),
    p.permiso.create({ data: { codigo: 'FARMACIA_CREAR', modulo: 'FARMACIA', accion: 'CREAR' } }),
    p.permiso.create({ data: { codigo: 'FARMACIA_MODIFICAR', modulo: 'FARMACIA', accion: 'MODIFICAR' } }),
    p.permiso.create({ data: { codigo: 'FACTURACION_LEER', modulo: 'FACTURACION', accion: 'LEER' } }),
    p.permiso.create({ data: { codigo: 'FACTURACION_CREAR', modulo: 'FACTURACION', accion: 'CREAR' } }),
    p.permiso.create({ data: { codigo: 'FACTURACION_MODIFICAR', modulo: 'FACTURACION', accion: 'MODIFICAR' } }),
    p.permiso.create({ data: { codigo: 'REPORTES_LEER', modulo: 'REPORTES', accion: 'LEER' } }),
    p.permiso.create({ data: { codigo: 'MAESTROS_LEER', modulo: 'MAESTROS', accion: 'LEER' } }),
    p.permiso.create({ data: { codigo: 'MAESTROS_CREAR', modulo: 'MAESTROS', accion: 'CREAR' } }),
    p.permiso.create({ data: { codigo: 'MAESTROS_MODIFICAR', modulo: 'MAESTROS', accion: 'MODIFICAR' } }),
  ]);

  console.log('  Creating especialidades...');
  const especialidades = await Promise.all([
    p.especialidad.create({ data: { id: 1, codigo: 'CARDIO', nombre: 'Cardiología', descripcion: 'Enfermedades del corazón y sistema cardiovascular' } }),
    p.especialidad.create({ data: { id: 2, codigo: 'PEDIA', nombre: 'Pediatría', descripcion: 'Atención médica de niños y adolescentes' } }),
    p.especialidad.create({ data: { id: 3, codigo: 'GINEC', nombre: 'Ginecología', descripcion: 'Salud femenina y sistema reproductor' } }),
    p.especialidad.create({ data: { id: 4, codigo: 'TRAUMA', nombre: 'Traumatología', descripcion: 'Lesiones del sistema musculoesquelético' } }),
    p.especialidad.create({ data: { id: 5, codigo: 'NEUROL', nombre: 'Neurología', descripcion: 'Enfermedades del sistema nervioso' } }),
    p.especialidad.create({ data: { id: 6, codigo: 'DERMA', nombre: 'Dermatología', descripcion: 'Enfermedades de la piel' } }),
    p.especialidad.create({ data: { id: 7, codigo: 'OFTALM', nombre: 'Oftalmología', descripcion: 'Enfermedades de los ojos' } }),
    p.especialidad.create({ data: { id: 8, codigo: 'MEDGEN', nombre: 'Medicina General', descripcion: 'Atención médica general' } }),
  ]);

  console.log('  Creating consultorios...');
  const consultorios = await Promise.all([
    p.consultorio.create({ data: { id: uid(), codigo: 'C-101', nombre: 'Consultorio 101', piso: '1', ubicacion: 'Planta baja, ala este' } }),
    p.consultorio.create({ data: { id: uid(), codigo: 'C-102', nombre: 'Consultorio 102', piso: '1', ubicacion: 'Planta baja, ala este' } }),
    p.consultorio.create({ data: { id: uid(), codigo: 'C-201', nombre: 'Consultorio 201', piso: '2', ubicacion: 'Primer piso, ala oeste' } }),
    p.consultorio.create({ data: { id: uid(), codigo: 'C-202', nombre: 'Consultorio 202', piso: '2', ubicacion: 'Primer piso, ala oeste' } }),
    p.consultorio.create({ data: { id: uid(), codigo: 'C-301', nombre: 'Consultorio 301', piso: '3', ubicacion: 'Segundo piso, ala norte' } }),
    p.consultorio.create({ data: { id: uid(), codigo: 'EMERG', nombre: 'Sala de Emergencia', piso: '1', ubicacion: 'Planta baja, acceso principal' } }),
  ]);

  console.log('  Creating diagnosticos...');
  const diagnosticos = await Promise.all([
    p.catalogoDiagnostico.create({ data: { id: uid(), codigo: 'J06.9', nombre: 'Infección aguda de las vías respiratorias superiores, no especificada' } }),
    p.catalogoDiagnostico.create({ data: { id: uid(), codigo: 'I10', nombre: 'Hipertensión esencial (primaria)' } }),
    p.catalogoDiagnostico.create({ data: { id: uid(), codigo: 'E11.9', nombre: 'Diabetes mellitus tipo 2 sin complicaciones' } }),
    p.catalogoDiagnostico.create({ data: { id: uid(), codigo: 'M54.5', nombre: 'Dolor lumbar bajo' } }),
    p.catalogoDiagnostico.create({ data: { id: uid(), codigo: 'K29.7', nombre: 'Gastritis, no especificada' } }),
    p.catalogoDiagnostico.create({ data: { id: uid(), codigo: 'N39.0', nombre: 'Infección de vías urinarias' } }),
    p.catalogoDiagnostico.create({ data: { id: uid(), codigo: 'J18.9', nombre: 'Neumonía, no especificada' } }),
    p.catalogoDiagnostico.create({ data: { id: uid(), codigo: 'L30.9', nombre: 'Dermatitis, no especificada' } }),
    p.catalogoDiagnostico.create({ data: { id: uid(), codigo: 'R51.9', nombre: 'Cefalea, no especificada' } }),
    p.catalogoDiagnostico.create({ data: { id: uid(), codigo: 'A09', nombre: 'Gastroenteritis y colitis de origen infeccioso' } }),
  ]);

  console.log('  Creating medicamentos...');
  const medicamentos = await Promise.all([
    p.medicamento.create({ data: { id: uid(), codigo: 'MED-001', nombreGenerico: 'Paracetamol', nombreComercial: 'Tylenol', formaFarmaceutica: 'Tableta', concentracion: '500mg', unidadMedida: 'Tableta', stockMinimo: 100 } }),
    p.medicamento.create({ data: { id: uid(), codigo: 'MED-002', nombreGenerico: 'Ibuprofeno', nombreComercial: 'Advil', formaFarmaceutica: 'Tableta', concentracion: '400mg', unidadMedida: 'Tableta', stockMinimo: 100 } }),
    p.medicamento.create({ data: { id: uid(), codigo: 'MED-003', nombreGenerico: 'Amoxicilina', nombreComercial: 'Amoxil', formaFarmaceutica: 'Cápsula', concentracion: '500mg', unidadMedida: 'Cápsula', stockMinimo: 50 } }),
    p.medicamento.create({ data: { id: uid(), codigo: 'MED-004', nombreGenerico: 'Omeprazol', nombreComercial: 'Losec', formaFarmaceutica: 'Cápsula', concentracion: '20mg', unidadMedida: 'Cápsula', stockMinimo: 80 } }),
    p.medicamento.create({ data: { id: uid(), codigo: 'MED-005', nombreGenerico: 'Losartán', nombreComercial: 'Cozaar', formaFarmaceutica: 'Tableta', concentracion: '50mg', unidadMedida: 'Tableta', stockMinimo: 60 } }),
    p.medicamento.create({ data: { id: uid(), codigo: 'MED-006', nombreGenerico: 'Metformina', nombreComercial: 'Glucophage', formaFarmaceutica: 'Tableta', concentracion: '850mg', unidadMedida: 'Tableta', stockMinimo: 60 } }),
    p.medicamento.create({ data: { id: uid(), codigo: 'MED-007', nombreGenerico: 'Salbutamol', nombreComercial: 'Ventolin', formaFarmaceutica: 'Inhalador', concentracion: '100mcg', unidadMedida: 'Inhalador', stockMinimo: 20 } }),
    p.medicamento.create({ data: { id: uid(), codigo: 'MED-008', nombreGenerico: 'Diclofenaco', nombreComercial: 'Voltaren', formaFarmaceutica: 'Tableta', concentracion: '50mg', unidadMedida: 'Tableta', stockMinimo: 80 } }),
    p.medicamento.create({ data: { id: uid(), codigo: 'MED-009', nombreGenerico: 'Azitromicina', nombreComercial: 'Zithromax', formaFarmaceutica: 'Tableta', concentracion: '500mg', unidadMedida: 'Tableta', stockMinimo: 30 } }),
    p.medicamento.create({ data: { id: uid(), codigo: 'MED-010', nombreGenerico: 'Ciprofloxacino', nombreComercial: 'Ciproxina', formaFarmaceutica: 'Tableta', concentracion: '500mg', unidadMedida: 'Tableta', stockMinimo: 40 } }),
    p.medicamento.create({ data: { id: uid(), codigo: 'MED-011', nombreGenerico: 'Dexametasona', nombreComercial: 'Decadron', formaFarmaceutica: 'Tableta', concentracion: '4mg', unidadMedida: 'Tableta', stockMinimo: 30, controlado: true } }),
    p.medicamento.create({ data: { id: uid(), codigo: 'MED-012', nombreGenerico: 'Ranitidina', nombreComercial: 'Zantac', formaFarmaceutica: 'Tableta', concentracion: '150mg', unidadMedida: 'Tableta', stockMinimo: 50 } }),
    p.medicamento.create({ data: { id: uid(), codigo: 'MED-013', nombreGenerico: 'Prednisona', nombreComercial: 'Deltacortril', formaFarmaceutica: 'Tableta', concentracion: '20mg', unidadMedida: 'Tableta', stockMinimo: 40 } }),
    p.medicamento.create({ data: { id: uid(), codigo: 'MED-014', nombreGenerico: 'Naproxeno', nombreComercial: 'Apronax', formaFarmaceutica: 'Tableta', concentracion: '500mg', unidadMedida: 'Tableta', stockMinimo: 40 } }),
    p.medicamento.create({ data: { id: uid(), codigo: 'MED-015', nombreGenerico: 'Clonazepam', nombreComercial: 'Rivotril', formaFarmaceutica: 'Tableta', concentracion: '2mg', unidadMedida: 'Tableta', stockMinimo: 20, controlado: true, requiereReceta: true } }),
  ]);

  console.log('  Creating proveedores...');
  const proveedores = await Promise.all([
    p.proveedor.create({ data: { id: uid(), nit: '1234567890', razonSocial: 'Farmacéutica Boliviana S.A.', contactoNombre: 'Roberto Méndez', telefono: '2-2345678', correo: 'ventas@farma-bol.com' } }),
    p.proveedor.create({ data: { id: uid(), nit: '9876543210', razonSocial: 'Distribuidora Médica del Sur', contactoNombre: 'María López', telefono: '2-2765432', correo: 'pedidos@dismed-sur.com' } }),
    p.proveedor.create({ data: { id: uid(), nit: '5555555555', razonSocial: 'Importadora Farmacéutica Central', contactoNombre: 'Carlos Vega', telefono: '2-2111222', correo: 'ventas@importfarma.com' } }),
  ]);

  console.log('  Creating servicios...');
  const servicios = await Promise.all([
    p.servicio.create({ data: { id: uid(), codigo: 'SRV-CONSULTA', nombre: 'Consulta Médica General', categoria: 'CONSULTA', precioBase: 150 } }),
    p.servicio.create({ data: { id: uid(), codigo: 'SRV-CONSULTA-ESP', nombre: 'Consulta Médica Especialista', categoria: 'CONSULTA', precioBase: 250 } }),
    p.servicio.create({ data: { id: uid(), codigo: 'SRV-LAB-BASICO', nombre: 'Análisis de Laboratorio Básico', categoria: 'LABORATORIO', precioBase: 120 } }),
    p.servicio.create({ data: { id: uid(), codigo: 'SRV-LAB-ESP', nombre: 'Análisis de Laboratorio Especializado', categoria: 'LABORATORIO', precioBase: 200 } }),
    p.servicio.create({ data: { id: uid(), codigo: 'SRV-IMG-RX', nombre: 'Radiografía', categoria: 'IMAGENOLOGIA', precioBase: 180 } }),
    p.servicio.create({ data: { id: uid(), codigo: 'SRV-IMG-ECO', nombre: 'Ecografía', categoria: 'IMAGENOLOGIA', precioBase: 250 } }),
    p.servicio.create({ data: { id: uid(), codigo: 'SRV-FARM-GEN', nombre: 'Servicio de Farmacia', categoria: 'FARMACIA', precioBase: 0 } }),
    p.servicio.create({ data: { id: uid(), codigo: 'SRV-EMERG', nombre: 'Atención de Emergencia', categoria: 'CONSULTA', precioBase: 350 } }),
  ]);

  console.log('  Creating tipos de examen...');
  const tiposExamen = await Promise.all([
    p.tipoExamen.create({ data: { id: uid(), codigo: 'LAB-HB', nombre: 'Hemograma Completo', tipoMuestra: 'Sangre venosa', unidadPredeterminada: 'g/dL', rangoReferenciaPredeterminado: '12-16 g/dL', precioReferencia: 80 } }),
    p.tipoExamen.create({ data: { id: uid(), codigo: 'LAB-GLU', nombre: 'Glucemia en Ayunas', tipoMuestra: 'Sangre venosa', unidadPredeterminada: 'mg/dL', rangoReferenciaPredeterminado: '70-100 mg/dL', precioReferencia: 60 } }),
    p.tipoExamen.create({ data: { id: uid(), codigo: 'LAB-COL', nombre: 'Colesterol Total', tipoMuestra: 'Sangre venosa', unidadPredeterminada: 'mg/dL', rangoReferenciaPredeterminado: '<200 mg/dL', precioReferencia: 70 } }),
    p.tipoExamen.create({ data: { id: uid(), codigo: 'LAB-BHC', nombre: 'Biometría Hemática Completa', tipoMuestra: 'Sangre venosa', unidadPredeterminada: '', rangoReferenciaPredeterminado: '', precioReferencia: 90 } }),
    p.tipoExamen.create({ data: { id: uid(), codigo: 'LAB-ORI', nombre: 'Examen General de Orina', tipoMuestra: 'Orina', unidadPredeterminada: '', rangoReferenciaPredeterminado: '', precioReferencia: 50 } }),
    p.tipoExamen.create({ data: { id: uid(), codigo: 'LAB-PCR', nombre: 'Proteína C Reactiva', tipoMuestra: 'Sangre venosa', unidadPredeterminada: 'mg/L', rangoReferenciaPredeterminado: '<5 mg/L', precioReferencia: 85 } }),
    p.tipoExamen.create({ data: { id: uid(), codigo: 'LAB-HBA', nombre: 'Hemoglobina Glucosilada (HbA1c)', tipoMuestra: 'Sangre venosa', unidadPredeterminada: '%', rangoReferenciaPredeterminado: '<5.7%', precioReferencia: 110 } }),
    p.tipoExamen.create({ data: { id: uid(), codigo: 'LAB-CREAT', nombre: 'Creatinina', tipoMuestra: 'Sangre venosa', unidadPredeterminada: 'mg/dL', rangoReferenciaPredeterminado: '0.6-1.2 mg/dL', precioReferencia: 75 } }),
    p.tipoExamen.create({ data: { id: uid(), codigo: 'LAB-UREA', nombre: 'Urea', tipoMuestra: 'Sangre venosa', unidadPredeterminada: 'mg/dL', rangoReferenciaPredeterminado: '10-50 mg/dL', precioReferencia: 65 } }),
    p.tipoExamen.create({ data: { id: uid(), codigo: 'LAB-GRAS', nombre: 'Perfil Lipídico', tipoMuestra: 'Sangre venosa', unidadPredeterminada: '', rangoReferenciaPredeterminado: '', precioReferencia: 120 } }),
  ]);

  console.log('  Creating tipos de estudio...');
  const tiposEstudio = await Promise.all([
    p.tipoEstudio.create({ data: { id: uid(), codigo: 'IMG-RX-TOR', nombre: 'Radiografía de Tórax', descripcion: 'Radiografía posteroanterior y lateral de tórax', precioReferencia: 150 } }),
    p.tipoEstudio.create({ data: { id: uid(), codigo: 'IMG-ECO-ABD', nombre: 'Ecografía Abdominal', descripcion: 'Ecografía de abdomen total', precioReferencia: 200 } }),
    p.tipoEstudio.create({ data: { id: uid(), codigo: 'IMG-ECO-PEL', nombre: 'Ecografía Pélvica', descripcion: 'Ecografía pélvica transabdominal', precioReferencia: 200 } }),
    p.tipoEstudio.create({ data: { id: uid(), codigo: 'IMG-TAC-CR', nombre: 'Tomografía de Cráneo', descripcion: 'TAC de cráneo sin contraste', precioReferencia: 450 } }),
    p.tipoEstudio.create({ data: { id: uid(), codigo: 'IMG-RMN-LE', nombre: 'Resonancia Magnética Lumboespinal', descripcion: 'RMN de columna lumbar', precioReferencia: 600 } }),
  ]);

  // ═══════════════════════════════════════════════════════════
  // NIVEL 1 — RolPermiso
  // ═══════════════════════════════════════════════════════════

  console.log('  Creating role-permission assignments...');
  const allPermisos = permisos.map((perm) => perm.id);
  const adminPermisos = allPermisos;
  const medicoPermisos = permisos.filter((p) => p.modulo === 'CLINICA' || p.modulo === 'LABORATORIO' || p.modulo === 'IMAGENOLOGIA' || p.modulo === 'REPORTES').map((p) => p.id);
  const enfermeriaPermisos = permisos.filter((p) => p.modulo === 'CLINICA').map((p) => p.id);
  const labPermisos = permisos.filter((p) => p.modulo === 'LABORATORIO').map((p) => p.id);
  const farmaciaPermisos = permisos.filter((p) => p.modulo === 'FARMACIA').map((p) => p.id);
  const cajaPermisos = permisos.filter((p) => p.modulo === 'FACTURACION').map((p) => p.id);
  const recepcionPermisos = permisos.filter((p) => p.modulo === 'MAESTROS' || p.modulo === 'CLINICA').map((p) => p.id);

  const rolePermisoData: { rolId: number; permisoId: number }[] = [];
  for (const pid of adminPermisos) rolePermisoData.push({ rolId: 1, permisoId: pid });
  for (const pid of recepcionPermisos) rolePermisoData.push({ rolId: 2, permisoId: pid });
  for (const pid of medicoPermisos) rolePermisoData.push({ rolId: 3, permisoId: pid });
  for (const pid of enfermeriaPermisos) rolePermisoData.push({ rolId: 4, permisoId: pid });
  for (const pid of labPermisos) rolePermisoData.push({ rolId: 5, permisoId: pid });
  for (const pid of farmaciaPermisos) rolePermisoData.push({ rolId: 6, permisoId: pid });
  for (const pid of cajaPermisos) rolePermisoData.push({ rolId: 7, permisoId: pid });
  for (const pid of adminPermisos) rolePermisoData.push({ rolId: 8, permisoId: pid });

  await p.rolPermiso.createMany({ data: rolePermisoData });

  // ═══════════════════════════════════════════════════════════
  // NIVEL 2 — Personas
  // ═══════════════════════════════════════════════════════════

  console.log('  Creating personas...');

  // Staff personas
  const personaAdmin = await p.persona.create({ data: { id: uid(), numeroDocumento: '1234567', nombres: 'Juan Carlos', apellidos: 'Ramírez Vega', fechaNacimiento: date(15000), sexo: 'MASCULINO', direccion: 'Av. Libertador 1234', telefono: '71234567', correo: 'admin@siih.com' } });
  const personaRecep = await p.persona.create({ data: { id: uid(), numeroDocumento: '2345678', nombres: 'Ana María', apellidos: 'Flores Mendoza', fechaNacimiento: date(12000), sexo: 'FEMENINO', direccion: 'Calle Murillo 567', telefono: '72345678', correo: 'recepcion@siih.com' } });
  const personaMed1 = await p.persona.create({ data: { id: uid(), numeroDocumento: '3456789', nombres: 'Roberto', apellidos: 'Gutiérrez Silva', fechaNacimiento: date(18000), sexo: 'MASCULINO', direccion: 'Av. Arce 890', telefono: '73456789', correo: 'medico1@siih.com' } });
  const personaMed2 = await p.persona.create({ data: { id: uid(), numeroDocumento: '4567890', nombres: 'Laura', apellidos: 'Fernández López', fechaNacimiento: date(16000), sexo: 'FEMENINO', direccion: 'Calle Colón 321', telefono: '74567890', correo: 'medico2@siih.com' } });
  const personaMed3 = await p.persona.create({ data: { id: uid(), numeroDocumento: '5678901', nombres: 'Fernando', apellidos: 'Cáceres Ruiz', fechaNacimiento: date(20000), sexo: 'MASCULINO', direccion: 'Av. Ballivián 654', telefono: '75678901', correo: 'medico3@siih.com' } });
  const personaEnf1 = await p.persona.create({ data: { id: uid(), numeroDocumento: '6789012', nombres: 'Carmen', apellidos: 'Torres Pereira', fechaNacimiento: date(11000), sexo: 'FEMENINO', direccion: 'Calle Sucre 987', telefono: '76789012', correo: 'enfermera1@siih.com' } });
  const personaEnf2 = await p.persona.create({ data: { id: uid(), numeroDocumento: '7890123', nombres: 'Patricia', apellidos: 'Mamani Quispe', fechaNacimiento: date(10000), sexo: 'FEMENINO', direccion: 'Av. 6 de Agosto 147', telefono: '77890123', correo: 'enfermera2@siih.com' } });
  const personaFar = await p.persona.create({ data: { id: uid(), numeroDocumento: '8901234', nombres: 'Miguel', apellidos: 'Ángel Vargas', fechaNacimiento: date(13000), sexo: 'MASCULINO', direccion: 'Cale Cotahuma 258', telefono: '78901234', correo: 'farmacia@siih.com' } });
  const personaCaj = await p.persona.create({ data: { id: uid(), numeroDocumento: '9012345', nombres: 'Sandra', apellidos: 'Paredes Choque', fechaNacimiento: date(9000), sexo: 'FEMENINO', direccion: 'Av. Banzer 369', telefono: '79012345', correo: 'caja@siih.com' } });
  const personaDirector = await p.persona.create({ data: { id: uid(), numeroDocumento: '1012345', nombres: 'Eduardo', apellidos: 'Rivera Montaño', fechaNacimiento: date(22000), sexo: 'MASCULINO', direccion: 'Av. Heroínas 741', telefono: '70123456', correo: 'director@siih.com' } });

  // Pacientes personas
  const pacientePersonas = await Promise.all([
    p.persona.create({ data: { id: uid(), numeroDocumento: '5512345', nombres: 'María Elena', apellidos: 'Condori Ramos', fechaNacimiento: date(25000), sexo: 'FEMENINO', direccion: 'Calle Potosí 111', telefono: '71111111', correo: 'maria.condori@email.com' } }),
    p.persona.create({ data: { id: uid(), numeroDocumento: '5523456', nombres: 'Pedro Luis', apellidos: 'Aguilar Ticona', fechaNacimiento: date(30000), sexo: 'MASCULINO', direccion: 'Av. Brasil 222', telefono: '72222222', correo: 'pedro.aguilar@email.com' } }),
    p.persona.create({ data: { id: uid(), numeroDocumento: '5534567', nombres: 'Rosa', apellidos: 'Guzmán Huanca', fechaNacimiento: date(20000), sexo: 'FEMENINO', direccion: 'Calle Murillo 333', telefono: '73333333', correo: 'rosa.guzman@email.com' } }),
    p.persona.create({ data: { id: uid(), numeroDocumento: '5545678', nombres: 'Juan Pablo', apellidos: 'Mamani Copa', fechaNacimiento: date(8000), sexo: 'MASCULINO', direccion: 'Av. Arce 444', telefono: '74444444', correo: 'juan.mamani@email.com' } }),
    p.persona.create({ data: { id: uid(), numeroDocumento: '5556789', nombres: 'Cecilia', apellidos: 'López de Alcocer', fechaNacimiento: date(35000), sexo: 'FEMENINO', direccion: 'Calle Colón 555', telefono: '75555555', correo: 'cecilia.lopez@email.com' } }),
    p.persona.create({ data: { id: uid(), numeroDocumento: '5567890', nombres: 'Andrés', apellidos: 'Quispe Terrazas', fechaNacimiento: date(5000), sexo: 'MASCULINO', direccion: 'Av. Ballivián 666', telefono: '76666666', correo: 'andres.quispe@email.com' } }),
    p.persona.create({ data: { id: uid(), numeroDocumento: '5578901', nombres: 'Gladys', apellidos: 'Vargas Mercado', fechaNacimiento: date(28000), sexo: 'FEMENINO', direccion: 'Calle Comercio 777', telefono: '77777777', correo: 'gladys.vargas@email.com' } }),
    p.persona.create({ data: { id: uid(), numeroDocumento: '5589012', nombres: 'Sergio', apellidos: 'Bustamante Flores', fechaNacimiento: date(40000), sexo: 'MASCULINO', direccion: 'Av. Montes 888', telefono: '78888888', correo: 'sergio.bustamante@email.com' } }),
    p.persona.create({ data: { id: uid(), numeroDocumento: '5590123', nombres: 'Paola', apellidos: 'Ríos Cardozo', fechaNacimiento: date(15000), sexo: 'FEMENINO', direccion: 'Calle Loayza 999', telefono: '79999999', correo: 'paola.rios@email.com' } }),
    p.persona.create({ data: { id: uid(), numeroDocumento: '5601234', nombres: 'Luis Fernando', apellidos: 'Villca Mamani', fechaNacimiento: date(32000), sexo: 'MASCULINO', direccion: 'Av. Villazón 000', telefono: '71010101', correo: 'luis.villca@email.com' } }),
    p.persona.create({ data: { id: uid(), numeroDocumento: '5612345', nombres: 'Verónica', apellidos: 'Salazar Jordán', fechaNacimiento: date(22000), sexo: 'FEMENINO', direccion: 'Calle Junín 111', telefono: '72020202', correo: 'veronica.salazar@email.com' } }),
    p.persona.create({ data: { id: uid(), numeroDocumento: '5623456', nombres: 'Oscar', apellidos: 'Córdoba Apaza', fechaNacimiento: date(27000), sexo: 'MASCULINO',direccion: 'Av. Illimani 222', telefono: '73030303', correo: 'oscar.cordoba@email.com' } }),
  ]);

  // ═══════════════════════════════════════════════════════════
  // NIVEL 3 — Pacientes, Empleados
  // ═══════════════════════════════════════════════════════════

  console.log('  Creating pacientes...');
  const pacientes = await Promise.all([
    p.paciente.create({ data: { id: uid(), personaId: pacientePersonas[0].id, grupoSanguineo: 'O+', factorRh: '+', contactoEmergenciaNombre: 'Pedro Condori', contactoEmergenciaTelefono: '71111112' } }),
    p.paciente.create({ data: { id: uid(), personaId: pacientePersonas[1].id, grupoSanguineo: 'A+', factorRh: '+', contactoEmergenciaNombre: 'Rosa Aguilar', contactoEmergenciaTelefono: '72222223' } }),
    p.paciente.create({ data: { id: uid(), personaId: pacientePersonas[2].id, grupoSanguineo: 'B-', factorRh: '-', contactoEmergenciaNombre: 'Juan Guzmán', contactoEmergenciaTelefono: '73333334' } }),
    p.paciente.create({ data: { id: uid(), personaId: pacientePersonas[3].id, grupoSanguineo: 'AB+', factorRh: '+', contactoEmergenciaNombre: 'Carmen Copa', contactoEmergenciaTelefono: '74444445' } }),
    p.paciente.create({ data: { id: uid(), personaId: pacientePersonas[4].id, grupoSanguineo: 'O-', factorRh: '-', contactoEmergenciaNombre: 'Miguel López', contactoEmergenciaTelefono: '75555556' } }),
    p.paciente.create({ data: { id: uid(), personaId: pacientePersonas[5].id, grupoSanguineo: 'A-', factorRh: '-', contactoEmergenciaNombre: 'Ana Quispe', contactoEmergenciaTelefono: '76666667' } }),
    p.paciente.create({ data: { id: uid(), personaId: pacientePersonas[6].id, grupoSanguineo: 'B+', factorRh: '+', contactoEmergenciaNombre: 'Roberto Vargas', contactoEmergenciaTelefono: '77777778' } }),
    p.paciente.create({ data: { id: uid(), personaId: pacientePersonas[7].id, grupoSanguineo: 'O+', factorRh: '+', contactoEmergenciaNombre: 'Laura Bustamante', contactoEmergenciaTelefono: '78888889' } }),
    p.paciente.create({ data: { id: uid(), personaId: pacientePersonas[8].id, grupoSanguineo: 'A+', factorRh: '+', contactoEmergenciaNombre: 'Sergio Ríos', contactoEmergenciaTelefono: '79999990' } }),
    p.paciente.create({ data: { id: uid(), personaId: pacientePersonas[9].id, grupoSanguineo: 'AB-', factorRh: '-', contactoEmergenciaNombre: 'Gladys Villca', contactoEmergenciaTelefono: '71010102' } }),
    p.paciente.create({ data: { id: uid(), personaId: pacientePersonas[10].id, grupoSanguineo: 'O+', factorRh: '+', contactoEmergenciaNombre: 'Fernando Salazar', contactoEmergenciaTelefono: '72020203' } }),
    p.paciente.create({ data: { id: uid(), personaId: pacientePersonas[11].id, grupoSanguineo: 'B+', factorRh: '+', contactoEmergenciaNombre: 'Patricia Córdoba', contactoEmergenciaTelefono: '73030304' } }),
  ]);

  console.log('  Creating empleados...');
  const empleados = await Promise.all([
    p.empleado.create({ data: { id: uid(), personaId: personaAdmin.id, codigoEmpleado: 'EMP-001', cargo: 'Administrador de Sistema', fechaIngreso: date(2000) } }),
    p.empleado.create({ data: { id: uid(), personaId: personaRecep.id, codigoEmpleado: 'EMP-002', cargo: 'Recepcionista', fechaIngreso: date(1500) } }),
    p.empleado.create({ data: { id: uid(), personaId: personaMed1.id, codigoEmpleado: 'EMP-003', cargo: 'Médico Cardiólogo', fechaIngreso: date(1800) } }),
    p.empleado.create({ data: { id: uid(), personaId: personaMed2.id, codigoEmpleado: 'EMP-004', cargo: 'Médica Pediatra', fechaIngreso: date(1600) } }),
    p.empleado.create({ data: { id: uid(), personaId: personaMed3.id, codigoEmpleado: 'EMP-005', cargo: 'Médico Traumatólogo', fechaIngreso: date(1200) } }),
    p.empleado.create({ data: { id: uid(), personaId: personaEnf1.id, codigoEmpleado: 'EMP-006', cargo: 'Enfermera Jefe', fechaIngreso: date(1400) } }),
    p.empleado.create({ data: { id: uid(), personaId: personaEnf2.id, codigoEmpleado: 'EMP-007', cargo: 'Enfermera', fechaIngreso: date(1000) } }),
    p.empleado.create({ data: { id: uid(), personaId: personaFar.id, codigoEmpleado: 'EMP-008', cargo: 'Farmacéutico', fechaIngreso: date(1300) } }),
    p.empleado.create({ data: { id: uid(), personaId: personaCaj.id, codigoEmpleado: 'EMP-009', cargo: 'Cajera', fechaIngreso: date(900) } }),
    p.empleado.create({ data: { id: uid(), personaId: personaDirector.id, codigoEmpleado: 'EMP-010', cargo: 'Director Médico', fechaIngreso: date(2500) } }),
  ]);

  // ═══════════════════════════════════════════════════════════
  // NIVEL 4 — Médicos
  // ═══════════════════════════════════════════════════════════

  console.log('  Creating medicos...');
  const medicos = await Promise.all([
    p.medico.create({ data: { id: uid(), empleadoId: empleados[2].id, matriculaProfesional: 'MAT-1001' } }),
    p.medico.create({ data: { id: uid(), empleadoId: empleados[3].id, matriculaProfesional: 'MAT-1002' } }),
    p.medico.create({ data: { id: uid(), empleadoId: empleados[4].id, matriculaProfesional: 'MAT-1003' } }),
  ]);

  console.log('  Creating medico-especialidades...');
  await Promise.all([
    p.medicoEspecialidad.create({ data: { medicoId: medicos[0].id, especialidadId: especialidades[0].id, esPrincipal: true } }),
    p.medicoEspecialidad.create({ data: { medicoId: medicos[0].id, especialidadId: especialidades[7].id, esPrincipal: false } }),
    p.medicoEspecialidad.create({ data: { medicoId: medicos[1].id, especialidadId: especialidades[1].id, esPrincipal: true } }),
    p.medicoEspecialidad.create({ data: { medicoId: medicos[2].id, especialidadId: especialidades[3].id, esPrincipal: true } }),
    p.medicoEspecialidad.create({ data: { medicoId: medicos[2].id, especialidadId: especialidades[4].id, esPrincipal: false } }),
  ]);

  console.log('  Creating horarios medicos...');
  const horarioData: any[] = [];
  for (const medico of medicos) {
    for (let dia = 1; dia <= 5; dia++) {
      horarioData.push({
        id: uid(),
        medicoId: medico.id,
        consultorioId: consultorios[dia - 1].id,
        diaSemana: dia,
        horaInicio: time(8),
        horaFin: time(12),
      });
      horarioData.push({
        id: uid(),
        medicoId: medico.id,
        consultorioId: consultorios[dia - 1].id,
        diaSemana: dia,
        horaInicio: time(14),
        horaFin: time(18),
      });
    }
  }
  await p.horarioMedico.createMany({ data: horarioData });

  // ═══════════════════════════════════════════════════════════
  // NIVEL 5 — Usuarios, Historias Clínicas
  // ═══════════════════════════════════════════════════════════

  console.log('  Creating usuarios...');
  const usuarios = await Promise.all([
    p.usuario.create({ data: { id: uid(), personaId: personaAdmin.id, nombreUsuario: 'admin', contrasenaHash: pwHash, estado: 'ACTIVO', cambiarContrasena: false } }),
    p.usuario.create({ data: { id: uid(), personaId: personaRecep.id, nombreUsuario: 'recepcion.demo', contrasenaHash: pwHash, estado: 'ACTIVO', cambiarContrasena: false } }),
    p.usuario.create({ data: { id: uid(), personaId: personaMed1.id, nombreUsuario: 'medico.demo', contrasenaHash: pwHash, estado: 'ACTIVO', cambiarContrasena: false } }),
    p.usuario.create({ data: { id: uid(), personaId: personaEnf1.id, nombreUsuario: 'enfermeria.demo', contrasenaHash: pwHash, estado: 'ACTIVO', cambiarContrasena: false } }),
    p.usuario.create({ data: { id: uid(), personaId: personaMed2.id, nombreUsuario: 'medico2.demo', contrasenaHash: pwHash, estado: 'ACTIVO', cambiarContrasena: false } }),
    p.usuario.create({ data: { id: uid(), personaId: personaEnf2.id, nombreUsuario: 'enfermeria2.demo', contrasenaHash: pwHash, estado: 'ACTIVO', cambiarContrasena: false } }),
    p.usuario.create({ data: { id: uid(), personaId: personaFar.id, nombreUsuario: 'farmacia.demo', contrasenaHash: pwHash, estado: 'ACTIVO', cambiarContrasena: false } }),
    p.usuario.create({ data: { id: uid(), personaId: personaCaj.id, nombreUsuario: 'caja.demo', contrasenaHash: pwHash, estado: 'ACTIVO', cambiarContrasena: false } }),
    p.usuario.create({ data: { id: uid(), personaId: personaDirector.id, nombreUsuario: 'director.demo', contrasenaHash: pwHash, estado: 'ACTIVO', cambiarContrasena: false } }),
    // Paciente usuario
    p.usuario.create({ data: { id: uid(), personaId: pacientePersonas[0].id, nombreUsuario: 'paciente.demo', contrasenaHash: pwHash, estado: 'ACTIVO', cambiarContrasena: false } }),
  ]);

  // ═══════════════════════════════════════════════════════════
  // NIVEL 6 — UsuarioRol, Historias Clínicas, Antecedentes
  // ═══════════════════════════════════════════════════════════

  console.log('  Creating usuario-roles...');
  await p.usuarioRol.createMany({ data: [
    { usuarioId: usuarios[0].id, rolId: 1 },
    { usuarioId: usuarios[1].id, rolId: 2 },
    { usuarioId: usuarios[2].id, rolId: 3 },
    { usuarioId: usuarios[3].id, rolId: 4 },
    { usuarioId: usuarios[4].id, rolId: 3 },
    { usuarioId: usuarios[5].id, rolId: 4 },
    { usuarioId: usuarios[6].id, rolId: 6 },
    { usuarioId: usuarios[7].id, rolId: 7 },
    { usuarioId: usuarios[8].id, rolId: 8 },
    { usuarioId: usuarios[9].id, rolId: 9 },
  ] });

  console.log('  Creating historias clinicas...');
  const historias = await Promise.all(
    pacientes.map((pac) =>
      p.historiaClinica.create({
        data: {
          id: uid(),
          pacienteId: pac.id,
          antecedentesResumen: 'Sin antecedentes relevantes al momento del registro',
        },
      })
    )
  );

  console.log('  Creating antecedentes clinicos...');
  const antecedenteData: any[] = [];
  const antecedentesTipos: { tipo: string; desc: string }[] = [
    { tipo: 'ALERGIA', desc: 'Alergia a Penicilina - reacción urticariforme' },
    { tipo: 'ALERGIA', desc: 'Alergia a Ibuprofeno - dificultad respiratoria' },
    { tipo: 'ENFERMEDAD_CRONICA', desc: 'Hipertensión arterial diagnosticada hace 5 años' },
    { tipo: 'ENFERMEDAD_CRONICA', desc: 'Diabetes mellitus tipo 2 desde 2020' },
    { tipo: 'CIRUGIA', desc: 'Apendicectomía de emergencia en 2018' },
    { tipo: 'CIRUGIA', desc: 'Cesárea en 2019' },
    { tipo: 'FAMILIAR', desc: 'Padre con antecedentes de cardiopatía isquémica' },
    { tipo: 'HABITO', desc: 'Fumador activo desde los 18 años, 1 paquete/día' },
    { tipo: 'HABITO', desc: 'Consumo moderado de alcohol, 2 veces por semana' },
    { tipo: 'OTRO', desc: 'Intolerancia a la lactosa diagnosticada en 2022' },
  ];

  for (let i = 0; i < 8; i++) {
    const tipoData = antecedentesTipos[i % antecedentesTipos.length];
    antecedenteData.push({
      id: uid(),
      historiaClinicaId: historias[i].id,
      tipo: tipoData.tipo as any,
      descripcion: tipoData.desc,
      fechaAproximada: date(365 * (i + 1)),
    });
  }
  await p.antecedenteClinico.createMany({ data: antecedenteData });

  // ═══════════════════════════════════════════════════════════
  // NIVEL 7 — Episodios, Citas, Consultas
  // ═══════════════════════════════════════════════════════════

  console.log('  Creating episodios de atencion...');
  const episodios = await Promise.all([
    p.episodioAtencion.create({ data: { id: uid(), pacienteId: pacientes[0].id, tipo: 'CONSULTA_EXTERNA', estado: 'FINALIZADO', fechaInicio: date(30), fechaFin: date(30), motivo: 'Dolor de cabeza persistente', prioridad: 'NORMAL' } }),
    p.episodioAtencion.create({ data: { id: uid(), pacienteId: pacientes[1].id, tipo: 'CONSULTA_EXTERNA', estado: 'FINALIZADO', fechaInicio: date(25), fechaFin: date(25), motivo: 'Control de presión arterial', prioridad: 'NORMAL' } }),
    p.episodioAtencion.create({ data: { id: uid(), pacienteId: pacientes[2].id, tipo: 'EMERGENCIA', estado: 'FINALIZADO', fechaInicio: date(20), fechaFin: date(20), motivo: 'Dolor abdominal agudo', prioridad: 'URGENTE' } }),
    p.episodioAtencion.create({ data: { id: uid(), pacienteId: pacientes[3].id, tipo: 'CONSULTA_EXTERNA', estado: 'FINALIZADO', fechaInicio: date(15), motivo: 'Fiebre en niño de 5 años', prioridad: 'NORMAL' } }),
    p.episodioAtencion.create({ data: { id: uid(), pacienteId: pacientes[4].id, tipo: 'CONSULTA_EXTERNA', estado: 'FINALIZADO', fechaInicio: date(12), fechaFin: date(12), motivo: 'Dolor lumbar bajo', prioridad: 'NORMAL' } }),
    p.episodioAtencion.create({ data: { id: uid(), pacienteId: pacientes[5].id, tipo: 'CONSULTA_EXTERNA', estado: 'EN_CURSO', fechaInicio: date(2), motivo: 'Revisión de resultados de laboratorio', prioridad: 'NORMAL' } }),
    p.episodioAtencion.create({ data: { id: uid(), pacienteId: pacientes[6].id, tipo: 'CONSULTA_EXTERNA', estado: 'FINALIZADO', fechaInicio: date(8), fechaFin: date(8), motivo: 'Dermatitis en brazos', prioridad: 'NORMAL' } }),
    p.episodioAtencion.create({ data: { id: uid(), pacienteId: pacientes[7].id, tipo: 'EMERGENCIA', estado: 'FINALIZADO', fechaInicio: date(10), fechaFin: date(10), motivo: 'Traumatismo en miembro inferior', prioridad: 'EMERGENCIA' } }),
    p.episodioAtencion.create({ data: { id: uid(), pacienteId: pacientes[8].id, tipo: 'CONSULTA_EXTERNA', estado: 'ABIERTO', fechaInicio: date(1), motivo: 'Dolor articular en rodillas', prioridad: 'NORMAL' } }),
    p.episodioAtencion.create({ data: { id: uid(), pacienteId: pacientes[9].id, tipo: 'CONSULTA_EXTERNA', estado: 'FINALIZADO', fechaInicio: date(7), fechaFin: date(7), motivo: 'Revisión oftmológica anual', prioridad: 'NORMAL' } }),
    p.episodioAtencion.create({ data: { id: uid(), pacienteId: pacientes[10].id, tipo: 'CONSULTA_EXTERNA', estado: 'FINALIZADO', fechaInicio: date(5), fechaFin: date(5), motivo: 'Gastroenteritis aguda', prioridad: 'NORMAL' } }),
    p.episodioAtencion.create({ data: { id: uid(), pacienteId: pacientes[11].id, tipo: 'CONSULTA_EXTERNA', estado: 'ABIERTO', fechaInicio: date(0), motivo: 'Examen médico de rutina', prioridad: 'NORMAL' } }),
  ]);

  console.log('  Creating citas...');
  const citas = await Promise.all([
    p.cita.create({ data: { id: uid(), pacienteId: pacientes[0].id, medicoId: medicos[0].id, especialidadId: especialidades[0].id, consultorioId: consultorios[0].id, episodioId: episodios[0].id, fechaHoraInicio: date(30), fechaHoraFin: new Date(date(30).getTime() + 30 * 60000), estado: 'ATENDIDA', motivo: 'Dolor de cabeza' } }),
    p.cita.create({ data: { id: uid(), pacienteId: pacientes[1].id, medicoId: medicos[0].id, especialidadId: especialidades[0].id, consultorioId: consultorios[0].id, episodioId: episodios[1].id, fechaHoraInicio: date(25), fechaHoraFin: new Date(date(25).getTime() + 30 * 60000), estado: 'ATENDIDA', motivo: 'Control de presión' } }),
    p.cita.create({ data: { id: uid(), pacienteId: pacientes[2].id, medicoId: medicos[2].id, especialidadId: especialidades[3].id, consultorioId: consultorios[5].id, episodioId: episodios[2].id, fechaHoraInicio: date(20), fechaHoraFin: new Date(date(20).getTime() + 45 * 60000), estado: 'ATENDIDA', motivo: 'Dolor abdominal' } }),
    p.cita.create({ data: { id: uid(), pacienteId: pacientes[3].id, medicoId: medicos[1].id, especialidadId: especialidades[1].id, consultorioId: consultorios[1].id, episodioId: episodios[3].id, fechaHoraInicio: date(15), fechaHoraFin: new Date(date(15).getTime() + 30 * 60000), estado: 'ATENDIDA', motivo: 'Fiebre en niño' } }),
    p.cita.create({ data: { id: uid(), pacienteId: pacientes[4].id, medicoId: medicos[2].id, especialidadId: especialidades[3].id, consultorioId: consultorios[2].id, episodioId: episodios[4].id, fechaHoraInicio: date(12), fechaHoraFin: new Date(date(12).getTime() + 30 * 60000), estado: 'ATENDIDA', motivo: 'Dolor lumbar' } }),
    p.cita.create({ data: { id: uid(), pacienteId: pacientes[5].id, medicoId: medicos[0].id, especialidadId: especialidades[0].id, consultorioId: consultorios[0].id, episodioId: episodios[5].id, fechaHoraInicio: date(2), fechaHoraFin: new Date(date(2).getTime() + 30 * 60000), estado: 'EN_ATENCION', motivo: 'Revisión resultados' } }),
    p.cita.create({ data: { id: uid(), pacienteId: pacientes[6].id, medicoId: medicos[1].id, especialidadId: especialidades[1].id, consultorioId: consultorios[1].id, episodioId: episodios[6].id, fechaHoraInicio: date(8), fechaHoraFin: new Date(date(8).getTime() + 30 * 60000), estado: 'ATENDIDA', motivo: 'Dermatitis' } }),
    p.cita.create({ data: { id: uid(), pacienteId: pacientes[7].id, medicoId: medicos[2].id, especialidadId: especialidades[3].id, consultorioId: consultorios[5].id, episodioId: episodios[7].id, fechaHoraInicio: date(10), fechaHoraFin: new Date(date(10).getTime() + 45 * 60000), estado: 'ATENDIDA', motivo: 'Traumatismo' } }),
    p.cita.create({ data: { id: uid(), pacienteId: pacientes[8].id, medicoId: medicos[0].id, especialidadId: especialidades[0].id, consultorioId: consultorios[0].id, episodioId: episodios[8].id, fechaHoraInicio: new Date(), fechaHoraFin: new Date(new Date().getTime() + 30 * 60000), estado: 'PROGRAMADA', motivo: 'Dolor articular' } }),
    p.cita.create({ data: { id: uid(), pacienteId: pacientes[10].id, medicoId: medicos[1].id, especialidadId: especialidades[1].id, consultorioId: consultorios[1].id, episodioId: episodios[10].id, fechaHoraInicio: date(5), fechaHoraFin: new Date(date(5).getTime() + 30 * 60000), estado: 'ATENDIDA', motivo: 'Gastroenteritis' } }),
    p.cita.create({ data: { id: uid(), pacienteId: pacientes[11].id, medicoId: medicos[0].id, especialidadId: especialidades[7].id, consultorioId: consultorios[3].id, episodioId: episodios[11].id, fechaHoraInicio: new Date(), fechaHoraFin: new Date(new Date().getTime() + 30 * 60000), estado: 'PROGRAMADA', motivo: 'Examen de rutina' } }),
    p.cita.create({ data: { id: uid(), pacienteId: pacientes[0].id, medicoId: medicos[0].id, especialidadId: especialidades[0].id, consultorioId: consultorios[0].id, fechaHoraInicio: new Date(new Date().getTime() + 86400000 * 3), fechaHoraFin: new Date(new Date().getTime() + 86400000 * 3 + 30 * 60000), estado: 'PROGRAMADA', motivo: 'Seguimiento cardiaco' } }),
    p.cita.create({ data: { id: uid(), pacienteId: pacientes[4].id, medicoId: medicos[2].id, especialidadId: especialidades[3].id, consultorioId: consultorios[2].id, fechaHoraInicio: new Date(new Date().getTime() + 86400000 * 5), fechaHoraFin: new Date(new Date().getTime() + 86400000 * 5 + 30 * 60000), estado: 'CANCELADA', motivo: 'Control lumbar', motivoCancelacion: 'El paciente solicitó reprogramación' } }),
  ]);

  // ═══════════════════════════════════════════════════════════
  // NIVEL 8 — Consultas, Signos Vitales, Diagnósticos, Notas
  // ═══════════════════════════════════════════════════════════

  console.log('  Creating consultas...');
  const consultas = await Promise.all([
    p.consulta.create({ data: { id: uid(), episodioId: episodios[0].id, citaId: citas[0].id, historiaClinicaId: historias[0].id, medicoId: medicos[0].id, estado: 'CERRADA', motivoConsulta: 'Cefalea tensional recurrente', exploracionFisica: 'Paciente consciente, orientado. Signos vitales dentro de parámetros normales.', impresionDiagnostica: 'Cefalea tensional', planTratamiento: 'Paracetamol 500mg cada 8 horas por 5 días. Reposo relativo.' } }),
    p.consulta.create({ data: { id: uid(), episodioId: episodios[1].id, citaId: citas[1].id, historiaClinicaId: historias[1].id, medicoId: medicos[0].id, estado: 'CERRADA', motivoConsulta: 'Control de presión arterial', exploracionFisica: 'PA: 140/90 mmHg. FC: 78 lpm. Peso: 85kg.', impresionDiagnostica: 'Hipertensión arterial no controlada', planTratamiento: 'Ajustar dosis de Losartán a 100mg. Control en 1 mes.' } }),
    p.consulta.create({ data: { id: uid(), episodioId: episodios[2].id, citaId: citas[2].id, historiaClinicaId: historias[2].id, medicoId: medicos[2].id, estado: 'CERRADA', motivoConsulta: 'Dolor abdominal agudo en fosa ilíaca derecha', exploracionFisica: 'Abdomen blando, depresible, dolor en FID. Defensa muscular leve.', impresionDiagnostica: 'Apendicitis aguda', planTratamiento: 'Interconsulta quirúrgica. Ayuno. Hidratación endovenosa.' } }),
    p.consulta.create({ data: { id: uid(), episodioId: episodios[3].id, citaId: citas[3].id, historiaClinicaId: historias[3].id, medicoId: medicos[1].id, estado: 'CERRADA', motivoConsulta: 'Fiebre de 39°C en niño de 5 años', exploracionFisica: 'T: 39.2°C. FR: 24 rpm. Oropharinge eritematosa. AMQ+', impresionDiagnostica: 'Infección aguda de vías respiratorias superiores', planTratamiento: 'Paracetamol 15mg/kg cada 6h. Hidratación abundante. Control en 48h.' } }),
    p.consulta.create({ data: { id: uid(), episodioId: episodios[4].id, citaId: citas[4].id, historiaClinicaId: historias[4].id, medicoId: medicos[2].id, estado: 'CERRADA', motivoConsulta: 'Dolor lumbar bajo de 2 semanas de evolución', exploracionFisica: 'Columna lumbar con limitación de movimiento. Lasègue negativo.', impresionDiagnostica: 'Lumbalgia mecánica', planTratamiento: 'Diclofenaco 50mg cada 12h. Fisioterapia. Evitar esfuerzos.' } }),
    p.consulta.create({ data: { id: uid(), episodioId: episodios[5].id, citaId: citas[5].id, historiaClinicaId: historias[5].id, medicoId: medicos[0].id, estado: 'ABIERTA', motivoConsulta: 'Revisión de resultados de perfil lipídico', exploracionFisica: 'PA: 120/80 mmHg. FC: 72 lpm. Peso: 72kg.', impresionDiagnostica: 'Dislipidemia - en evaluación', planTratamiento: 'Solicitar HbA1c. Continuar dieta.' } }),
    p.consulta.create({ data: { id: uid(), episodioId: episodios[6].id, citaId: citas[6].id, historiaClinicaId: historias[6].id, medicoId: medicos[1].id, estado: 'CERRADA', motivoConsulta: 'Lesiones eritematosas en ambos brazos', exploracionFisica: 'Máculas eritematosas pruriginosas en antebrazos bilateral.', impresionDiagnostica: 'Dermatitis de contacto', planTratamiento: 'Prednisona 20mg/día por 5 días. Crema de hidrocortisona tópica.' } }),
    p.consulta.create({ data: { id: uid(), episodioId: episodios[7].id, citaId: citas[7].id, historiaClinicaId: historias[7].id, medicoId: medicos[2].id, estado: 'CERRADA', motivoConsulta: 'Traumatismo en tobillo derecho por caída', exploracionFisica: 'Edema maleolar externo. Movilidad conservada. Dolor a la palpación.', impresionDiagnostica: 'Esguince de tobillo grado II', planTratamiento: 'Inmovilización. Hielo. Analgesia. Control en 1 semana.' } }),
    p.consulta.create({ data: { id: uid(), episodioId: episodios[10].id, citaId: citas[9].id, historiaClinicaId: historias[10].id, medicoId: medicos[1].id, estado: 'CERRADA', motivoConsulta: 'Diarrea y vómitos desde hace 24 horas', exploracionFisica: 'T: 37.5°C. Mucosas orales semihúmedas. Abdomen blando, dolor difuso.', impresionDiagnostica: 'Gastroenteritis aguda viral', planTratamiento: 'Hidratación oral. dieta blanda. Probióticos.' } }),
  ]);

  console.log('  Creating signos vitales...');
  await p.signoVital.createMany({ data: [
    { id: uid(), consultaId: consultas[0].id, registradoPor: usuarios[3].id, presionSistolica: 120, presionDiastolica: 80, frecuenciaCardiaca: 72, frecuenciaRespiratoria: 16, temperatura: 36.5, saturacionOxigeno: 98, pesoKg: 68, tallaCm: 165 },
    { id: uid(), consultaId: consultas[1].id, registradoPor: usuarios[3].id, presionSistolica: 140, presionDiastolica: 90, frecuenciaCardiaca: 78, frecuenciaRespiratoria: 18, temperatura: 36.8, saturacionOxigeno: 97, pesoKg: 85, tallaCm: 172 },
    { id: uid(), consultaId: consultas[2].id, registradoPor: usuarios[3].id, presionSistolica: 130, presionDiastolica: 85, frecuenciaCardiaca: 90, frecuenciaRespiratoria: 20, temperatura: 37.8, saturacionOxigeno: 97 },
    { id: uid(), consultaId: consultas[3].id, registradoPor: usuarios[3].id, presionSistolica: 100, presionDiastolica: 65, frecuenciaCardiaca: 110, frecuenciaRespiratoria: 24, temperatura: 39.2, saturacionOxigeno: 96, pesoKg: 18, tallaCm: 110 },
    { id: uid(), consultaId: consultas[4].id, registradoPor: usuarios[3].id, presionSistolica: 118, presionDiastolica: 76, frecuenciaCardiaca: 68, frecuenciaRespiratoria: 14, temperatura: 36.4, saturacionOxigeno: 99, pesoKg: 72, tallaCm: 170 },
    { id: uid(), consultaId: consultas[5].id, registradoPor: usuarios[3].id, presionSistolica: 120, presionDiastolica: 80, frecuenciaCardiaca: 72, frecuenciaRespiratoria: 16, temperatura: 36.6, saturacionOxigeno: 98, pesoKg: 72, tallaCm: 170 },
    { id: uid(), consultaId: consultas[6].id, registradoPor: usuarios[3].id, presionSistolica: 115, presionDiastolica: 75, frecuenciaCardiaca: 76, frecuenciaRespiratoria: 16, temperatura: 36.7, saturacionOxigeno: 98 },
    { id: uid(), consultaId: consultas[7].id, registradoPor: usuarios[3].id, presionSistolica: 135, presionDiastolica: 88, frecuenciaCardiaca: 85, frecuenciaRespiratoria: 18, temperatura: 36.9, saturacionOxigeno: 97, pesoKg: 78, tallaCm: 168 },
    { id: uid(), consultaId: consultas[8].id, registradoPor: usuarios[3].id, presionSistolica: 122, presionDiastolica: 78, frecuenciaCardiaca: 70, frecuenciaRespiratoria: 15, temperatura: 36.5, saturacionOxigeno: 99, pesoKg: 65, tallaCm: 160 },
  ] });

  console.log('  Creating diagnostico-consultas...');
  await p.consultaDiagnostico.createMany({ data: [
    { consultaId: consultas[0].id, diagnosticoId: diagnosticos[8].id, tipo: 'PRINCIPAL', observaciones: 'Cefalea tensional recurrente' },
    { consultaId: consultas[1].id, diagnosticoId: diagnosticos[1].id, tipo: 'PRINCIPAL', observaciones: 'PA elevada, ajustar medicación' },
    { consultaId: consultas[2].id, diagnosticoId: diagnosticos[4].id, tipo: 'PRINCIPAL', observaciones: 'Compatible con apendicitis' },
    { consultaId: consultas[3].id, diagnosticoId: diagnosticos[0].id, tipo: 'PRINCIPAL', observaciones: 'IVAS en paciente pediátrico' },
    { consultaId: consultas[4].id, diagnosticoId: diagnosticos[3].id, tipo: 'PRINCIPAL', observaciones: 'Lumbalgia mecánica' },
    { consultaId: consultas[5].id, diagnosticoId: diagnosticos[1].id, tipo: 'SECUNDARIO', observaciones: 'Evaluar control lipídico' },
    { consultaId: consultas[6].id, diagnosticoId: diagnosticos[7].id, tipo: 'PRINCIPAL', observaciones: 'Dermatitis de contacto' },
    { consultaId: consultas[7].id, diagnosticoId: diagnosticos[3].id, tipo: 'PRINCIPAL', observaciones: 'Esguince maleolar' },
    { consultaId: consultas[8].id, diagnosticoId: diagnosticos[9].id, tipo: 'PRINCIPAL', observaciones: 'Gastroenteritis aguda' },
  ] });

  console.log('  Creating notas de evolucion...');
  await p.notaEvolucion.createMany({ data: [
    { id: uid(), episodioId: episodios[0].id, consultaId: consultas[0].id, tipo: 'MEDICA', contenido: 'Paciente refiere cefalea de 3 días de evolución, tipo opresivo, bifrontal. No presenta náuseas ni vómitos. Se indica paracetamol y reposo.', autorUsuarioId: usuarios[2].id },
    { id: uid(), episodioId: episodios[1].id, consultaId: consultas[1].id, tipo: 'MEDICA', contenido: 'Control de HTA. PA 140/90. Se ajusta Losartán a 100mg. Se solicita perfil lipídico y creatinina.', autorUsuarioId: usuarios[2].id },
    { id: uid(), episodioId: episodios[2].id, consultaId: consultas[2].id, tipo: 'MEDICA', contenido: 'Cuadro compatible con apendicitis aguda. Se solicita interconsulta quirúrgica urgente. Se inicia HVO y ayuno.', autorUsuarioId: usuarios[2].id },
    { id: uid(), episodioId: episodios[2].id, tipo: 'ENFERMERIA', contenido: 'Paciente con SV estables. Se canaliza vía periférica. Se inicia hidratación con SSN 1000ml/8h.', autorUsuarioId: usuarios[3].id },
    { id: uid(), episodioId: episodios[3].id, consultaId: consultas[3].id, tipo: 'MEDICA', contenido: 'Fiebre en niño. T 39.2°C. Se indica paracetamol VO. Madre refiere que el niño ha tolerado líquidos.', autorUsuarioId: usuarios[4].id },
    { id: uid(), episodioId: episodios[4].id, consultaId: consultas[4].id, tipo: 'MEDICA', contenido: 'Dolor lumbar mecánico. Sin signos de alarma. Se indica Diclofenaco y fisioterapia.', autorUsuarioId: usuarios[2].id },
    { id: uid(), episodioId: episodios[7].id, consultaId: consultas[7].id, tipo: 'MEDICA', contenido: 'Esguince de tobillo grado II. Se realiza inmovilización con vendaje funcional. Se indica hielo y analgesia.', autorUsuarioId: usuarios[2].id },
    { id: uid(), episodioId: episodios[10].id, consultaId: consultas[8].id, tipo: 'MEDICA', contenido: 'Gastroenteritis aguda viral. Paciente con deshidratación leve. Se inicia rehidratación oral.', autorUsuarioId: usuarios[4].id },
    { id: uid(), episodioId: episodios[10].id, tipo: 'ENFERMERIA', contenido: 'Control de signos vitales cada 4 horas. Registrar balance hídrico. Dieta blanda.', autorUsuarioId: usuarios[5].id },
  ] });

  // ═══════════════════════════════════════════════════════════
  // NIVEL 9 — Órdenes de Laboratorio, Lotes, Compras
  // ═══════════════════════════════════════════════════════════

  console.log('  Creating ordenes de laboratorio...');
  const ordenesLab = await Promise.all([
    p.ordenLaboratorio.create({ data: { id: uid(), consultaId: consultas[1].id, solicitadoPorMedicoId: medicos[0].id, prioridad: 'NORMAL', estado: 'COMPLETADA', indicaciones: 'Perfil lipídico completo en ayunas' } }),
    p.ordenLaboratorio.create({ data: { id: uid(), consultaId: consultas[5].id, solicitadoPorMedicoId: medicos[0].id, prioridad: 'NORMAL', estado: 'EN_PROCESO', indicaciones: 'Hemograma y HbA1c' } }),
    p.ordenLaboratorio.create({ data: { id: uid(), consultaId: consultas[8].id, solicitadoPorMedicoId: medicos[1].id, prioridad: 'URGENTE', estado: 'PENDIENTE', indicaciones: 'Electrolitos séricos y función renal' } }),
  ]);

  console.log('  Creating detalle ordenes lab...');
  const detLab1 = await p.detalleOrdenLab.create({ data: { id: uid(), ordenId: ordenesLab[0].id, tipoExamenId: tiposExamen[2].id, estado: 'COMPLETADA' } });
  const detLab2 = await p.detalleOrdenLab.create({ data: { id: uid(), ordenId: ordenesLab[0].id, tipoExamenId: tiposExamen[9].id, estado: 'COMPLETADA' } });
  const detLab3 = await p.detalleOrdenLab.create({ data: { id: uid(), ordenId: ordenesLab[1].id, tipoExamenId: tiposExamen[0].id, estado: 'EN_PROCESO' } });
  const detLab4 = await p.detalleOrdenLab.create({ data: { id: uid(), ordenId: ordenesLab[1].id, tipoExamenId: tiposExamen[6].id, estado: 'PENDIENTE' } });
  const detLab5 = await p.detalleOrdenLab.create({ data: { id: uid(), ordenId: ordenesLab[2].id, tipoExamenId: tiposExamen[7].id, estado: 'PENDIENTE' } });

  console.log('  Creating muestras...');
  await Promise.all([
    p.muestra.create({ data: { id: uid(), detalleOrdenId: detLab1.id, codigoMuestra: 'MUE-2026-001', tipoMuestra: 'Sangre venosa', estado: 'PROCESADA', recolectadaEn: date(24), recolectadaPor: 'Enf. Carmen Torres', recibidaEn: date(24), recibidaPor: 'Lab. Roberto' } }),
    p.muestra.create({ data: { id: uid(), detalleOrdenId: detLab2.id, codigoMuestra: 'MUE-2026-002', tipoMuestra: 'Sangre venosa', estado: 'PROCESADA', recolectadaEn: date(24), recolectadaPor: 'Enf. Carmen Torres', recibidaEn: date(24), recibidaPor: 'Lab. Roberto' } }),
    p.muestra.create({ data: { id: uid(), detalleOrdenId: detLab3.id, codigoMuestra: 'MUE-2026-003', tipoMuestra: 'Sangre venosa', estado: 'RECOLECTADA', recolectadaEn: date(2), recolectadaPor: 'Enf. Patricia Mamani' } }),
  ]);

  console.log('  Creating lotes de medicamento...');
  const lotes = await Promise.all([
    p.loteMedicamento.create({ data: { id: uid(), medicamentoId: medicamentos[0].id, proveedorId: proveedores[0].id, codigoLote: 'LOT-2026-001', fechaVencimiento: new Date(2027, 11, 31), costoUnitario: 0.15, stockActual: 500 } }),
    p.loteMedicamento.create({ data: { id: uid(), medicamentoId: medicamentos[1].id, proveedorId: proveedores[0].id, codigoLote: 'LOT-2026-002', fechaVencimiento: new Date(2027, 10, 30), costoUnitario: 0.20, stockActual: 300 } }),
    p.loteMedicamento.create({ data: { id: uid(), medicamentoId: medicamentos[2].id, proveedorId: proveedores[1].id, codigoLote: 'LOT-2026-003', fechaVencimiento: new Date(2027, 9, 28), costoUnitario: 0.35, stockActual: 200 } }),
    p.loteMedicamento.create({ data: { id: uid(), medicamentoId: medicamentos[3].id, proveedorId: proveedores[0].id, codigoLote: 'LOT-2026-004', fechaVencimiento: new Date(2027, 8, 31), costoUnitario: 0.25, stockActual: 250 } }),
    p.loteMedicamento.create({ data: { id: uid(), medicamentoId: medicamentos[4].id, proveedorId: proveedores[2].id, codigoLote: 'LOT-2026-005', fechaVencimiento: new Date(2027, 7, 30), costoUnitario: 0.30, stockActual: 150 } }),
    p.loteMedicamento.create({ data: { id: uid(), medicamentoId: medicamentos[5].id, proveedorId: proveedores[1].id, codigoLote: 'LOT-2026-006', fechaVencimiento: new Date(2027, 6, 31), costoUnitario: 0.22, stockActual: 180 } }),
    p.loteMedicamento.create({ data: { id: uid(), medicamentoId: medicamentos[6].id, proveedorId: proveedores[2].id, codigoLote: 'LOT-2026-007', fechaVencimiento: new Date(2027, 5, 30), costoUnitario: 2.50, stockActual: 40 } }),
    p.loteMedicamento.create({ data: { id: uid(), medicamentoId: medicamentos[7].id, proveedorId: proveedores[0].id, codigoLote: 'LOT-2026-008', fechaVencimiento: new Date(2027, 11, 31), costoUnitario: 0.18, stockActual: 350 } }),
    p.loteMedicamento.create({ data: { id: uid(), medicamentoId: medicamentos[8].id, proveedorId: proveedores[1].id, codigoLote: 'LOT-2026-009', fechaVencimiento: new Date(2027, 10, 30), costoUnitario: 0.40, stockActual: 120 } }),
    p.loteMedicamento.create({ data: { id: uid(), medicamentoId: medicamentos[9].id, proveedorId: proveedores[2].id, codigoLote: 'LOT-2026-010', fechaVencimiento: new Date(2027, 9, 28), costoUnitario: 0.38, stockActual: 100 } }),
  ]);

  console.log('  Creating compras...');
  const compras = await Promise.all([
    p.compra.create({ data: { id: uid(), proveedorId: proveedores[0].id, numeroDocumento: 'FAC-2026-001', fechaCompra: date(60), estado: 'RECIBIDA', subtotal: 300, descuento: 0, total: 300, registradaPor: usuarios[6].id, observaciones: 'Compra de analgésicos' } }),
    p.compra.create({ data: { id: uid(), proveedorId: proveedores[1].id, numeroDocumento: 'FAC-2026-002', fechaCompra: date(45), estado: 'RECIBIDA', subtotal: 450, descuento: 10, total: 440, registradaPor: usuarios[6].id, observaciones: 'Compra de antibióticos' } }),
    p.compra.create({ data: { id: uid(), proveedorId: proveedores[2].id, numeroDocumento: 'FAC-2026-003', fechaCompra: date(30), estado: 'RECIBIDA', subtotal: 200, descuento: 0, total: 200, registradaPor: usuarios[6].id, observaciones: 'Compra de inhaladores' } }),
  ]);

  console.log('  Creating detalle compras...');
  await p.detalleCompra.createMany({ data: [
    { id: uid(), compraId: compras[0].id, loteId: lotes[0].id, cantidad: 200, costoUnitario: 0.15 },
    { id: uid(), compraId: compras[0].id, loteId: lotes[1].id, cantidad: 150, costoUnitario: 0.20 },
    { id: uid(), compraId: compras[0].id, loteId: lotes[7].id, cantidad: 100, costoUnitario: 0.18 },
    { id: uid(), compraId: compras[1].id, loteId: lotes[2].id, cantidad: 100, costoUnitario: 0.35 },
    { id: uid(), compraId: compras[1].id, loteId: lotes[8].id, cantidad: 50, costoUnitario: 0.40 },
    { id: uid(), compraId: compras[2].id, loteId: lotes[6].id, cantidad: 20, costoUnitario: 2.50 },
  ] });

  // ═══════════════════════════════════════════════════════════
  // NIVEL 10 — Resultados Lab, Recetas
  // ═══════════════════════════════════════════════════════════

  console.log('  Creating resultados de laboratorio...');
  await Promise.all([
    p.resultadoLab.create({ data: { id: uid(), detalleOrdenId: detLab1.id, estado: 'VALIDADO', resultadoTexto: 'Colesterol elevado', valorNumerico: 245, unidad: 'mg/dL', rangoReferencia: '<200 mg/dL', esAnormal: true, registradoPor: usuarios[2].id, validadoPor: usuarios[2].id, validadoEn: date(23), observaciones: 'Colesterol total elevado. Se recomienda dieta y control.' } }),
    p.resultadoLab.create({ data: { id: uid(), detalleOrdenId: detLab2.id, estado: 'VALIDADO', resultadoTexto: 'Perfil lipídico completo', valorNumerico: null, unidad: '', rangoReferencia: '', esAnormal: true, registradoPor: usuarios[2].id, validadoPor: usuarios[2].id, validadoEn: date(23), observaciones: 'CT: 245, LDL: 160, HDL: 38, TG: 180. Dislipidemia mixta.' } }),
    p.resultadoLab.create({ data: { id: uid(), detalleOrdenId: detLab3.id, estado: 'BORRADOR', resultadoTexto: 'Hemograma en proceso', valorNumerico: 14.2, unidad: 'g/dL', rangoReferencia: '12-16 g/dL', esAnormal: false, registradoPor: usuarios[2].id } }),
  ]);

  console.log('  Creating ordenes de imagenologia...');
  const ordenesImg = await Promise.all([
    p.ordenImagenologia.create({ data: { id: uid(), consultaId: consultas[2].id, solicitadoPorMedicoId: medicos[2].id, prioridad: 'URGENTE', estado: 'COMPLETADA', indicaciones: 'Radiografía de tórax para descartar patología pulmonar' } }),
    p.ordenImagenologia.create({ data: { id: uid(), consultaId: consultas[4].id, solicitadoPorMedicoId: medicos[2].id, prioridad: 'NORMAL', estado: 'COMPLETADA', indicaciones: 'Ecografía de columna lumbar' } }),
  ]);

  console.log('  Creating detalle ordenes imagenologia...');
  const detImg1 = await p.detalleOrdenImg.create({ data: { id: uid(), ordenId: ordenesImg[0].id, tipoEstudioId: tiposEstudio[0].id, estado: 'COMPLETADA', regionAnatomica: 'Tórax' } });
  const detImg2 = await p.detalleOrdenImg.create({ data: { id: uid(), ordenId: ordenesImg[1].id, tipoEstudioId: tiposEstudio[1].id, estado: 'COMPLETADA', regionAnatomica: 'Abdomen inferior' } });

  console.log('  Creating resultados de imagenologia...');
  await Promise.all([
    p.resultadoImg.create({ data: { id: uid(), detalleOrdenId: detImg1.id, estado: 'VALIDADO', informe: 'Radiografía de tórax PA y lateral. Campos pulmonares limpios. Silueta cardíaca normal. No se observan derrames pleurales.', conclusion: 'Radiografía de tórax normal', registradoPor: usuarios[2].id, validadoPor: usuarios[2].id, validadoEn: date(19) } }),
    p.resultadoImg.create({ data: { id: uid(), detalleOrdenId: detImg2.id, estado: 'VALIDADO', informe: 'Ecografía abdominal. Hígado de tamaño normal, ecoestructura homogénea. Vesícula sin litos. Riñones sin dilatación de系统尿路.', conclusion: 'Ecografía abdominal sin hallazgos patológicos significativos', registradoPor: usuarios[2].id, validadoPor: usuarios[2].id, validadoEn: date(11) } }),
  ]);

  // ═══════════════════════════════════════════════════════════
  // NIVEL 11 — Recetas
  // ═══════════════════════════════════════════════════════════

  console.log('  Creating recetas...');
  const recetas = await Promise.all([
    p.receta.create({ data: { id: uid(), consultaId: consultas[0].id, medicoId: medicos[0].id, estado: 'DISPENSADA', validaHasta: new Date(new Date().getTime() + 30 * 86400000), observaciones: 'Tomar después de las comidas' } }),
    p.receta.create({ data: { id: uid(), consultaId: consultas[1].id, medicoId: medicos[0].id, estado: 'DISPENSADA', validaHasta: new Date(new Date().getTime() + 30 * 86400000), observaciones: 'Tomar en la mañana' } }),
    p.receta.create({ data: { id: uid(), consultaId: consultas[3].id, medicoId: medicos[1].id, estado: 'EMITIDA', validaHasta: new Date(new Date().getTime() + 15 * 86400000) } }),
    p.receta.create({ data: { id: uid(), consultaId: consultas[4].id, medicoId: medicos[2].id, estado: 'EMITIDA', validaHasta: new Date(new Date().getTime() + 15 * 86400000) } }),
    p.receta.create({ data: { id: uid(), consultaId: consultas[6].id, medicoId: medicos[1].id, estado: 'EMITIDA', validaHasta: new Date(new Date().getTime() + 15 * 86400000) } }),
    p.receta.create({ data: { id: uid(), consultaId: consultas[7].id, medicoId: medicos[2].id, estado: 'EMITIDA', validaHasta: new Date(new Date().getTime() + 15 * 86400000) } }),
    p.receta.create({ data: { id: uid(), consultaId: consultas[8].id, medicoId: medicos[1].id, estado: 'EMITIDA', validaHasta: new Date(new Date().getTime() + 15 * 86400000) } }),
  ]);

  // ═══════════════════════════════════════════════════════════
  // NIVEL 12 — DetalleReceta, Dispensaciones
  // ═══════════════════════════════════════════════════════════

  console.log('  Creating detalle recetas...');
  const detRecetas = await Promise.all([
    p.detalleReceta.create({ data: { id: uid(), recetaId: recetas[0].id, medicamentoId: medicamentos[0].id, dosis: '500mg', viaAdministracion: 'Oral', frecuencia: 'Cada 8 horas', duracionDias: 5, cantidadPrescrita: 15, indicaciones: 'Tomar después de las comidas' } }),
    p.detalleReceta.create({ data: { id: uid(), recetaId: recetas[1].id, medicamentoId: medicamentos[4].id, dosis: '100mg', viaAdministracion: 'Oral', frecuencia: 'Cada 24 horas', duracionDias: 30, cantidadPrescrita: 30, indicaciones: 'Tomar en la mañana con el estómago vacío' } }),
    p.detalleReceta.create({ data: { id: uid(), recetaId: recetas[1].id, medicamentoId: medicamentos[2].id, dosis: '500mg', viaAdministracion: 'Oral', frecuencia: 'Cada 8 horas', duracionDias: 7, cantidadPrescrita: 21 } }),
    p.detalleReceta.create({ data: { id: uid(), recetaId: recetas[2].id, medicamentoId: medicamentos[0].id, dosis: '15mg/kg', viaAdministracion: 'Oral', frecuencia: 'Cada 6 horas', duracionDias: 3, cantidadPrescrita: 12 } }),
    p.detalleReceta.create({ data: { id: uid(), recetaId: recetas[3].id, medicamentoId: medicamentos[7].id, dosis: '50mg', viaAdministracion: 'Oral', frecuencia: 'Cada 12 horas', duracionDias: 10, cantidadPrescrita: 20 } }),
    p.detalleReceta.create({ data: { id: uid(), recetaId: recetas[4].id, medicamentoId: medicamentos[12].id, dosis: '20mg', viaAdministracion: 'Oral', frecuencia: 'Cada 24 horas', duracionDias: 5, cantidadPrescrita: 5 } }),
    p.detalleReceta.create({ data: { id: uid(), recetaId: recetas[5].id, medicamentoId: medicamentos[7].id, dosis: '50mg', viaAdministracion: 'Oral', frecuencia: 'Cada 12 horas', duracionDias: 7, cantidadPrescrita: 14 } }),
    p.detalleReceta.create({ data: { id: uid(), recetaId: recetas[6].id, medicamentoId: medicamentos[3].id, dosis: '20mg', viaAdministracion: 'Oral', frecuencia: 'Cada 24 horas', duracionDias: 10, cantidadPrescrita: 10 } }),
  ]);

  console.log('  Creating dispensaciones...');
  const dispensaciones = await Promise.all([
    p.dispensacion.create({ data: { id: uid(), recetaId: recetas[0].id, estado: 'ENTREGADA', dispensadaPor: usuarios[6].id, dispensadaEn: date(29), observaciones: 'Dispensación completa' } }),
    p.dispensacion.create({ data: { id: uid(), recetaId: recetas[1].id, estado: 'ENTREGADA', dispensadaPor: usuarios[6].id, dispensadaEn: date(24), observaciones: 'Dispensación completa' } }),
  ]);

  console.log('  Creating detalle dispensaciones...');
  await p.detalleDispensacion.createMany({ data: [
    { id: uid(), dispensacionId: dispensaciones[0].id, detalleRecetaId: detRecetas[0].id, loteId: lotes[0].id, cantidad: 15 },
    { id: uid(), dispensacionId: dispensaciones[1].id, detalleRecetaId: detRecetas[1].id, loteId: lotes[4].id, cantidad: 30 },
    { id: uid(), dispensacionId: dispensaciones[1].id, detalleRecetaId: detRecetas[2].id, loteId: lotes[2].id, cantidad: 21 },
  ] });

  // ═══════════════════════════════════════════════════════════
  // NIVEL 13 — Movimientos de Inventario
  // ═══════════════════════════════════════════════════════════

  console.log('  Creating movimientos de inventario...');
  const movimientos = await Promise.all([
    p.movimientoInventario.create({ data: { id: uid(), tipo: 'ENTRADA_COMPRA', fechaMovimiento: date(60), usuarioId: usuarios[6].id, compraId: compras[0].id, motivo: 'Ingreso de compra FAC-2026-001' } }),
    p.movimientoInventario.create({ data: { id: uid(), tipo: 'ENTRADA_COMPRA', fechaMovimiento: date(45), usuarioId: usuarios[6].id, compraId: compras[1].id, motivo: 'Ingreso de compra FAC-2026-002' } }),
    p.movimientoInventario.create({ data: { id: uid(), tipo: 'ENTRADA_COMPRA', fechaMovimiento: date(30), usuarioId: usuarios[6].id, compraId: compras[2].id, motivo: 'Ingreso de compra FAC-2026-003' } }),
    p.movimientoInventario.create({ data: { id: uid(), tipo: 'SALIDA_DISPENSACION', fechaMovimiento: date(29), usuarioId: usuarios[6].id, dispensacionId: dispensaciones[0].id, motivo: 'Dispensación receta #1' } }),
    p.movimientoInventario.create({ data: { id: uid(), tipo: 'SALIDA_DISPENSACION', fechaMovimiento: date(24), usuarioId: usuarios[6].id, dispensacionId: dispensaciones[1].id, motivo: 'Dispensación receta #2' } }),
  ]);

  console.log('  Creating detalle movimientos...');
  await p.detalleMovimiento.createMany({ data: [
    { id: uid(), movimientoId: movimientos[0].id, loteId: lotes[0].id, cantidad: 200, costoUnitario: 0.15 },
    { id: uid(), movimientoId: movimientos[0].id, loteId: lotes[1].id, cantidad: 150, costoUnitario: 0.20 },
    { id: uid(), movimientoId: movimientos[3].id, loteId: lotes[0].id, cantidad: -15, costoUnitario: 0.15 },
    { id: uid(), movimientoId: movimientos[4].id, loteId: lotes[4].id, cantidad: -30, costoUnitario: 0.30 },
    { id: uid(), movimientoId: movimientos[4].id, loteId: lotes[2].id, cantidad: -21, costoUnitario: 0.35 },
  ] });

  // ═══════════════════════════════════════════════════════════
  // NIVEL 14 — Prestaciones, Facturas, Pagos
  // ═══════════════════════════════════════════════════════════

  console.log('  Creating prestaciones de servicio...');
  const prestaciones = await Promise.all([
    p.prestacionServicio.create({ data: { id: uid(), servicioId: servicios[0].id, pacienteId: pacientes[0].id, episodioId: episodios[0].id, origen: 'CONSULTA', consultaId: consultas[0].id, descripcion: 'Consulta médica general', precioUnitario: 150, registradaPor: usuarios[1].id } }),
    p.prestacionServicio.create({ data: { id: uid(), servicioId: servicios[1].id, pacienteId: pacientes[1].id, episodioId: episodios[1].id, origen: 'CONSULTA', consultaId: consultas[1].id, descripcion: 'Consulta cardiológica', precioUnitario: 250, registradaPor: usuarios[1].id } }),
    p.prestacionServicio.create({ data: { id: uid(), servicioId: servicios[2].id, pacienteId: pacientes[1].id, episodioId: episodios[1].id, origen: 'LABORATORIO', descripcion: 'Análisis de laboratorio - Perfil lipídico', precioUnitario: 120, registradaPor: usuarios[1].id } }),
    p.prestacionServicio.create({ data: { id: uid(), servicioId: servicios[3].id, pacienteId: pacientes[1].id, episodioId: episodios[1].id, origen: 'LABORATORIO', descripcion: 'Análisis de laboratorio - HbA1c', precioUnitario: 200, registradaPor: usuarios[1].id } }),
    p.prestacionServicio.create({ data: { id: uid(), servicioId: servicios[4].id, pacienteId: pacientes[2].id, episodioId: episodios[2].id, origen: 'IMAGENOLOGIA', descripcion: 'Radiografía de tórax', precioUnitario: 180, registradaPor: usuarios[1].id } }),
    p.prestacionServicio.create({ data: { id: uid(), servicioId: servicios[1].id, pacienteId: pacientes[3].id, episodioId: episodios[3].id, origen: 'CONSULTA', consultaId: consultas[3].id, descripcion: 'Consulta pediátrica', precioUnitario: 250, registradaPor: usuarios[1].id } }),
    p.prestacionServicio.create({ data: { id: uid(), servicioId: servicios[0].id, pacienteId: pacientes[4].id, episodioId: episodios[4].id, origen: 'CONSULTA', consultaId: consultas[4].id, descripcion: 'Consulta de traumatología', precioUnitario: 150, registradaPor: usuarios[1].id } }),
    p.prestacionServicio.create({ data: { id: uid(), servicioId: servicios[5].id, pacienteId: pacientes[4].id, episodioId: episodios[4].id, origen: 'IMAGENOLOGIA', descripcion: 'Ecografía abdominal', precioUnitario: 250, registradaPor: usuarios[1].id } }),
    p.prestacionServicio.create({ data: { id: uid(), servicioId: servicios[0].id, pacienteId: pacientes[6].id, episodioId: episodios[6].id, origen: 'CONSULTA', consultaId: consultas[6].id, descripcion: 'Consulta dermatológica', precioUnitario: 150, registradaPor: usuarios[1].id } }),
    p.prestacionServicio.create({ data: { id: uid(), servicioId: servicios[0].id, pacienteId: pacientes[7].id, episodioId: episodios[7].id, origen: 'CONSULTA', consultaId: consultas[7].id, descripcion: 'Consulta de emergencia', precioUnitario: 350, registradaPor: usuarios[1].id } }),
    p.prestacionServicio.create({ data: { id: uid(), servicioId: servicios[0].id, pacienteId: pacientes[10].id, episodioId: episodios[10].id, origen: 'CONSULTA', consultaId: consultas[8].id, descripcion: 'Consulta médica general', precioUnitario: 150, registradaPor: usuarios[1].id } }),
  ]);

  console.log('  Creating facturas...');
  const facturas = await Promise.all([
    p.factura.create({ data: { id: uid(), pacienteId: pacientes[0].id, estado: 'PAGADA', fechaEmision: date(29), subtotal: 150, descuento: 0, total: 150, emitidaPor: usuarios[7].id } }),
    p.factura.create({ data: { id: uid(), pacienteId: pacientes[1].id, estado: 'PAGADA', fechaEmision: date(24), subtotal: 820, descuento: 20, total: 800, emitidaPor: usuarios[7].id } }),
    p.factura.create({ data: { id: uid(), pacienteId: pacientes[3].id, estado: 'EMITIDA', fechaEmision: date(14), subtotal: 250, descuento: 0, total: 250, emitidaPor: usuarios[7].id } }),
    p.factura.create({ data: { id: uid(), pacienteId: pacientes[4].id, estado: 'EMITIDA', fechaEmision: date(11), subtotal: 400, descuento: 0, total: 400, emitidaPor: usuarios[7].id } }),
    p.factura.create({ data: { id: uid(), pacienteId: pacientes[10].id, estado: 'BORRADOR', subtotal: 150, descuento: 0, total: 150, emitidaPor: usuarios[7].id } }),
  ]);

  console.log('  Creating detalle facturas...');
  await p.detalleFactura.createMany({ data: [
    { id: uid(), facturaId: facturas[0].id, prestacionId: prestaciones[0].id, descripcion: 'Consulta médica general', cantidad: 1, precioUnitario: 150, descuento: 0 },
    { id: uid(), facturaId: facturas[1].id, prestacionId: prestaciones[1].id, descripcion: 'Consulta cardiológica', cantidad: 1, precioUnitario: 250, descuento: 0 },
    { id: uid(), facturaId: facturas[1].id, prestacionId: prestaciones[2].id, descripcion: 'Análisis de laboratorio - Perfil lipídico', cantidad: 1, precioUnitario: 120, descuento: 0 },
    { id: uid(), facturaId: facturas[1].id, prestacionId: prestaciones[3].id, descripcion: 'Análisis de laboratorio - HbA1c', cantidad: 1, precioUnitario: 200, descuento: 0 },
    { id: uid(), facturaId: facturas[1].id, prestacionId: prestaciones[4].id, descripcion: 'Radiografía de tórax', cantidad: 1, precioUnitario: 180, descuento: 20 },
    { id: uid(), facturaId: facturas[2].id, prestacionId: prestaciones[5].id, descripcion: 'Consulta pediátrica', cantidad: 1, precioUnitario: 250, descuento: 0 },
    { id: uid(), facturaId: facturas[3].id, prestacionId: prestaciones[6].id, descripcion: 'Consulta de traumatología', cantidad: 1, precioUnitario: 150, descuento: 0 },
    { id: uid(), facturaId: facturas[3].id, prestacionId: prestaciones[7].id, descripcion: 'Ecografía abdominal', cantidad: 1, precioUnitario: 250, descuento: 0 },
    { id: uid(), facturaId: facturas[4].id, prestacionId: prestaciones[10].id, descripcion: 'Consulta médica general', cantidad: 1, precioUnitario: 150, descuento: 0 },
  ] });

  console.log('  Creating pagos...');
  await p.pago.createMany({ data: [
    { id: uid(), facturaId: facturas[0].id, fechaPago: date(29), monto: 150, metodo: 'EFECTIVO', registradoPor: usuarios[7].id },
    { id: uid(), facturaId: facturas[1].id, fechaPago: date(24), monto: 400, metodo: 'TARJETA', referencia: 'VISA **** 1234', registradoPor: usuarios[7].id },
    { id: uid(), facturaId: facturas[1].id, fechaPago: date(23), monto: 400, metodo: 'EFECTIVO', registradoPor: usuarios[7].id },
  ] });

  // ═══════════════════════════════════════════════════════════
  // NIVEL 15 — Alertas
  // ═══════════════════════════════════════════════════════════

  console.log('  Creating alertas...');
  await p.alerta.create({ data: { titulo: 'Bienvenida', mensaje: 'Sistema SIIH iniciado correctamente', severidad: 'INFO', estado: 'ACTIVA', origen: 'SISTEMA' } });
  await p.alerta.create({ data: { titulo: 'Stock bajo', mensaje: 'Paracetamol stock por debajo del mínimo', severidad: 'ADVERTENCIA', estado: 'ACTIVA', origen: 'FARMACIA' } });
  await p.alerta.create({ data: { titulo: 'Resultado pendiente', mensaje: 'Examen HbA1c del paciente María Condori está pendiente de validación', severidad: 'INFO', estado: 'ACTIVA', origen: 'LABORATORIO' } });
  await p.alerta.create({ data: { titulo: 'Mantenimiento programado', mensaje: 'El sistema será actualizado este fin de semana', severidad: 'INFO', estado: 'ACTIVA', origen: 'SISTEMA' } });
  await p.alerta.create({ data: { titulo: 'Factura vencida', mensaje: 'La factura #3 del paciente Juan Pablo Mamani lleva 14 días sin pagar', severidad: 'CRITICA', estado: 'ACTIVA', origen: 'FACTURACION' } });

  // ═══════════════════════════════════════════════════════════
  // RESUMEN
  // ═══════════════════════════════════════════════════════════

  const counts = {
    roles: await p.rol.count(),
    permisos: await p.permiso.count(),
    especialidades: await p.especialidad.count(),
    consultorios: await p.consultorio.count(),
    personas: await p.persona.count(),
    pacientes: await p.paciente.count(),
    empleados: await p.empleado.count(),
    medicos: await p.medico.count(),
    usuarios: await p.usuario.count(),
    historiasClinicas: await p.historiaClinica.count(),
    episodios: await p.episodioAtencion.count(),
    citas: await p.cita.count(),
    consultas: await p.consulta.count(),
    signosVitales: await p.signoVital.count(),
    diagnosticosCatalogo: await p.catalogoDiagnostico.count(),
    diagnosticosConsulta: await p.consultaDiagnostico.count(),
    notasEvolucion: await p.notaEvolucion.count(),
    tiposExamen: await p.tipoExamen.count(),
    ordenesLab: await p.ordenLaboratorio.count(),
    detalleOrdenLab: await p.detalleOrdenLab.count(),
    muestras: await p.muestra.count(),
    resultadosLab: await p.resultadoLab.count(),
    tiposEstudio: await p.tipoEstudio.count(),
    ordenesImg: await p.ordenImagenologia.count(),
    detalleOrdenImg: await p.detalleOrdenImg.count(),
    resultadosImg: await p.resultadoImg.count(),
    medicamentos: await p.medicamento.count(),
    proveedores: await p.proveedor.count(),
    lotes: await p.loteMedicamento.count(),
    compras: await p.compra.count(),
    detalleCompras: await p.detalleCompra.count(),
    recetas: await p.receta.count(),
    detalleRecetas: await p.detalleReceta.count(),
    dispensaciones: await p.dispensacion.count(),
    detalleDispensaciones: await p.detalleDispensacion.count(),
    movimientosInventario: await p.movimientoInventario.count(),
    servicios: await p.servicio.count(),
    prestaciones: await p.prestacionServicio.count(),
    facturas: await p.factura.count(),
    detalleFacturas: await p.detalleFactura.count(),
    pagos: await p.pago.count(),
    alertas: await p.alerta.count(),
  };

  console.log('\n  ═══ SEED COMPLETE ═══');
  console.log('  ─────────────────────────────────────');
  for (const [key, value] of Object.entries(counts)) {
    const num = typeof value === 'object' && value !== null && 'cnt' in value ? (value as any).cnt : value;
    console.log(`  ${key}: ${num}`);
  }
  console.log('  ─────────────────────────────────────');
  console.log(`  Password for all users: ${DEFAULT_PASSWORD}`);
  console.log(`  Admin login: admin / ${DEFAULT_PASSWORD}`);

  await p.$disconnect();
}

main()
  .catch(async (e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  });
