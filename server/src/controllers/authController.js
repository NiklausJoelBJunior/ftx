import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db/pool.js';

const tokenFor = (user) => jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
const publicUser = ({ password_hash, ...user }) => user;

export async function register(req, res, next) {
  try {
    const { name, email, password, phone, location, farmArea } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password are required' });
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, phone, password_hash, location, farm_area)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, email.toLowerCase(), phone || null, hash, location || null, farmArea || null],
    );
    res.status(201).json({ token: tokenFor(rows[0]), user: publicUser(rows[0]) });
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'An account with this email already exists' });
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email?.toLowerCase()]);
    if (!rows[0] || !(await bcrypt.compare(password || '', rows[0].password_hash))) return res.status(401).json({ error: 'Invalid email or password' });
    res.json({ token: tokenFor(rows[0]), user: publicUser(rows[0]) });
  } catch (error) { next(error); }
}

export async function profile(req, res, next) {
  try {
    const { rows } = await pool.query('SELECT id, name, email, phone, location, farm_area, profile_image_url, created_at FROM users WHERE id = $1', [req.user.id]);
    res.json(rows[0]);
  } catch (error) { next(error); }
}

export async function updateProfile(req, res, next) {
  try {
    const { name, phone, location, farmArea, profileImageUrl } = req.body;
    const { rows } = await pool.query(
      `UPDATE users SET name = COALESCE($1, name), phone = COALESCE($2, phone), location = COALESCE($3, location),
       farm_area = COALESCE($4, farm_area), profile_image_url = COALESCE($5, profile_image_url) WHERE id = $6
       RETURNING id, name, email, phone, location, farm_area, profile_image_url, created_at`,
      [name, phone, location, farmArea, profileImageUrl, req.user.id],
    );
    res.json(rows[0]);
  } catch (error) { next(error); }
}
