const { Client } = require('pg');
require('dotenv').config({ path: '.env' });
async function test() {
  const client = new Client({ connectionString: process.env.DATABASE_URL_NOTIFICATION });
  await client.connect();
  const res = await client.query('SELECT * FROM "Notification" ORDER BY "createdAt" DESC LIMIT 5');
  console.log(JSON.stringify(res.rows, null, 2));
  await client.end();
}
test();
