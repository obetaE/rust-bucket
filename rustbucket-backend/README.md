# Rust Bucket Backend

Auth (with forgot/reset password), product catalog, favorites, and orders —
built the same way as your other backends (Express + TypeScript + Mongoose),
for the Rust Bucket gadget/audio shop app.

## Setup

```bash
pnpm install
```

Edit `.env` — paste your existing MongoDB Atlas connection string as
`MONGO_URI` (same cluster you've used for your other apps is fine; this
connects to its own database name, `rustbucket`, so nothing collides) and
set `JWT_SECRET` to any long random string.

```bash
pnpm dev    # also adds any missing catalogue products on startup
```

`pnpm start` runs the TypeScript directly with Node's built-in type
stripping (`node --experimental-strip-types`, Node 22.6+) — the same setup
as scenewise-backend, so there's no build step. On Render: build command
`pnpm install`, start command `pnpm start`, and set `MONGO_URI` and
`JWT_SECRET` as environment variables.

Runs on port **3002** by default, so it can sit alongside your other backends
(book-app on 3000, scenewise-backend on 3001) without a conflict.

## Forgot password — what's real and what's a placeholder

`POST /api/auth/forgot-password` generates a real 6-character reset code,
hashes it (SHA-256) before storing it, and sets a 15-minute expiry — all of
that is production-shaped. What's **not** production-ready: no email service
is wired up, so the raw code is returned directly in the API response
(`devResetCode`) instead of being emailed. The frontend's forgot-password
screen displays it in an explicitly-labeled "dev mode" box for exactly this
reason.

**To make this real**, swap the `devResetCode` response field for an actual
email send — e.g. [Resend](https://resend.com) or
[Postmark](https://postmarkapp.com) both have simple Node SDKs, or
`nodemailer` + any SMTP provider. The token generation, hashing, and
expiry logic in `authRoutes.ts` doesn't need to change at all — just add the
email call where the comment says so, and delete the `devResetCode` field
from the response.

## Product catalogue & images

The catalogue — 42 products across Headphones, Earbuds, Speakers, Phones,
Wearables, Computers and Accessories — lives in `src/lib/catalog.ts`. The
server adds any missing products **every time it starts** (matched by name),
so new products appear without running anything; existing ones are never
overwritten. `pnpm seed` does the same without starting the server.

Each product has either:

- `imageKey` — one of the renders bundled with the app (`headphones`,
  `earbuds`, `speaker`, `phone`, `watch`, `laptop`), mapped in the frontend's
  `lib/products.ts`; or
- `imageUrl` — a remote photo. The added products use free Unsplash photos,
  chosen without visible third-party branding, so they need an internet
  connection to display.

To add a product, append it to `CATALOG` and restart the server.

## API surface

`/api/auth/*` is public. Everything else that touches a specific user
requires `Authorization: Bearer <token>`; `/api/products` is public
(browsing doesn't need an account).

| Method | Route | What it does |
|---|---|---|
| GET | `/api/health` | Public — `{ ok: true }`, for checking the server is awake |
| POST | `/api/auth/register` | `{ email, password, fullName }` |
| POST | `/api/auth/login` | `{ email, password }` |
| POST | `/api/auth/forgot-password` | `{ email }` → generates a reset code (see above) |
| POST | `/api/auth/reset-password` | `{ email, code, newPassword }` |
| GET | `/api/products?category=&q=` | Public catalog, filterable |
| GET | `/api/products/:id` | Public — single product |
| GET | `/api/favorites` | This user's favorited products |
| POST | `/api/favorites/:productId` | Toggles a favorite |
| POST | `/api/orders` | `{ items: [{productId, quantity}], deliveryAddress, cardLast4 }` — prices are looked up server-side, never trusted from the client |
| GET | `/api/orders` | This user's order history |

## Verified, not run end-to-end

`tsc --noEmit` passes clean — caught and fixed two real issues along the
way: `@types/jsonwebtoken`/`@types/bcryptjs` version numbers that don't
actually exist on npm (fixed to the real latest), and `bcryptjs` v3 now
ships its own type declarations, making the separate `@types/bcryptjs`
package both unnecessary and deprecated (removed it). Could not connect to
a live MongoDB Atlas cluster from here — run `pnpm seed` then `pnpm dev` and
try `GET /api/products` first.
