# Job Watcher

Web app that runs on a schedule, fetches the latest posted jobs, and stores the
job content, client stats and (when you apply) your proposal in SQLite.

## Run

Requires Node >= 22.13 (uses built-in `node:sqlite`; no npm dependencies).

```
npm start          # http://127.0.0.1:3000  (PORT / HOST / DB_FILE env vars)
npm test
```

## Use

1. Pick a provider, set the interval (minutes), tick **Schedule on**, **Save**.
   The first scheduled run happens one interval later; **Run now** fetches immediately.
2. Jobs are de-duplicated per provider and shown newest first with client stats
   (country, rating, reviews, total spent, hire rate, jobs posted, payment verified).
3. Open **Apply / save proposal** on a job to store proposal text, bid and status
   (applied / interview / hired / declined).

## Providers

- `demo` – generates sample jobs (try the app with no setup).
- `rss` – any RSS/Atom feed URL. Client stats are parsed from `Label: value`
  lines in the item description (Country, Rating, Reviews, Total spent, Hire rate,
  Jobs posted, Payment verified).

Add a source by creating `src/providers/<name>.js` exporting
`fetchJobs(settings)` and registering it in `src/providers/index.js`. For Upwork,
use its official GraphQL API with your own OAuth credentials in a new provider;
scraping the site is against its terms.

Note: the API has no authentication and binds to 127.0.0.1 by default. Put it
behind auth before exposing it.
