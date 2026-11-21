import fs from 'node:fs/promises';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'node:url';
import { pool } from './pool.js';

const directory = path.dirname(fileURLToPath(import.meta.url));
const schema = await fs.readFile(path.join(directory, 'schema.sql'), 'utf8');

await pool.query(schema);
const passwordHash = await bcrypt.hash('password123', 10);
await pool.query(
  `INSERT INTO users (name, email, phone, password_hash, location, farm_area)
   VALUES ('Demo Farmer', 'farmer@example.com', '+123456789', $1, 'Green Valley', '5 acres')
   ON CONFLICT (email) DO NOTHING`,
  [passwordHash],
);
await pool.query(`INSERT INTO market_prices (crop_name, category, buying_price, selling_price, unit, trend, location)
  SELECT * FROM (VALUES
    ('Maize', 'Grains', 0.32, 0.45, 'kg', 'up', 'Green Valley'),
    ('Tomato', 'Vegetables', 0.55, 0.80, 'kg', 'down', 'Riverside'),
    ('Beans', 'Legumes', 0.70, 0.95, 'kg', 'steady', 'Highlands')
  ) AS seed(crop_name, category, buying_price, selling_price, unit, trend, location)
  WHERE NOT EXISTS (SELECT 1 FROM market_prices)`);
await pool.query(`INSERT INTO planting_advisories (crop_name, region, season, recommendation, planting_window, notes)
  SELECT * FROM (VALUES
    ('Maize', 'Green Valley', 'Early Rainy', 'Plant Now', 'March - April', 'Soil moisture is suitable for germination.'),
    ('Tomato', 'Riverside', 'Late Rainy', 'Avoid Planting', 'June - July', 'Wait for drier weather to reduce fungal disease.')
  ) AS seed(crop_name, region, season, recommendation, planting_window, notes)
  WHERE NOT EXISTS (SELECT 1 FROM planting_advisories)`);
await pool.query(`INSERT INTO news_articles (title, summary, content, category)
  SELECT * FROM (VALUES
    ('Better soil care improves harvests', 'Simple soil testing can help farmers choose the right nutrients.', 'Local extension teams recommend testing soil before applying fertilizer and adding organic matter where needed.', 'Farming Tips'),
    ('New market day connects local growers', 'Farmers can now meet buyers every Friday at the community market.', 'The weekly market creates a direct route for small farms to reach restaurants and households.', 'Community')
  ) AS seed(title, summary, content, category)
  WHERE NOT EXISTS (SELECT 1 FROM news_articles)`);

console.log('FTX database schema and sample data are ready.');
await pool.end();
