/* ============================================================
   KidPoshan — engine
   Poshan Score, recommendation matching, preferences, shared UI.
   ============================================================ */

/* ---------- 1. Preferences (age, meal slot, season) ---------- */

const PREF_KEY = "kidposhan.prefs";
let memoryPrefs = null; // fallback if storage is unavailable

const DEFAULT_PREFS = { age: 5, slot: "breakfast", season: currentSeason() };

function currentSeason() {
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 6) return "summer";
  if (m >= 7 && m <= 10) return "monsoon";
  return "winter";
}

function getPrefs() {
  if (memoryPrefs) return memoryPrefs;
  try {
    const raw = window.localStorage.getItem(PREF_KEY);
    memoryPrefs = raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : { ...DEFAULT_PREFS };
  } catch (e) {
    memoryPrefs = { ...DEFAULT_PREFS };
  }
  return memoryPrefs;
}

function setPrefs(patch) {
  memoryPrefs = { ...getPrefs(), ...patch };
  try {
    window.localStorage.setItem(PREF_KEY, JSON.stringify(memoryPrefs));
  } catch (e) { /* session-only, fine */ }
  return memoryPrefs;
}

function bandForAge(years) {
  const y = Number(years);
  const hit = AGE_BANDS.find(b => y >= b.min && y <= b.max);
  return hit ? hit.id : (y < 0.5 ? "6-12m" : "9-12y");
}

function labelFor(list, id) {
  const hit = list.find(x => x.id === id);
  return hit ? hit.label : id;
}

/* ---------- 2. Poshan Score ----------
   One transparent rubric. Every food starts at a neutral base and
   moves up or down. The same code scores a home-cooked khichdi and a
   packet of noodles, and every point is reported back so the product
   page can show a parent exactly how the number was reached.
   Packaged food is judged per 100 g as printed on the label; a cooked
   meal is judged per serving for one child.
------------------------------------------------------------- */

/* Two profiles, because the two things we score are not measured the same way.
   A packet prints its numbers per 100 g. A cooked meal is judged as the plate a
   child actually eats. Scoring both against the same thresholds would punish
   home food for being mostly water, so each gets its own. The bands are shared. */
const SCORE_PROFILES = {
  pack: {
    label: "per 100 g",
    base:          58,   // a plain, unremarkable food sits here
    sugarWeight:   1.7,  // points lost per gram of added sugar
    sugarCap:      38,
    sugarDrinkX:   3.4,  // a gram in a glass matters more than in a dry mix
    sodiumFree:    100,  // mg that costs nothing
    sodiumDivisor: 34,
    sodiumCap:     28,
    satFatWeight:  1.2,
    satFatCap:     18,
    additiveEach:  6,
    additiveCap:   22,
    palmOil:       8,
    maida:         8,
    proteinWeight: 0.9,
    proteinCap:    13,
    fibreWeight:   1.5,
    fibreCap:      15,
    wholeGrain:    9,
    cleanLabel:    6     // nothing artificial, no palm oil, no refined flour
  },
  meal: {
    label: "per serving",
    base:          52,
    sugarWeight:   2.0,
    sugarCap:      30,
    sugarDrinkX:   1,
    sodiumFree:    250,  // a whole plate is allowed more salt than 100 g of powder
    sodiumDivisor: 20,
    sodiumCap:     25,
    satFatWeight:  1.4,
    satFatCap:     20,
    additiveEach:  6,
    additiveCap:   18,
    palmOil:       8,
    maida:         6,
    proteinWeight: 1.8,
    proteinCap:    18,
    fibreWeight:   2.4,
    fibreCap:      16,
    wholeGrain:    9,
    cleanLabel:    6
  }
};

/* Kept as an alias so older code and bookmarks to the rubric still resolve. */
const SCORE_RULES = SCORE_PROFILES.pack;

function poshanScore(n, flags, category, profile) {
  const r = SCORE_PROFILES[profile] || SCORE_PROFILES.pack;
  const f = flags || {};
  const lines = [];
  let score = r.base;

  const drinkX = category === "Beverage" ? r.sugarDrinkX : 1;
  const sugar = Math.min(r.sugarCap, (n.addedSugar || 0) * r.sugarWeight * drinkX);
  if (sugar > 0) { score -= sugar; lines.push({ label: "Added sugar " + n.addedSugar + " g", delta: -sugar }); }

  const sodiumOver = Math.max(0, (n.sodium || 0) - r.sodiumFree);
  const sodium = Math.min(r.sodiumCap, sodiumOver / r.sodiumDivisor);
  if (sodium > 0) { score -= sodium; lines.push({ label: "Sodium " + n.sodium + " mg", delta: -sodium }); }

  const satFat = Math.min(r.satFatCap, (n.satFat || 0) * r.satFatWeight);
  if (satFat > 0) { score -= satFat; lines.push({ label: "Saturated fat " + n.satFat + " g", delta: -satFat }); }

  const addCount = (f.additives !== undefined ? f.additives : n.additives) || 0;
  const additives = Math.min(r.additiveCap, addCount * r.additiveEach);
  if (additives > 0) { score -= additives; lines.push({ label: addCount + " artificial additive" + (addCount > 1 ? "s" : ""), delta: -additives }); }

  if (f.palmOil) { score -= r.palmOil; lines.push({ label: "Contains palm oil", delta: -r.palmOil }); }
  if (f.maida)   { score -= r.maida;   lines.push({ label: "Refined flour (maida) base", delta: -r.maida }); }

  const protein = Math.min(r.proteinCap, (n.protein || 0) * r.proteinWeight);
  if (protein > 0) { score += protein; lines.push({ label: "Protein " + n.protein + " g", delta: protein }); }

  const fibre = Math.min(r.fibreCap, (n.fibre || 0) * r.fibreWeight);
  if (fibre > 0) { score += fibre; lines.push({ label: "Fibre " + n.fibre + " g", delta: fibre }); }

  const wg = (f.wholeGrain !== undefined ? f.wholeGrain : n.wholeGrain);
  if (wg) { score += r.wholeGrain; lines.push({ label: "Whole grain base", delta: r.wholeGrain }); }

  if (addCount === 0 && !f.palmOil && !f.maida) {
    score += r.cleanLabel;
    lines.push({ label: "Clean label — nothing artificial", delta: r.cleanLabel });
  }

  return { score: Math.max(0, Math.min(100, Math.round(score))), lines: lines, base: r.base, basis: r.label };
}

function scoreBand(score) {
  if (score >= 80) return { id: "excellent", label: "Excellent" };
  if (score >= 58) return { id: "good",      label: "Good" };
  if (score >= 40) return { id: "fair",      label: "Fair" };
  return { id: "limit", label: "Occasional" };
}

function scoreProduct(p) {
  const res = poshanScore(p.nutrition, p.flags, p.category, "pack");
  return Object.assign({}, p, { score: res.score, band: scoreBand(res.score), breakdown: res.lines, scoreBase: res.base });
}

function scoreMeal(m) {
  const res = poshanScore(m.scoreBasis, m.scoreBasis, "", "meal");
  return Object.assign({}, m, { score: res.score, band: scoreBand(res.score), breakdown: res.lines, scoreBase: res.base });
}

/* ---------- 3. Recommendation matching ----------
   A meal has to be age-appropriate and belong to the meal slot.
   Everything after that is a ranking, not a filter, so the page
   always has something to show.
------------------------------------------------------------- */

function recommendMeals(prefs, limit = 8) {
  const band = bandForAge(prefs.age);

  return MEALS
    .filter(m => m.ages.includes(band) && m.slots.includes(prefs.slot))
    .map(scoreMeal)
    .map(m => {
      let fit = m.score;
      if (m.seasons.includes(prefs.season)) fit += 8;   // right food for the weather
      if (prefs.slot === "breakfast" && m.prepMins <= 12) fit += 5; // mornings are short
      if (prefs.slot === "tiffin" && m.prepMins <= 20) fit += 3;
      if (band === "6-12m" || band === "1-2y") fit += m.scoreBasis.sodium < 200 ? 4 : -4;
      return { ...m, fit };
    })
    .sort((a, b) => b.fit - a.fit)
    .slice(0, limit);
}

function recommendProducts(prefs, limit = 6) {
  const band = bandForAge(prefs.age);
  return PRODUCTS
    .filter(p => p.ages.includes(band) && p.slots.includes(prefs.slot))
    .map(scoreProduct)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function searchAll(q) {
  const s = q.trim().toLowerCase();
  if (!s) return { meals: [], products: [] };
  const hit = (txt) => txt.toLowerCase().includes(s);
  return {
    meals: MEALS.filter(m => hit(m.name) || hit(m.blurb) || m.slots.some(hit)).map(scoreMeal),
    products: PRODUCTS.filter(p =>
      hit(p.name) || hit(p.brand) || hit(p.category) || p.ingredients.some(hit)
    ).map(scoreProduct)
  };
}

/* ---------- 4. Shared UI ---------- */

function el(tag, cls, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html !== undefined) n.innerHTML = html;
  return n;
}

function scoreChip(score, band, size = "") {
  return `<span class="chip chip--${band.id} ${size}">${band.label}</span>`;
}

function scoreBadge(score, band) {
  return `<div class="scorebox scorebox--${band.id}">
            <span class="scorebox__n">${score}</span>
            <span class="scorebox__b">${band.label}</span>
          </div>`;
}

/* Illustration stand-in: a food-tinted tile with a soft bowl-and-steam mark.
   Swap the .thumb element for an <img> when photography is ready. */
const THUMB_HUES = [140, 96, 28, 200, 340, 172, 44];
function thumb(name, seed) {
  const h = THUMB_HUES[(seed || name.length) % THUMB_HUES.length];
  return `<div class="thumb" style="--h:${h}">${ICON.bowl}</div>`;
}

/* ---------- Small inline icon set used across tabs and cards ---------- */
const ICON = {
  sun:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" stroke-linecap="round"/></svg>',
  bag:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4.5" y="8" width="15" height="12.5" rx="2.6"/><path d="M8.5 8V6.2A3.2 3.2 0 0 1 11.7 3h.6a3.2 3.2 0 0 1 3.2 3.2V8" stroke-linecap="round"/><path d="M8.7 12.2h6.6" stroke-linecap="round"/></svg>',
  apple: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 9.4c-1-1.7-2.9-2.5-4.6-1.9C5 8.3 3.7 11 4.5 13.7c.8 2.8 3.3 6.3 5.8 6.9 1 .25 1.7-.2 2.5-.5.7.3 1.4.75 2.5.5 2.5-.6 5-4.1 5.8-6.9.8-2.7-.5-5.4-2.9-6.2-1.7-.6-3.6.2-4.6 1.9Z"/><path d="M12 9c0-2 .6-3.4 2.3-4.5" stroke-linecap="round"/></svg>',
  moon:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 14.2A8.2 8.2 0 1 1 9.8 4a6.6 6.6 0 0 0 10.2 10.2Z" stroke-linejoin="round"/></svg>',
  drop:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3.5c3 3.9 6 8 6 11.2A6 6 0 1 1 6 14.7c0-3.2 3-7.3 6-11.2Z" stroke-linejoin="round"/></svg>',
  flake: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 3v18M4.8 7.5l14.4 9M4.8 16.5l14.4-9"/><path d="M8.3 5.3 12 8l3.7-2.7M8.3 18.7 12 16l3.7 2.7M20.2 9.9 16 12l4.2 2.1M3.8 9.9 8 12l-4.2 2.1"/></svg>',
  child: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="7.2" r="3.4"/><path d="M5 20.5c.7-3.9 3.4-6 7-6s6.3 2.1 7 6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  bowl:  '<svg viewBox="0 0 40 40" fill="none"><path d="M8 20h24a12 12 0 0 1-24 0Z" fill="currentColor" fill-opacity=".22"/><path d="M8 20h24a12 12 0 0 1-24 0Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M13 20a7 7 0 0 1 14 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M15.5 12c-.6-1.4-.2-2.4.8-3.4M20 11c-.4-1.6.1-2.7 1.3-3.7M24.3 12.4c-.2-1.5.4-2.5 1.6-3.3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'
};

function mountHeader(active) {
  const links = [
    ["index.html", "Home"],
    ["recommendations.html", "Meal ideas"],
    ["products.html", "Products"],
    ["planner.html", "Planner"],
    ["search.html", "Search"]
  ];
  const nav = links.map(([href, label]) =>
    `<a href="${href}" class="${active === label ? "is-active" : ""}">${label}</a>`
  ).join("");

  document.body.insertAdjacentHTML("afterbegin", `
    <header class="site">
      <div class="wrap site__in">
        <a class="logo" href="index.html">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c4 0 7 3 7 7 0 5-4 8-7 11-3-3-7-6-7-11 0-4 3-7 7-7z"/></svg>
          <span><b>KID</b>POSHAN</span>
        </a>
        <nav class="site__nav">${nav}</nav>
      </div>
    </header>`);
}

function mountFooter() {
  document.body.insertAdjacentHTML("beforeend", `
    <footer class="site-foot">
      <div class="wrap">
        <p class="site-foot__lead">KidPoshan scores food against ICMR-NIN, FSSAI and WHO guidance for children. We are not a substitute for your paediatrician.</p>
        <p class="site-foot__fine">Some links take you to partner stores. If you buy through them, KidPoshan may earn a commission, which does not change what you pay or how a product is scored.</p>
        <nav class="site-foot__nav">
          <a href="index.html">Home</a>
          <a href="recommendations.html">Meal ideas</a>
          <a href="products.html">Products</a>
          <a href="how-we-score.html">How we score</a>
          <a href="search.html">Search</a>
        </nav>
      </div>
    </footer>`);
}

/* ---------- Soft-tab chooser ----------
   One row of pill buttons per choice (age band, meal, season) instead of a
   native <select>. Every page that needs the child's context — home,
   recommendations, planner — renders the same three rows so the control
   feels identical wherever a parent meets it. */

function tabRow(groupId, legend, options, activeId, iconOf) {
  const buttons = options.map(o => `
    <button type="button" class="tab" data-group="${groupId}" data-value="${o.id}"
            role="tab" aria-selected="${o.id === activeId}">
      <span class="tab__icon">${ICON[iconOf(o)] || ""}</span>
      <span>${o.label}</span>
    </button>`).join("");
  return `
    <div class="tabrow">
      <span class="tabrow__label">${legend}</span>
      <div class="tabrow__scroll" role="tablist" aria-label="${legend}">${buttons}</div>
    </div>`;
}

function mountPrefBar(target, onChange, opts) {
  const compact = !!(opts && opts.compact);
  const p = getPrefs();
  const band = bandForAge(p.age);

  target.innerHTML = `
    <div class="chooser ${compact ? "chooser--compact" : ""}">
      ${tabRow("age", "Child's age", AGE_BANDS, band, () => "child")}
      ${tabRow("slot", "When", MEAL_SLOTS, p.slot, o => o.icon)}
      ${tabRow("season", "Season", SEASONS, p.season, o => o.icon)}
    </div>`;

  target.querySelectorAll(".tab").forEach(btn => btn.addEventListener("click", () => {
    const group = btn.dataset.group, value = btn.dataset.value;
    target.querySelectorAll(`.tab[data-group="${group}"]`).forEach(b => b.setAttribute("aria-selected", "false"));
    btn.setAttribute("aria-selected", "true");

    if (group === "age")    setPrefs({ age: AGE_BAND_MID[value] });
    if (group === "slot")   setPrefs({ slot: value });
    if (group === "season") setPrefs({ season: value });

    onChange(getPrefs());
  }));
}
