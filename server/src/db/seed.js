import fs from 'node:fs/promises';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'node:url';
import { pool } from './pool.js';

const directory = path.dirname(fileURLToPath(import.meta.url));
const schema = await fs.readFile(path.join(directory, 'schema.sql'), 'utf8');

await pool.query(schema);
const passwordHash = await bcrypt.hash('password123', 10);
const plantingAdvisories = [
  {
    cropName: 'Maize',
    region: 'Green Valley',
    season: 'Early Rainy',
    recommendation: 'Plant Now',
    plantingWindow: 'March - April',
    notes: 'Plant when the soil is moist and well drained. Prepare a fine seedbed, choose a locally recommended variety, and avoid waterlogged fields. Base fertilizer decisions on a soil test or local extension guidance, and monitor rainfall after sowing.',
  },
  {
    cropName: 'Tomato',
    region: 'Riverside',
    season: 'Late Rainy',
    recommendation: 'Avoid Planting',
    plantingWindow: 'June - July',
    notes: 'High humidity and prolonged leaf wetness can increase fungal disease pressure. Improve airflow with suitable spacing, use healthy transplants, and avoid overhead watering where possible. Follow local disease guidance and plant in a drier window when water is available.',
  },
];
const articles = [
  {
    title: 'Better soil care improves harvests',
    summary: 'Soil testing, organic matter, and careful nutrient planning help farmers make informed decisions throughout the growing season.',
    content: `Healthy soil supports strong roots, stores water, and makes nutrients available to crops. Start with a soil test through a local laboratory or extension service so fertilizer choices match the field rather than relying on guesswork.

Where appropriate, return crop residues or add mature compost to build organic matter over time. Rotate crops when possible, keep soil covered between plantings, and avoid working wet soil because compaction can restrict root growth.

Soil needs vary by field and crop. Use local test results and extension recommendations to choose amendments and application rates.`,
    category: 'Farming Tips',
  },
  {
    title: 'New market day connects local growers',
    summary: 'A regular community market can give growers a predictable place to meet buyers and compare demand.',
    content: `A consistent market day helps farmers plan harvest, sorting, and transport around a known selling opportunity. Before harvest, ask buyers which crops, grades, quantities, and packaging they need so produce can be prepared to match demand.

Keep simple records of quantities offered, prices received, and transport costs. Comparing these records over several market days can help growers decide which crops and routes are worthwhile.

Market conditions change by location and season. Confirm the date, selling rules, and current prices with the market organizers before transporting produce.`,
    category: 'Community',
  },
];
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
await pool.query(
  `INSERT INTO planting_advisories (crop_name, region, season, recommendation, planting_window, notes)
   SELECT * FROM (VALUES ($1, $2, $3, $4, $5, $6), ($7, $8, $9, $10, $11, $12))
   AS seed(crop_name, region, season, recommendation, planting_window, notes)
   WHERE NOT EXISTS (SELECT 1 FROM planting_advisories)`,
  plantingAdvisories.flatMap(item => [
    item.cropName, item.region, item.season, item.recommendation, item.plantingWindow, item.notes,
  ]),
);
for (const item of plantingAdvisories) {
  await pool.query(
    `UPDATE planting_advisories SET recommendation = $1, planting_window = $2, notes = $3
     WHERE crop_name = $4 AND region = $5 AND season = $6`,
    [item.recommendation, item.plantingWindow, item.notes, item.cropName, item.region, item.season],
  );
}
await pool.query(
  `INSERT INTO news_articles (title, summary, content, category)
   SELECT * FROM (VALUES ($1, $2, $3, $4), ($5, $6, $7, $8))
   AS seed(title, summary, content, category)
   WHERE NOT EXISTS (SELECT 1 FROM news_articles)`,
  articles.flatMap(item => [item.title, item.summary, item.content, item.category]),
);
for (const item of articles) {
  await pool.query(
    'UPDATE news_articles SET summary = $1, content = $2 WHERE title = $3 AND category = $4',
    [item.summary, item.content, item.title, item.category],
  );
}

console.log('FTX database schema and sample data are ready.');
await pool.end();
