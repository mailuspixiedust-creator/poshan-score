# Poshan Score — landing page

Five static HTML files, no build step, no dependencies:

- `index.html` — the landing page (default root file both platforms look for)
- `browse.html` — Browse page: 19 real products, scored per age band
- `age-metrics.html` — the age-banded rubric page: all ten metrics, their
  daily-reference thresholds, and full source citations (ICMR-NIN, WHO,
  NASEM/IOM, FSSAI)
- `why-we-do-this.html` — the founder-story page, with a scroll-linked
  timeline animation
- `cereals.html` — the Cereal Aisle: exactly 29 named breakfast-cereal
  products (a fixed list, not editable via the UI), with a search box, the
  same age tabs and 10-metric scoring as Browse, and researched ingredient
  panels in place of label photos (see note below on why there are no photos)

Keep all five files in the same folder when you upload — the links between
them are relative paths, so no config needed.

## About the Cereal Aisle page's data and images

Unlike the original 19 products (which you photographed yourself), the 29
cereals were researched from retailer nutrition panels and brand sites, not
from physical labels.

**On the front/back flip cards:** every product card has a tab that flips
between front and back on click, plus a zoom button that pops it into a
larger lightbox view — that interaction is fully built. What's *not* built
in is real photos. I tried to source them from the Blinkit links in your
spreadsheet and from Amazon as a backup, and both sites actively block
automated fetching (bot detection on Blinkit, robots.txt disallow on
Amazon) — this isn't a gap in effort, it's those sites deliberately
preventing exactly this kind of automated image-pulling. Your spreadsheet's
own "Back links" column already flagged this same limitation honestly
("back-of-pack has NOT been claimed as verified... deliberately marks back
verification conservatively rather than inventing a direct back-image
URL").

**To add real photos**, open `cereals.html`, find the product in the
`products` array, and fill in its `frontImg` and `backImg` fields with a
real image URL, e.g.:
```js
{ name:"Kellogg's Multigrain Chocos More Chocolatey, No-Maida", servingG:30,
  frontImg:"https://your-image-url.jpg", backImg:"https://your-image-url-2.jpg",
  ...
```
Leave either field as `""` to keep the placeholder for that side. The
easiest real-world way to get these URLs: open each Blinkit product page in
an ordinary browser (not blocked, since you're not an automated fetcher),
right-click the front or back image in the carousel, and choose "Copy image
address." If you'd rather host the images yourself instead of hotlinking to
Blinkit, save them into an `/images` folder next to the HTML files and
reference them as relative paths instead (e.g. `frontImg:"images/1-front.jpg"`).

A few more things worth knowing:

- **Confirmed vs. estimated nutrition data.** About a third of the 29 have
  nutrition figures confirmed from an official brand or retailer source
  (Kellogg's Multigrain Chocos, Kellogg's Corn Flakes, Slurrp Farm Choco
  Crunch, Tata Soulfull Ragi Bites and Choco Fills, Kellogg's Special K).
  The rest — mostly near-duplicate retailer listings of the same underlying
  product, and a few brands with limited public nutrition data (Kwality,
  8AM, Little Joys, Nestle Munch, Parle Hide & Seek Fills) — are marked
  `est.` on their card and use the closest confirmed sibling product or
  category norm. Parle Hide & Seek Fills has the lowest confidence of the
  29 — its exact product category wasn't fully confirmed during research.
- **Same scoring engine as Browse**, just with per-100g figures scaled to
  a 30g serving internally, rather than pre-computed per-serving numbers.



## Deploy on GitHub Pages

1. Create a new repo on GitHub (e.g. `poshan-score`).
2. Upload all five HTML files to the repo root (drag-and-drop
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
2. Drag in the whole folder (all five HTML files).
3. Give the project a name and click **Deploy**. Cloudflare gives you a
   `*.pages.dev` URL immediately.

**Option B — connect the GitHub repo (auto-redeploys on push):**
1. Push `index.html` to a GitHub repo (see steps above).
2. In Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git**, pick the repo.
3. Build settings: leave **Build command** empty and set **Build output
   directory** to `/` (it's plain HTML, nothing to build).
4. Deploy.

## Amazon affiliate links ("Buy on Amazon" buttons)

Every **Excellent and Good** tier product card shows a "View on
Amazon" button — Caution and Avoid cards don't get one, so the site never
earns a commission on steering someone toward a product it's flagging as
risky. If you'd rather show it on every card regardless of tier, open
`browse.html` and remove the `${(tier === 'excellent' || tier === 'good') ? ... : ``}`
wrapper around the `buy-row` block in the card template.

The affiliate tag is already set to your registered Associates ID,
**`kidposhan-21`** — no further setup needed there. A few things worth
knowing about how it's built:

1. **Keep the disclosure line visible.** Amazon's Operating Agreement
   requires a clear affiliate disclosure near any affiliate link — the small
   "As an Amazon Associate, Poshan Score may earn from qualifying purchases"
   line under each button satisfies this. Don't remove it if you go live.
2. **Note on link type**: the buttons link to an Amazon *search* for each
   product's name, not a specific product page (ASIN). This is deliberate —
   it always resolves to a real, current listing even if you haven't
   manually verified the exact ASIN for every one of the 19 products, and
   it won't break if a specific listing goes out of stock or changes. If you
   want to switch to direct product-page links later (slightly higher
   conversion, since it skips the search results page), you'd replace the
   `amazonSearchUrl()` function's return value with a per-product ASIN URL
   instead — that requires looking up and confirming the correct ASIN for
   each product individually.
3. **Amazon's 24-hour cookie window**: Associates links only earn commission
   on purchases made within 24 hours of the click (or items added to cart
   within that window, even if bought later) — this is an Amazon policy,
   not something the code controls.



## Custom domain (either platform)

Once deployed, both GitHub Pages and Cloudflare Pages let you attach a
custom domain (e.g. `kidposhan.in` or a `poshanscore.` subdomain) under
their respective settings pages — you'll add a CNAME record pointing at
the platform's URL.
