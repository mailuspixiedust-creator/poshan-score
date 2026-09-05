/* ============================================================
   KidPoshan — data layer
   Edit this file to add meals or products. Nothing else needs
   to change: pages read from these arrays at runtime.
   ============================================================ */

/* Age bands used across the site.
   `min` and `max` are in years (0.5 = 6 months). */
const AGE_BANDS = [
  { id: "6-12m", label: "6–12 months", min: 0.5, max: 1 },
  { id: "1-2y",  label: "1–2 years",   min: 1,   max: 2 },
  { id: "3-5y",  label: "3–5 years",   min: 3,   max: 5 },
  { id: "6-8y",  label: "6–8 years",   min: 6,   max: 8 },
  { id: "9-12y", label: "9–12 years",  min: 9,   max: 12 }
];

const MEAL_SLOTS = [
  { id: "breakfast", label: "Breakfast", icon: "sun" },
  { id: "tiffin",    label: "Tiffin",    icon: "bag" },
  { id: "snack",     label: "Snack",     icon: "apple" },
  { id: "dinner",    label: "Dinner",    icon: "moon" }
];

const SEASONS = [
  { id: "summer",  label: "Summer",  icon: "sun" },
  { id: "monsoon", label: "Monsoon", icon: "drop" },
  { id: "winter",  label: "Winter",  icon: "flake" }
];

/* A representative age, in years, for the middle of each band — used so a
   single tap on an age band gives the scoring logic one concrete number. */
const AGE_BAND_MID = { "6-12m": 0.75, "1-2y": 1.5, "3-5y": 4, "6-8y": 7, "9-12y": 10.5 };

/* ------------------------------------------------------------
   MEAL IDEAS
   scoreBasis fields are what the Poshan Score is computed from.
   ------------------------------------------------------------ */
const MEALS = [
  {
    id: "veg-poha-curd-banana",
    name: "Vegetable poha + curd + banana",
    slots: ["breakfast"],
    ages: ["3-5y", "6-8y", "9-12y"],
    seasons: ["monsoon", "winter", "summer"],
    prepMins: 10,
    diet: "veg",
    blurb: "Light, quick and easy to digest — a dependable school-morning plate.",
    why: [
      "Complex carbohydrates from flattened rice release energy steadily",
      "Curd adds protein and gut-friendly probiotics",
      "Banana brings natural sugars and potassium",
      "Digests easily, so it sits well before a school day"
    ],
    scoreBasis: { addedSugar: 0, sodium: 180, satFat: 1.2, protein: 8, fibre: 3.5, wholeGrain: true, additives: 0 }
  },
  {
    id: "idli-sambar",
    name: "Idli + sambar",
    slots: ["breakfast", "dinner"],
    ages: ["1-2y", "3-5y", "6-8y", "9-12y"],
    seasons: ["monsoon", "winter", "summer"],
    prepMins: 15,
    diet: "veg",
    blurb: "Fermented, steamed and high in protein without any frying.",
    why: [
      "Fermentation improves mineral absorption",
      "Dal in sambar supplies plant protein and fibre",
      "Steamed, so no added fat from cooking",
      "Soft texture suits younger children"
    ],
    scoreBasis: { addedSugar: 0, sodium: 320, satFat: 0.9, protein: 9, fibre: 4, wholeGrain: true, additives: 0 }
  },
  {
    id: "egg-roti-fruit",
    name: "Egg + roti + fruit",
    slots: ["breakfast", "dinner"],
    ages: ["1-2y", "3-5y", "6-8y", "9-12y"],
    seasons: ["winter", "monsoon"],
    prepMins: 12,
    diet: "egg",
    blurb: "Balanced protein and energy in one plate, ready in minutes.",
    why: [
      "Egg is a complete protein with vitamin B12 and choline",
      "Whole-wheat roti keeps energy steady through the morning",
      "Fresh fruit adds vitamin C and fibre",
      "Very little added salt or sugar involved"
    ],
    scoreBasis: { addedSugar: 0, sodium: 240, satFat: 2.4, protein: 14, fibre: 4.5, wholeGrain: true, additives: 0 }
  },
  {
    id: "low-sugar-cereal-milk-fruit",
    name: "Low-sugar cereal + milk + fruit",
    slots: ["breakfast"],
    ages: ["3-5y", "6-8y", "9-12y"],
    seasons: ["summer", "monsoon", "winter"],
    prepMins: 3,
    diet: "veg",
    blurb: "The fastest option on a running-late morning.",
    why: [
      "Milk supplies calcium and protein",
      "Choose a cereal with under 5 g sugar per 100 g",
      "Fruit replaces the sweetness that packaged cereals usually add",
      "No cooking needed"
    ],
    scoreBasis: { addedSugar: 4, sodium: 190, satFat: 2.8, protein: 9, fibre: 2.5, wholeGrain: true, additives: 1 }
  },
  {
    id: "veg-paratha-curd",
    name: "Stuffed vegetable paratha + curd",
    slots: ["tiffin", "breakfast"],
    ages: ["3-5y", "6-8y", "9-12y"],
    seasons: ["winter", "monsoon"],
    prepMins: 20,
    diet: "veg",
    blurb: "Stays soft in a tiffin box for hours and travels well.",
    why: [
      "Vegetables are hidden inside, which helps with fussy eaters",
      "Curd adds protein and keeps the meal cooling",
      "Holds texture for 4–5 hours in a box",
      "Use minimal ghee to keep saturated fat sensible"
    ],
    scoreBasis: { addedSugar: 0, sodium: 300, satFat: 3.6, protein: 10, fibre: 5, wholeGrain: true, additives: 0 }
  },
  {
    id: "millet-pasta-veg",
    name: "Millet pasta with vegetables",
    slots: ["tiffin", "dinner"],
    ages: ["3-5y", "6-8y", "9-12y"],
    seasons: ["monsoon", "winter", "summer"],
    prepMins: 18,
    diet: "veg",
    blurb: "Familiar shape, better grain — usually an easy sell at home.",
    why: [
      "Millet base gives more fibre and minerals than refined wheat pasta",
      "Vegetables cooked in add vitamins without a separate dish",
      "No packet seasoning, so sodium stays low",
      "Tastes as expected, which matters with reluctant eaters"
    ],
    scoreBasis: { addedSugar: 0, sodium: 210, satFat: 1.8, protein: 11, fibre: 6, wholeGrain: true, additives: 0 }
  },
  {
    id: "curd-rice-pomegranate",
    name: "Curd rice with pomegranate",
    slots: ["tiffin", "dinner"],
    ages: ["1-2y", "3-5y", "6-8y", "9-12y"],
    seasons: ["summer"],
    prepMins: 10,
    diet: "veg",
    blurb: "Cooling, gentle on the stomach and built for hot months.",
    why: [
      "Curd is cooling and helps in summer heat",
      "Probiotics support digestion",
      "Pomegranate adds sweetness without any added sugar",
      "Stays safe and palatable at room temperature for a few hours"
    ],
    scoreBasis: { addedSugar: 0, sodium: 200, satFat: 2.0, protein: 8, fibre: 2.5, wholeGrain: false, additives: 0 }
  },
  {
    id: "besan-chilla",
    name: "Besan chilla with vegetables",
    slots: ["tiffin", "breakfast", "snack"],
    ages: ["1-2y", "3-5y", "6-8y", "9-12y"],
    seasons: ["monsoon", "winter", "summer"],
    prepMins: 15,
    diet: "veg",
    blurb: "High-protein, naturally gluten-free and quick on a pan.",
    why: [
      "Gram flour gives a strong plant protein base",
      "Naturally free of gluten",
      "Cooked with very little oil",
      "Grated vegetables go in unnoticed"
    ],
    scoreBasis: { addedSugar: 0, sodium: 260, satFat: 1.5, protein: 13, fibre: 5.5, wholeGrain: true, additives: 0 }
  },
  {
    id: "roasted-makhana",
    name: "Roasted makhana",
    slots: ["snack"],
    ages: ["3-5y", "6-8y", "9-12y"],
    seasons: ["monsoon", "winter", "summer"],
    prepMins: 8,
    diet: "veg",
    blurb: "A crunchy snack that isn't fried and isn't sweetened.",
    why: [
      "Roasted, not fried, so fat stays very low",
      "No added sugar at all",
      "Light enough not to spoil the next meal",
      "Salt is fully in your control"
    ],
    scoreBasis: { addedSugar: 0, sodium: 120, satFat: 0.5, protein: 6, fibre: 4, wholeGrain: true, additives: 0 }
  },
  {
    id: "fruit-nut-chaat",
    name: "Fruit and nut chaat",
    slots: ["snack"],
    ages: ["3-5y", "6-8y", "9-12y"],
    seasons: ["summer", "monsoon"],
    prepMins: 7,
    diet: "veg",
    blurb: "Sweet enough that it reads as a treat, with nothing added.",
    why: [
      "All sweetness comes from whole fruit",
      "Chopped nuts add healthy fats and protein",
      "Fibre and water content help with summer hydration",
      "No cooking involved"
    ],
    scoreBasis: { addedSugar: 0, sodium: 40, satFat: 1.6, protein: 5, fibre: 6.5, wholeGrain: false, additives: 0 }
  },
  {
    id: "ragi-porridge",
    name: "Ragi porridge with mashed banana",
    slots: ["breakfast", "dinner"],
    ages: ["6-12m", "1-2y"],
    seasons: ["monsoon", "winter", "summer"],
    prepMins: 12,
    diet: "veg",
    blurb: "A first-foods staple — smooth, iron-rich and easy to swallow.",
    why: [
      "Ragi is one of the richest plant sources of calcium",
      "Smooth consistency suits early eaters",
      "Banana sweetens it without any sugar",
      "Iron content supports growth at this stage"
    ],
    scoreBasis: { addedSugar: 0, sodium: 25, satFat: 0.6, protein: 5, fibre: 4, wholeGrain: true, additives: 0 }
  },
  {
    id: "khichdi-ghee",
    name: "Moong dal khichdi with a spoon of ghee",
    slots: ["dinner", "breakfast"],
    ages: ["6-12m", "1-2y", "3-5y", "6-8y"],
    seasons: ["monsoon", "winter"],
    prepMins: 20,
    diet: "veg",
    blurb: "The dinner that works on the nights nothing else does.",
    why: [
      "Rice and dal together form a complete protein",
      "Soft and easy to digest before bed",
      "Ghee helps absorb fat-soluble vitamins",
      "Barely any salt needed"
    ],
    scoreBasis: { addedSugar: 0, sodium: 220, satFat: 3.2, protein: 10, fibre: 4.5, wholeGrain: true, additives: 0 }
  },
  {
    id: "veg-pulao-raita",
    name: "Vegetable pulao + raita",
    slots: ["dinner", "tiffin"],
    ages: ["3-5y", "6-8y", "9-12y"],
    seasons: ["winter", "summer", "monsoon"],
    prepMins: 25,
    diet: "veg",
    blurb: "One pot, several vegetables, and leftovers that pack well.",
    why: [
      "Several vegetables land in a single dish",
      "Raita adds calcium and protein",
      "Cooks in one pot on a busy evening",
      "Reheats and packs well the next day"
    ],
    scoreBasis: { addedSugar: 0, sodium: 340, satFat: 2.6, protein: 9, fibre: 4, wholeGrain: false, additives: 0 }
  },
  {
    id: "sprouts-sundal",
    name: "Sprouts sundal",
    slots: ["snack", "tiffin"],
    ages: ["6-8y", "9-12y"],
    seasons: ["monsoon", "winter"],
    prepMins: 15,
    diet: "veg",
    blurb: "A protein-heavy snack for older children who get hungry by four.",
    why: [
      "Sprouting raises available protein and vitamin C",
      "High fibre keeps hunger away until dinner",
      "Coconut and curry leaves make it taste familiar",
      "No frying, no sugar"
    ],
    scoreBasis: { addedSugar: 0, sodium: 180, satFat: 1.4, protein: 14, fibre: 8, wholeGrain: true, additives: 0 }
  },
  {
    id: "dhokla",
    name: "Steamed dhokla",
    slots: ["tiffin", "snack"],
    ages: ["3-5y", "6-8y", "9-12y"],
    seasons: ["summer", "monsoon"],
    prepMins: 25,
    diet: "veg",
    blurb: "Soft, savoury and it survives a lunchbox without going soggy.",
    why: [
      "Steamed rather than fried",
      "Fermented gram flour is protein-rich",
      "Holds its texture in a box",
      "Skip the sugar in the tempering to keep the score high"
    ],
    scoreBasis: { addedSugar: 2, sodium: 380, satFat: 1.2, protein: 11, fibre: 4, wholeGrain: true, additives: 0 }
  }
];

/* ------------------------------------------------------------
   PACKAGED PRODUCTS
   nutrition is per 100 g as printed on pack.
   `partner` is the affiliate destination label.
   ------------------------------------------------------------ */
const PRODUCTS = [
  {
    id: "slurrp-millet-muesli",
    brand: "Slurrp Farm",
    name: "Millet Muesli, No Added Sugar",
    category: "Breakfast cereal",
    price: 349,
    pack: "400 g",
    ages: ["3-5y", "6-8y", "9-12y"],
    slots: ["breakfast", "snack"],
    partner: "Amazon",
    partnerUrl: "https://www.amazon.in/s?k=slurrp+farm+millet+muesli&tag=kidposhan-21",
    ingredients: ["Rolled oats", "Ragi flakes", "Jowar flakes", "Almonds", "Raisins", "Pumpkin seeds"],
    nutrition: { energy: 402, protein: 11.2, carbs: 62, addedSugar: 0.5, totalSugar: 8.4, fat: 11, satFat: 1.6, fibre: 9.8, sodium: 22 },
    flags: { additives: 0, wholeGrain: true, palmOil: false, maida: false }
  },
  {
    id: "nestle-ceregrow",
    brand: "Nestlé",
    name: "Ceregrow Multigrain Cereal, No Refined Sugar",
    category: "Breakfast cereal",
    price: 285,
    pack: "300 g",
    ages: ["1-2y", "3-5y"],
    slots: ["breakfast"],
    partner: "Amazon",
    partnerUrl: "https://www.amazon.in/s?k=nestle+ceregrow&tag=kidposhan-21",
    ingredients: ["Wheat flour", "Milk solids", "Fruit powders", "Vitamins and minerals", "Rice flour"],
    nutrition: { energy: 412, protein: 12.6, carbs: 70, addedSugar: 4.2, totalSugar: 18.5, fat: 8.6, satFat: 3.4, fibre: 4.2, sodium: 120 },
    flags: { additives: 1, wholeGrain: true, palmOil: false, maida: false }
  },
  {
    id: "true-elements-rolled-oats",
    brand: "True Elements",
    name: "Rolled Oats",
    category: "Breakfast cereal",
    price: 199,
    pack: "1 kg",
    ages: ["1-2y", "3-5y", "6-8y", "9-12y"],
    slots: ["breakfast"],
    partner: "Amazon",
    partnerUrl: "https://www.amazon.in/s?k=true+elements+rolled+oats&tag=kidposhan-21",
    ingredients: ["Whole rolled oats"],
    nutrition: { energy: 389, protein: 13.2, carbs: 66, addedSugar: 0, totalSugar: 1.0, fat: 6.5, satFat: 1.1, fibre: 10.6, sodium: 6 },
    flags: { additives: 0, wholeGrain: true, palmOil: false, maida: false }
  },
  {
    id: "kidposhan-ragi-podi",
    brand: "KidPoshan",
    name: "Ragi Podi",
    category: "Meal mix",
    price: 245,
    pack: "250 g",
    ages: ["1-2y", "3-5y", "6-8y"],
    slots: ["breakfast", "dinner"],
    partner: "KidPoshan store",
    partnerUrl: "#",
    ingredients: ["Whole ragi", "Roasted chana dal", "Urad dal", "Curry leaves", "Rock salt"],
    nutrition: { energy: 358, protein: 12.8, carbs: 61, addedSugar: 0, totalSugar: 0.6, fat: 4.2, satFat: 0.8, fibre: 11.4, sodium: 95 },
    flags: { additives: 0, wholeGrain: true, palmOil: false, maida: false }
  },
  {
    id: "kidposhan-millet-porridge",
    brand: "KidPoshan",
    name: "Millet Porridge Mix",
    category: "Meal mix",
    price: 279,
    pack: "300 g",
    ages: ["6-12m", "1-2y", "3-5y"],
    slots: ["breakfast", "dinner"],
    partner: "KidPoshan store",
    partnerUrl: "#",
    ingredients: ["Foxtail millet", "Ragi", "Moong dal", "Almond powder", "Cardamom"],
    nutrition: { energy: 371, protein: 13.5, carbs: 63, addedSugar: 0, totalSugar: 1.2, fat: 5.4, satFat: 0.9, fibre: 9.2, sodium: 18 },
    flags: { additives: 0, wholeGrain: true, palmOil: false, maida: false }
  },
  {
    id: "kidposhan-millet-noodles",
    brand: "KidPoshan",
    name: "Instant Millet Noodles",
    category: "Noodles & pasta",
    price: 189,
    pack: "4 × 70 g",
    ages: ["3-5y", "6-8y", "9-12y"],
    slots: ["tiffin", "snack", "dinner"],
    partner: "KidPoshan store",
    partnerUrl: "#",
    ingredients: ["Foxtail millet flour", "Ragi flour", "Wheat flour", "Rock salt", "Turmeric"],
    nutrition: { energy: 364, protein: 10.4, carbs: 68, addedSugar: 0, totalSugar: 1.4, fat: 3.8, satFat: 1.0, fibre: 7.6, sodium: 340 },
    flags: { additives: 0, wholeGrain: true, palmOil: false, maida: false }
  },
  {
    id: "yogabar-oats-choco",
    brand: "Yogabar",
    name: "Dark Chocolate Oats Bar",
    category: "Snack bar",
    price: 399,
    pack: "6 × 40 g",
    ages: ["6-8y", "9-12y"],
    slots: ["snack", "tiffin"],
    partner: "Amazon",
    partnerUrl: "https://www.amazon.in/s?k=yogabar+oats+bar&tag=kidposhan-21",
    ingredients: ["Oats", "Dates", "Almonds", "Dark chocolate", "Honey", "Sea salt"],
    nutrition: { energy: 428, protein: 9.4, carbs: 58, addedSugar: 14.2, totalSugar: 26, fat: 16, satFat: 5.2, fibre: 6.4, sodium: 110 },
    flags: { additives: 0, wholeGrain: true, palmOil: false, maida: false }
  },
  {
    id: "timios-ragi-cookies",
    brand: "Timios",
    name: "Ragi Cookies",
    category: "Biscuits & cookies",
    price: 165,
    pack: "150 g",
    ages: ["3-5y", "6-8y", "9-12y"],
    slots: ["snack", "tiffin"],
    partner: "Amazon",
    partnerUrl: "https://www.amazon.in/s?k=timios+ragi+cookies&tag=kidposhan-21",
    ingredients: ["Ragi flour", "Whole wheat flour", "Jaggery", "Butter", "Cardamom"],
    nutrition: { energy: 452, protein: 7.2, carbs: 64, addedSugar: 19.5, totalSugar: 21, fat: 18, satFat: 8.4, fibre: 5.1, sodium: 210 },
    flags: { additives: 0, wholeGrain: true, palmOil: false, maida: false }
  },
  {
    id: "gowardhan-makhana",
    brand: "Farmley",
    name: "Roasted Makhana, Lightly Salted",
    category: "Snack",
    price: 249,
    pack: "200 g",
    ages: ["3-5y", "6-8y", "9-12y"],
    slots: ["snack", "tiffin"],
    partner: "Amazon",
    partnerUrl: "https://www.amazon.in/s?k=farmley+roasted+makhana&tag=kidposhan-21",
    ingredients: ["Foxnut", "Rice bran oil", "Salt"],
    nutrition: { energy: 361, protein: 9.7, carbs: 71, addedSugar: 0, totalSugar: 0.4, fat: 4.2, satFat: 0.9, fibre: 7.2, sodium: 290 },
    flags: { additives: 0, wholeGrain: true, palmOil: false, maida: false }
  },
  {
    id: "mango-drink-generic",
    brand: "Popular brand",
    name: "Mango Fruit Drink",
    category: "Beverage",
    price: 45,
    pack: "600 ml",
    ages: ["6-8y", "9-12y"],
    slots: ["snack"],
    partner: "Amazon",
    partnerUrl: "https://www.amazon.in/s?k=mango+fruit+drink&tag=kidposhan-21",
    ingredients: ["Water", "Sugar", "Mango pulp (14%)", "Acidity regulator", "Preservative (INS 211)", "Added flavour"],
    nutrition: { energy: 61, protein: 0.1, carbs: 15, addedSugar: 13.6, totalSugar: 14.8, fat: 0, satFat: 0, fibre: 0, sodium: 12 },
    flags: { additives: 3, wholeGrain: false, palmOil: false, maida: false }
  },
  {
    id: "instant-noodles-generic",
    brand: "Popular brand",
    name: "Masala Instant Noodles",
    category: "Noodles & pasta",
    price: 14,
    pack: "70 g",
    ages: ["6-8y", "9-12y"],
    slots: ["snack", "dinner"],
    partner: "Amazon",
    partnerUrl: "https://www.amazon.in/s?k=instant+noodles&tag=kidposhan-21",
    ingredients: ["Refined wheat flour (maida)", "Palm oil", "Salt", "Flavour enhancer", "Thickener", "Acidity regulator"],
    nutrition: { energy: 452, protein: 9.2, carbs: 62, addedSugar: 2.4, totalSugar: 3.1, fat: 18.6, satFat: 8.8, fibre: 2.2, sodium: 1180 },
    flags: { additives: 4, wholeGrain: false, palmOil: true, maida: true }
  },
  {
    id: "amul-milk-powder",
    brand: "Amul",
    name: "Instant Full Cream Milk Powder",
    category: "Dairy",
    price: 320,
    pack: "500 g",
    ages: ["1-2y", "3-5y", "6-8y", "9-12y"],
    slots: ["breakfast", "snack"],
    partner: "Amazon",
    partnerUrl: "https://www.amazon.in/s?k=amul+milk+powder&tag=kidposhan-21",
    ingredients: ["Full cream milk solids"],
    nutrition: { energy: 496, protein: 26, carbs: 38, addedSugar: 0, totalSugar: 38, fat: 26, satFat: 16, fibre: 0, sodium: 340 },
    flags: { additives: 0, wholeGrain: false, palmOil: false, maida: false }
  },
  {
    id: "24mantra-atta",
    brand: "24 Mantra Organic",
    name: "Whole Wheat Atta",
    category: "Flour",
    price: 315,
    pack: "5 kg",
    ages: ["1-2y", "3-5y", "6-8y", "9-12y"],
    slots: ["breakfast", "tiffin", "dinner"],
    partner: "Amazon",
    partnerUrl: "https://www.amazon.in/s?k=24+mantra+organic+atta&tag=kidposhan-21",
    ingredients: ["Organic whole wheat"],
    nutrition: { energy: 341, protein: 12.1, carbs: 69, addedSugar: 0, totalSugar: 1.2, fat: 1.9, satFat: 0.4, fibre: 11.2, sodium: 4 },
    flags: { additives: 0, wholeGrain: true, palmOil: false, maida: false }
  },
  {
    id: "happa-fruit-puree",
    brand: "Happa",
    name: "Organic Fruit Puree, Apple & Banana",
    category: "Baby food",
    price: 175,
    pack: "100 g",
    ages: ["6-12m", "1-2y"],
    slots: ["snack", "breakfast"],
    partner: "Amazon",
    partnerUrl: "https://www.amazon.in/s?k=happa+organic+fruit+puree&tag=kidposhan-21",
    ingredients: ["Organic apple", "Organic banana"],
    nutrition: { energy: 62, protein: 0.6, carbs: 14.6, addedSugar: 0, totalSugar: 11.8, fat: 0.2, satFat: 0.1, fibre: 2.1, sodium: 3 },
    flags: { additives: 0, wholeGrain: false, palmOil: false, maida: false }
  },
  {
    id: "early-foods-sprouted-ragi",
    brand: "Early Foods",
    name: "Sprouted Ragi Powder",
    category: "Baby food",
    price: 220,
    pack: "250 g",
    ages: ["6-12m", "1-2y"],
    slots: ["breakfast", "dinner"],
    partner: "Amazon",
    partnerUrl: "https://www.amazon.in/s?k=early+foods+sprouted+ragi+powder&tag=kidposhan-21",
    ingredients: ["Sprouted ragi"],
    nutrition: { energy: 336, protein: 7.6, carbs: 72, addedSugar: 0, totalSugar: 0.8, fat: 1.4, satFat: 0.3, fibre: 11.8, sodium: 11 },
    flags: { additives: 0, wholeGrain: true, palmOil: false, maida: false }
  },
  {
    id: "wholesome-tales-choco-spread",
    brand: "Wholesome Tales",
    name: "Chocolate Hazelnut Spread",
    category: "Spread",
    price: 425,
    pack: "300 g",
    ages: ["6-8y", "9-12y"],
    slots: ["breakfast", "snack"],
    partner: "Amazon",
    partnerUrl: "https://www.amazon.in/s?k=chocolate+hazelnut+spread+no+palm+oil&tag=kidposhan-21",
    ingredients: ["Hazelnuts", "Cocoa", "Coconut sugar", "Cocoa butter", "Milk solids"],
    nutrition: { energy: 548, protein: 7.8, carbs: 46, addedSugar: 32, totalSugar: 38, fat: 34, satFat: 9.6, fibre: 5.2, sodium: 45 },
    flags: { additives: 0, wholeGrain: false, palmOil: false, maida: false }
  }
];
