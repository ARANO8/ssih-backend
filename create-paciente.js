const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const main = async () => {
  try {
    // Crear persona primero (si no existe)
    const persona = await prisma.maestros_persona.create({
      data: {
        numeroDocumento: '12345678',
        tipoDocumento: 'CC',
        nombres: 'Juan',
        apellidos: 'Perez',
        sexo: 'M',
        estadoCivil: 'SOLTERO',
      },
      select: { id: true },
    }).catch(e => {
      if (e.code === 'P2002') {
        console.log('Persona ya existe');
        return prisma.maestros_persona.findFirst({
          where: { numeroDocumento: '12345678' },
          select: { id: true },
        });
      }
      throw e;
    });

    console.log('✓ Persona ID:', persona.id);

    // Crear paciente
    const paciente = await prisma.maestros_paciente.create({
      data: {
        personaId: persona.id,
        email: 'test@example.com',
        telefonoPersonal: '1234567890',
      },
      select: { id: true },
    }).catch(async e => {
      if (e.code === 'P2002') {
        console.log('Paciente ya existe');
        const existingPaciente = await prisma.maestros_paciente.findFirst({
          where: { personaId: persona.id },
          select: { id: true },
        });
        return existingPaciente;
      }
      throw e;
    });

    console.log('✓ Paciente creado/encontrado con ID:', paciente.id);
    console.log('\nUsa este pacienteId para la prueba de subida:');
    console.log(paciente.id);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

main();
