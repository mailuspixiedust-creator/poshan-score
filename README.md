# Poshan Score — landing page

Five static HTML files, no build step, no dependencies, plus one script:

- `index.html` — the landing page (default root file both platforms look for)
- `browse.html` — Browse page: 19 real products, scored per age band
- `age-metrics.html` — the age-banded rubric page: all ten metrics, their
  daily-reference thresholds, and full source citations (ICMR-NIN, WHO,
  NASEM/IOM, FSSAI)
- `why-we-do-this.html` — the founder-story page, with a scroll-linked
  timeline animation
- `cereals.html` — the Cereal Aisle: 18 breakfast-cereal products (started
  as 29 from a Blinkit list, cut down to only those independently
  verifiable — see below), with a search box, the same age tabs and
  10-metric scoring as Browse, front/back flip-to-zoom photo cards, and
  a "Losing points on:" breakdown on every card that isn't a perfect score
- `download-images.sh` — **run this once before deploying** — fetches the
  real product photos `cereals.html` references into a local `images/`
  folder (see below for why this step is separate)

Keep all five HTML files (and the `images/` folder, once populated) in the
same folder when you upload — the links between them are relative paths,
so no config needed beyond running the download script first.

## About the Cereal Aisle page's data and images

This page started as all 29 products from the Blinkit list you sent. **18
remain**, split into two confidence levels:

**7 fully confirmed** — every ingredient and every nutrition figure
independently verified from an official brand site or retailer's published
nutrition table:
1. Kellogg's Multigrain Chocos More Chocolatey, No-Maida
2. Kellogg's Original Corn Flakes
3. Slurrp Farm Choco Crunch Breakfast Cereal for Kids
4. Kellogg's Almonds & Honey Corn Flakes
5. Tata Soulfull Choco Fills Ragi Bites Cereal
6. Kellogg's Special K Original Cereal with Whole Wheat
7. Bagrry's Corn Flakes Plus Original & Healthier (with Fibre Power)

**11 with a confirmed ingredient list but one or more estimated nutrition
figures** (marked `est.` on their card, with the specific estimate
explained in that product's own ingredient text):
- Kellogg's Multigrain Chocos Variety Pack, Moons & Stars, Crunchy Bites
  Kids Cereal, Chocos Multigrain Moons & Stars Chocos, and Moons & Stars
  Kids Cereal — five retailer listings that are, per Kellogg's own
  product-line page, the same confirmed Multigrain Chocos formulation in
  different pack sizes/shapes; nutrition figures carried over from the
  confirmed base product
- Kellogg's Froot Loops — full ingredient list confirmed from Kellogg's
  India site (and confirmed to use natural-derived colours, not the
  synthetic dyes in the US version); sugar/sodium not published
- Kellogg's Multigrain Plus Corn Flakes — full ingredient list confirmed
  from Amazon India (includes a synthetic colour and artificial coconut
  flavouring); sugar/sodium not published
- Kellogg's Real Honey Corn Flakes — full ingredient list confirmed from
  Kellogg's India site; sugar/sodium estimated from its confirmed sibling,
  Almonds & Honey Corn Flakes
- Kellogg's Double Chocolaty Fills Chocos and its retailer-duplicate
  listing, Chocos Fills Double Chocolaty Cereal — full ingredient list
  confirmed from Kellogg's India site; exact fat/sugar not published
- Tata Soulfull Ragi Bites Choco 7 Grains (No Maida) — full ingredient
  list confirmed from a retailer listing; fat/fiber estimated from its
  confirmed sibling, Tata Soulfull Choco Fills Ragi Bites

**11 removed entirely** — neither ingredients nor nutrition data found
anywhere searchable, mostly smaller/budget brands or bundle packs: Nestle
Munch Choco Fills Cereal, Little Joys Millet Chocos Crunch, Kellogg's
Strawberry Puree Corn Flakes, 8AM Corn Flakes Family Pack, Kwality
Multigrain Choco Flakes, Tata Soulfull Chocos Variety Pack Cereal Combo,
Kwality Corn Flakes, Parle Hide & Seek Fills, Kellogg's All Bran Wheat
Flakes, Kellogg's Protein Chocos, and Kellogg's Choco Fills Kids Cereal
(Caramel Flavour). If you can find a published nutrition table or ingredient
photo for any of these, they can be added back — follow the data format in
`cereals.html`'s `products` array.

**On the front/back flip cards:** every product card has a tab that flips
between front and back on click, plus a zoom button that pops it into a
larger lightbox view. **14 of the 18 products have real photos.**

**Images are hosted locally, not hotlinked** — `cereals.html` references
paths like `images/multigrain-chocos-more-chocolatey-front.png`, not
external URLs. This matters because the original source
(`images.kglobalservices.com`, Kellogg's own CDN) is outside your control
and could move or change; local files won't break if that happens.

**One thing you need to do before deploying**: run `download-images.sh`
once, from the same folder as `cereals.html`. This is a small script that
fetches all 19 image files (14 front photos + 11 nutrition-label/back
photos, some URLs shared between near-duplicate products) into an
`images/` folder using the exact filenames `cereals.html` already expects.
It needs a machine with normal, unrestricted internet access — Kellogg's,
Slurrp Farm, and Bagrry's own sites aren't blocked the way Blinkit and
Amazon are, so a plain `curl` from your own laptop works fine:
```
chmod +x download-images.sh
./download-images.sh
```
Until you run it, those 14 cards will show a broken-image icon instead of
a photo (the placeholder ingredient-panel fallback only triggers when a
field is empty, not when a path is set but the file is missing) — so run
the script before you deploy, not after.

Where each image came from:
- **11 Kellogg's products**: front pack photo + the brand's own official
  nutrition-label photo as the "back," both from kelloggs.com/en-in's
  product pages.
- **Slurrp Farm**: front pack photo from slurrpfarm.com; the "back" is the
  second image in their product gallery, which is usually the pack's back
  but wasn't independently confirmed — treat it with slightly less
  certainty than the Kellogg's ones.
- **Bagrry's**: front pack photo from bagrrys.com; no back image (couldn't
  confirm which of their gallery images was the actual back of pack).

**4 products still show the researched ingredient panel instead of a
photo**: Kellogg's Special K (no India-specific product page found on
kelloggs.com), Tata Soulfull's two entries (no fetchable official product
page found), and Bagrry's back side. Their `frontImg`/`backImg` fields are
still empty strings, so the placeholder renders correctly for these.

**To add or replace a photo later**, open `cereals.html`, find the product
in the `products` array, and edit its `frontImg` / `backImg` fields to
point at a new local path (drop the file into `images/` first) or, if you
prefer, a direct URL — either works, since the render code just checks
whether the field is non-empty:
```js
{ name:"Kellogg's Multigrain Chocos More Chocolatey, No-Maida", servingG:30,
  frontImg:"images/your-new-file.jpg", backImg:"images/your-other-file.jpg",
  ...
```
Leave a field as `""` to fall back to the placeholder for that side.

**Same scoring engine as Browse**, just with per-100g figures scaled to a
30g serving internally, rather than pre-computed per-serving numbers.



## Before you deploy: run the image download script

```
chmod +x download-images.sh
./download-images.sh
```

Do this from your own machine (not inside any restricted/sandboxed
environment) before either deployment path below — it creates the
`images/` folder that 14 of the Cereal Aisle cards need. Skipping this
step means those cards show broken-image icons instead of photos once
live.

## Deploy on GitHub Pages

1. Create a new repo on GitHub (e.g. `poshan-score`).
2. Upload all five HTML files **and the `images/` folder** to the repo
   root (drag-and-drop on the GitHub web UI works fine — no git CLI
   required).
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to "Deploy from a branch",
   branch `main`, folder `/ (root)`. Save.
5. GitHub gives you a URL like `https://<username>.github.io/poshan-score/`
   within a minute or two.

## Deploy on Cloudflare Pages

**Option A — no GitHub needed (fastest):**
1. Go to the Cloudflare dashboard → **Workers & Pages** → **Create** →
   **Pages** → **Upload assets**.
2. Drag in the whole folder (all five HTML files **and the `images/`
   folder**).
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
