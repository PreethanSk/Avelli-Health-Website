# Build Plan (Technical)

Status: planned, not started. Updated after the reference audit ([05-reference-audit.md](05-reference-audit.md)) and rebuilt around the **6A Tangent** mark. It explains how the site in [03-site-structure.md](03-site-structure.md) will be built on the existing scaffold.

## 1. Constraints

- **Next.js 16.3.5, React 19.2.8, Tailwind v4** are already installed.
- **Fully static:** `next.config.ts` sets `output: "export"` and `images.unoptimized`. No API routes, server actions, ISR or image optimiser. Forms post to a third-party endpoint from the browser.
- **Read the bundled Next docs first:** as `AGENTS.md` says, this Next version differs from older training data. Before writing code, read the relevant guides in `node_modules/next/dist/docs/01-app/`: fonts, metadata and OG images, static exports, lazy loading (`next/dynamic`), and `LayoutProps` typing (already used in `src/app/layout.tsx`).
- **The logo package is the source of truth for the mark:** [`docs/new-logo-latest-final/anveli-6a-package/`](../new-logo-latest-final/anveli-6a-package/README.md).

## 2. Dependencies to add

| Package | Why |
| --- | --- |
| `gsap`, `@gsap/react` | Scroll story: ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin, CustomEase (all free) |
| `motion` | UI state and gesture: picker, waitlist, menu, carousel, hovers |
| `three`, `@react-three/fiber`, `@react-three/drei` | The 3D rings |
| `lenis` | Smooth scroll, driven by GSAP's ticker |
| `@phosphor-icons/react` | Icons |
| `clsx`, `tailwind-merge` | Class helpers needed by shadcn-style components |
| `leva` (dev) | Rings tuning panel, development only |
| `svgo` (dev) | Strip the embedded metadata from the package SVGs |
| shadcn CLI + `components.json` | Installing registry items (below) |

Not installed: `animejs` (replaced by GSAP), `vanta`, `@shadergradient/react`, `@paper-design/shaders-react` (the living mark replaced the logo moments; the grain tile is exported once from the Paper Shaders playground), liquid-glass-js and the liquid-logo repo. Reasons are in [05-reference-audit.md](05-reference-audit.md).

Fonts: the scaffold already loads **Geist** through `next/font/google`, and it stays (it's the brand face). **Geist Mono is replaced by JetBrains Mono.**

Registry setup in `components.json`:

```json
{
  "registries": {
    "@kokonutui": "https://kokonutui.com/r/{name}.json"
  }
}
```

Add the React Bits and Skiper UI namespaces the same way, copying their registry URLs from each library's install page at the time (they aren't written here because they change). Skiper documents its items as `npx shadcn add @skiper-ui/skiperNN`. React Bits items come in the **TS + Tailwind** variant. Fancy Components and Watermelon items install by URL from their docs. Bklit installs from its own docs.

Only free items are installed (see the audit). Every installed component is restyled to our tokens, loses any glow or gradient border, and has its icons swapped for Phosphor. If a registry component is built on a different engine from the one the section spec names (for example a GSAP-based React Bits menu where the spec says Motion), rebuild it on the named engine and keep only the choreography.

### Licence notes

| Source | Licence | What it means for us |
| --- | --- | --- |
| GSAP | GSAP standard licence (free, including commercial use) | Fine for this site. |
| React Bits | MIT + Commons Clause | We can use the components in the product; we can't resell them as components. |
| Geist, JetBrains Mono | SIL OFL | Free for commercial use. |
| Skiper UI (free), Fancy Components, Bklit, Watermelon | Free; confirm each licence file at install | Record the licence in a comment at the top of each copied file. |
| Kokonut UI, Motion, Lenis, three, R3F, drei, Phosphor | MIT | Fine. |
| liquid-logo repo | PolyForm Shield | Not used. |

## 3. Proposed file structure

```
src/
  app/
    layout.tsx            fonts (Geist, JetBrains Mono), metadata, providers
    page.tsx              homepage: composes sections (Server Component)
    globals.css           Tailwind v4 @theme tokens (from 02-brand-system.md)
    privacy-trust/page.tsx
    privacy/page.tsx
    terms/page.tsx
    not-found.tsx
    sitemap.ts, robots.ts
  components/
    brand/                Symbol (full + optical), Lockup (horizontal + stacked), LivingMark (package port)
    three/                RingsStage, RingsCanvas (client, lazy), ring and fragment shaders, fallbacks
    ground/               GroundLayer (the fixed paper layer), Grain (static overlay)
    sections/             one file per homepage part (Hero, Problem, Rings, ...)
    product/              coded product previews (BaselineChart, SourceChips, PhoneScreens, PurposePicker, RingDiagram)
    waitlist/             WaitlistField, waitlist state
    motion/               gsap.ts (plugin registration, CustomEase tokens), SmoothScroll (Lenis on the GSAP ticker), MotionState (global pause), useReducedMotionSafe
    ui/                   installed registry components after restyling
  lib/
    tokens.ts             z-index scale, breakpoints, motion tokens, mark geometry (R, ring ratios, stroke)
    example-data.ts       all sample values in one place, each marked as example
public/
  images/                 photos and the 3D fallback renders (WebP/AVIF)
  brand/                  package SVGs (after SVGO), favicon.svg, app icons, OG images, grain.webp
DESIGN.md                 root design system (from 02-brand-system.md)
```

Rules:

- `page.tsx` and sections are **Server Components** by default. Anything with motion, scroll or pointer logic is a small `"use client"` leaf.
- GSAP, Motion, Three.js and LivingMark never control the same element. Each animated leaf uses exactly one of them (see [02-brand-system.md](02-brand-system.md) §6, "Library split").
- **One source for the mark's geometry.** `lib/tokens.ts` holds R, the ring ratios (0.725, 0.4625, core 0.225), the stroke (0.075R) and the optical version. The SVG symbol, the living mark, the ring diagrams and the 3D scene all read from it, so the mark can never drift.
- All example numbers live in `lib/example-data.ts`, so they're easy to audit and clearly labelled.

## 4. The 3D rings: technical approach

This is the biggest risk, so it's built and proven first.

**Geometry:**

- **Final rings:** three `TorusGeometry` rings (a thin tube, radius about 0.012R) at R, 0.725R and 0.4625R, each positioned so its lowest point is the shared tangent point, and tilted about the vertical axis through that point (0°, 14°, -10°). The **core** is a sphere of radius 0.225R resting on the same point.
- **Fragments:** about 60 to 120 short arc segments (partial tori), rendered with **one `InstancedMesh`**, so all fragments are a single draw call. Each instance stores a target ring, a target start angle, its arc length, a scatter position and rotation, and a delay.
- The fragments of each ring cover its whole circumference when settled. As a ring's accrual completes, the matching final torus fades in over them and the fragments of that ring fade out, which removes seams.

**Animation:**

- Everything is driven by a few uniforms (vertex shader for fragments, plain transforms for the three final rings):
  - `uAccrue` (0 to 3): 0 means every fragment is scattered; each whole number means one more ring has closed. Within a ring's step, a fragment's progress is `smoothstep(delay, delay + 0.7, local)`, and it travels from its scatter pose to its place on the ring. Rings grow outward from the core as they close, matching the living mark's accrue.
  - `uScatter`: how far apart the loose fragments sit.
  - `uCore` (0 to 1): the core's emissive strength, plus a one-off pulse that travels outward ring by ring.
  - `uBreathe` (0 to 1): how much the finished rings breathe (the package's ±7%, out of phase, radius and centre updated together so they stay tangent). It's multiplied by the global motion state, so Pause motion stops it.
  - `uTime`, `uGroupX`: slow drift and the horizontal offset.
- Scroll progress comes from the ScrollTriggers of parts 2 to 4 (`onUpdate`) and is written into a ref, then copied into the uniforms each frame in `useFrame`. No React re-renders. The full uniform map, with progress windows, is in [03-site-structure.md](03-site-structure.md) §3.1.
- The canvas lives in the sticky `RingsStage` wrapper around parts 2 to 4 and stops rendering (`frameloop="never"`) once the stage is off screen.

**Look:**

- **Rings: glass-like "ice".** The default is a cheap custom shader: an `ice` base at low opacity, a strong fresnel rim, and a faint refraction-like offset of the depth glow behind. This is what liquid-glass-js and React Bits Fluid Glass are references for.
- **Upgrade, if it holds 60fps:** drei `MeshTransmissionMaterial` on the three final rings only (never on the instanced fragments), with low samples and `resolution` 256 to 512. Decided in phase 2 by a side-by-side test, and recorded here.
- **Core:** a solid sphere in `glacier` with a soft emissive glow and no bloom pass.
- **Light and ground:** one cool key light from the top left, low ambient, and the `depth` radial glow as a DOM gradient behind the transparent canvas (not rendered in WebGL). No bloom, no neon, no lens flares.

**Performance budget:**

- The canvas lazy-loads with `next/dynamic` (`ssr: false`) after the hero text has painted, so the LCP is the headline, not WebGL.
- `dpr={[1, 1.5]}`; render on demand when idle; pause when the canvas is off-screen or the tab is hidden.
- Target: 60fps on a mid-range laptop and a WebGL payload under about 200 KB gzipped (three plus scene code).
- Use drei's `PerformanceMonitor` to lower the fragment count, then switch transmission off, if the frame rate drops.
- **The rings canvas is the only WebGL context on the site.** The living mark, ring diagrams and grain are SVG or static images.

**Fallbacks:**

- Four static renders exported from the same scene (fragments, one ring, two rings, the full lit mark) as AVIF/WebP.
- They're used on small screens, when `prefers-reduced-motion` is on, when WebGL is unavailable, and as the OG image source.

**Tuning:** Leva panel in development for fragment count, scatter, tilt angles, rim strength, transmission on or off, colours and timings. Final values are then written into `lib/tokens.ts`.

## 5. The living mark

- `components/brand/LivingMark.tsx` ports the package's `AnveliMark` function to React. It keeps the same levels (core 9, rings 18.5 / 29 / 40, and a 51 ring for the accrue hand-off in a 100 box), the same breathe (±7%, out of phase, about a 7s period), accrue (about 1.8s with the in-out curve) and pulse (about 0.9s, 80ms ring stagger), and the same 0.5s cubic hand-off between states.
- Props: `state` (`"breathe" | "sync" | "added" | "static"`), `size`, `ground` (`"ink" | "paper"`, which picks the colours), `loops` (how many breathe or accrue cycles before it holds still), and `optical` (for 32px and below: it shows the optical symbol and only the pulse, since the rings can't animate that small).
- It's stepped by `gsap.ticker`, not its own `requestAnimationFrame`. It pauses when off screen (IntersectionObserver), when the global motion state is paused, and under reduced motion (where it renders the static symbol).
- Circle attributes are set directly on the SVG elements through refs. No React state per frame.

## 6. Scroll and motion architecture

**GSAP owns scroll; Motion owns UI state.** This follows Greenstack's proven stack (Lenis + GSAP ScrollTrigger + CustomEase + split text).

- **Setup (`components/motion/gsap.ts`, client only):** register ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin and CustomEase once. Create the `anveli.out` and `anveli.inOut` eases there (values in [02-brand-system.md](02-brand-system.md) §6).
- **Lenis on the GSAP ticker (`SmoothScroll`):** create Lenis with `autoRaf: false` and the settings in 02. Then `lenis.on("scroll", ScrollTrigger.update)`, `gsap.ticker.add((time) => lenis.raf(time * 1000))` and `gsap.ticker.lagSmoothing(0)`. Nested scrollers (the mobile sheet, any overflow list) get `data-lenis-prevent`. Anchor links use `lenis.scrollTo(target, { offset: -72 })`.
- **Global motion state (`MotionState`):** one context and a `data-motion="paused"` attribute on `<html>`, set by the Pause motion buttons and stored in `sessionStorage` (try/catch). The hero breathe (`uBreathe` multiplier), the marquee and every LivingMark read it.
- **Ground changes (`GroundLayer`):** the fixed paper layer and the two scrubbed ScrollTriggers in [03-site-structure.md](03-site-structure.md) §2.1. Its midpoint callbacks toggle `data-ground="paper" | "ink"` on `<html>`, which switches the nav variant and the grain blend through CSS.
- **Every GSAP leaf** uses `useGSAP(() => { ... }, { scope: ref })`, so its tweens, ScrollTriggers and SplitText instances are cleaned up on unmount. One `useGSAP` per leaf component.
- **Pinning:** ScrollTrigger pins (`pin: true`, `start: "top top"`) with the lengths in [03-site-structure.md](03-site-structure.md) §2.3. No CSS-sticky pinning, except the rings canvas inside `RingsStage`.
- **Refresh:** call `ScrollTrigger.refresh()` after `document.fonts.ready` and after images above each pin have loaded (their dimensions are set in the markup, so this is a safety net). Horizontal pans use `invalidateOnRefresh: true`.
- **Order:** pinned sections are created top to bottom in the DOM order so their spacing is computed correctly. If any section is created out of order, use `refreshPriority`.
- **Motion's role:** state, layout and gesture only, plus `whileInView` for simple one-off entrances outside pinned parts (part 7 cells). Motion never reads scroll inside pinned parts and never animates an element that GSAP touches.
- **Reduced motion:** `gsap.matchMedia()` with `"(prefers-reduced-motion: no-preference)"` wraps every scroll animation, so none are created when reduced motion is on. The shared `useReducedMotionSafe()` hook handles the Motion side, the 3D fallback and the living marks. When it's on: no pins, final states shown, the marquee static, no Lenis, ground changes instant.
- **Mobile:** GSAP `matchMedia` also splits `(min-width: 768px)` from smaller screens, so each part's mobile choreography in 03 is created only on mobile.
- **Forbidden:** `window.addEventListener('scroll')`, React state for scroll values, animating layout properties, `background-color` scrubs (use an opacity layer), and two engines on one element.

## 7. Accessibility checklist

- Colour contrast AA or better everywhere. Body text on ink uses `ice` or `ice-60`; on paper, `ink-reverse` or `slate`. Accent text on paper uses `harbor-deep`, never `harbor` (3.3:1 is for graphics only).
- Real headings in order; one `h1` per page.
- Every interactive preview (purpose picker, phone carousel, search demo) is keyboard-operable, with visible focus rings (`glacier` on ink, `harbor` on paper).
- Every ambient loop can be paused from the nav's Pause motion button, and nothing moves on its own for more than 5 seconds without it.
- The 3D canvas is `aria-hidden`, with the meaning told in the text beside it. Decorative living marks are `aria-hidden`; the nav lockup is a link named "anveli home".
- Form fields have visible labels; errors are announced (`aria-live="polite"`).
- The lit/dimmed state in the purpose picker is also written in text.
- Touch targets are at least 44px.

## 8. Build order

| Phase | Work | Done when |
| --- | --- | --- |
| 0. Rename and brand files | `package.json` name set to `anveli-website`; copy the 6A package SVGs into `public/brand/` and run SVGO; generate the favicon set and app icons from the package; mark `docs/Logo design brief/` as superseded; owner renames the repo folder and GitHub repo | No "avelli", "anvelli" or "anveli." period wordmark left outside git history and the archived brief |
| 1. Foundation | Root `DESIGN.md`; `@theme` tokens in `globals.css`; Geist and JetBrains Mono through `next/font`; metadata; Symbol, Lockup and LivingMark (all three states checked against the package's `anveli-living-mark.html` side by side); `gsap.ts`, Lenis on the GSAP ticker, `MotionState`, `GroundLayer`, reduced-motion hook and `gsap.matchMedia` setup; motion tokens and mark geometry in `lib/tokens.ts`; z-index scale; grain tile and the `Grain` overlay | A blank page renders the lockup and living mark correctly on both grounds, with grain; a test pin scrubs smoothly with Lenis; the ground change works both ways |
| 2. Rings prototype | Scene, fragments, shaders, `RingsStage`, the uniform map from 03 §3.1, fallbacks, performance check; the custom ice shader against `MeshTransmissionMaterial` side by side, with the choice recorded in §4 | 60fps on desktop, clean fallback on phone and reduced motion; the finished 3D mark matches the package's proportions exactly |
| 3. Story core | Parts 1 to 4 (nav, hero, problem, the rings) | The opening feels right end to end |
| 4. Product parts | Parts 5 to 11 (everyday life, verbs, bento, continuity, phone, insurance, protect), including both ground changes | Every preview is real, keyboard-usable and labelled Example |
| 5. Close | Parts 12 and 13; final photos for part 5 when they arrive | Full homepage complete |
| 6. Waitlist | Loops or Formspree account, field states (with the living mark), follow-up question | Test entries arrive in the dashboard |
| 7. Other pages | `/privacy-trust`, `/privacy`, `/terms`, 404, sitemap, robots, OG images | All routes build statically |
| 8. Review | `web-design-guidelines` audit; taste-skill pre-flight; accessibility review; Lighthouse | Checks in section 9 pass |

## 9. Verification

- **Viewports:** check in the Browser pane at 1440×900, 1280×720 (hero and CTA visible without scrolling), 768×1024 and 375×812.
- **Reduced motion:** forced on; every section is readable and nothing is pinned, looping or breathing.
- **Performance:** CPU throttled 4×; the rings lower their fragment count (then drop transmission) instead of stuttering.
- **Static build:** `npm run build` produces `out/`; serve it statically and click through every route and anchor.
- **Lighthouse targets:** LCP under 2.5s, CLS under 0.1, INP under 200ms, Accessibility 95 or higher, SEO 100.
- **Waitlist:** valid, invalid, duplicate and offline cases all behave as specified.
- **Copy audit:** search the source for `—`, `–`, "Avelli", "anvelli", "anveli." (the old period wordmark), "Figtree", "teal", "seamless", "elevate"; confirm every sample value is labelled Example; confirm the disclaimer is in the footer.
- **Mark fidelity:** every symbol, diagram and 3D ring keeps the tangent rule (all circles touch at one point at the bottom), uses the package ratios, and switches to the optical symbol at 32px and below. Compare the LivingMark against the package's HTML in all three states.
- **Taste pre-flight:** eyebrow count ≤ 4, one marquee, one paper chapter, no duplicate CTA labels, no three equal feature cards, no centred hero over a dark mesh.
- **Spec match:** walk each part against its Build spec in 03: pin lengths, progress windows, eases and states. Any deliberate change is written back into 03.
- **Scroll engine:** with Lenis on, pins don't jitter or jump at their start and end; anchor links land 72px below the nav; resizing the window recalculates the horizontal pan; the mobile sheet scrolls on its own and the page doesn't.
- **One engine per element:** in the source, no element is targeted by both GSAP and Motion; `animejs` and `@paper-design/shaders-react` are not in `package.json`.
- **Motion control:** Pause motion stops the hero breathe, the marquee and every living mark, and the choice survives navigation within the session. Exactly one WebGL context exists (check in DevTools).
- **Grain:** present on ink and paper at the right strength, gone under `prefers-reduced-transparency` and in print; body text still passes AA with it on.

## 10. Open decisions

| Decision | Options | Needed by |
| --- | --- | --- |
| Waitlist provider | Loops (nicer email tooling) or Formspree (simplest) | Phase 6 |
| Hosting | Any static host (Vercel, Netlify, Cloudflare Pages) | Phase 7 |
| Domain | to decide | Phase 7 |
| Photography source | Generated from the prompts in 03, or licensed stock | Phase 5 |
| Analytics | None, or a privacy-friendly option (for example Plausible) that matches our privacy promise | Phase 7 |
| Legal text | Privacy policy and terms from a lawyer | Before public launch |
| Light/dark toggle | Not in phase 1 (both grounds are part of the story); revisit after launch | Later |
| Ring material | Custom ice shader (default) or `MeshTransmissionMaterial` on the final rings | Phase 2 |
| `ink-2` and `paper-2` exact values | The proposed `#12181C` and `#E3E9EC`, checked in context | Phase 1 |
| Paid component libraries | None for now (free only). Revisit only if a section can't reach its spec with free sources | As needed |
