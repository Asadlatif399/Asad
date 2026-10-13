import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export const DEFAULT_SETTINGS = {
  enabled: false,
  intervalMinutes: 15,
  provider: 'demo',
  feedUrl: '',
  keywords: '',
};

export function openDb(file = process.env.DB_FILE || 'data/jobs.db') {
  if (file !== ':memory:') mkdirSync(dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      external_id TEXT NOT NULL,
      provider TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      url TEXT,
      budget TEXT,
      skills TEXT,
      posted_at TEXT,
      fetched_at TEXT NOT NULL DEFAULT (datetime('now')),
      client_country TEXT,
      client_rating REAL,
      client_reviews INTEGER,
      client_total_spent REAL,
      client_hire_rate REAL,
      client_jobs_posted INTEGER,
      client_payment_verified INTEGER,
      client_raw TEXT,
      UNIQUE (provider, external_id)
    );
    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id INTEGER NOT NULL UNIQUE REFERENCES jobs(id) ON DELETE CASCADE,
      proposal TEXT NOT NULL,
      bid_amount REAL,
      status TEXT NOT NULL DEFAULT 'applied',
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      started_at TEXT NOT NULL,
      finished_at TEXT,
      fetched INTEGER NOT NULL DEFAULT 0,
      added INTEGER NOT NULL DEFAULT 0,
      error TEXT
    );
  `);
  return db;
}

export function getSettings(db) {
  const out = { ...DEFAULT_SETTINGS };
  for (const { key, value } of db.prepare('SELECT key, value FROM settings').all()) {
    if (key in out) out[key] = JSON.parse(value);
  }
  return out;
}

export function saveSettings(db, patch) {
  const next = { ...getSettings(db) };
  if ('enabled' in patch) next.enabled = Boolean(patch.enabled);
  if ('intervalMinutes' in patch) {
    const n = Number(patch.intervalMinutes);
    if (!Number.isFinite(n) || n < 1) throw new Error('intervalMinutes must be >= 1');
    next.intervalMinutes = Math.floor(n);
  }
  for (const k of ['provider', 'feedUrl', 'keywords']) {
    if (k in patch) next[k] = String(patch[k] ?? '').trim();
  }
  const up = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value');
  for (const [k, v] of Object.entries(next)) up.run(k, JSON.stringify(v));
  return next;
}

/** Insert jobs, skipping ones already stored. Returns the number of new rows. */
export function saveJobs(db, provider, jobs) {
  const ins = db.prepare(`
    INSERT OR IGNORE INTO jobs (external_id, provider, title, content, url, budget, skills, posted_at,
      client_country, client_rating, client_reviews, client_total_spent, client_hire_rate,
      client_jobs_posted, client_payment_verified, client_raw)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  let added = 0;
  db.exec('BEGIN');
  try {
    for (const j of jobs) {
      const c = j.client || {};
      const r = ins.run(
        j.externalId, provider, j.title, j.content ?? '', j.url ?? null, j.budget ?? null,
        j.skills?.join(', ') ?? null, j.postedAt ?? null,
        c.country ?? null, c.rating ?? null, c.reviews ?? null, c.totalSpent ?? null,
        c.hireRate ?? null, c.jobsPosted ?? null,
        c.paymentVerified == null ? null : Number(Boolean(c.paymentVerified)),
        JSON.stringify(c),
      );
      added += Number(r.changes);
    }
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
  return added;
}

export function listJobs(db, { q = '', applied = '', limit = 100, offset = 0 } = {}) {
  const where = [];
  const args = [];
  if (q) {
    where.push('(j.title LIKE ? OR j.content LIKE ? OR j.skills LIKE ?)');
    args.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  if (applied === '1') where.push('a.id IS NOT NULL');
  if (applied === '0') where.push('a.id IS NULL');
  const sql = `
    SELECT j.*, a.id AS application_id, a.proposal, a.bid_amount, a.status AS application_status, a.applied_at
    FROM jobs j LEFT JOIN applications a ON a.job_id = j.id
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY COALESCE(j.posted_at, j.fetched_at) DESC, j.id DESC LIMIT ? OFFSET ?`;
  return db.prepare(sql).all(...args, Math.min(Number(limit) || 100, 500), Number(offset) || 0);
}

export function saveApplication(db, jobId, { proposal, bidAmount, status }) {
  if (!db.prepare('SELECT 1 FROM jobs WHERE id = ?').get(jobId)) throw new Error('job not found');
  if (!proposal || !String(proposal).trim()) throw new Error('proposal text is required');
  db.prepare(`
    INSERT INTO applications (job_id, proposal, bid_amount, status) VALUES (?, ?, ?, ?)
    ON CONFLICT(job_id) DO UPDATE SET proposal = excluded.proposal, bid_amount = excluded.bid_amount, status = excluded.status`)
    .run(jobId, String(proposal).trim(), bidAmount == null || bidAmount === '' ? null : Number(bidAmount), status || 'applied');
}

export function deleteApplication(db, jobId) {
  db.prepare('DELETE FROM applications WHERE job_id = ?').run(jobId);
}
