const { Client } = require('pg');
require('dotenv').config({ path: '.env' });
async function test() {
  const client = new Client({ connectionString: process.env.DATABASE_URL_MATCHING });
  await client.connect();
  const res = await client.query('SELECT * FROM "MatchCandidate"');
  console.log(`Matching DB has ${res.rows.length} candidates`);
  await client.end();
}
test();
