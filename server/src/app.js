import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import apiRoutes from './routes/index.js';

export const app = express();
app.use(cors());
app.use(express.json());
app.get('/api/health', (req, res) => res.json({ status: 'ok', name: 'FTX API' }));
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Server error' });
});
