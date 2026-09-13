# Zain Ul Abideen — 3D Portfolio

Interactive portfolio with Three.js, dark/light theme, and a TaskBot case study. Static site — no build step.

## Local preview

```bash
cd zain-ul-abideen-portfolio
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080)

- Home: `/index.html`
- TaskBot case study: `/case-studies/taskbot.html`

## Deploy on Vercel

### Option A — Vercel CLI (fastest)

1. Install CLI: `npm i -g vercel`
2. From this folder:

```bash
cd "/Users/egora/Desktop/Flux TV/zain-ul-abideen-portfolio"
vercel
```

3. Follow prompts (link to your GitHub account if you want auto-deploys).
4. Production deploy:

```bash
vercel --prod
```

**Framework preset:** Other / None (static files)  
**Root directory:** `zain-ul-abideen-portfolio` (if the repo root is `Flux TV`, set this in Vercel project settings)

### Option B — GitHub + Vercel dashboard

1. Push this folder to a GitHub repository (or monorepo with this as root).
2. Go to [vercel.com/new](https://vercel.com/new) → Import the repo.
3. **Framework Preset:** Other  
4. **Build Command:** leave empty  
5. **Output Directory:** `.` (project root)  
6. Deploy.

### After deploy

- Set a custom domain in Vercel → Project → Settings → Domains.
- Resume PDF is included as `Zain Ul Abideen - Resume.pdf` for download links.

## Files

| Path | Purpose |
|------|---------|
| `index.html` | Main portfolio |
| `case-studies/taskbot.html` | TaskBot case study |
| `vercel.json` | Vercel static config |
| `js/theme.js` | Dark / light toggle (saved in `localStorage`) |
