# Guru Sweet Mart — HTML design mockup

A static, front-end-only mockup of the Guru Sweet Mart website described in
[`../docs/PRD.md`](../docs/PRD.md). It is a **new, standalone copy** — nothing
in `../docs/` or `../site/` was modified to build this.

Design direction: traditional and royal, drawing on Mysuru's palace heritage —
a maroon/gold/sandalwood palette, palace-dome and paisley motifs, serif
display type (Cormorant Garamond / Cinzel), and Kannada script alongside
English. Product and shop imagery is intentionally illustrated (no borrowed
photos), matching the guidance in `../docs/PHOTO-RESEARCH.md`.

## Pages

- `index.html` — home: hero, signature products, heritage teaser, order-at-store
  teaser, store locations, trust strip
- `shop.html` — 66 confirmed products with real transparent product images,
  exact weight-based prices, category filters, and menu search
- `story.html` — heritage story and how-it's-made timeline
- `order.html` — "Order at Store" token/QR flow, with a working stage
  simulator (Paid → Accepted → Preparing → Ready → Collected)
- `visit.html` — store locations/hours, an order-tracking form, and an FAQ
  ("Help") section
- `offline.html` — branded offline fallback shown by the service worker

Everything is static HTML/CSS/vanilla JS — there is no backend, cart, payment,
or real order data. Cart counts, the tracking form, and the token simulator
are all client-side illustrations of the intended behaviour.

## Run it locally

Service workers and `fetch` require a real origin, so don't open the files
with `file://` — serve the folder instead:

```bash
npx serve mockup
```

or

```bash
python3 -m http.server 4173 --directory mockup
```

Then open `http://localhost:4173/index.html`.

This repo also has a `.claude/launch.json` entry (`guru-sweet-mart-mockup`)
that serves the same folder on port 4173 for quick preview.

## PWA

- `manifest.webmanifest` — installable, standalone display, shortcuts to
  Shop and Order at Store
- `service-worker.js` — caches the app shell on install (cache-first for
  static assets, network-first for navigations, falling back to
  `offline.html`)
- `icons/` — app icons (192/512, maskable variants, apple-touch-icon,
  favicons), cropped and matted from `images/web_logo.png`

## Brand artwork

- `images/web_logo.png` — the supplied palace/Mysore-Pak emblem artwork.
  `images/logo-mark.png` is a square, transparent-edge crop of it used
  directly in the header, footer and install banner; the `icons/` PNGs are
  the same crop matted onto the maroon brand colour for favicons and the
  PWA manifest.
- `images/home_page.png` — the supplied Devaraja Market illustration, shown
  full-width on the home page's "Mysuru, then and now" heritage banner. Its
  alpha-vignette edges are intentional — they fade into the section's maroon
  background rather than sitting in a hard rectangle.

Regenerating the icon crop/matte (e.g. if the source artwork changes) is done
with Pillow — see the crop/matte logic used to produce `icons/*.png` and
`images/logo-mark.png` from `images/web_logo.png` if you need to redo it.

## Known limitations (mockup scope)

- No real backend, payments, inventory, or multilingual content — the
  language switcher and "track order" form are UI demonstrations only.
- Only English UI copy is written out; the language pills and Kannada
  wordmark are there to demonstrate the multilingual design intent from the
  PRD, not a working translation system.
- The shop catalogue now uses the product photography and prices supplied in
  the menu PDFs. Other homepage feature cards may still use illustrated
  placeholders until the final product and editorial image selection is made.
