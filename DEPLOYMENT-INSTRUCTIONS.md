# Extremely Detailed Deployment Instructions — Vercel + CMS

Follow these steps in order. Every click and field is described so you can do this without guessing.

---

## Before you start

**You need:**

- A **GitHub** account. If you don’t have one: [github.com/join](https://github.com/join) — sign up (free).
- A **Vercel** account. You’ll create it when we deploy (free; sign in with GitHub).
- This project on your computer (the folder with `index.html`, `admin/`, `api/`, `content/`, etc.).

**Write these down as you go (you’ll need them later):**

| What | Your value (fill in) |
|------|----------------------|
| Your GitHub username | |
| Your GitHub repository name | |
| Your Vercel project URL (e.g. `something.vercel.app`) | |
| GitHub OAuth Client ID | |
| GitHub OAuth Client secret | |

---

# Part 1 — Put the site on GitHub

## 1.1 Create a new repository on GitHub

1. Open your browser and go to: **https://github.com**
2. Log in to your account.
3. In the top-right, click the **+** icon, then click **New repository**.
4. You’ll see the “Create a new repository” page. Fill it in as follows:

   - **Repository name:**  
     Type a short name, e.g. `freelance` or `jordancroome`.  
     This will be your repo name. Write it in the table above.

   - **Description:**  
     Optional. You can leave it blank or e.g. “Portfolio site”.

   - **Public**  
     Leave **Public** selected.

   - **Do NOT check** “Add a README file”, “Add .gitignore”, or “Choose a license”.  
     We’re adding an existing project; we don’t want GitHub to create any files.

5. Click the green **Create repository** button.
6. You’ll see a page titled “Quick setup — if you’ve done this kind of thing before”.  
   **Leave this page open** — we’ll use the URL it shows (looks like `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git`).  
   Write down **YOUR_USERNAME** and **YOUR_REPO_NAME** in the table at the top of this doc.

---

## 1.2 Push your project to GitHub from your computer

You’ll run commands in a terminal (Terminal.app on Mac, or the terminal inside Cursor/VS Code).

**If you’ve never used Git in this folder:**

1. Open Terminal.
2. Go into your project folder. For example:
   ```bash
   cd /Users/jordancroome/Desktop/freelance
   ```
   (Use the real path to the folder that contains `index.html`.)

3. Turn the folder into a Git repo and make the first commit:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - site and CMS setup"
   ```

4. Rename the default branch to `main` (if needed):
   ```bash
   git branch -M main
   ```

5. Add GitHub as the remote. **Replace YOUR_USERNAME and YOUR_REPO_NAME** with the values you wrote down:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   ```

6. Push to GitHub:
   ```bash
   git push -u origin main
   ```
   If GitHub asks for login, use your GitHub username and a **Personal Access Token** (not your password).  
   To create a token: GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)** → **Generate new token**. Give it “repo” scope.

**If this folder is already a Git repo and you’ve already added the remote:**

1. Make sure all files are committed:
   ```bash
   cd /Users/jordancroome/Desktop/freelance
   git add .
   git status
   ```
   If there are changes, run:
   ```bash
   git commit -m "Add Vercel and CMS config"
   ```

2. Push to GitHub (use your branch name if it’s not `main`):
   ```bash
   git push -u origin main
   ```

7. On GitHub, refresh the repo page. You should see all your files (`index.html`, `admin/`, `api/`, `content/`, etc.).  
   If you see them, **Part 1 is done.** Write down your repo as **USERNAME/REPO_NAME** (e.g. `jordancroome/freelance`).

---

# Part 2 — Deploy the site on Vercel

## 2.1 Sign in to Vercel and import the repo

1. Go to: **https://vercel.com**
2. Click **Sign Up** or **Log In**.
3. Choose **Continue with GitHub**. Authorize Vercel to access your GitHub if asked.
4. After login you’ll see the Vercel dashboard.
5. Click **Add New…** (or **Add New** → **Project**).
6. You’ll see “Import Git Repository”. Under **Import Git Repository**, you should see your GitHub account and a list of repos.
7. Find the repo you just pushed (e.g. `freelance` or `jordancroome/freelance`) and click **Import** next to it.  
   If you don’t see it, click **Adjust GitHub App Permissions** and grant Vercel access to that repository, then try again.

---

## 2.2 Configure the project (important)

On the “Configure Project” page, set these exactly:

1. **Project Name**  
   - Vercel will suggest a name (often the repo name). You can keep it or change it (e.g. `jordancroome`).  
   - This decides your URL: `https://PROJECT_NAME.vercel.app`.  
   - **Write down this URL** (you’ll use it for the GitHub OAuth App and for `admin/config.yml`).

2. **Framework Preset**  
   - Click the dropdown. Choose **Other** (or leave as “Other” if it’s already that).  
   - We’re not using Next.js, Create React App, etc.; it’s a plain static site.

3. **Root Directory**  
   - Leave as **.** (dot). That means “use the root of the repo.”

4. **Build and Output Settings**  
   - **Build Command:**  
     Leave **empty** or delete any text. We don’t run a build step.  
   - **Output Directory:**  
     Type a single dot: **.**  
     This tells Vercel the “built” site is the repo root (where `index.html` is).  
   - **Install Command:**  
     Leave as **npm install** (default). This installs `simple-oauth2` for the CMS login API.

5. **Environment Variables**  
   - Leave empty for now. We’ll add them in Part 4.

6. Click **Deploy**.

---

## 2.3 Wait for the deploy and get your URL

1. You’ll see a “Building” / “Deploying” screen. Wait until it says **Congratulations** or **Ready** (usually 1–2 minutes).
2. Click **Visit** (or “Continue to Dashboard”) to open your live site.
3. The URL will look like: **https://your-project-name.vercel.app**  
   (or with a random suffix if the name was taken, e.g. `your-project-abc123.vercel.app`.)
4. **Copy this full URL** (with `https://`, no trailing slash) and write it in the table at the top. You need it for:
   - GitHub OAuth App callback
   - `admin/config.yml` → `base_url`

**Check:** Open `https://YOUR_VERCEL_URL.vercel.app` in a new tab. You should see your site (hero, projects, etc.).  
**Check:** Open `https://YOUR_VERCEL_URL.vercel.app/admin`. You should see the CMS login page (e.g. “Login with GitHub”). If you see that, **Part 2 is done.** Don’t try to log in yet — we haven’t set up the OAuth App.

---

# Part 3 — Create the GitHub OAuth App (for CMS login)

The CMS needs to log you in with GitHub. GitHub requires a small “app” (OAuth App) so it knows where to send you after you authorize.

## 3.1 Open the “New OAuth App” page

1. In a new tab, go to: **https://github.com/settings/applications/new**  
   Or: GitHub → click your profile picture (top-right) → **Settings** → left sidebar **Developer settings** → **OAuth Apps** → **New OAuth App**.

2. You’ll see the form “Register a new OAuth application”.

---

## 3.2 Fill in the OAuth App form

Use **your real Vercel URL** from Part 2 (the one you wrote down). Example: if your site is `https://jordancroome.vercel.app`, use that everywhere below.

1. **Application name**  
   - Type something like: **Jordan Croome CMS** (or any name you’ll recognise).  
   - This name appears when you click “Login with GitHub” in the CMS.

2. **Homepage URL**  
   - Type your **live site URL** only, no path.  
   - Correct: `https://your-project.vercel.app`  
   - Wrong: `https://your-project.vercel.app/` (no trailing slash is safer)  
   - Wrong: `https://your-project.vercel.app/admin`  
   - Use the **exact** URL you see in the browser when you open your site.

3. **Application description**  
   - Optional. You can leave it blank.

4. **Authorization callback URL**  
   - This is **critical** and must be exactly right.  
   - Type: **https://YOUR_VERCEL_URL/api/callback**  
   - Replace `YOUR_VERCEL_URL` with your actual domain (no path, no trailing slash).  
   - Examples:  
     - `https://jordancroome.vercel.app/api/callback`  
     - `https://freelance-abc123.vercel.app/api/callback`  
   - Do **not** add a slash after `callback`.  
   - Do **not** use `localhost` here — use the real Vercel URL.

5. Click **Register application**.

---

## 3.3 Get the Client ID and Client secret

1. You’ll land on the app’s settings page.
2. **Client ID**  
   - You’ll see a long string labelled “Client ID” (e.g. `Ov23liAbc123...`).  
   - Click the copy icon (or select and copy).  
   - Paste it somewhere safe and **write it in the table** at the top as “GitHub OAuth Client ID”.

3. **Client secrets**  
   - Under “Client secrets”, click **Generate a new client secret**.
   - Optional: add an expiry or note. Click **Generate**.
   - You’ll see the secret **once**. Copy it immediately and **write it in the table** as “GitHub OAuth Client secret”.  
   - If you lose it, generate a new one and update the value in Vercel (Part 4).

**Part 3 is done** when you have both Client ID and Client secret saved.

---

# Part 4 — Add the secrets to Vercel

Vercel’s API routes (`/api/auth` and `/api/callback`) need the Client ID and secret. You add them as environment variables.

## 4.1 Open Environment Variables

1. Go to **https://vercel.com** and open your dashboard.
2. Click the **project** you deployed (e.g. “freelance” or “jordancroome”).
3. At the top, click **Settings**.
4. In the left sidebar under “Project”, click **Environment Variables**.

---

## 4.2 Add OAUTH_CLIENT_ID

1. Under “Key”, type exactly: **OAUTH_CLIENT_ID**  
   (all caps, underscore, no spaces.)
2. Under “Value”, paste your **GitHub OAuth Client ID** (from Part 3).
3. Under “Environment”, select **Production** (and optionally **Preview** if you want to use the CMS on preview deployments).
4. Click **Save**.

---

## 4.3 Add OAUTH_CLIENT_SECRET

1. Click **Add New** (or “Add another”).
2. Key: **OAUTH_CLIENT_SECRET**
3. Value: paste your **GitHub OAuth Client secret** (from Part 3).
4. Environment: **Production** (and optionally **Preview**).
5. Click **Save**.

---

## 4.4 Redeploy so the new variables are used

Environment variables are only applied on **new** deploys.

1. In your project, click the **Deployments** tab (top).
2. Find the **latest** deployment (top of the list).
3. Click the **three dots (⋯)** on the right of that deployment.
4. Click **Redeploy**.
5. Confirm **Redeploy**.
6. Wait until the status is **Ready**.

**Part 4 is done** when both variables are saved and the latest deploy is Ready.

---

# Part 5 — Point the CMS at your repo and your site URL

The CMS loads its config from **config.yml at the project root** (so it’s served as `/config.yml` and doesn’t 404 on Vercel). That file must have: (1) your GitHub repo, and (2) your live site URL.

## 5.1 Open config.yml (project root)

**Option A — Edit on GitHub (easiest):**

1. Go to your repo on GitHub: **https://github.com/YOUR_USERNAME/YOUR_REPO_NAME**
2. In the **root** of the repo (not inside any folder), click **config.yml**.
3. Click the **pencil icon** (Edit this file).

**Option B — Edit on your computer:**

1. Open the project in Cursor/VS Code (or any editor).
2. Open the file **config.yml** (in the project root, same level as `index.html`).

---

## 5.2 Replace the two placeholders

At the top of `config.yml` you’ll see something like:

```yaml
backend:
  name: github
  repo: YOUR_GITHUB_USERNAME/YOUR_REPO_NAME   # e.g. jordancroome/freelance
  branch: main
  base_url: https://YOUR_VERCEL_URL.vercel.app   # Your live site URL (HTTPS)
  auth_endpoint: api/auth
```

Change **only** these two:

1. **repo**  
   - Replace `YOUR_GITHUB_USERNAME/YOUR_REPO_NAME` with your real repo.  
   - Format: **username/repository-name** (one slash, no spaces, no `https://` or `.git`).  
   - Examples: `jordancroome/freelance`, `jordancroome/jordancroome`.

2. **base_url**  
   - Replace `https://YOUR_VERCEL_URL.vercel.app` with your **actual** Vercel URL (the one you wrote down).  
   - Must be **https**, no trailing slash.  
   - Examples: `https://jordancroome.vercel.app`, `https://freelance-xyz.vercel.app`.

**Example after editing (yours will have your own values):**

```yaml
backend:
  name: github
  repo: jordancroome/freelance
  branch: main
  base_url: https://jordancroome.vercel.app
  auth_endpoint: api/auth
```

Do **not** change `name`, `branch`, or `auth_endpoint`.

---

## 5.3 Save and push the change

**If you edited on GitHub:**

1. Scroll down to “Commit changes”.
2. Message can be: `Configure CMS repo and base_url`
3. Click **Commit changes**.

**If you edited on your computer:**

1. Save the file.
2. In the terminal, from your project folder:
   ```bash
   git add admin/config.yml
   git commit -m "Configure CMS repo and base_url"
   git push
   ```

4. Wait for Vercel to deploy the new commit (Deployments tab; usually under a minute).

**Part 5 is done** when **config.yml** (project root) has the correct `repo` and `base_url` and that commit is pushed and deployed.

---

# Part 6 — Log in to the CMS

## 6.1 Open the admin page

1. In your browser, go to: **https://YOUR_VERCEL_URL.vercel.app/admin**  
   (Use your real Vercel URL.)
2. You should see the Decap CMS screen with a button like **Login with GitHub**.

---

## 6.2 Click Login with GitHub

1. Click **Login with GitHub**.
2. You may be redirected to GitHub. If GitHub asks you to sign in, sign in.
3. You’ll see “Authorize [Your OAuth App name]?” (e.g. “Authorize Jordan Croome CMS?”).  
   It may ask which repositories to allow. Choose:
   - **Only select repositories** → pick the repo that contains this site (e.g. `freelance`),  
   - or **All repositories** if you prefer.
4. Click **Authorize** (or **Install** / **Save**).
5. You should be sent back to your site at `/admin` and see the CMS dashboard: left sidebar with “Site Settings”, “Work / Projects”, “Services”, “Testimonials”, “Writing / Articles”.

If that’s what you see, **you’re done with deployment.** You can now edit content.

---

## 6.3 If login doesn’t work

- **Blank or error after “Login with GitHub”**  
  - Check that the **Authorization callback URL** in the GitHub OAuth App is **exactly** `https://YOUR_VERCEL_URL/api/callback` (no typo, same domain as the site).
  - Check that you **redeployed** after adding `OAUTH_CLIENT_ID` and `OAUTH_CLIENT_SECRET` in Vercel.

- **“Failed to load config” or “config.yml (404)”**  
  - The CMS loads config from **/config.yml** (the file **config.yml** in the project root). Ensure that file exists and is committed.
  - Check **base_url** in **config.yml** — must match the URL in the browser (e.g. `https://your-project.vercel.app`).
  - Make sure the latest commit is deployed on Vercel.

- **“OAUTH_CLIENT_ID and OAUTH_CLIENT_SECRET must be set”**  
  - In Vercel → Project → Settings → Environment Variables, confirm both names are exactly `OAUTH_CLIENT_ID` and `OAUTH_CLIENT_SECRET`, then redeploy.

---

# Quick checklist (fill in for your project)

| Step | What to do | Done? |
|------|------------|--------|
| 1 | Create GitHub repo and push project | ☐ |
| 2 | Deploy project on Vercel; note live URL | ☐ |
| 3 | Create GitHub OAuth App; set callback to `https://YOUR_URL/api/callback`; copy Client ID and secret | ☐ |
| 4 | In Vercel, add `OAUTH_CLIENT_ID` and `OAUTH_CLIENT_SECRET`; redeploy | ☐ |
| 5 | In **config.yml** (project root), set `repo` and `base_url`; commit and push | ☐ |
| 6 | Open `https://YOUR_URL/admin`, click Login with GitHub, authorize | ☐ |

---

# What to do next

- **Edit content:** Use the left sidebar in the CMS (Site Settings, Work / Projects, etc.). Change fields and click **Publish**. The site will update after the next Vercel deploy.
- **Full CMS reference:** See **SETUP.md** in this repo for detailed sections on every collection (projects, services, testimonials, articles, images, troubleshooting).
- **Custom domain:** In Vercel → Settings → Domains, add your domain and follow the DNS steps. Then update the GitHub OAuth App callback URL and `base_url` in **config.yml** (project root) to use that domain (e.g. `https://jordancroome.com.au` and `https://jordancroome.com.au/api/callback`).
