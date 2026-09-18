# Rust Bucket (Expo)

An e-commerce gadget/audio shop app — converted from the Lovable web mockup,
with a glassmorphic navbar, real light/dark mode, an upgraded auth flow
(including forgot/reset password), and a custom splash screen. Backed by
`rustbucket-backend`.

## Stack

- Expo SDK 54 (React Native 0.81.5, React 19.1) — versions re-verified fresh
  against Expo's own `bundledNativeModules.json` for this build
- Expo Router, NativeWind v4 + Tailwind CSS v3
- `expo-blur` for the glass effect (chosen over `expo-glass-effect`, which is
  iOS-only — `BlurView` renders a real blur on both iOS and Android)
- `react-native-reanimated` v4 for the splash screen's entrance animation —
  its Babel plugin (`react-native-worklets/plugin`) is added automatically by
  `babel-preset-expo`, so `babel.config.js` deliberately doesn't list it
- `expo-secure-store` for the auth token (real credentials this time, so the
  device keychain, not AsyncStorage)
- Outfit (display) + Inter (body) fonts

## The dark mode is a real redesign, not an inversion

The original mockup's `.dark` CSS block was unused shadcn boilerplate —
generic blue-gray, completely disconnected from the actual forest/lime/palm
brand. Rather than port that over, dark mode here is a deliberate "richer,
more mature" palette built on the same identity: deep pine surfaces
(`#0b120d` background, `#141f17` cards) with antique gold (`#e8d998`) standing
in for the light mode's brighter lime, and a muted moss accent (`#7a9a4a`).
Toggle it from the Profile tab (light / dark / system), or let it follow the
device automatically — the preference is saved and persists across launches.

## The glass navbar

`components/GlassSurface.tsx` wraps `expo-blur`'s `BlurView`, tinted per
theme. It's used for the bottom tab bar (`app/(tabs)/_layout.tsx`'s custom
`GlassTabBar`) and the "free express delivery" badge on the product image —
same pattern the original mockup's CSS `.glass` utility class was reaching
for, now actually rendering a real blur instead of a CSS backdrop-filter
(which doesn't exist in React Native).

## Auth: what's new vs. the mockup

The mockup's login screen was a single form with a mode toggle and no
password recovery at all ("Prototype mode · Any valid email and 6-character
password works"). This build has real screens for each: `login.tsx`,
`signup.tsx`, `forgot-password.tsx`, `reset-password.tsx` — all wired to
actual backend auth, not a prototype shortcut.

**One thing to know about forgot-password**: no email service is wired up
in the backend yet, so `forgot-password.tsx` displays the reset code
directly on-screen in a "dev mode" box after requesting one. That's clearly
labeled as temporary — see the backend's README for what real email sending
would need.

## Setup

```bash
pnpm install
```

pnpm, same as Scenewise — `.npmrc` sets `node-linker=hoisted`, which Expo
needs. Don't mix in `npm install`; one lockfile (`pnpm-lock.yaml`) only.

Edit `.env` — point `EXPO_PUBLIC_API_BASE_URL` at your computer's LAN IP
(not `localhost`) plus `rustbucket-backend`'s port (3002):

```
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.42:3002/api
```

`rustbucket-backend` needs to be running (`pnpm dev` in that folder, and
`pnpm seed` once to populate the product catalog) for anything beyond the
splash screen to work.

Then:

```bash
npx expo start -c
```

## Structure

```
app/
  _layout.tsx           # fonts, ThemeProvider/SessionProvider/CartProvider, stack
  index.tsx               # animated splash — routes to /login or /shop
  login.tsx, signup.tsx, forgot-password.tsx, reset-password.tsx
  (tabs)/
    _layout.tsx            # the glassmorphic tab bar lives here
    shop.tsx                 # home — hero, search, categories, product grid
    cart.tsx
    support.tsx
    profile.tsx               # account, theme toggle, order history, sign out
  product/[id].tsx
  checkout/index.tsx           # 3-step checkout, creates a real order
  checkout/success.tsx
components/
  GlassSurface.tsx               # the reusable glass wrapper
lib/
  theme.tsx                        # persisted light/dark/system preference
  session.tsx, auth.ts                # real JWT auth, keychain-stored
  cart.tsx                              # client-side cart (screens are
                                          # separate routes now, not one
                                          # single-page app with lifted state)
  api.ts                                  # typed client for the backend
  products.ts                              # maps backend imageKey → bundled asset
```

## A routing mistake I almost made twice

I nearly recreated the exact `(group)` collision that came up in an earlier
project: putting the splash screen at `(auth)/index.tsx` or similar while
`(tabs)/index.tsx` also wants to claim `/`. Fixed by making the splash the
actual root (`app/index.tsx`) and naming the tab's home screen `shop.tsx`
instead of `index.tsx`. Worth remembering if more top-level screens get added
later.

## Verified, not run end-to-end

Whole-project `tsc --noEmit` passes clean. Caught and fixed two real issues
along the way: a wrong Reanimated Babel plugin (the v3 plugin name doesn't
work with the v4 package this SDK ships), and a theme color-type mismatch
that `tsc` flagged directly. I could not actually boot Expo and tap through
the screens — no simulator/device here, no network path to your backend.
Try the splash → login → shop flow first once both are running.
