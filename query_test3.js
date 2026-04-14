const { Client } = require('pg');
require('dotenv').config({ path: '.env' });
async function test() {
  const client = new Client({ connectionString: process.env.DATABASE_URL_MATCHING });
  await client.connect();
  const res = await client.query('SELECT * FROM "MatchCandidate" LIMIT 3');
  console.log(JSON.stringify(res.rows, null, 2));
  await client.end();
}
test();
