import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;
const url = new URL(process.env.DATABASE_URL);
const endpointId = url.hostname.split('.')[0];
const options = url.searchParams.get('options') || `endpoint=${endpointId}`;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  options,
  family: 4,
  connectionTimeoutMillis: 15000,
  ssl: { rejectUnauthorized: false, servername: url.hostname },
});
