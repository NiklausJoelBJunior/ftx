import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { app } from './app.js';
import { pool } from './db/pool.js';

const port = process.env.PORT || 4000;

const schema = await readFile(new URL('./db/schema.sql', import.meta.url), 'utf8');
await pool.query(schema);

app.listen(port, '0.0.0.0', () => {
  console.log(`FTX API listening on http://localhost:${port}`);
  console.log(`Phone on your LAN: http://<YOUR_COMPUTER_LAN_IP>:${port}/api`);
});
