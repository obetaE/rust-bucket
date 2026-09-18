import Product from "./models/Product.ts";

// The shop's catalogue. The six originals use renders bundled with the app
// (imageKey); everything else uses a free Unsplash photo (imageUrl).
// Product names are Rust Bucket's own — photos were chosen without visible
// third-party branding.

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&q=80&auto=format&fit=crop`;

type CatalogProduct = {
  name: string;
  category: string;
  price: number;
  imageKey?: string;
  imageUrl?: string;
  tag: string;
  description: string;
  rating: number;
  reviewsCount: number;
};

export const CATALOG: CatalogProduct[] = [
  /* ---------------- Headphones ---------------- */
  {
    name: "Forge H1",
    category: "Headphones",
    price: 289,
    imageKey: "headphones",
    tag: "Flagship",
    description: "Adaptive noise control and 60-hour power in a precision-built over-ear silhouette.",
    rating: 4.9,
    reviewsCount: 148,
  },
  {
    name: "Forge Studio",
    category: "Headphones",
    price: 329,
    imageUrl: unsplash("1505740420928-5e560c06d30e"),
    tag: "Studio",
    description: "Tuned flat for mixing and mastering, with memory-foam cushions for long sessions.",
    rating: 4.8,
    reviewsCount: 96,
  },
  {
    name: "Forge H1 Pro",
    category: "Headphones",
    price: 379,
    imageUrl: unsplash("1618366712010-f4ae9c647dcb"),
    tag: "ANC Pro",
    description: "Our strongest noise cancelling yet, with eight microphones and 40-hour battery life.",
    rating: 4.9,
    reviewsCount: 211,
  },
  {
    name: "Forge Lite",
    category: "Headphones",
    price: 149,
    imageUrl: unsplash("1546435770-a3e426bf472b"),
    tag: "Everyday",
    description: "Lightweight, foldable and comfortable enough to forget you're wearing them.",
    rating: 4.6,
    reviewsCount: 188,
  },
  {
    name: "Anvil Classic",
    category: "Headphones",
    price: 199,
    imageUrl: unsplash("1484704849700-f032a568e944"),
    tag: "Heritage",
    description: "Brushed aluminium and leather, built around a warm, open sound.",
    rating: 4.7,
    reviewsCount: 74,
  },
  {
    name: "Monitor M2",
    category: "Headphones",
    price: 119,
    imageUrl: unsplash("1583394838336-acd977736f90"),
    tag: "Wired",
    description: "A dependable wired pair with a detachable cable and zero latency.",
    rating: 4.5,
    reviewsCount: 59,
  },
  {
    name: "Obsidian H3",
    category: "Headphones",
    price: 259,
    imageUrl: unsplash("1585298723682-7115561c51b7"),
    tag: "Matte",
    description: "A stealthy matte-black finish with deep bass and 50-hour battery life.",
    rating: 4.7,
    reviewsCount: 83,
  },
  {
    name: "Halo Max",
    category: "Headphones",
    price: 499,
    imageUrl: unsplash("1609081219090-a6d81d3085bf"),
    tag: "Premium",
    description: "Machined aluminium cups, spatial audio and a breathable knit headband.",
    rating: 4.8,
    reviewsCount: 142,
  },
  {
    name: "Halo Max Rose",
    category: "Headphones",
    price: 499,
    imageUrl: unsplash("1613040809024-b4ef7ba99bc3"),
    tag: "Limited",
    description: "Everything in Halo Max, in a limited soft-rose finish.",
    rating: 4.8,
    reviewsCount: 37,
  },

  /* ---------------- Earbuds ---------------- */
  {
    name: "Foundry Pods",
    category: "Earbuds",
    price: 179,
    imageKey: "earbuds",
    tag: "New",
    description: "Pocket-sized clarity with spatial audio, soft-touch fit and all-day battery life.",
    rating: 4.8,
    reviewsCount: 92,
  },
  {
    name: "Foundry Pods Pro",
    category: "Earbuds",
    price: 229,
    imageUrl: unsplash("1572569511254-d8f925fe2cbb"),
    tag: "ANC",
    description: "Active noise cancelling, transparency mode and a wireless charging case.",
    rating: 4.8,
    reviewsCount: 264,
  },
  {
    name: "Foundry Pods 2",
    category: "Earbuds",
    price: 189,
    imageUrl: unsplash("1606741965326-cb990ae01bb2"),
    tag: "Refreshed",
    description: "A refined fit, longer battery life and faster pairing across your devices.",
    rating: 4.7,
    reviewsCount: 118,
  },
  {
    name: "Foundry Air",
    category: "Earbuds",
    price: 129,
    imageUrl: unsplash("1600294037681-c80b4cb5b434"),
    tag: "Light",
    description: "Open-fit buds that stay comfortable all day, with a case that fits any pocket.",
    rating: 4.5,
    reviewsCount: 97,
  },
  {
    name: "Pebble Buds",
    category: "Earbuds",
    price: 99,
    imageUrl: unsplash("1590658268037-6bf12165a8df"),
    tag: "Colours",
    description: "Playful, affordable earbuds in three finishes with a 24-hour case.",
    rating: 4.4,
    reviewsCount: 156,
  },
  {
    name: "Ember Sport",
    category: "Earbuds",
    price: 159,
    imageUrl: unsplash("1606220588913-b3aacb4d2f46"),
    tag: "Sport",
    description: "Sweat-proof, secure-fit buds built for training days and long runs.",
    rating: 4.6,
    reviewsCount: 71,
  },

  /* ---------------- Speakers ---------------- */
  {
    name: "Field Box",
    category: "Speakers",
    price: 219,
    imageKey: "speaker",
    tag: "Outdoor",
    description: "Room-filling sound in a weather-ready shell made for workdays and weekends.",
    rating: 4.7,
    reviewsCount: 61,
  },
  {
    name: "Hearth Tower",
    category: "Speakers",
    price: 349,
    imageUrl: unsplash("1545454675-3531b543be5d"),
    tag: "Hi-fi",
    description: "A wood-finished bookshelf speaker with a silk-dome tweeter and rich mids.",
    rating: 4.8,
    reviewsCount: 44,
  },
  {
    name: "Orbit Home",
    category: "Speakers",
    price: 99,
    imageUrl: unsplash("1512446816042-444d641267d4"),
    tag: "Smart",
    description: "A voice-controlled smart speaker with a light ring and 360° sound.",
    rating: 4.5,
    reviewsCount: 203,
  },
  {
    name: "Orbit Mini",
    category: "Speakers",
    price: 59,
    imageUrl: unsplash("1519558260268-cde7e03a0152"),
    tag: "Compact",
    description: "A palm-sized smart speaker for the kitchen, bedroom or desk.",
    rating: 4.4,
    reviewsCount: 167,
  },
  {
    name: "Loom Speaker",
    category: "Speakers",
    price: 129,
    imageUrl: unsplash("1543512214-318c7553f230"),
    tag: "Fabric",
    description: "A tall fabric-wrapped speaker that fills a room without dominating it.",
    rating: 4.6,
    reviewsCount: 52,
  },

  /* ---------------- Phones ---------------- */
  {
    name: "Verdant One",
    category: "Phones",
    price: 849,
    imageKey: "phone",
    tag: "Pro camera",
    description:
      "A considered flagship phone with an all-day battery, vivid display and studio-grade camera system.",
    rating: 4.9,
    reviewsCount: 203,
  },
  {
    name: "Verdant One Max",
    category: "Phones",
    price: 999,
    imageUrl: unsplash("1592899677977-9c10ca588bbd"),
    tag: "Max",
    description: "A bigger display, the longest battery life in the range and a 5× telephoto lens.",
    rating: 4.9,
    reviewsCount: 176,
  },
  {
    name: "Verdant Mini",
    category: "Phones",
    price: 599,
    imageUrl: unsplash("1580910051074-3eb694886505"),
    tag: "Compact",
    description: "Flagship performance in a phone you can use with one hand.",
    rating: 4.7,
    reviewsCount: 88,
  },
  {
    name: "Verdant Lite",
    category: "Phones",
    price: 499,
    imageUrl: unsplash("1511707171634-5f897ff02aa9"),
    tag: "Value",
    description: "The essentials done well: a bright display, two-day battery and a great main camera.",
    rating: 4.6,
    reviewsCount: 131,
  },
  {
    name: "Grove X",
    category: "Phones",
    price: 649,
    imageUrl: unsplash("1598327105666-5b89351aff97"),
    tag: "Android",
    description: "A clean Android experience with a 120Hz display and fast charging.",
    rating: 4.6,
    reviewsCount: 102,
  },
  {
    name: "Grove Duo",
    category: "Phones",
    price: 729,
    imageUrl: unsplash("1546054454-aa26e2b734c7"),
    tag: "Dual SIM",
    description: "Two SIMs, two lenses, one slim body — built for people who juggle work and life.",
    rating: 4.5,
    reviewsCount: 64,
  },
  {
    name: "Grove S",
    category: "Phones",
    price: 399,
    imageUrl: unsplash("1544866092-1935c5ef2a8f"),
    tag: "Starter",
    description: "An affordable, reliable phone with a big screen and a battery that lasts.",
    rating: 4.3,
    reviewsCount: 145,
  },

  /* ---------------- Wearables ---------------- */
  {
    name: "Pulse W2",
    category: "Wearables",
    price: 249,
    imageKey: "watch",
    tag: "Everyday",
    description:
      "Health, movement and notifications in a durable, lightweight watch made to stay with you.",
    rating: 4.6,
    reviewsCount: 77,
  },
  {
    name: "Pulse W3 Pro",
    category: "Wearables",
    price: 399,
    imageUrl: unsplash("1579586337278-3befd40fd17a"),
    tag: "Pro",
    description: "An always-on display, ECG, GPS and a titanium case for serious training.",
    rating: 4.8,
    reviewsCount: 121,
  },
  {
    name: "Pulse Active",
    category: "Wearables",
    price: 299,
    imageUrl: unsplash("1546868871-7041f2a55e12"),
    tag: "Fitness",
    description: "Workout tracking, heart-rate zones and a sport band that stays put.",
    rating: 4.7,
    reviewsCount: 98,
  },
  {
    name: "Pulse Classic",
    category: "Wearables",
    price: 199,
    imageUrl: unsplash("1523275335684-37898b6baf30"),
    tag: "Minimal",
    description: "A clean round face with smart notifications and a week of battery life.",
    rating: 4.5,
    reviewsCount: 66,
  },
  {
    name: "Pulse Band",
    category: "Wearables",
    price: 59,
    imageUrl: unsplash("1575311373937-040b8e1fd5b6"),
    tag: "Tracker",
    description: "A slim fitness band for steps, sleep and heart rate — two weeks per charge.",
    rating: 4.4,
    reviewsCount: 239,
  },

  /* ---------------- Computers ---------------- */
  {
    name: "Canopy 13",
    category: "Computers",
    price: 1199,
    imageKey: "laptop",
    tag: "Creator",
    description:
      "A slim, quiet performance laptop with a brilliant display and battery life built for long sessions.",
    rating: 4.9,
    reviewsCount: 134,
  },
  {
    name: "Canopy 15",
    category: "Computers",
    price: 1499,
    imageUrl: unsplash("1496181133206-80ce9b88a853"),
    tag: "Pro",
    description: "A larger canvas with more power for video, code and 3D work.",
    rating: 4.8,
    reviewsCount: 87,
  },
  {
    name: "Canopy Air",
    category: "Computers",
    price: 999,
    imageUrl: unsplash("1525547719571-a2d4ac8945e2"),
    tag: "Thin",
    description: "Our thinnest laptop, with a backlit keyboard and a fanless, silent design.",
    rating: 4.7,
    reviewsCount: 112,
  },
  {
    name: "Canopy Tab",
    category: "Computers",
    price: 649,
    imageUrl: unsplash("1544244015-0df4b3ffc6b0"),
    tag: "Tablet",
    description: "An 11-inch tablet with stylus support for sketching, notes and reading.",
    rating: 4.7,
    reviewsCount: 93,
  },
  {
    name: "Canopy Tab Mini",
    category: "Computers",
    price: 449,
    imageUrl: unsplash("1587033411391-5d9e51cce126"),
    tag: "Portable",
    description: "A compact tablet that slips into any bag — perfect for travel and reading.",
    rating: 4.6,
    reviewsCount: 58,
  },
  {
    name: "Summit Display 27",
    category: "Computers",
    price: 549,
    imageUrl: unsplash("1616763355548-1b606f439f86"),
    tag: "Display",
    description: "A 27-inch 4K display with accurate colour and a single-cable connection.",
    rating: 4.7,
    reviewsCount: 49,
  },

  /* ---------------- Accessories ---------------- */
  {
    name: "Keyline 75",
    category: "Accessories",
    price: 129,
    imageUrl: unsplash("1618384887929-16ec33fab9ef"),
    tag: "Mechanical",
    description: "A compact 75% mechanical keyboard with hot-swappable switches.",
    rating: 4.8,
    reviewsCount: 104,
  },
  {
    name: "Keyline Slim",
    category: "Accessories",
    price: 89,
    imageUrl: unsplash("1587829741301-dc798b83add3"),
    tag: "Wireless",
    description: "A low-profile wireless keyboard with a rechargeable month-long battery.",
    rating: 4.5,
    reviewsCount: 72,
  },
  {
    name: "Glide Mouse",
    category: "Accessories",
    price: 49,
    imageUrl: unsplash("1527864550417-7fd91fc51a46"),
    tag: "Ergonomic",
    description: "A sculpted wireless mouse with a silent click and precise tracking.",
    rating: 4.5,
    reviewsCount: 133,
  },
  {
    name: "Surge 60W Charger",
    category: "Accessories",
    price: 39,
    imageUrl: unsplash("1583863788434-e58a36330cf0"),
    tag: "Fast charge",
    description: "A compact 60W USB-C charger for laptops, tablets and phones.",
    rating: 4.6,
    reviewsCount: 181,
  },
];

/**
 * Adds any catalogue products that aren't in the database yet (matched by
 * name). Existing products are left untouched, so it's safe to run on every
 * start — new products appear automatically after a deploy.
 */
export async function syncCatalog() {
  const existing = new Set(
    (await Product.find({}, { name: 1 }).lean()).map((p: { name: string }) => p.name),
  );
  const missing = CATALOG.filter((p) => !existing.has(p.name));
  if (missing.length) await Product.insertMany(missing);
  return { added: missing.map((p) => p.name), total: existing.size + missing.length };
}
