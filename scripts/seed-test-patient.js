const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString:
      process.env.DATABASE_URL ||
      'postgresql://admin:root@localhost:55432/siih_hospital',
  }),
});

async function main() {
  const persona = await prisma.persona.create({
    data: {
      tipoDocumento: 'CI',
      numeroDocumento: '12345678',
      nombres: 'Juan',
      apellidos: 'Perez',
      sexo: 'M',
      activo: true,
    },
  });

  const paciente = await prisma.paciente.create({
    data: {
      personaId: persona.id,
      activo: true,
    },
  });

  console.log(JSON.stringify({ personaId: persona.id, pacienteId: paciente.id }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
