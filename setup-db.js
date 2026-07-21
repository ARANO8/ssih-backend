const { Client } = require('pg');

const createPatient = async () => {
  const client = new Client({
    user: 'admin',
    password: 'root',
    host: 'localhost',
    port: 55432,
    database: 'siih_hospital',
  });

  try {
    await client.connect();
    console.log('✓ Conectado a PostgreSQL');

    // Crear schema si no existen
    await client.query(`
      CREATE SCHEMA IF NOT EXISTS maestros;
      CREATE SCHEMA IF NOT EXISTS clinica;
      CREATE SCHEMA IF NOT EXISTS seguridad;
      CREATE SCHEMA IF NOT EXISTS facturacion;
      CREATE SCHEMA IF NOT EXISTS farmacia;
      CREATE SCHEMA IF NOT EXISTS imagenologia;
      CREATE SCHEMA IF NOT EXISTS laboratorio;
      CREATE SCHEMA IF NOT EXISTS auditoria;
    `);

    console.log('✓ Schemas creados/existentes');

    // Crear tabla persona
    await client.query(`
      CREATE TABLE IF NOT EXISTS maestros.persona (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        numeroDocumento VARCHAR(20) UNIQUE,
        tipoDocumento VARCHAR(10),
        nombres VARCHAR(100),
        apellidos VARCHAR(100),
        sexo CHAR(1),
        estadoCivil VARCHAR(20),
        fechaCreacion TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✓ Tabla persona lista');

    // Crear tabla paciente
    await client.query(`
      CREATE TABLE IF NOT EXISTS maestros.paciente (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        personaId UUID REFERENCES maestros.persona(id),
        email VARCHAR(100),
        telefonoPersonal VARCHAR(20),
        activo BOOLEAN DEFAULT TRUE,
        fechaCreacion TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✓ Tabla paciente lista');

    // Crear tabla archivo_clinico
    await client.query(`
      CREATE TABLE IF NOT EXISTS clinica.archivo_clinico (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        pacienteId UUID REFERENCES maestros.paciente(id),
        claveObjeto VARCHAR(500),
        nombreArchivo VARCHAR(255),
        tamaño INTEGER,
        tipoContenido VARCHAR(100),
        sha256 VARCHAR(64),
        categoria VARCHAR(40),
        subidoPor VARCHAR(120),
        contenedor VARCHAR(100),
        fechaCreacion TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✓ Tabla archivo_clinico lista');

    // Insertar persona
    const personaResult = await client.query(
      `INSERT INTO maestros.persona (numeroDocumento, tipoDocumento, nombres, apellidos, sexo, estadoCivil)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (numeroDocumento) DO UPDATE SET numeroDocumento = EXCLUDED.numeroDocumento
       RETURNING id`,
      ['12345678', 'CC', 'Juan', 'Perez', 'M', 'SOLTERO']
    );
    const personaId = personaResult.rows[0].id;
    console.log('✓ Persona insertada:', personaId);

    // Insertar paciente
    const pacienteResult = await client.query(
      `INSERT INTO maestros.paciente (personaId, email, telefonoPersonal)
       VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING
       RETURNING id`,
      [personaId, 'test@example.com', '1234567890']
    );

    if (pacienteResult.rows.length === 0) {
      const existing = await client.query(
        `SELECT id FROM maestros.paciente WHERE personaId = $1`,
        [personaId]
      );
      const pacienteId = existing.rows[0].id;
      console.log('✓ Paciente ya existe:', pacienteId);
      console.log('\nPaciente ID para subida:');
      console.log(pacienteId);
    } else {
      const pacienteId = pacienteResult.rows[0].id;
      console.log('✓ Paciente creado:', pacienteId);
      console.log('\nPaciente ID para subida:');
      console.log(pacienteId);
    }
  } catch (error) {
    console.error('✗ Error:', error.message);
    if (error.code) console.error('Código:', error.code);
  } finally {
    await client.end();
  }
};

createPatient();
