# Poshan Score — landing page

Four static HTML files, no build step, no dependencies:

- `index.html` — the landing page (default root file both platforms look for)
- `browse.html` — Browse page: 19 real products, scored per age band (1–3,
  4–6, 7–9, 10–12 yrs) with animated tabs, using the equal-weight 10-metric
  rubric from age-metrics.html
- `age-metrics.html` — the age-banded rubric page: all ten metrics, their
  daily-reference thresholds, and full source citations (ICMR-NIN, WHO,
  NASEM/IOM, FSSAI)
- `why-we-do-this.html` — the founder-story page, with a scroll-linked
  timeline animation

Keep all four files in the same folder when you upload — the links between
them are relative paths, so no config needed.

## Deploy on GitHub Pages

1. Create a new repo on GitHub (e.g. `poshan-score`).
2. Upload all four HTML files to the repo root (drag-and-drop
   on the GitHub web UI works fine — no git CLI required).
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to "Deploy from a branch",
   branch `main`, folder `/ (root)`. Save.
5. GitHub gives you a URL like `https://<username>.github.io/poshan-score/`
   within a minute or two.

## Deploy on Cloudflare Pages

**Option A — no GitHub needed (fastest):**
1. Go to the Cloudflare dashboard → **Workers & Pages** → **Create** →
   **Pages** → **Upload assets**.
2. Drag in the whole folder (all four HTML files).
3. Give the project a name and click **Deploy**. Cloudflare gives you a
   `*.pages.dev` URL immediately.

**Option B — connect the GitHub repo (auto-redeploys on push):**
1. Push `index.html` to a GitHub repo (see steps above).
2. In Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git**, pick the repo.
3. Build settings: leave **Build command** empty and set **Build output
   directory** to `/` (it's plain HTML, nothing to build).
4. Deploy.

## Custom domain (either platform)

Once deployed, both GitHub Pages and Cloudflare Pages let you attach a
custom domain (e.g. `kidposhan.in` or a `poshanscore.` subdomain) under
their respective settings pages — you'll add a CNAME record pointing at
the platform's URL.
