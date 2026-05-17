CREATE TABLE IF NOT EXISTS plans (
  user_id                TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  plan                   TEXT NOT NULL DEFAULT 'free',
  stripe_customer_id     TEXT,
  stripe_subscription_id TEXT,
  created_at             TEXT DEFAULT (datetime('now'))
);