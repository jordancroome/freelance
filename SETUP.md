# Jordan Croome — Site Setup Guide

This is a static site with **Decap CMS** (formerly Netlify CMS) for content management. It is built to run on **Vercel** and uses **GitHub** for authentication and content storage.

You’ll need:

- A **GitHub** account (free)
- A **Vercel** account (free)

**→ For extremely detailed, step-by-step deployment instructions (every click and field explained), use [DEPLOYMENT-INSTRUCTIONS.md](./DEPLOYMENT-INSTRUCTIONS.md).**  
This file (SETUP.md) is the reference for file structure, config, and managing the CMS after deployment.

---

## Cursor: UI/UX Pro Max skill

The **ui-ux-pro-max** pack is installed under **`.cursor/skills/ui-ux-pro-max/`**. The main file is **`SKILL.md`** (design/a11y/motion/forms checklist). A project rule **`.cursor/rules/ui-ux-pro-max.mdc`** applies when editing HTML/CSS/JS. Full site review: **`docs/UI-UX-AUDIT.md`**.

---

## File structure

```
jordancroome/
├── index.html              ← Home (hero, statement, work, clients, testimonials, contact band, newsletter)
├── work/index.html         ← /work (project index) + /work/:slug (case studies via rewrite)
├── services/index.html     ← /services
├── about/index.html        ← /about
├── contact/index.html      ← /contact
├── vercel.json             ← Vercel configuration (headers, rewrites)
├── package.json            ← Dependencies for CMS OAuth (simple-oauth2)
├── admin/
│   ├── index.html          ← CMS admin panel (visit /admin)
│   └── config.yml          ← Copy; CMS loads from root config.yml (see below)
├── config.yml              ← CMS config (edit repo + base_url here)
├── api/                    ← Vercel serverless functions for GitHub OAuth
│   ├── auth.js             ← Starts GitHub login
│   ├── callback.js         ← Handles callback and returns token to CMS
│   └── _lib/
│       └── oauth2.js       ← Shared OAuth helper
├── content/
│   ├── hero.json           ← Hero section text
│   ├── statement.json      ← “Who I work with” section
│   ├── about.json          ← About section + stats + tags
│   ├── cta.json            ← Contact band on home + /contact (headline, body, email, booking)
│   ├── contact-form.json   ← /contact enquiry form (headings, Formspree URL or mailto fallback)
│   ├── footer.json         ← Footer tagline, CTA strip, Instagram, email, location, copyright
│   ├── projects/           ← One .json file per project
│   ├── services/           ← One .json file per service
│   └── testimonials/       ← One .json file per testimonial
└── images/
    └── uploads/            ← CMS uploads images here
```

---

## Step 1 — Push to GitHub

1. Create a new repository on GitHub (e.g. `jordancroome` or `freelance`).
2. Push this project to the repo (all files, including `admin/`, `api/`, `content/`, etc.).

---

## Step 2 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
2. Click **Add New** → **Project** and import your GitHub repository.
3. **Configure the project:**
   - **Framework Preset:** Other (or leave as detected).
   - **Build Command:** leave empty (static site).
   - **Output Directory:** `.` (root).
   - **Install Command:** `npm install` (so `simple-oauth2` is installed for the API routes).
4. Click **Deploy**.

Your site will be live at `https://your-project.vercel.app` (or your custom domain) in about a minute.

---

## Step 3 — Create a GitHub OAuth App (for CMS login)

The CMS logs in via GitHub. You need a GitHub OAuth App and its credentials in Vercel.

1. On GitHub: **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**  
   Or open: [github.com/settings/applications/new](https://github.com/settings/applications/new).

2. Fill in:
   - **Application name:** e.g. `Jordan Croome CMS`
   - **Homepage URL:** your live site URL, e.g. `https://your-project.vercel.app`
   - **Authorization callback URL:**  
     `https://YOUR_VERCEL_DOMAIN/api/callback`  
     Use the same domain as your live site (e.g. `https://your-project.vercel.app/api/callback`).  
     **Important:** Must be HTTPS and match the domain where the site is deployed.

3. Click **Register application**.

4. On the app page you’ll see **Client ID**. Click **Generate a new client secret** and copy the **Client secret** (you won’t see it again).

---

## Step 4 — Add environment variables in Vercel

1. In the Vercel dashboard, open your project → **Settings** → **Environment Variables**.
2. Add:
   - **Name:** `OAUTH_CLIENT_ID`  
     **Value:** the Client ID from your GitHub OAuth App  
     **Environment:** Production (and Preview if you want CMS on preview URLs).
   - **Name:** `OAUTH_CLIENT_SECRET`  
     **Value:** the Client secret from your GitHub OAuth App  
     **Environment:** Production (and Preview if needed).
3. Save. Redeploy the project so the new variables are applied (Deployments → … on latest → Redeploy).

---

## Step 5 — Point the CMS at your repo and site

1. In your repo, open **config.yml** (at the project root, not inside `admin/`).
2. Replace the placeholders:
   - **repo:** `YOUR_GITHUB_USERNAME/YOUR_REPO_NAME`  
     e.g. `jordancroome/freelance`.
   - **base_url:** `https://YOUR_VERCEL_URL.vercel.app`  
     Your actual production URL (HTTPS, no trailing slash).  
     If you use a custom domain, use that instead (e.g. `https://jordancroome.com.au`).
3. Commit and push. Vercel will redeploy with the updated config.

Example:

```yaml
backend:
  name: github
  repo: jordancroome/freelance
  branch: main
  base_url: https://jordancroome.vercel.app
  auth_endpoint: api/auth
```

---

## Step 6 — Log in to the CMS

1. Open `https://YOUR_VERCEL_URL.vercel.app/admin` (or your custom domain + `/admin`).
2. Click **Login with GitHub**.
3. Authorize the GitHub OAuth App when prompted (choose the repo that contains this site).
4. You’ll be redirected back to the Decap CMS dashboard.

**Note:** Only people with **write access** to the GitHub repo can log in and edit content. No separate CMS user accounts are created.

---

## Managing the CMS — Detailed guide

### How the CMS works

- The admin UI at **/admin** is a static page that loads Decap CMS.
- When you click “Login with GitHub,” you’re sent to **/api/auth**, which redirects to GitHub.
- After you authorize, GitHub sends the user back to **/api/callback**. That serverless function exchanges the code for an access token and sends it back to the CMS in the browser.
- All edits (and image uploads) create commits and pushes to your GitHub repo. Vercel then redeploys the site automatically.

### Site Settings (left sidebar)

Single-file settings that affect the whole site:

| Item | File | What you edit |
|------|------|----------------|
| **Hero Section** | `content/hero.json` | Eyebrow, headline lines, subheading, CTA button labels |
| **Statement Section** | `content/statement.json` | “Who I work with” label, heading, paragraphs |
| **About Section** | `content/about.json` | Heading, photo, bio paragraphs, stats numbers/labels, skill tags |
| **Contact / CTA** | `content/cta.json` | Top band on `/contact` + home: heading, body, email, Calendly, footer note |
| **Contact form** | `content/contact-form.json` | Second band on `/contact`: Name / Email / Message. Set **form_action** to a [Formspree](https://formspree.io) endpoint (`https://formspree.io/f/…`) to submit in-browser; leave empty to open the visitor’s mail app with a pre-filled message to your **cta.json** email. |
| **Footer** | `content/footer.json` | Tagline, CTA headline/button/link, Instagram, email, location line, copyright |

To edit: open **Site Settings** in the CMS, then the section you want. Change fields and click **Publish** (or **Save**). The change is committed to GitHub and the site redeploys.

### Client Logos (Trusted by… bar)
- **Location:** `content/clients/` — one JSON file per client.
- **To add:** **Client Logos** → **New Client Logos**. Enter business name, upload **Logo** (SVG or PNG), set sort order. Logos appear in the scrolling “Trusted by…” marquee. Uploaded logos are stored in `images/uploads/`.

### Work / Projects

- **Location:** `content/projects/` — one JSON file per project.
- **To add:** **Work / Projects** → **New Work / Projects**.
- **To edit:** Click an existing project in the list.

**Fields:**

- **Title** — Project title (e.g. “Redesign of X”).
- **Client name** — Company or client name.
- **Category** — `product`, `brand`, or `ux`.
- **Category label** — Shown on the site (e.g. “Product · SaaS”).
- **Cover image** — Upload or choose from media library.
- **Sort order** — Number; lower = higher in the grid (e.g. 1 = first).
- **Featured** — On = shown in the main grid.
- **Link URL** — Optional link when the project is clicked.
- **Short description** — Optional text.

**Case study bottom image (collage):** The page tries, in order: optional **Collage image** in CMS, then `images/projects/{slug}/collage.png`, `collage.webp`, `collage.jpg`, mapped `*-collage.png` filenames, then showcase / cover image. Add your collage under `images/projects/<same-slug-as-the-json-file>/` (e.g. `operata/collage.png` for `operata.json`).

**Quick add:** New project → fill fields → set **Sort order** and **Featured: ON** → **Publish**. The new file appears in `content/projects/` and the site updates after the next Vercel deploy.

### Services

- **Location:** `content/services/` — one JSON file per service.
- **Fields:** Title, Number (e.g. “01”), Sort order, Body text.

### Testimonials

- **Location:** `content/testimonials/` — one JSON file per testimonial.
- **Fields:** Quote, Author name, Author role & company, Author initial (single letter for avatar), Sort order.

### Images and uploads

- **Uploads folder:** `images/uploads/` (configured in `admin/config.yml` as `media_folder` / `public_folder`).
- All images uploaded in the CMS are stored in the repo under `images/uploads/` and referenced as `/images/uploads/filename.jpg`.
- **Suggested sizes:**
  - Project covers: **1400×900 px** (16:9).
  - About photo: **800×1000 px** (4:5 portrait).

### Publishing and drafts

- **Publish:** Saves the change and pushes a commit to GitHub. Vercel will deploy that commit.
- **Save (draft):** Some setups support “draft” commits; by default, saving in the CMS commits to the branch (e.g. `main`), so the site updates after deploy.
- Typical flow: edit → **Publish** → wait for Vercel to finish deploying (usually under a minute).

### Troubleshooting the CMS

- **“Failed to load config” or “config.yml (404)”**  
  - The CMS loads **config.yml** from the site root (`/config.yml`). Ensure that file exists and is committed.
  - Check that **base_url** in **config.yml** (project root) matches your live URL (HTTPS, no typo).
  - Ensure the latest commit is deployed on Vercel.

- **“Login with GitHub” does nothing or “Invalid Redirect URI” / “redirect_uri is not associated with this application”**  
  - In GitHub go to **Settings → Developer settings → OAuth Apps** and open your CMS OAuth App.
  - Set **Authorization callback URL** to exactly: `https://YOUR_DOMAIN/api/callback` (e.g. `https://jordan-croome-freelance.vercel.app/api/callback`). Use **https**, no trailing slash, no path except `/api/callback`.
  - Confirm `OAUTH_CLIENT_ID` and `OAUTH_CLIENT_SECRET` in Vercel match that app, then redeploy if you changed env vars.

- **“Error: OAUTH_CLIENT_ID and OAUTH_CLIENT_SECRET must be set”**  
  - Add both in Vercel → Settings → Environment Variables and redeploy.

- **New projects from the CMS don’t appear on the homepage**  
  - In Vercel, add the env var **GITHUB_REPO** (e.g. `jordancroome/freelance`) so the site can list project files from your repo. Redeploy after adding it.

- **Edits don’t appear on the site**  
  - Check that you clicked **Publish** in the CMS.
  - In Vercel, check **Deployments** for the latest deploy and that it succeeded.
  - Hard-refresh the site (or open in incognito) to avoid cache.

- **Preview URLs (e.g. `*.vercel.app`)**  
  - OAuth is tied to the **callback URL** you registered. If you use a custom domain in production, set that as the callback and `base_url`. If you want to use CMS on a preview deployment, you’d need a separate OAuth App (or a wildcard callback if supported) and matching `base_url`; for most cases, using the production URL is simplest.

---

## Custom domain (optional)

1. In Vercel: Project → **Settings** → **Domains** → **Add**.
2. Enter your domain (e.g. `jordancroome.com.au`).
3. Follow Vercel’s DNS instructions (add the records they show at your registrar or DNS provider).
4. After the domain is verified, Vercel will provision SSL.

Then:

- Update **Authorization callback URL** in the GitHub OAuth App to `https://yourdomain.com/api/callback`.
- Update **base_url** in **config.yml** (project root) to `https://yourdomain.com`.
- Use `https://yourdomain.com/admin` to access the CMS.

---

## Adding a new project (quick reference)

1. Go to **/admin** → **Work / Projects** → **New Work / Projects**.
2. Title: e.g. “Redesign of X”.
3. Client: company name.
4. Category: product / brand / ux.
5. Category label: e.g. “Product · SaaS”.
6. Cover image: upload.
7. Sort order: number for position (1 = first).
8. Featured: ON.
9. Click **Publish**.

The site will update after the next Vercel deploy (usually within a minute).
