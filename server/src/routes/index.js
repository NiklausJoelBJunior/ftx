import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { pool } from '../db/pool.js';
import { auth } from '../middleware/auth.js';

const router = Router();
const directory = path.dirname(fileURLToPath(import.meta.url));
const uploadsDirectory = path.join(directory, '..', 'uploads');
fs.mkdirSync(uploadsDirectory, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDirectory,
    filename: (req, file, done) => {
      const extension = path.extname(file.originalname).toLowerCase() || '.jpg';
      done(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${extension}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, done) => done(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)),
});

router.get('/', (req, res) => res.json({ name: 'FTX API', health: '/api/health' }));

async function commonsImage(query) {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1&prop=pageimages&piprop=thumbnail&pithumbsize=700&format=json&origin=*`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    const page = data.query?.pages ? Object.values(data.query.pages)[0] : null;
    return page?.thumbnail?.source || null;
  } catch {
    return null;
  }
}

const list = (table, order = 'id DESC') => async (req, res, next) => {
  try {
    const values = [];
    const filters = [];
    if (req.query.crop) { values.push(`%${req.query.crop}%`); filters.push(`crop_name ILIKE $${values.length}`); }
    if (req.query.category) { values.push(req.query.category); filters.push(`category = $${values.length}`); }
    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const { rows } = await pool.query(`SELECT * FROM ${table} ${where} ORDER BY ${order}`, values);
    res.json(rows);
  } catch (error) { next(error); }
};

router.get('/market-prices', async (req, res, next) => {
  try {
    if (process.env.MARKET_API_KEY) {
      const name = req.query.crop || 'corn';
      const response = await fetch(`https://api.api-ninjas.com/v1/commodityprice?name=${encodeURIComponent(name)}`, {
        headers: { 'X-Api-Key': process.env.MARKET_API_KEY },
      });
      if (response.ok) {
        const external = await response.json();
        if (Array.isArray(external) && external.length) {
          const marketItems = await Promise.all(external.map(async (item, index) => ({
            id: `external-${index}`,
            crop_name: item.name || name,
            category: req.query.category || 'Agriculture',
            buying_price: item.price || 0,
            selling_price: item.price || 0,
            unit: 'unit',
            trend: item.change > 0 ? 'up' : item.change < 0 ? 'down' : 'steady',
            location: 'International',
            updated_at: new Date(),
            image_url: await commonsImage(item.name || name),
          })));
          return res.json(marketItems);
        }
      }
    }
    const values = [];
    const filters = [];
    if (req.query.crop) { values.push(`%${req.query.crop}%`); filters.push(`crop_name ILIKE $${values.length}`); }
    if (req.query.category) { values.push(req.query.category); filters.push(`category = $${values.length}`); }
    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const { rows } = await pool.query(`SELECT * FROM market_prices ${where} ORDER BY updated_at DESC`, values);
    const marketItems = await Promise.all(rows.map(async item => ({ ...item, image_url: await commonsImage(item.crop_name) })));
    res.json(marketItems);
  } catch (error) { next(error); }
});

router.get('/planting-advisories', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM planting_advisories ORDER BY id');
    if (req.query.latitude && req.query.longitude) {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(req.query.latitude)}&longitude=${encodeURIComponent(req.query.longitude)}&current=temperature_2m,precipitation`;
      const response = await fetch(weatherUrl);
      if (response.ok) {
        const weather = await response.json();
        const current = weather.current || {};
        const rainy = (current.precipitation || 0) > 0;
        const advisories = await Promise.all(rows.map(async item => ({
          ...item,
          current_temperature: current.temperature_2m,
          recommendation: rainy ? 'Plant Now' : item.recommendation,
          notes: `${item.notes} Live weather: ${current.temperature_2m ?? 'unknown'}°C${rainy ? ', precipitation detected.' : '.'}`,
          image_url: await commonsImage(item.crop_name),
        })));
        return res.json(advisories);
      }
    }
    const advisories = await Promise.all(rows.map(async item => ({ ...item, image_url: await commonsImage(item.crop_name) })));
    res.json(advisories);
  } catch (error) { next(error); }
});

router.get('/news', async (req, res, next) => {
  try {
    try {
      const gdeltResponse = await fetch('https://api.gdeltproject.org/api/v2/doc/doc?query=agriculture&mode=ArtList&maxrecords=10&format=json', { signal: AbortSignal.timeout(5000) });
      if (gdeltResponse.ok) {
        const gdelt = await gdeltResponse.json();
        if (Array.isArray(gdelt.articles) && gdelt.articles.length) {
          return res.json(gdelt.articles.map((item, index) => ({
            id: `external-${index}`,
            title: item.title,
            summary: item.title,
            content: item.title,
            category: 'Agriculture',
            published_at: item.seendate,
            external_url: item.url,
            image_url: item.socialimage || null,
          })));
        }
      }
    } catch {}
    if (process.env.NEWS_API_KEY) {
      const response = await fetch(`https://gnews.io/api/v4/search?q=agriculture&lang=en&max=10&apikey=${encodeURIComponent(process.env.NEWS_API_KEY)}`);
      if (response.ok) {
        const external = await response.json();
        if (Array.isArray(external.articles)) {
          const articles = await Promise.all(external.articles.map(async (item, index) => ({
            id: `external-${index}`,
            title: item.title,
            summary: item.description || item.title,
            content: item.description ? `${item.description}\n\nRead the full report at: ${item.url}` : item.url,
            category: 'Agriculture',
            published_at: item.publishedAt,
            external_url: item.url,
            image_url: item.image || await commonsImage(item.title),
          })));
          return res.json(articles);
        }
      }
    }
    const { rows } = await pool.query('SELECT * FROM news_articles ORDER BY published_at DESC');
    const articles = await Promise.all(rows.map(async item => ({ ...item, image_url: await commonsImage(`${item.title} agriculture`) })));
    res.json(articles);
  } catch (error) { next(error); }
});
router.get('/news/:id', async (req, res, next) => {
  try {
    if (req.params.id.startsWith('external-')) {
      try {
        const gdeltResponse = await fetch('https://api.gdeltproject.org/api/v2/doc/doc?query=agriculture&mode=ArtList&maxrecords=10&format=json', { signal: AbortSignal.timeout(5000) });
        if (gdeltResponse.ok) {
          const gdelt = await gdeltResponse.json();
          const index = Number(req.params.id.replace('external-', ''));
          const item = gdelt.articles?.[index];
          if (item) return res.json({
            id: req.params.id,
            title: item.title,
            summary: item.title,
            content: item.title,
            category: 'Agriculture',
            published_at: item.seendate,
            external_url: item.url,
            image_url: item.socialimage || null,
          });
        }
      } catch {}
    }
    if (req.params.id.startsWith('external-') && process.env.NEWS_API_KEY) {
      const response = await fetch(`https://gnews.io/api/v4/search?q=agriculture&lang=en&max=10&apikey=${encodeURIComponent(process.env.NEWS_API_KEY)}`);
      if (response.ok) {
        const external = await response.json();
        const index = Number(req.params.id.replace('external-', ''));
        const item = external.articles?.[index];
        if (item) return res.json({
          id: req.params.id,
          title: item.title,
          summary: item.description || item.title,
          content: item.description ? `${item.description}\n\nRead the full report at: ${item.url}` : item.url,
          category: 'Agriculture',
          published_at: item.publishedAt,
          external_url: item.url,
        });
      }
    }
    const { rows } = await pool.query('SELECT * FROM news_articles WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Article not found' });
    res.json(rows[0]);
  } catch (error) { next(error); }
});
router.get('/listings', async (req, res, next) => {
  try {
    const values = [];
    const filters = ['status = $1'];
    values.push(req.query.status || 'active');
    if (req.query.crop) { values.push(`%${req.query.crop}%`); filters.push(`crop_name ILIKE $${values.length}`); }
    if (req.query.category) { values.push(req.query.category); filters.push(`category = $${values.length}`); }
    const { rows } = await pool.query(`SELECT * FROM crop_listings WHERE ${filters.join(' AND ')} ORDER BY created_at DESC`, values);
    res.json(rows);
  } catch (error) { next(error); }
});
router.get('/listings/mine', auth(), async (req, res, next) => {
  try { const { rows } = await pool.query('SELECT * FROM crop_listings WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]); res.json(rows); } catch (error) { next(error); }
});
router.post('/uploads/profile', auth(), upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'A JPG, PNG, or WebP image is required' });
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const { rows } = await pool.query(
      'UPDATE users SET profile_image_url = $1 WHERE id = $2 RETURNING id, name, email, phone, location, farm_area, profile_image_url, created_at',
      [imageUrl, req.user.id],
    );
    res.status(201).json(rows[0]);
  } catch (error) { next(error); }
});

router.post('/listings', auth(), upload.single('image'), async (req, res, next) => {
  try {
    const { cropName, category, quantity, unit, askingPrice, location, status = 'active' } = req.body;
    if (!cropName || !category || !quantity || !unit || !askingPrice || !location) return res.status(400).json({ error: 'All listing fields are required' });
    const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;
    const { rows } = await pool.query(
      `INSERT INTO crop_listings (user_id, crop_name, category, quantity, unit, asking_price, location, status, image_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [req.user.id, cropName, category, quantity, unit, askingPrice, location, status, imageUrl],
    );
    res.status(201).json(rows[0]);
  } catch (error) { next(error); }
});
router.patch('/listings/:id', auth(), async (req, res, next) => {
  try { const { rows } = await pool.query('UPDATE crop_listings SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *', [req.body.status, req.params.id, req.user.id]); if (!rows[0]) return res.status(404).json({ error: 'Listing not found' }); res.json(rows[0]); } catch (error) { next(error); }
});
export default router;
