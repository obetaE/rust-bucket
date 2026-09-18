<div align="center">
  <img src="rustbucket-expo/assets/images/icon.png" alt="Rust Bucket" width="96" />

  # Rust Bucket

  **Technology with staying power.**

  A full-stack e-commerce mobile app for a fictional gadget and audio shop — React Native
  (Expo) on the front, Express + MongoDB on the back, built end to end.
</div>

---

## What it is

Rust Bucket is a complete shopping experience on a phone: browse a catalogue of 42 gadgets,
search and filter by category, save favourites, add to a bag, and check out through a
three-step flow that creates a real order you can track. It has full email/password
accounts, including a working forgot-password flow, and a customer care section with live
chat and a searchable help centre.

It's a portfolio project, so it's deliberately complete rather than a demo of one screen:
the checkout writes real orders, prices are calculated server-side, passwords are hashed,
and the design carries a full light and dark theme.

## Features

**Shopping**
- A 42-product catalogue across 7 categories — headphones, earbuds, speakers, phones,
  wearables, computers and accessories
- Search with a debounce, plus category filters
- A featured hero product, product detail pages with ratings and reviews counts
- Favourites (the heart on any product), saved to your account
- A bag with quantity controls and a running total

**Checkout & orders**
- A three-step flow: delivery details → payment → review, each step validated
- Prices and totals are calculated **on the server** from the live catalogue, never
  trusted from the client
- Orders are saved with a status (confirmed → packed → dispatched → delivered) and
  listed on your profile

**Accounts**
- Register and sign in with email and password (hashed with bcrypt, JWT sessions)
- Forgot/reset password with a 6-character code that expires after 15 minutes
- The token lives in the device keychain (`expo-secure-store`), not in plain storage
- An expired session signs you out cleanly instead of failing silently

**Customer care**
- Live chat (prototype — scripted replies)
- A help centre with 18 articles across 5 topics, searchable, with expandable answers

**Design**
- A real light *and* dark theme — not an inversion, but a second palette built on the same
  forest/lime identity: deep pine surfaces with antique gold in dark mode
- Your choice of Light, Dark or Auto, remembered between launches
- A glassmorphic tab bar and login card (`expo-blur`)
- An animated splash screen (Reanimated), and Outfit + Inter as the type pairing

## Built with

**Mobile app** (`rustbucket-expo/`)

| | |
|---|---|
| Framework | Expo SDK 54, React Native 0.81.5, React 19.1 |
| Navigation | Expo Router 6 (file-based, typed routes) |
| Styling | NativeWind v4 + Tailwind CSS 3 |
| Animation | React Native Reanimated 4 |
| Storage | expo-secure-store (auth token), AsyncStorage (theme) |
| UI | expo-blur, expo-linear-gradient, lucide-react-native, react-native-svg |
| Language | TypeScript 5.9 |

**API** (`rustbucket-backend/`)

| | |
|---|---|
| Runtime | Node.js 22.6+ (runs TypeScript directly via `--experimental-strip-types`) |
| Framework | Express 5 |
| Database | MongoDB Atlas + Mongoose 9 |
| Auth | jsonwebtoken (JWT), bcryptjs |
| Language | TypeScript 5.8 |

## Architecture

```
┌──────────────────────┐         HTTPS + Bearer token        ┌──────────────────────┐
│   Expo app           │ ──────────────────────────────────► │   Express API        │
│   (Android / iOS)    │ ◄────────────────────────────────── │   (Node + TS)        │
│                      │            JSON                     │                      │
│  token in keychain   │                                     │  auth · products ·   │
│  cart in memory      │                                     │  favorites · orders  │
└──────────────────────┘                                     └──────────┬───────────┘
                                                                        │ Mongoose
                                                             ┌──────────▼───────────┐
                                                             │  MongoDB Atlas       │
                                                             │  users · products ·  │
                                                             │  orders              │
                                                             └──────────────────────┘
```

In development the app finds the API by itself: it reuses the IP your phone already used to
reach Metro and swaps in the API port, so a changing computer IP never breaks it. Set
`EXPO_PUBLIC_API_BASE_URL` to point at a deployed backend instead.

## Project structure

```
rust-bucket/
├── rustbucket-expo/              # the mobile app
│   ├── app/                      # screens (Expo Router — file = route)
│   │   ├── index.tsx             # animated splash → /login or /shop
│   │   ├── login · signup · forgot-password · reset-password
│   │   ├── help.tsx              # help centre
│   │   ├── (tabs)/               # shop · cart · support · profile
│   │   ├── product/[id].tsx      # product detail
│   │   └── checkout/             # 3-step checkout + success
│   ├── components/               # GlassSurface, DeveloperCard
│   ├── lib/                      # api, auth, session, cart, theme, products
│   └── assets/                   # icons, splash, bundled product renders
│
└── rustbucket-backend/           # the API
    └── src/
        ├── index.ts              # server, health check, request logging
        ├── lib/catalog.ts        # the product catalogue (synced on startup)
        ├── lib/models/           # User, Product, Order
        ├── middleware/           # JWT route protection
        └── routes/               # auth, products, favorites, orders
```

## Running it locally

**You'll need:** Node.js 22.6 or newer, pnpm, a MongoDB connection string (a free
[Atlas](https://www.mongodb.com/atlas) cluster is fine), and the Expo Go app on your phone.

**1. The API**

```bash
cd rustbucket-backend
pnpm install
```

Create `.env`:

```
MONGO_URI=your-mongodb-connection-string
PORT=3001
JWT_SECRET=any-long-random-string
```

```bash
pnpm dev
```

It runs on port 3001 and prints the addresses your phone can reach. The product catalogue
is added to the database automatically on startup — no seeding step needed.

**2. The app**

```bash
cd rustbucket-expo
pnpm install
pnpm expo start -c
```

Scan the QR code with Expo Go. `.env` only needs `EXPO_PUBLIC_API_PORT=3001` to match the
API; the IP is worked out automatically.

> Your phone and computer must be on the same Wi-Fi, and a VPN on either device will
> usually block the connection.

## API

`/api/auth/*` and `/api/products` are public. Everything else needs
`Authorization: Bearer <token>`.

| Method | Route | Description |
|---|---|---|
| GET | `/api/health` | Is the server awake |
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Sign in |
| POST | `/api/auth/forgot-password` | Request a reset code |
| POST | `/api/auth/reset-password` | Set a new password with the code |
| GET | `/api/products?category=&q=` | The catalogue, filterable |
| GET | `/api/products/:id` | One product |
| GET | `/api/favorites` | Your favourites |
| POST | `/api/favorites/:productId` | Toggle a favourite |
| POST | `/api/orders` | Place an order |
| GET | `/api/orders` | Your order history |

## Prototype limitations

Worth knowing before you judge it as production code — each is a deliberate scope decision,
not an oversight:

- **Payments aren't real.** Checkout validates card details and stores only the last four
  digits, like a payment processor would return, but no money moves and no card data is
  sent anywhere. Wiring in Stripe would replace one step of the flow.
- **Password reset codes appear on screen.** No email service is connected, so the API
  returns the reset code directly and the app shows it in a labelled "dev mode" box. The
  token generation, SHA-256 hashing and 15-minute expiry are production-shaped; only the
  delivery is missing.
- **Live chat is scripted.** It sends a canned reply rather than reaching a real agent.
- **Product photos are hosted remotely.** The six original products use renders bundled
  with the app; the other 36 use free [Unsplash](https://unsplash.com) photos and need an
  internet connection to display.

## Credits

Product photography from [Unsplash](https://unsplash.com), under the Unsplash License.
Product names, branding and copy are fictional.

## Built by

**Obeta Chukwuka Eric** — designed and built end to end, from the app to the API behind it.

- Email — [obetachukwuka1@gmail.com](mailto:obetachukwuka1@gmail.com)
- GitHub — [@obetaE](https://github.com/obetaE)
- X — [@ObetaEric_Codes](https://x.com/ObetaEric_Codes)

If you like how it feels, want something similar built, or just have feedback, I'd
genuinely love to hear from you.
