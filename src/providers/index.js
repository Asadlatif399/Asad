import * as demo from './demo.js';
import * as rss from './rss.js';

// To add a source, export `fetchJobs(settings)` returning
// [{ externalId, title, content, url, budget, skills[], postedAt, client{} }]
// and register it here.
export const providers = { demo, rss };
