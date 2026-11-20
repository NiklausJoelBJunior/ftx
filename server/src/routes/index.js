import { Router } from 'express';
import { pool } from '../db/pool.js';
import { auth } from '../middleware/auth.js';

const router = Router();
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

router.get('/market-prices', list('market_prices', 'updated_at DESC'));
router.get('/planting-advisories', list('planting_advisories'));
router.get('/news', list('news_articles', 'published_at DESC'));
router.get('/news/:id', async (req, res, next) => {
  try { const { rows } = await pool.query('SELECT * FROM news_articles WHERE id = $1', [req.params.id]); if (!rows[0]) return res.status(404).json({ error: 'Article not found' }); res.json(rows[0]); } catch (error) { next(error); }
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
router.post('/listings', auth(), async (req, res, next) => {
  try {
    const { cropName, category, quantity, unit, askingPrice, location, status = 'active' } = req.body;
    if (!cropName || !category || !quantity || !unit || !askingPrice || !location) return res.status(400).json({ error: 'All listing fields are required' });
    const { rows } = await pool.query(
      `INSERT INTO crop_listings (user_id, crop_name, category, quantity, unit, asking_price, location, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [req.user.id, cropName, category, quantity, unit, askingPrice, location, status],
    );
    res.status(201).json(rows[0]);
  } catch (error) { next(error); }
});
router.patch('/listings/:id', auth(), async (req, res, next) => {
  try { const { rows } = await pool.query('UPDATE crop_listings SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *', [req.body.status, req.params.id, req.user.id]); if (!rows[0]) return res.status(404).json({ error: 'Listing not found' }); res.json(rows[0]); } catch (error) { next(error); }
});
export default router;
