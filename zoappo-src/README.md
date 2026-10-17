# Zoappo website

A static, multi-page site with clean URLs, built from one source. No dependencies beyond Node 18+.

```
zoappo-src/
  build.js          build script
  data/pages.json   page content (extracted from the original preview, unchanged wording)
  src/render.js     every page as HTML (also used for the single-file preview)
  src/behaviors.js  animation, search, forms, navigation
  src/site.css      design system (logo colours, light + dark themes)
zoappo-site/        generated, deploy this folder to any static host
Zoappo_Website.html generated single-file preview (hash routing)
```

Build: `node zoappo-src/build.js`. Preview locally: `cd zoappo-site && python3 -m http.server 8080`.

## Site map

| Section | URLs |
|---|---|
| Home | `/` |
| Solutions | `/solutions/`, `/solutions/{sales,marketing,custom-processes,hrms,finance-operations,collaboration}/` |
| Apps directory (search and filter) | `/apps/` |
| Zoho One and app pages | `/zoho-one/`, `/zoho-crm/`, `/books/` ... (original URLs kept) |
| Services | `/services/` (implementation, customization, integrations, custom apps, support), plus `/web-mobile-development/`, `/openai-whatsapp-integrations/`, `/biometric-devices/` |
| How we work | `/how-we-work/` |
| Resources | `/blog/`, `/blog/{slug}/`, `/faq/` |
| Company | `/about-us/`, `/contact/`, `/thank-you/` |

Every page ships with a title, description, canonical URL, Open Graph tags and JSON-LD (Organization, BreadcrumbList, FAQPage on the FAQ, Article on posts). `sitemap.xml` and `robots.txt` are generated.

## Before launch

1. Enquiry form: set `endpoint` in `zoappo-site/assets/config.js` (or `ZP_CFG` in `build.js`). It posts JSON: first, last, email, phone, company, country, interest, size, message, page. Until set, the form shows a preview-only notice.
2. Images: client logos and product screenshots load from zoappo.com. The design falls back to names when an image is unavailable.
3. Not included because the original preview has no copy for them: privacy policy, terms, case studies, pricing. Add them as new pages in `data/pages.json` and `src/render.js`.
4. Production domain is `https://zoappo.com` (see `SITE` in `build.js`).
