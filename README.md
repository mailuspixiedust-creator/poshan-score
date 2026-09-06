# KidPoshan

Static site for GitHub Pages. No build step, no dependencies — plain HTML, CSS and JavaScript.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home. Age + meal-occasion picker. |
| `recommendations.html` | Today's pick, alternatives, matching packaged products. |
| `products.html` | All scored products, filterable by category, age band and score. |
| `product.html?id=…` | Product detail: ingredients, nutrition, score breakdown. |
| `search.html` | Search across meals and products, including by ingredient. |
| `planner.html` | Weekly planner with auto-fill. |
| `how-we-score.html` | The full rubric. |

## Deploying

1. Create a repo, e.g. `kidposhan-site`.
2. Push these files to the `main` branch root.
3. Settings → Pages → Source: `main` / `(root)`.
4. For the custom domain, add a file named `CNAME` containing `kidposhan.in`, then point an ALIAS/A record at GitHub's Pages IPs and a CNAME for `www`.

`.nojekyll` is included so GitHub serves the files as-is.

## Adding content

Everything lives in `assets/js/data.js`.

**A meal** needs: `slots`, `ages`, `seasons`, `prepMins`, `why` (the bullet list parents see) and `scoreBasis` (per serving, for one child).

**A product** needs: `ages`, `slots`, `ingredients`, `nutrition` (per 100 g as printed on the pack), `flags`, and `partnerUrl`.

Scores are computed at runtime — never hand-write a score into the data file, or the number and the breakdown will disagree.

## Affiliate links

Amazon links use the tag `kidposhan-21`. All partner links carry `rel="sponsored nofollow noopener"`, which Amazon Associates and Google both expect. Disclosure appears in the footer and on every product page.

## Changing the rubric

`SCORE_PROFILES` in `assets/js/engine.js` holds every weight and cap, in two profiles:

- `pack` — packaged food, judged per 100 g as printed on the label.
- `meal` — home-cooked food, judged per serving for one child.

They exist separately because a cooked plate is mostly water; scoring it against per-100 g thresholds would penalise home food for not being a dry powder.

Change a number there and every score on the site updates. `how-we-score.html` reads these values at runtime and renders the tables from them, so the published rubric cannot drift away from the code.

Never hand-write a score into `data.js`. The breakdown shown to parents is the arithmetic itself — if the two disagree, the trust promise on the front page is broken.

