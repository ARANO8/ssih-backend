const fs = require('node:fs');
const path = require('node:path');
const { Client } = require('pg');

const sqlFiles = [
  '08_final_demo.sql',
];

async function bootstrap() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    await client.query(`CREATE TABLE IF NOT EXISTS public.siih_bootstrap (version TEXT PRIMARY KEY, applied_at TIMESTAMP NOT NULL DEFAULT NOW())`);
    const result = await client.query(`SELECT version FROM public.siih_bootstrap WHERE version = $1`, ['final-v1']);
    if (result.rowCount) {
      console.log('SIIH database seed final-v1 already applied.');
      return;
    }
    for (const filename of sqlFiles) {
      console.log(`Applying ${filename}...`);
      const sql = fs.readFileSync(path.join(__dirname, '..', 'prisma', 'sql', filename), 'utf8');
      await client.query(sql);
    }
    await client.query(`INSERT INTO public.siih_bootstrap (version) VALUES ($1) ON CONFLICT DO NOTHING`, ['final-v1']);
    console.log('SIIH database bootstrap completed.');
  } finally {
    await client.end();
  }
}

bootstrap().catch((error) => {
  console.error('Database bootstrap failed:', error);
  process.exit(1);
});
