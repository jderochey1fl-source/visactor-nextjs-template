-- Admin / analytics tracking schema.
-- Two tables back the entire admin portal: page_views (every navigation)
-- and events (custom signals like role-play started/completed, sequence
-- generated, calculator used). Indexes are tuned for the dashboard's
-- "last N events" / "top paths" / "by session" / "by date" reads.

CREATE TABLE IF NOT EXISTS page_views (
  id          BIGSERIAL PRIMARY KEY,
  session_id  TEXT        NOT NULL,
  path        TEXT        NOT NULL,
  ref         TEXT,
  ua          TEXT,
  ip_hash     TEXT,
  country     TEXT,
  region      TEXT,
  city        TEXT,
  viewed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON page_views (viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_session   ON page_views (session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_path      ON page_views (path);

CREATE TABLE IF NOT EXISTS events (
  id          BIGSERIAL PRIMARY KEY,
  session_id  TEXT        NOT NULL,
  kind        TEXT        NOT NULL,
  payload     JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_created_at ON events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_session    ON events (session_id);
CREATE INDEX IF NOT EXISTS idx_events_kind       ON events (kind);
