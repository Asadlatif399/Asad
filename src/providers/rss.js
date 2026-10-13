// Generic RSS/Atom provider. Works with any job board that exposes a feed URL
// (e.g. a saved-search feed). Client stats are parsed best-effort from the
// item description when it contains "Label: value" lines (Upwork-style).

const decode = (s = '') =>
  s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');

const stripHtml = (s) => decode(s).replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').replace(/[ \t]+/g, ' ').trim();

function tag(block, name) {
  const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'));
  return m ? m[1].trim() : '';
}

const num = (s) => {
  if (s == null) return null;
  const m = String(s).replace(/,/g, '').match(/[\d.]+/);
  if (!m) return null;
  let n = parseFloat(m[0]);
  if (/k\b/i.test(s)) n *= 1000;
  if (/m\b/i.test(s)) n *= 1e6;
  return n;
};

function field(text, label) {
  const m = text.match(new RegExp(`${label}\\s*:\\s*([^\\n]+)`, 'i'));
  return m ? m[1].trim() : null;
}

export function parseClientStats(text) {
  const verified = field(text, 'Payment (?:method )?verified') ?? field(text, 'Payment');
  return {
    country: field(text, 'Country'),
    rating: num(field(text, '(?:Client )?Rating')),
    reviews: num(field(text, 'Reviews')),
    totalSpent: num(field(text, 'Total spent')),
    hireRate: num(field(text, 'Hire rate')),
    jobsPosted: num(field(text, 'Jobs posted')),
    paymentVerified: verified == null ? null : !/not|unverified|no/i.test(verified),
  };
}

export function parseFeed(xml) {
  const blocks = xml.match(/<(item|entry)[\s>][\s\S]*?<\/\1>/gi) || [];
  return blocks.map((b) => {
    const link = decode(tag(b, 'link')) || (b.match(/<link[^>]*href="([^"]+)"/i) || [])[1] || '';
    const raw = tag(b, 'description') || tag(b, 'content') || tag(b, 'summary');
    const content = stripHtml(raw);
    const title = stripHtml(tag(b, 'title'));
    const budget = field(content, 'Budget') ?? field(content, 'Hourly Range');
    const skills = field(content, 'Skills');
    return {
      externalId: decode(tag(b, 'guid')) || decode(tag(b, 'id')) || link || title,
      title,
      content,
      url: link,
      budget,
      skills: skills ? skills.split(/\s*,\s*/) : [],
      postedAt: (() => {
        const d = new Date(decode(tag(b, 'pubDate') || tag(b, 'published') || tag(b, 'updated')));
        return isNaN(d) ? null : d.toISOString();
      })(),
      client: parseClientStats(content),
    };
  });
}

export async function fetchJobs(settings) {
  if (!settings.feedUrl) throw new Error('feedUrl is not configured');
  const res = await fetch(settings.feedUrl, {
    headers: { 'user-agent': 'job-watcher/1.0', accept: 'application/rss+xml, application/atom+xml, text/xml' },
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) throw new Error(`Feed responded ${res.status}`);
  return parseFeed(await res.text());
}
