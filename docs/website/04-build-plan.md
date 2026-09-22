# Build Plan (Technical)

Status: planned, not started. Updated after the reference audit ([05-reference-audit.md](05-reference-audit.md)). It explains how the site in [03-site-structure.md](03-site-structure.md) will be built on the existing scaffold.

## 1. Constraints

- **Next.js 16.3.5, React 19.2.8, Tailwind v4** are already installed.
- **Fully static:** `next.config.ts` sets `output: "export"` and `images.unoptimized`. No API routes, server actions, ISR or image optimiser. Forms post to a third-party endpoint from the browser.
- **Read the bundled Next docs first:** as `AGENTS.md` says, this Next version differs from older training data. Before writing code, read the relevant guides in `node_modules/next/dist/docs/01-app/`: fonts, metadata and OG images, static exports, lazy loading (`next/dynamic`), and `LayoutProps` typing (already used in `src/app/layout.tsx`).

## 2. Dependencies to add

| Package | Why |
| --- | --- |
| `gsap`, `@gsap/react` | Scroll story: ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin, CustomEase (all free) |
| `motion` | UI state and gesture: picker, waitlist, menu, carousel, hovers, logo dot |
| `three`, `@react-three/fiber`, `@react-three/drei` | The ribbon |
| `lenis` | Smooth scroll, driven by GSAP's ticker |
| `@paper-design/shaders-react` | The two logo moments. **Pin the exact version** (no `^`): it's 0.0.x and ships breaking changes. |
| `@phosphor-icons/react` | Icons |
| `clsx`, `tailwind-merge` | Class helpers needed by shadcn-style components |
| `leva` (dev) | Ribbon tuning panel, development only |
| shadcn CLI + `components.json` | Installing registry items (below) |

Not installed: `animejs` (replaced by GSAP), `vanta`, `@shadergradient/react`, liquid-glass-js and the liquid-logo repo. Reasons are in [05-reference-audit.md](05-reference-audit.md).

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
| Paper Shaders | Apache 2.0 | Keep the licence notice if code is copied rather than installed. |
| Skiper UI (free), Fancy Components, Bklit, Watermelon | Free; confirm each licence file at install | Record the licence in a comment at the top of each copied file. |
| Kokonut UI, Motion, Lenis, three, R3F, drei, Phosphor | MIT | Fine. |
| liquid-logo repo | PolyForm Shield | Not used. |

## 3. Proposed file structure

```
src/
  app/
    layout.tsx            fonts, metadata, providers
    page.tsx              homepage: composes sections (Server Component)
    globals.css           Tailwind v4 @theme tokens
    privacy-trust/page.tsx
    privacy/page.tsx
    terms/page.tsx
    not-found.tsx
    sitemap.ts, robots.ts
  components/
    brand/                Logo, Icon, AnimatedDot
    three/                RibbonStage, RibbonCanvas (client, lazy), ribbon shaders, fallbacks
    shaders/              Grain (static overlay), LogoMoment (Paper Shaders, lazy)
    sections/             one file per homepage part (Hero, Problem, Braid, ...)
    product/              coded product previews (BaselineChart, SourceChips, PhoneScreens, PurposePicker)
    waitlist/             WaitlistField, waitlist state
    motion/               gsap.ts (plugin registration, CustomEase tokens), SmoothScroll (Lenis on the GSAP ticker), useReducedMotionSafe
    ui/                   installed registry components after restyling
  lib/
    tokens.ts             z-index scale, breakpoints, motion tokens (eases, durations, staggers, springs)
    example-data.ts       all sample values in one place, each marked as example
public/
  images/                 photos and ribbon fallback renders (WebP/AVIF)
  brand/                  logo SVGs (including the outlined wordmark for the shader), icons, OG images, grain.webp
DESIGN.md                 root design system (from 02-brand-system.md)
```

Rules:

- `page.tsx` and sections are **Server Components** by default. Anything with motion, scroll or pointer logic is a small `"use client"` leaf.
- GSAP, Motion, Three.js and Paper Shaders never control the same element. Each animated leaf uses exactly one of them (see [02-brand-system.md](02-brand-system.md) §6, "Library split").
- All example numbers live in `lib/example-data.ts`, so they're easy to audit and clearly labelled.

## 4. The ribbon: technical approach

This is the biggest risk, so it's built and proven first.

**Geometry:**

- One central spline (`CatmullRomCurve3`) defines the final braided path.
- **N strands** (about 48 to 96 on desktop, fewer on low-power devices) are thin flat slats rendered with **one `InstancedMesh`**, so the whole ribbon is a single draw call.
- Each slat instance has a strand index and a position along the curve.

**Animation:**

- Everything happens in the **vertex shader**, driven by a few uniforms:
  - `uBraid` (0 to 1): 0 means strands are scattered by per-strand noise offsets; 1 means they're packed around the spline and twisted into the ribbon.
  - `uTwist`, `uTime`: slow idle drift.
  - `uCore` (0 to 1): how far the teal core has lit along the ribbon.
  - `uDot` (0 to 1): the position of the person dot along the thread.
- Scroll progress comes from the ScrollTriggers of parts 2 to 4 (`onUpdate`) and is written into a ref, then copied into the uniforms each frame in `useFrame`. No React re-renders. The full uniform map, with progress windows, is in [03-site-structure.md](03-site-structure.md) §3.1.
- Extra uniforms from that map: `uGroupX` (horizontal offset of the whole ribbon) and `uScatter` (how far apart the loose strands sit). Each strand also gets a random braid delay (0 to 0.25) so they arrive one after another.
- The canvas lives in the sticky `RibbonStage` wrapper around parts 2 to 4 and stops rendering (`frameloop="never"`) once the stage is off screen.

**Look:**

- Matte, paper-toned material (a simple lit shader or `MeshStandardMaterial` with high roughness), soft ambient light plus one warm key light, and a tinted contact shadow. A thin teal emissive core. No bloom or neon.

**Performance budget:**

- The canvas lazy-loads with `next/dynamic` (`ssr: false`) after the hero text has painted, so the LCP is the headline, not WebGL.
- `dpr={[1, 1.5]}`; render on demand when idle; pause when the canvas is off-screen or the tab is hidden.
- Target: 60fps on a mid-range laptop and a WebGL payload under about 200 KB gzipped (three plus scene code).
- Use drei's `PerformanceMonitor` to reduce strand count if the frame rate drops.
- **Other WebGL on the page:** at most **one** extra context alive besides the ribbon at any time. The footer logo moment mounts only when the footer is in view (the ribbon has stopped by then) and unmounts after it settles. The grain is a static image with no runtime shader.
- `@paper-design/shaders-react` is loaded with `next/dynamic` (`ssr: false`) only inside `LogoMoment`, so it never lands in the first-load bundle.

**Fallbacks:**

- Three static renders exported from the same scene (loose, braiding, braided) as AVIF/WebP.
- They're used on small screens, when `prefers-reduced-motion` is on, when WebGL is unavailable, and as the OG image source.

**Tuning:** Leva panel in development for strand count, twist, noise, colours and timings. Final values are then written into `lib/tokens.ts`.

## 5. Scroll and motion architecture

**GSAP owns scroll; Motion owns UI state.** This follows Greenstack's proven stack (Lenis + GSAP ScrollTrigger + CustomEase + split text).

- **Setup (`components/motion/gsap.ts`, client only):** register ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin and CustomEase once. Create the `anveli.out` and `anveli.inOut` eases there (values in [02-brand-system.md](02-brand-system.md) §6).
- **Lenis on the GSAP ticker (`SmoothScroll`):** create Lenis with `autoRaf: false` and the settings in 02. Then `lenis.on("scroll", ScrollTrigger.update)`, `gsap.ticker.add((time) => lenis.raf(time * 1000))` and `gsap.ticker.lagSmoothing(0)`. Nested scrollers (the mobile sheet, any overflow list) get `data-lenis-prevent`. Anchor links use `lenis.scrollTo(target, { offset: -72 })`.
- **Every GSAP leaf** uses `useGSAP(() => { ... }, { scope: ref })`, so its tweens, ScrollTriggers and SplitText instances are cleaned up on unmount. One `useGSAP` per leaf component.
- **Pinning:** ScrollTrigger pins (`pin: true`, `start: "top top"`) with the lengths in [03-site-structure.md](03-site-structure.md) §2.2. No CSS-sticky pinning, except the ribbon canvas inside `RibbonStage`.
- **Refresh:** call `ScrollTrigger.refresh()` after `document.fonts.ready` and after images above each pin have loaded (their dimensions are set in the markup, so this is a safety net). Horizontal pans use `invalidateOnRefresh: true`.
- **Order:** pinned sections are created top to bottom in the DOM order so their spacing is computed correctly. If any section is created out of order, use `refreshPriority`.
- **Motion's role:** state, layout and gesture only, plus `whileInView` for simple one-off entrances outside pinned parts (part 7 cells). Motion never reads scroll inside pinned parts and never animates an element that GSAP touches.
- **Reduced motion:** `gsap.matchMedia()` with `"(prefers-reduced-motion: no-preference)"` wraps every scroll animation, so none are created when reduced motion is on. The shared `useReducedMotionSafe()` hook handles the Motion side, the ribbon fallback and the logo moment. When it's on: no pins, final states shown, the marquee static, no Lenis.
- **Mobile:** GSAP `matchMedia` also splits `(min-width: 768px)` from smaller screens, so each part's mobile choreography in 03 is created only on mobile.
- **Forbidden:** `window.addEventListener('scroll')`, React state for scroll values, animating layout properties, `background-color` scrubs (use an opacity layer), and two engines on one element.

## 6. Accessibility checklist

- Colour contrast AA or better everywhere; body text on paper uses `ink` or `ink-60` only.
- Real headings in order; one `h1` per page.
- Every interactive preview (purpose picker, phone carousel, search demo) is keyboard-operable, with visible teal focus rings.
- The marquee has a Pause button; animations longer than 5 seconds can be stopped.
- The 3D canvas is `aria-hidden`, with the meaning told in the text beside it.
- Form fields have visible labels; errors are announced (`aria-live="polite"`).
- The lit/dimmed state in the purpose picker is also written in text.
- Touch targets are at least 44px.

## 7. Build order

| Phase | Work | Done when |
| --- | --- | --- |
| 0. Rename | `package.json` name set to `anveli-website`; `docs/README.md` title; rename the logo folder to `anveli-brand` and the CSS to `anveli-logo.css`; regenerate lockups as "anveli."; owner renames the repo folder and GitHub repo | No "avelli" or "anvelli" left outside git history |
| 1. Foundation | Root `DESIGN.md`; `@theme` tokens in `globals.css`; Figtree and JetBrains Mono through `next/font`; metadata; Logo, Icon and AnimatedDot; `gsap.ts` (plugins, CustomEase tokens), Lenis on the GSAP ticker, reduced-motion hook and `gsap.matchMedia` setup; motion tokens in `lib/tokens.ts`; z-index scale; grain tile exported from Paper Shaders and the `Grain` overlay | A blank page renders the brand correctly in both grounds, with grain, and a test pin scrubs smoothly with Lenis |
| 2. Ribbon and shader prototypes | Ribbon: scene, shaders, `RibbonStage`, the uniform map from 03 §3.1, fallbacks, performance check. Logo moment: `LiquidMetal` against `Heatmap` side by side on ink with the outlined wordmark; pick one and record it in 02 §1 | 60fps on desktop, clean fallback on phone and reduced motion; the logo moment settles invisibly into the flat mark |
| 3. Story core | Parts 1 to 4 (nav, hero, problem, braid) | The opening feels right end to end |
| 4. Product parts | Parts 6 to 11 (verbs, bento, loop, phone, insurance, protect) | Every preview is real, keyboard-usable and labelled Example |
| 5. Close | Parts 12 and 13, then Part 5 once photos arrive | Full homepage complete |
| 6. Waitlist | Loops or Formspree account, field states, follow-up question | Test entries arrive in the dashboard |
| 7. Other pages | `/privacy-trust`, `/privacy`, `/terms`, 404, sitemap, robots, OG images | All routes build statically |
| 8. Review | `web-design-guidelines` audit; taste-skill pre-flight; accessibility review; Lighthouse | Checks in section 8 pass |

## 8. Verification

- **Viewports:** check in the Browser pane at 1440×900, 1280×720 (hero and CTA visible without scrolling), 768×1024 and 375×812.
- **Reduced motion:** forced on; every section is readable and nothing is pinned or looping.
- **Performance:** CPU throttled 4×; the ribbon lowers its strand count instead of stuttering.
- **Static build:** `npm run build` produces `out/`; serve it statically and click through every route and anchor.
- **Lighthouse targets:** LCP under 2.5s, CLS under 0.1, INP under 200ms, Accessibility 95 or higher, SEO 100.
- **Waitlist:** valid, invalid, duplicate and offline cases all behave as specified.
- **Copy audit:** search the source for `—`, `–`, "Avelli", "anvelli", "seamless", "elevate"; confirm every sample value is labelled Example; confirm the disclaimer is in the footer.
- **Taste pre-flight:** eyebrow count ≤ 4, one marquee, one theme switch, no duplicate CTA labels, no three equal feature cards.
- **Spec match:** walk each part against its Build spec in 03: pin lengths, progress windows, eases and states. Any deliberate change is written back into 03.
- **Scroll engine:** with Lenis on, pins don't jitter or jump at their start and end; anchor links land 72px below the nav; resizing the window recalculates the horizontal pan; the mobile sheet scrolls on its own and the page doesn't.
- **One engine per element:** in the source, no element is targeted by both GSAP and Motion; `animejs` is not in `package.json`.
- **Logo moments:** the footer plays once per load and the 404 replays only on hover or tap; both end on a frame identical to the flat mark; the WebGL context count never exceeds two (check in DevTools).
- **Grain:** present on paper and ink at the right strength, gone under `prefers-reduced-transparency` and in print; body text still passes AA with it on.

## 9. Open decisions

| Decision | Options | Needed by |
| --- | --- | --- |
| Waitlist provider | Loops (nicer email tooling) or Formspree (simplest) | Phase 6 |
| Hosting | Any static host (Vercel, Netlify, Cloudflare Pages) | Phase 7 |
| Domain | to decide | Phase 7 |
| Photography source | Generated from the prompts in 03, or licensed stock | Phase 5 |
| Analytics | None, or a privacy-friendly option (for example Plausible) that matches our privacy promise | Phase 7 |
| Legal text | Privacy policy and terms from a lawyer | Before public launch |
| Dark mode | Not in phase 1 (the brand uses both grounds in the story); revisit after launch | Later |
| Logo moment shader | `LiquidMetal` (default) or `Heatmap` | Phase 2 |
| Warmer ink | Keep `#0B0C0D`, or move toward Optikka's warm brown ink (needs the logo package updated too) | Before phase 1 if wanted |
| Paid component libraries | None for now (free only). Revisit only if a section can't reach its spec with free sources | As needed |
