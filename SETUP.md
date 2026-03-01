# Jordan Croome — Site Setup Guide

This is a static site with **Netlify CMS** for content management.
You'll need a GitHub account and a Netlify account (both free).

---

## File Structure

```
jordancroome/
├── index.html              ← Your website
├── netlify.toml            ← Netlify configuration
├── admin/
│   ├── index.html          ← CMS admin panel (visit /admin)
│   └── config.yml          ← Defines all editable fields
├── content/
│   ├── hero.json           ← Hero section text
│   ├── statement.json      ← "Who I work with" section
│   ├── about.json          ← About section + stats + tags
│   ├── cta.json            ← Contact section + email/booking
│   ├── footer.json         ← Footer tagline + social links
│   ├── projects/           ← One .json file per project
│   ├── services/           ← One .json file per service
│   ├── testimonials/       ← One .json file per testimonial
│   └── articles/           ← One .json file per article
└── images/
    └── uploads/            ← CMS uploads images here
```

---

## Step 1 — Push to GitHub

1. Create a new repository at github.com (name it `jordancroome` or similar)
2. Upload all these files to the repo (drag & drop in the GitHub UI, or use Git)

---

## Step 2 — Deploy to Netlify

1. Go to **app.netlify.com** → "Add new site" → "Import from Git"
2. Connect your GitHub account and select your repo
3. Build settings:
   - Build command: *(leave blank)*
   - Publish directory: `.`
4. Click **Deploy site**

Your site will be live at a `*.netlify.app` URL in about 60 seconds.

---

## Step 3 — Enable Netlify Identity (for CMS login)

1. In Netlify dashboard → **Identity** tab → click **Enable Identity**
2. Under **Registration** → set to **Invite only** (important — keeps it private)
3. Under **Services** → **Git Gateway** → click **Enable Git Gateway**
4. Go to **Identity** tab → **Invite users** → enter your email address
5. Check your email and click the invite link to set your password

---

## Step 4 — Log in to the CMS

1. Visit `https://yoursite.netlify.app/admin`
2. Log in with the email/password you just set
3. You'll see the Netlify CMS dashboard

---

## Using the CMS

### Editing text sections
- **Site Settings** in the left sidebar contains:
  - Hero Section (eyebrow, headlines, CTA labels)
  - Statement Section (the "Who I work with" copy)
  - About Section (bio paragraphs, stats, skill tags, photo)
  - Contact / CTA Section (email address, Calendly URL)
  - Footer (tagline, social links)

### Adding / editing projects
- Click **Work / Projects** → click an existing project or "New Work / Projects"
- Fill in: title, client name, category, cover image, sort order
- **Cover image**: click the image field → upload from your computer
- Set **Sort order** (1 = first, 2 = second, etc.)
- Toggle **Featured** on/off to show/hide from the grid

### Adding testimonials
- Click **Testimonials** → "New Testimonials"
- Fill in the quote, author name, role, and a single initial letter for the avatar

### Adding articles
- Click **Writing / Articles** → "New Writing / Articles"
- Fill in title, category, excerpt, read time, and publish date

### Adding images
- All images uploaded via the CMS go to `/images/uploads/`
- Recommended sizes:
  - Project cover images: **1400×900px** (16:9)
  - About photo: **800×1000px** (4:5 portrait)

---

## Custom Domain (optional)

1. In Netlify → **Domain management** → **Add custom domain**
2. Enter `jordancroome.com.au`
3. Follow the DNS instructions (update your domain registrar's nameservers)
4. Netlify provisions a free SSL certificate automatically

---

## Adding a New Project (quick reference)

1. `/admin` → Work / Projects → New
2. Title: "Redesign of X"
3. Client: "Company Name"
4. Category: product / brand / ux
5. Category label: "Product · SaaS" (shown on hover)
6. Cover image: upload your project image
7. Sort order: set the number for its position in the grid
8. Featured: ON
9. Click **Publish**

The site updates within ~30 seconds automatically.
