# SEO audit — Jordan Croome (portfolio)

**Date:** March 2026 · **Stack:** Static HTML on Vercel, JSON-driven case studies

Use this doc with Search Console + Lighthouse (SEO category) after each deploy.

---

## Executive summary

| Area | Status |
|------|--------|
| **Titles & meta descriptions** | Present on all main templates; case studies update title + description in JS when `meta_description` exists |
| **Canonical URLs** | **Added** — one per page; case studies set canonical to `/work/{slug}` in JS |
| **Open Graph + Twitter Cards** | **Added** — social previews; case studies override image/title/URL |
| **robots.txt + sitemap.xml** | **Added** — update domain if not `jordancroome.com.au` |
| **Structured data (JSON-LD)** | **Added** on homepage (`Person`) |
| **Admin / CMS** | **noindex** via `X-Robots-Tag` |
| **Language** | `lang="en"` on all pages ✓ |
| **Mobile viewport** | Present ✓ |

---

## 1. Critical — done in codebase

1. **`robots.txt`** — Allows crawl; blocks nothing except you should keep `/admin` out of sitemap. Admin gets **noindex** header.
2. **`sitemap.xml`** — Lists home, inner pages, and all current `/work/{slug}` URLs. **Regenerate** when you add/remove projects (or automate in CI).
3. **Canonical** — Avoids duplicate signals; **must match your live hostname** (www vs non-www). Pick one in Vercel redirects + Search Console.
4. **OG/Twitter** — Improves link sharing; default share image: `/images/uploads/hero-1.webp` — consider a **1200×630** PNG/WebP named e.g. `og-default.webp` for best social crop.

---

## 2. High priority — your ongoing checklist

| Item | Action |
|------|--------|
| **Production URL** | If the live site is not `https://jordancroome.com.au`, find-replace that string in: `robots.txt`, `sitemap.xml`, every page `<head>`, and `SITE_ORIGIN` in `work/index.html` script. |
| **Google Search Console** | Add property, submit sitemap, check “Page experience” + indexing. |
| **`meta_description` per project** | Many project JSON files omit it — add 150–160 char summaries in CMS for richer snippets on case studies. |
| **Work list images `alt=""`** | Grid thumbs use empty alt — **bad for SEO & a11y**. Set alt to e.g. `"{client} — {title}"` from JSON. |
| **Case study hero images** | Ensure collage/hero images have descriptive `alt` where they carry meaning. |

---

## 3. Medium priority

| Item | Notes |
|------|--------|
| **Homepage contact band** | Single H1 on home is hero; H2s in sections — OK. Confirm one clear H1 per URL. |
| **Internal links** | Already use absolute paths `/contact`, `/work` — good for SPA-adjacent routing. |
| **HTTPS** | Vercel default — enforce HSTS in Vercel if not already. |
| **Core Web Vitals** | Hero WebGL + fonts affect LCP; monitor in CrUX / PageSpeed. |
| **Duplicate titles** | Case studies without distinct `client`/`title` could collide — unique titles per project. |

---

## 4. Nice to have

- **BreadcrumbList** JSON-LD on case studies (`Home → Work → Project`).
- **`WebSite` + `SearchAction`** if you add site search.
- **`Article` / `BlogPosting`** if writing/blog goes live.
- **hreflang** only if you add localized copies.
- **Pre-render or SSR** for case studies if you need **instant** correct meta for crawlers that don’t run JS well (Google generally runs JS; others vary).

---

## 5. Files touched for SEO

| File | Role |
|------|------|
| `/robots.txt` | Crawl rules + sitemap URL |
| `/sitemap.xml` | URL list for engines |
| `index.html`, `about/`, `contact/`, `services/`, `work/` | Canonical, OG, Twitter, meta |
| `work/index.html` (script) | `SITE_ORIGIN`, per–case-study SEO, work index reset |
| `vercel.json` | `X-Robots-Tag: noindex` for `/admin` |
| Homepage | `Person` JSON-LD |

---

## 6. Quick verification commands

After deploy:

```bash
curl -sI https://YOUR_DOMAIN/robots.txt
curl -sI https://YOUR_DOMAIN/sitemap.xml
curl -sI https://YOUR_DOMAIN/admin | grep -i robots
```

Use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and [Twitter Card Validator](https://cards-dev.twitter.com/validator) on home + one case study URL.
