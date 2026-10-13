import { getSettings, saveJobs } from './db.js';
import { providers } from './providers/index.js';

export function createScheduler(db) {
  let timer = null;
  let running = false;
  let nextRunAt = null;

  async function runOnce() {
    if (running) return { skipped: true };
    running = true;
    const settings = getSettings(db);
    const started = new Date().toISOString();
    const runId = Number(db.prepare('INSERT INTO runs (started_at) VALUES (?)').run(started).lastInsertRowid);
    try {
      const provider = providers[settings.provider];
      if (!provider) throw new Error(`Unknown provider "${settings.provider}"`);
      let jobs = await provider.fetchJobs(settings);
      const kws = settings.keywords.split(',').map((k) => k.trim().toLowerCase()).filter(Boolean);
      if (kws.length) {
        jobs = jobs.filter((j) => {
          const hay = `${j.title} ${j.content} ${(j.skills || []).join(' ')}`.toLowerCase();
          return kws.some((k) => hay.includes(k));
        });
      }
      const added = saveJobs(db, settings.provider, jobs);
      db.prepare('UPDATE runs SET finished_at = ?, fetched = ?, added = ? WHERE id = ?')
        .run(new Date().toISOString(), jobs.length, added, runId);
      return { fetched: jobs.length, added };
    } catch (e) {
      db.prepare('UPDATE runs SET finished_at = ?, error = ? WHERE id = ?')
        .run(new Date().toISOString(), String(e.message || e), runId);
      return { error: String(e.message || e) };
    } finally {
      running = false;
    }
  }

  /** (Re)arm the timer from current settings. The first run happens after one full interval. */
  function reschedule() {
    if (timer) clearTimeout(timer);
    timer = null;
    nextRunAt = null;
    const s = getSettings(db);
    if (!s.enabled) return;
    const ms = s.intervalMinutes * 60_000;
    nextRunAt = new Date(Date.now() + ms).toISOString();
    timer = setTimeout(async () => {
      await runOnce();
      reschedule();
    }, ms);
  }

  return {
    runOnce,
    reschedule,
    status: () => ({ running, nextRunAt }),
    stop: () => timer && clearTimeout(timer),
  };
}
