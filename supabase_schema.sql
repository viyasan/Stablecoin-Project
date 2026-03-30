-- StablecoinStats.xyz — Cron Data Refresh Schema
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard > SQL Editor)

-- 1. Snapshots table — stores top 10 stablecoin data every 15 minutes
CREATE TABLE IF NOT EXISTS snapshots (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  coin_id       TEXT NOT NULL,
  gecko_id      TEXT,
  symbol        TEXT NOT NULL,
  name          TEXT NOT NULL,
  price_usd     NUMERIC(20, 8),
  market_cap    NUMERIC(24, 2) NOT NULL,
  volume_24h    NUMERIC(24, 2),
  peg_deviation NUMERIC(10, 6),
  dominance_pct NUMERIC(8, 4),
  peg_type      TEXT,
  peg_mechanism TEXT,
  fetched_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_snapshots_coin_fetched ON snapshots (coin_id, fetched_at DESC);
CREATE INDEX IF NOT EXISTS idx_snapshots_fetched_at ON snapshots (fetched_at DESC);

-- 2. Market summaries table — stores total market data every 15 minutes
CREATE TABLE IF NOT EXISTS market_summaries (
  id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  total_market_cap    NUMERIC(24, 2) NOT NULL,
  change_24h          NUMERIC(10, 4),
  change_24h_value    NUMERIC(24, 2),
  change_7d           NUMERIC(10, 4),
  change_7d_value     NUMERIC(24, 2),
  change_30d          NUMERIC(10, 4),
  change_30d_value    NUMERIC(24, 2),
  tracked_stablecoins INTEGER,
  fetched_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_market_summaries_fetched_at ON market_summaries (fetched_at DESC);

-- 3. Views for latest data
CREATE OR REPLACE VIEW latest_snapshot AS
SELECT DISTINCT ON (coin_id) *
FROM snapshots
ORDER BY coin_id, fetched_at DESC;

CREATE OR REPLACE VIEW latest_market_summary AS
SELECT * FROM market_summaries
ORDER BY fetched_at DESC
LIMIT 1;

-- 4. Row Level Security
ALTER TABLE snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON snapshots FOR SELECT USING (true);
CREATE POLICY "Allow service role insert" ON snapshots FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access" ON market_summaries FOR SELECT USING (true);
CREATE POLICY "Allow service role insert" ON market_summaries FOR INSERT WITH CHECK (true);
