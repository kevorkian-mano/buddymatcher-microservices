const { Client } = require('pg');
require('dotenv').config();

const databases = [
  { name: 'User DB', url: process.env.DATABASE_URL_USER },
  { name: 'Profile DB', url: process.env.DATABASE_URL_PROFILE },
  { name: 'Availability DB', url: process.env.DATABASE_URL_AVAILABILITY },
  { name: 'Matching DB', url: process.env.DATABASE_URL_MATCHING },
  { name: 'Session DB', url: process.env.DATABASE_URL_SESSION },
  { name: 'Notification DB', url: process.env.DATABASE_URL_NOTIFICATION },
  { name: 'Messaging DB', url: process.env.DATABASE_URL_MESSAGING },
];

async function clearDatabase(dbName, connectionString) {
  if (!connectionString) {
    console.log(`Skipping ${dbName} - No connection string provided in .env`);
    return;
  }

  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    
    // Fetch all table names in the public schema
    const result = await client.query(`
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public';
    `);

    const tables = result.rows
      .map(row => row.tablename)
      .filter(name => name !== '_prisma_migrations'); // Don't drop prisma migration history

    if (tables.length === 0) {
      console.log(`[${dbName}] No tables to clean.`);
      return;
    }

    // Determine the query to Truncate all tables with cascade
    const tableList = tables.map(t => `"${t}"`).join(', ');
    console.log(`[${dbName}] Truncating tables: ${tables.join(', ')}`);
    
    await client.query(`TRUNCATE TABLE ${tableList} CASCADE;`);
    
    console.log(`[${dbName}] Successfully cleared all data.`);
  } catch (error) {
    console.error(`[${dbName}] Error clearing database:`, error.message);
  } finally {
    await client.end();
  }
}

async function runClean() {
  console.log('Starting massive database cleanup...\n');
  
  for (const db of databases) {
    await clearDatabase(db.name, db.url);
  }
  
  console.log('\nAll databases have been wiped clean!');
}

runClean();
