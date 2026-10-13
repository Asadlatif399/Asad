import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  openDb, getSettings, saveSettings, listJobs, saveApplication, deleteApplication,
} from './db.js';
import { createScheduler } from './scheduler.js';
import { providers } from './providers/index.js';

const here = dirname(fileURLToPath(import.meta.url));

export function createApp(db) {
  const scheduler = createScheduler(db);

  async function route(req, res) {
    const url = new URL(req.url, 'http://x');
    const p = url.pathname;
    const m = req.method;

    if (m === 'GET' && (p === '/' || p === '/index.html')) {
      res.setHeader('content-type', 'text/html; charset=utf-8');
      return res.end(await readFile(join(here, '../public/index.html')));
    }
    if (m === 'GET' && p === '/api/settings') {
      return json(res, { settings: getSettings(db), providers: Object.keys(providers), ...scheduler.status() });
    }
    if (m === 'PUT' && p === '/api/settings') {
      const settings = saveSettings(db, await body(req));
      scheduler.reschedule();
      return json(res, { settings, providers: Object.keys(providers), ...scheduler.status() });
    }
    if (m === 'POST' && p === '/api/run') return json(res, await scheduler.runOnce());
    if (m === 'GET' && p === '/api/runs') {
      return json(res, db.prepare('SELECT * FROM runs ORDER BY id DESC LIMIT 20').all());
    }
    if (m === 'GET' && p === '/api/jobs') {
      return json(res, listJobs(db, Object.fromEntries(url.searchParams)));
    }
    const am = p.match(/^\/api\/jobs\/(\d+)\/application$/);
    if (am && m === 'PUT') {
      saveApplication(db, Number(am[1]), await body(req));
      return json(res, { ok: true });
    }
    if (am && m === 'DELETE') {
      deleteApplication(db, Number(am[1]));
      return json(res, { ok: true });
    }
    res.statusCode = 404;
    json(res, { error: 'not found' });
  }

  const server = createServer((req, res) => {
    route(req, res).catch((e) => {
      res.statusCode = e.status || 400;
      json(res, { error: e.message });
    });
  });
  return { server, scheduler };
}

function json(res, data) {
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(data));
}

async function body(req) {
  let s = '';
  for await (const c of req) {
    s += c;
    if (s.length > 1e6) throw Object.assign(new Error('body too large'), { status: 413 });
  }
  return s ? JSON.parse(s) : {};
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const db = openDb();
  const { server, scheduler } = createApp(db);
  scheduler.reschedule();
  const port = Number(process.env.PORT) || 3000;
  // Bound to localhost by default: the API has no authentication.
  server.listen(port, process.env.HOST || '127.0.0.1', () => console.log(`Job Watcher on http://${process.env.HOST || '127.0.0.1'}:${port}`));
}
