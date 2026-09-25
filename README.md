# anveli website

The marketing site and waitlist for **anveli**: one living health history for your records, wearables, doctor visits and insurance. *Your health, understood.*

The brand is always **anveli**: lowercase, one "l", no period. The mark is the 6A Tangent symbol (four circles touching one point, the person).

## Stack

- **Next.js 16** (App Router) with **React 19**, fully static: `next.config.ts` sets `output: "export"`, so `npm run build` writes plain HTML, CSS and JS to `out/`. No API routes, server actions, ISR or image optimiser.
- **Tailwind CSS v4**, with the design tokens in `src/app/globals.css` (`@theme`) and their JS mirror in `src/lib/tokens.ts`.
- **GSAP** (ScrollTrigger, SplitText, DrawSVG, MotionPath, CustomEase) for everything scroll-linked, **Lenis** for smooth scroll on GSAP's ticker, **Motion** for UI state and gesture, **three.js + react-three-fiber + drei** for the 3D rings, **Phosphor** icons.
- Fonts: **Geist** and **JetBrains Mono** through `next/font`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server at http://localhost:3000 |
| `npm run build` | Static export to `out/` (serve that folder from any static host) |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type check |
| `node scripts/make-og.mjs` | Regenerates the share image (`src/app/opengraph-image.png` and `twitter-image.png`) |
| `node scripts/make-grain.mjs public/brand/grain.webp` | Regenerates the grain tile |

## Environment variables

| Variable | Used for |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | The canonical origin (for example `https://anveli.example`). Used for metadata, `sitemap.xml` and `robots.txt`. Defaults to `http://localhost:3000`. |
| `NEXT_PUBLIC_WAITLIST_ENDPOINT` | The form endpoint the waitlist posts to from the browser (Formspree or Loops). Until it is set, signups are simulated in development. |

Both are read at build time, so set them before `npm run build`.

## Routes

| Route | Ground | What it is |
| --- | --- | --- |
| `/` | Ink, with one paper chapter | The scroll story and the waitlist |
| `/privacy-trust` | Paper | An editorial long-read on how anveli treats your information |
| `/privacy`, `/terms` | Paper | Placeholder legal pages (need legal review before launch; noindex until then) |
| 404 | Ink | "This page isn't part of the story." |

## Where things live

- `DESIGN.md`: the active design system (tokens, components, motion, rules).
- `docs/`: product and website docs, the source of truth for copy and structure. Start with `docs/README.md`.
  - `docs/product/`: the problem, why existing systems fail, and our approach.
  - `docs/website/`: design direction, brand system, site structure (with a Build spec per part), build plan, reference audit.
  - `docs/new-logo-latest-final/anveli-6a-package/`: the logo package (the source of truth for the mark).
  - `docs/Logo design brief/`: the superseded "anvelli." wordmark, kept for history only.
- `src/app/`: routes, metadata files (`sitemap.ts`, `robots.ts`, share images, icons) and global CSS.
- `src/components/`: `brand/` (symbol, lockup, living mark), `motion/` (GSAP setup, Lenis, reduced motion, pause state, line reveals), `ground/`, `sections/` (one file per homepage part), `product/` (coded product previews), `waitlist/`, `nav/`, `footer/`, `privacy-trust/`, `three/`, `ui/`.
- `src/lib/`: `tokens.ts` (colour, motion, mark geometry) and `example-data.ts` (every sample value, all labelled Example).
- `public/brand/`: the package SVGs and PNGs, icons and the grain tile.
- `design-references/`: the awesome-design-md library used as the format for `DESIGN.md`.
