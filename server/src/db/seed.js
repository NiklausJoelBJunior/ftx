import fs from 'node:fs/promises';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'node:url';
import { pool } from './pool.js';

const directory = path.dirname(fileURLToPath(import.meta.url));
const schema = await fs.readFile(path.join(directory, 'schema.sql'), 'utf8');

await pool.query(schema);
const passwordHash = await bcrypt.hash('password123', 10);
const marketPrices = [
  { crop_name: 'Maize', category: 'Grains', buying_price: 0.32, selling_price: 0.45, unit: 'kg', trend: 'up', location: 'Green Valley' },
  { crop_name: 'Tomato', category: 'Vegetables', buying_price: 0.55, selling_price: 0.80, unit: 'kg', trend: 'down', location: 'Riverside' },
  { crop_name: 'Beans', category: 'Legumes', buying_price: 0.70, selling_price: 0.95, unit: 'kg', trend: 'steady', location: 'Highlands' },
  { crop_name: 'Rice', category: 'Grains', buying_price: 0.48, selling_price: 0.62, unit: 'kg', trend: 'up', location: 'Lakeside' },
  { crop_name: 'Cassava', category: 'Roots', buying_price: 0.18, selling_price: 0.28, unit: 'kg', trend: 'steady', location: 'North Plains' },
  { crop_name: 'Sweet Potato', category: 'Roots', buying_price: 0.25, selling_price: 0.38, unit: 'kg', trend: 'up', location: 'Riverbend' },
  { crop_name: 'Sorghum', category: 'Grains', buying_price: 0.34, selling_price: 0.47, unit: 'kg', trend: 'down', location: 'East Ridge' },
  { crop_name: 'Millet', category: 'Grains', buying_price: 0.40, selling_price: 0.55, unit: 'kg', trend: 'steady', location: 'Highlands' },
  { crop_name: 'Groundnuts', category: 'Legumes', buying_price: 1.10, selling_price: 1.45, unit: 'kg', trend: 'up', location: 'Riverside' },
  { crop_name: 'Soybeans', category: 'Legumes', buying_price: 0.62, selling_price: 0.82, unit: 'kg', trend: 'down', location: 'Green Valley' },
  { crop_name: 'Onions', category: 'Vegetables', buying_price: 0.65, selling_price: 0.92, unit: 'kg', trend: 'up', location: 'Lakeside' },
  { crop_name: 'Cabbage', category: 'Vegetables', buying_price: 0.30, selling_price: 0.48, unit: 'kg', trend: 'down', location: 'North Plains' },
  { crop_name: 'Carrots', category: 'Vegetables', buying_price: 0.50, selling_price: 0.75, unit: 'kg', trend: 'steady', location: 'Riverbend' },
  { crop_name: 'Banana', category: 'Fruit', buying_price: 0.42, selling_price: 0.60, unit: 'kg', trend: 'up', location: 'Coastal Belt' },
  { crop_name: 'Avocado', category: 'Fruit', buying_price: 0.90, selling_price: 1.25, unit: 'kg', trend: 'up', location: 'Highlands' },
  { crop_name: 'Coffee', category: 'Cash Crops', buying_price: 3.40, selling_price: 4.10, unit: 'kg', trend: 'steady', location: 'East Ridge' },
  { crop_name: 'Cocoa', category: 'Cash Crops', buying_price: 2.60, selling_price: 3.20, unit: 'kg', trend: 'up', location: 'Coastal Belt' },
  { crop_name: 'Sunflower', category: 'Oilseeds', buying_price: 0.55, selling_price: 0.76, unit: 'kg', trend: 'down', location: 'Green Valley' },
  { crop_name: 'Pineapple', category: 'Fruit', buying_price: 0.38, selling_price: 0.58, unit: 'kg', trend: 'steady', location: 'Lakeside' },
  { crop_name: 'Pepper', category: 'Vegetables', buying_price: 0.85, selling_price: 1.20, unit: 'kg', trend: 'up', location: 'Riverbend' },
];
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
  {
    cropName: 'Rice', region: 'Lakeside', season: 'Main Rainy', recommendation: 'Plant Now', plantingWindow: 'April - May',
    notes: 'Use clean seed and prepare a level field to help manage water evenly. Choose a locally adapted variety and follow local recommendations for spacing, fertilizer, and water depth.',
  },
  {
    cropName: 'Cassava', region: 'North Plains', season: 'Rainy Onset', recommendation: 'Plant Now', plantingWindow: 'At the start of reliable rains',
    notes: 'Select healthy, disease-free stem cuttings from a locally suitable variety. Plant into moist, well-drained soil and avoid fields that remain waterlogged.',
  },
  {
    cropName: 'Sweet Potato', region: 'Riverbend', season: 'Early Rainy', recommendation: 'Plant Now', plantingWindow: 'March - May',
    notes: 'Use healthy vines and prepare loose, well-drained ridges where appropriate. Keep young plants moist while they establish and monitor for pests.',
  },
  {
    cropName: 'Sorghum', region: 'East Ridge', season: 'Short Rainy', recommendation: 'Plant Now', plantingWindow: 'At reliable rainfall onset',
    notes: 'Sow when soil moisture is adequate and use a locally recommended variety. Keep the seedbed free of early weed competition and avoid planting into dry soil.',
  },
  {
    cropName: 'Millet', region: 'Highlands', season: 'Short Rainy', recommendation: 'Plant Now', plantingWindow: 'At reliable rainfall onset',
    notes: 'Millet can suit drier conditions, but establishment still depends on timely moisture. Select seed adapted to the local season and follow extension guidance on spacing.',
  },
  {
    cropName: 'Groundnuts', region: 'Riverside', season: 'Main Rainy', recommendation: 'Plant Now', plantingWindow: 'March - April',
    notes: 'Use clean, viable seed and a well-drained seedbed. Avoid waterlogging and follow local advice on inoculation, rotation, and disease management.',
  },
  {
    cropName: 'Soybeans', region: 'Green Valley', season: 'Early Rainy', recommendation: 'Plant Now', plantingWindow: 'When rains are established',
    notes: 'Choose a locally adapted variety and plant into moist, well-drained soil. Ask local extension services about inoculant use and nutrient needs for your field.',
  },
  {
    cropName: 'Onions', region: 'Lakeside', season: 'Cool Dry', recommendation: 'Avoid Planting', plantingWindow: 'Use the locally recommended cool-season window',
    notes: 'Heavy rain and prolonged leaf wetness can affect onion health and curing. Plan nursery and transplant timing with local forecasts and ensure the field drains well.',
  },
  {
    cropName: 'Cabbage', region: 'North Plains', season: 'Cool Season', recommendation: 'Plant Now', plantingWindow: 'September - November',
    notes: 'Use healthy transplants and a site with good drainage. Monitor regularly for caterpillars and other pests, and use locally approved control practices when needed.',
  },
  {
    cropName: 'Carrots', region: 'Riverbend', season: 'Cool Dry', recommendation: 'Plant Now', plantingWindow: 'October - December',
    notes: 'Prepare a fine, stone-free seedbed to support straight roots. Keep the surface evenly moist during germination and thin plants according to local recommendations.',
  },
  {
    cropName: 'Banana', region: 'Coastal Belt', season: 'Wet Season', recommendation: 'Plant Now', plantingWindow: 'At the start of reliable rains',
    notes: 'Choose healthy planting material and a site with reliable drainage. Provide adequate spacing and monitor for pests and disease using local extension advice.',
  },
  {
    cropName: 'Avocado', region: 'Highlands', season: 'Early Rainy', recommendation: 'Plant Now', plantingWindow: 'At the start of reliable rains',
    notes: 'Plant healthy, locally suitable trees in well-drained soil. Protect young plants from drying winds and waterlogging, and check local guidance on spacing and pollination.',
  },
  {
    cropName: 'Coffee', region: 'East Ridge', season: 'Main Rainy', recommendation: 'Plant Now', plantingWindow: 'When rains are established',
    notes: 'Use healthy seedlings of varieties suited to the local elevation and climate. Prepare shade and soil conservation measures based on local extension recommendations.',
  },
  {
    cropName: 'Cocoa', region: 'Coastal Belt', season: 'Wet Season', recommendation: 'Plant Now', plantingWindow: 'Early in the rainy season',
    notes: 'Use healthy planting material suited to the area and establish appropriate temporary shade. Maintain drainage and follow local guidance for disease monitoring.',
  },
  {
    cropName: 'Sunflower', region: 'Green Valley', season: 'Early Rainy', recommendation: 'Plant Now', plantingWindow: 'After reliable rains begin',
    notes: 'Choose a locally adapted variety and plant into moist, well-drained soil. Check local recommendations for spacing and avoid fields with persistent standing water.',
  },
  {
    cropName: 'Pineapple', region: 'Lakeside', season: 'Warm Wet', recommendation: 'Plant Now', plantingWindow: 'At the start of reliable rains',
    notes: 'Select healthy planting material and use a well-drained field. Match planting density and weed management to local extension guidance.',
  },
  {
    cropName: 'Pepper', region: 'Riverbend', season: 'Warm Dry', recommendation: 'Avoid Planting', plantingWindow: 'Transplant after heavy rains ease',
    notes: 'Pepper seedlings are sensitive to waterlogging and some fungal diseases. Use healthy transplants, ensure drainage, and plan irrigation before choosing a drier planting window.',
  },
  {
    cropName: 'Cucumber', region: 'Riverside', season: 'Warm Rainy', recommendation: 'Plant Now', plantingWindow: 'September - November',
    notes: 'Plant into warm, well-drained soil and provide support or room for vines to spread. Monitor moisture consistently and check plants for common pests and disease.',
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
  {
    title: 'Planning irrigation around crop needs',
    summary: 'Simple field checks can help farmers use limited irrigation water more efficiently.',
    content: 'Check soil moisture near the active root zone before irrigating rather than following a fixed schedule alone. Water requirements change with crop stage, soil type, temperature, and rainfall.\\n\\nWhere possible, repair leaks, irrigate during cooler parts of the day, and use mulch or ground cover to reduce evaporation. Follow local water restrictions and crop-specific extension guidance.',
    category: 'Water Management',
  },
  {
    title: 'Choosing seed for local conditions',
    summary: 'Variety selection should account for local climate, maturity time, and available market demand.',
    content: 'Before buying seed, confirm that the variety is suitable for the local season, rainfall pattern, and soil. Check the label, expiry date, and germination information, and purchase from a trusted supplier.\\n\\nAsk local extension services about maturity time and disease resistance. A variety that performs well elsewhere may not suit every farm or market.',
    category: 'Crop Planning',
  },
  {
    title: 'Using crop rotation to support soil health',
    summary: 'Rotating crops can help diversify farm production and interrupt some pest and disease cycles.',
    content: 'Where land and markets allow, avoid planting the same crop family in the same field season after season. Rotations that include legumes or cover crops may support soil structure and add useful ground cover.\\n\\nRotation benefits depend on local pests, crop choices, and soil conditions. Plan a sequence that fits the farm and seek local advice before changing a production system.',
    category: 'Soil Health',
  },
  {
    title: 'Mulching helps protect bare soil',
    summary: 'Organic mulch can reduce soil splash and slow moisture loss when used appropriately.',
    content: 'A layer of clean plant material can protect the soil surface from heavy rain and reduce evaporation. Keep mulch away from crop stems where excess moisture could encourage disease, and avoid material that may contain viable weed seeds or contaminants.\\n\\nUse locally available materials responsibly and check whether mulch could shelter crop pests in your area.',
    category: 'Soil Health',
  },
  {
    title: 'Scouting fields for pests early',
    summary: 'Regular crop checks help growers identify problems before they spread widely.',
    content: 'Walk fields on a regular schedule and inspect plants in several locations, including field edges and less vigorous patches. Record the crop stage, symptoms, and number of affected plants so changes can be compared over time.\\n\\nConfirm pest identity before taking action. Use integrated pest management and locally approved controls, following label directions and protective equipment requirements.',
    category: 'Crop Protection',
  },
  {
    title: 'Keeping harvested grain dry and clean',
    summary: 'Drying and clean storage conditions are important for maintaining grain quality.',
    content: 'Harvest at suitable maturity and remove visibly damaged material before storage. Dry grain to a safe moisture level recommended for the crop and local climate; moisture meters or extension services can help confirm readiness.\\n\\nUse clean, dry containers and inspect stored grain regularly for moisture, insects, or damage. Follow food-safety and storage guidance available in your region.',
    category: 'Postharvest',
  },
  {
    title: 'Protecting pollinators on the farm',
    summary: 'Pollinators support many crops, and careful practices can reduce avoidable exposure.',
    content: 'Identify flowering areas and protect nesting habitat where practical. When crop protection is necessary, use locally approved products according to their labels and avoid spraying flowering crops when pollinators are active if the product guidance advises against it.\\n\\nIntegrated pest management and advice from local extension services can help balance crop protection with pollinator safety.',
    category: 'Farm Environment',
  },
  {
    title: 'Compost needs time to mature',
    summary: 'Well-managed composting can turn suitable farm residues into a useful soil amendment.',
    content: 'Combine appropriate plant materials and maintain moisture and aeration so decomposition can proceed. Turning the pile when needed and keeping it covered from heavy rain can support a more even process.\\n\\nUse mature, stable compost rather than fresh material near sensitive crops. Local guidance can help assess maturity and safe application practices.',
    category: 'Soil Health',
  },
  {
    title: 'Reducing postharvest vegetable losses',
    summary: 'Gentle handling, sorting, and shade can help preserve fresh produce quality.',
    content: 'Harvest during cooler hours when practical, avoid dropping or overfilling containers, and move produce out of direct sun. Sort damaged items separately and use clean crates that allow airflow.\\n\\nStorage life varies by crop and temperature. Seek crop-specific handling advice and arrange transport promptly when refrigeration is unavailable.',
    category: 'Postharvest',
  },
  {
    title: 'Keeping farm records useful',
    summary: 'A few consistent records can help compare costs, yields, and selling options.',
    content: 'Record dates, seed and input costs, labor, harvest quantities, and the prices actually received. Keep notes on weather or pest issues that may explain unusually good or poor results.\\n\\nReview records at the end of each season and compare like-for-like crops and fields. A notebook or simple spreadsheet is enough to start.',
    category: 'Farm Business',
  },
  {
    title: 'Preparing fields for heavy rain',
    summary: 'Drainage and soil cover can help reduce erosion and standing water during intense rainfall.',
    content: 'Inspect field slopes and drainage channels before the rainy period. Keep waterways clear, maintain vegetative cover where suitable, and avoid directing runoff onto neighboring fields or roads.\\n\\nThe right conservation practice depends on slope and soil. Ask local agricultural services about measures suited to your farm.',
    category: 'Climate Resilience',
  },
  {
    title: 'Making vegetable seedlings stronger',
    summary: 'Healthy nursery practices give transplants a better start before field planting.',
    content: 'Use clean trays or a prepared nursery bed, suitable growing media, and healthy seed. Provide enough light and airflow while protecting seedlings from extreme heat and heavy rain.\\n\\nHarden seedlings gradually before transplanting and water them carefully during establishment. Follow local crop guidance for spacing and nursery timing.',
    category: 'Crop Planning',
  },
  {
    title: 'Safe handling of farm inputs',
    summary: 'Careful storage and label-based use protect farm workers, crops, and the environment.',
    content: 'Keep inputs in their original labeled containers, locked away from children, animals, food, and water sources. Read and follow product directions, use required protective equipment, and never reuse empty containers.\\n\\nAsk local extension or safety authorities how to dispose of containers and unused products in your area.',
    category: 'Farm Safety',
  },
  {
    title: 'Choosing produce grades buyers need',
    summary: 'Agreeing on quality and packaging before harvest can reduce rejected produce.',
    content: 'Ask buyers how they define size, maturity, cleanliness, and packaging for each crop. Sort produce consistently and keep different grades separate so buyers can assess the offer quickly.\\n\\nRequirements vary between markets. Confirm the standard and price before investing time in extra grading or packaging.',
    category: 'Market Guide',
  },
  {
    title: 'Ground cover can limit soil erosion',
    summary: 'Keeping soil covered between crops helps slow runoff and protect topsoil.',
    content: 'Crop residues, cover crops, and suitable ground cover can reduce the impact of raindrops and slow water moving across fields. Maintain cover where it does not create pest or planting problems for the next crop.\\n\\nChoose practices that fit local rainfall, livestock use, and crop rotations, and consult extension guidance on species and timing.',
    category: 'Soil Health',
  },
  {
    title: 'Coordinating transport with neighboring farms',
    summary: 'Shared transport may help small growers lower costs and reach buyers together.',
    content: 'Discuss harvest schedules, produce volumes, destinations, and handling needs before sharing a vehicle. Agree in advance how costs will be divided and how produce will be kept separate or identified.\\n\\nCheck vehicle capacity, road conditions, and market delivery times. A clear plan helps protect produce quality and relationships between growers.',
    category: 'Farm Business',
  },
  {
    title: 'Managing weeds before they set seed',
    summary: 'Timely weed control can reduce competition and limit future weed pressure.',
    content: 'Inspect fields early and identify the main weeds before choosing a control method. Timely hand-weeding, cultivation, or locally approved methods may be more effective before weeds mature and produce seed.\\n\\nAvoid practices that spread invasive weeds or damage crop roots. Consult local guidance for safe, crop-appropriate options.',
    category: 'Crop Protection',
  },
  {
    title: 'Planning farm work around seasonal forecasts',
    summary: 'Seasonal outlooks can inform planning, but they are not a guarantee of local weather.',
    content: 'Use seasonal forecasts as one input when planning seed, labor, and field preparation. Compare the outlook with local observations and short-range forecasts before making time-sensitive decisions.\\n\\nKeep options open where possible, such as staggered planting or more than one suitable variety. Follow local meteorological and extension updates.',
    category: 'Climate Resilience',
  },
];
const seededArticles = articles.map(item => ({
  ...item,
  content: item.content.replace(/\\n/g, '\n'),
}));
await pool.query(
  `INSERT INTO users (name, email, phone, password_hash, location, farm_area)
   VALUES ('Demo Farmer', 'farmer@example.com', '+123456789', $1, 'Green Valley', '5 acres')
   ON CONFLICT (email) DO NOTHING`,
  [passwordHash],
);
await pool.query(
  `INSERT INTO market_prices (crop_name, category, buying_price, selling_price, unit, trend, location)
   SELECT seed.crop_name, seed.category, seed.buying_price, seed.selling_price, seed.unit, seed.trend, seed.location
   FROM jsonb_to_recordset($1::jsonb) AS seed(
     crop_name text, category text, buying_price numeric, selling_price numeric, unit text, trend text, location text
   )
   WHERE NOT EXISTS (
     SELECT 1 FROM market_prices existing
     WHERE LOWER(existing.crop_name) = LOWER(seed.crop_name)
       AND LOWER(COALESCE(existing.location, '')) = LOWER(COALESCE(seed.location, ''))
   )`,
  [JSON.stringify(marketPrices)],
);
await pool.query(
  `INSERT INTO planting_advisories (crop_name, region, season, recommendation, planting_window, notes)
   SELECT seed.crop_name, seed.region, seed.season, seed.recommendation, seed.planting_window, seed.notes
   FROM jsonb_to_recordset($1::jsonb) AS seed(
     crop_name text, region text, season text, recommendation text, planting_window text, notes text
   )
   WHERE NOT EXISTS (
     SELECT 1 FROM planting_advisories existing
     WHERE LOWER(existing.crop_name) = LOWER(seed.crop_name)
       AND LOWER(existing.region) = LOWER(seed.region)
       AND LOWER(existing.season) = LOWER(seed.season)
   )`,
  [JSON.stringify(plantingAdvisories.map(item => ({
    crop_name: item.cropName,
    region: item.region,
    season: item.season,
    recommendation: item.recommendation,
    planting_window: item.plantingWindow,
    notes: item.notes,
  })))],
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
   SELECT seed.title, seed.summary, seed.content, seed.category
   FROM jsonb_to_recordset($1::jsonb) AS seed(title text, summary text, content text, category text)
   WHERE NOT EXISTS (
     SELECT 1 FROM news_articles existing
     WHERE LOWER(existing.title) = LOWER(seed.title) AND LOWER(existing.category) = LOWER(seed.category)
   )`,
  [JSON.stringify(seededArticles)],
);
for (const item of seededArticles) {
  await pool.query(
    'UPDATE news_articles SET summary = $1, content = $2 WHERE title = $3 AND category = $4',
    [item.summary, item.content, item.title, item.category],
  );
}

console.log('FTX database schema and sample data are ready.');
await pool.end();
