import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import authRoutes from './routes/auth.js';
import apiRoutes from './routes/index.js';

export const app = express();
app.use(cors());
app.use(express.json());
const directory = path.dirname(fileURLToPath(import.meta.url));
app.use('/uploads', express.static(path.join(directory, '..', 'uploads')));
app.get('/api/health', (req, res) => res.json({ status: 'ok', name: 'FTX API' }));
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Server error' });
});
