import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openDb, saveSettings, getSettings, saveJobs, listJobs, saveApplication } from '../src/db.js';
import { parseFeed } from '../src/providers/rss.js';
import { createApp } from '../src/server.js';

const FEED = `<rss><channel><item>
<title><![CDATA[Build a React app]]></title><link>https://x.test/j/1</link><guid>j1</guid>
<pubDate>Mon, 13 Oct 2026 10:00:00 GMT</pubDate>
<description><![CDATA[Need dashboard.<br/>Budget: $500<br/>Skills: React, TypeScript<br/>Country: Germany<br/>Total spent: $12.5k<br/>Hire rate: 80%<br/>Payment verified: Yes]]></description>
</item></channel></rss>`;

test('parses RSS items with client stats', () => {
  const [j] = parseFeed(FEED);
  assert.equal(j.title, 'Build a React app');
  assert.equal(j.externalId, 'j1');
  assert.deepEqual(j.skills, ['React', 'TypeScript']);
  assert.equal(j.client.country, 'Germany');
  assert.equal(j.client.totalSpent, 12500);
  assert.equal(j.client.hireRate, 80);
  assert.equal(j.client.paymentVerified, true);
});

test('dedupes jobs and stores proposals', () => {
  const db = openDb(':memory:');
  const jobs = parseFeed(FEED);
  assert.equal(saveJobs(db, 'rss', jobs), 1);
  assert.equal(saveJobs(db, 'rss', jobs), 0);
  const [row] = listJobs(db);
  assert.equal(row.client_total_spent, 12500);
  saveApplication(db, row.id, { proposal: 'Hi!', bidAmount: 450 });
  assert.equal(listJobs(db, { applied: '1' })[0].proposal, 'Hi!');
  assert.equal(listJobs(db, { applied: '0' }).length, 0);
  assert.throws(() => saveApplication(db, row.id, { proposal: ' ' }));
});

test('settings validation', () => {
  const db = openDb(':memory:');
  assert.throws(() => saveSettings(db, { intervalMinutes: 0 }));
  assert.equal(saveSettings(db, { intervalMinutes: 5, enabled: true }).intervalMinutes, 5);
  assert.equal(getSettings(db).enabled, true);
});

test('scheduler run via API stores demo jobs', async () => {
  const db = openDb(':memory:');
  const { server, scheduler } = createApp(db);
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const run = await (await fetch(base + '/api/run', { method: 'POST' })).json();
  assert.equal(run.added, 3);
  const jobs = await (await fetch(base + '/api/jobs')).json();
  assert.equal(jobs.length, 3);
  assert.ok(jobs[0].client_country);
  scheduler.stop();
  server.close();
});
