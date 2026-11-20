CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(40),
  password_hash TEXT NOT NULL,
  location VARCHAR(160),
  farm_area VARCHAR(80),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS market_prices (
  id SERIAL PRIMARY KEY,
  crop_name VARCHAR(120) NOT NULL,
  category VARCHAR(80) NOT NULL,
  buying_price NUMERIC(12, 2) NOT NULL,
  selling_price NUMERIC(12, 2) NOT NULL,
  unit VARCHAR(30) NOT NULL DEFAULT 'kg',
  trend VARCHAR(10) NOT NULL CHECK (trend IN ('up', 'down', 'steady')),
  location VARCHAR(160),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crop_listings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  crop_name VARCHAR(120) NOT NULL,
  category VARCHAR(80) NOT NULL,
  quantity NUMERIC(12, 2) NOT NULL,
  unit VARCHAR(30) NOT NULL,
  asking_price NUMERIC(12, 2) NOT NULL,
  location VARCHAR(160) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS planting_advisories (
  id SERIAL PRIMARY KEY,
  crop_name VARCHAR(120) NOT NULL,
  region VARCHAR(120) NOT NULL,
  season VARCHAR(80) NOT NULL,
  recommendation VARCHAR(20) NOT NULL CHECK (recommendation IN ('Plant Now', 'Avoid Planting')),
  planting_window VARCHAR(120) NOT NULL,
  notes TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS news_articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(240) NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(80) NOT NULL DEFAULT 'Agriculture',
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
