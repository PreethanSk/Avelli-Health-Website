# Reference Audit

Status: complete, September 2026, and **re-checked after the 6A Tangent logo was chosen** (ink-first, glass-like rings, the living mark). It covers every inspiration source, library and tool the owner has shared. The build used every "Use" item; per-file sources and licences are in each component's header comment and summarised in [04-build-plan.md §11](04-build-plan.md#11-as-built-september-2026).

This is the one place that answers "did we look at X, and what did we take from it?" The decisions here feed [01-design-direction.md](01-design-direction.md) (why), [02-brand-system.md](02-brand-system.md) (tokens and motion rules), [03-site-structure.md](03-site-structure.md) (the per-section build specs) and [04-build-plan.md](04-build-plan.md) (dependencies and architecture).

## 1. Decisions this audit locked

| Decision | Result |
| --- | --- |
| The mark | **6A Tangent**: four circles touching one point, a Geist wordmark with no period, ink-first, an ice/glacier/harbor palette, and a living mark (breathe, accrue, pulse). Package: [`../new-logo-latest-final/anveli-6a-package/`](../new-logo-latest-final/anveli-6a-package/README.md). |
| Ground | **Ink primary** with one soft depth glow, and **one cool-paper chapter** (parts 5 to 10). |
| Hero object | **The mark in 3D**: arc fragments accrue into glass-like rings around the core. The earlier braided "thread" is retired. |
| Animation stack | **GSAP + Motion.** GSAP (ScrollTrigger, SplitText, DrawSVG, MotionPathPlugin, CustomEase) runs the scroll story. Motion runs UI state. Lenis runs on GSAP's ticker. **anime.js is dropped.** react-three-fiber renders the rings only. The **LivingMark** (a port of the package script) animates the logo. |
| Logo motion | **The living mark only.** The planned Paper Shaders logo moments are dropped. |
| Paid sources | **Free only.** Paid tiers (Skiper UI Pro, GetLayers, React Bits Pro, deck.gallery Pro) and Mobbin are visual references, never dependencies. |
| Texture | **Grain only**: one static tile, exported once. No animated backgrounds, no ambient gradients beyond the one depth glow, no interface glass. |

Verdict key: **Use** means we install or copy code from it. **Reference only** means we study it and build our own version. **Skip** means we leave it out, with the reason stated.

## 2. The two anchor sites, measured

Both were inspected live in September 2026, with their tech and type measured from the page.

### Optikka ([optikka.com](https://optikka.com))

| What | Measured |
| --- | --- |
| Stack | Astro 4.9, Lenis smooth scroll. No global GSAP or Three found (bundled scripts). |
| Structure | The whole page is **one ~11,500px section** containing a pinned WebGL scene (4 canvases). The object transforms as you scroll and the copy steps past it. There is no conventional stack of sections. |
| Display type | PP Neue Montreal, about 97px, weight 500, letter-spacing -0.03em, line-height 1.07. |
| Labels | JetBrains Mono, uppercase, small. This is the same mono we use. |
| Ground | `rgb(230, 217, 204)`, a warm sand. |
| Text colour | Warm brown ink (`rgb(68, 50, 24)` and `rgb(99, 82, 58)`), never pure black. |
| Accent | `rgb(253, 67, 25)` orange, used on one phrase ("revenue potential"). |
| Header | Fixed, 48px, transparent: logo on the left, three mono links spread across. |
| Copy rhythm | Large statement bottom-left; a small mono label top-left; a "SCROLL DOWN" cue on the right. |

**Still useful after 6A:** the single-object scroll scene (now our 3D mark; its object is even a ring-like form), the pinned-stage structure, the display type metrics (Geist 500 at -0.035em sits close to its numbers), mono labels, bottom-left statements and a quiet fixed header.

**No longer relevant:** its warm sand and brown palette (ours now comes from the 6A package). Still left out: the orange accent, the loader, the "SCROLL DOWN" cue and the B2B tone.

### Greenstack ([greenstack.zajno.com](https://greenstack.zajno.com))

| What | Measured |
| --- | --- |
| Stack | Webflow, **Lenis 1.2.3, GSAP 3.12 with ScrollTrigger and CustomEase**, SplitType for text, a custom canvas rain effect, 2 background videos. |
| Type | Switzer. |
| Palette | Cool grey-teal grounds (`rgb(234, 242, 243)`, `rgb(218, 231, 233)`) with deep navy text (`rgb(31, 38, 51)`). |
| Structure | A number-counter preloader, then a huge "GREEN STACK®" wordmark that later sits in the nav, a full-bleed cinematic media moment, numbered editorial paragraphs, and a single "Book a demo" CTA. |
| Page height | About 6,000px. |

**Still useful after 6A, and more so:** its cool grey-blue palette is now close to ours (`#EEF2F4` paper, `#0E1A22` reverse ink), and it proves cool tones can feel human with good photography. Also the lockup that shrinks into the nav, the full-bleed photo moment, calm left-aligned paragraphs, a single CTA, and the **Lenis + GSAP ScrollTrigger + CustomEase + split text** stack.

**Left out:** the preloader, big counters ("471k+ farms"), repeated placeholder paragraphs, and the rain effect.

## 3. Libraries and component sources

| Source | What it is | Licence / cost | Verdict | Exactly what we take (after 6A) | Where |
| --- | --- | --- | --- | --- | --- |
| [GSAP](https://github.com/greensock/gsap) | Animation engine, v3.15, all plugins free since the Webflow acquisition. | Free for commercial use (GSAP standard licence, not MIT). | **Use** | `gsap`, `@gsap/react` (`useGSAP`), ScrollTrigger, SplitText, **DrawSVG** (every ring diagram draws from its tangent point), **MotionPathPlugin** (the core travelling the baseline and the part 8 loop), CustomEase. | Scroll story, parts 1 to 8, 10 to 12, ground changes, `/privacy-trust`. |
| [Lenis](https://github.com/darkroomengineering/lenis) | Smooth scroll that wraps native scroll. Used by both anchor sites. | MIT | **Use** | `lenis` with `lenis/react` (`ReactLenis`), driven by the GSAP ticker. `data-lenis-prevent` on nested scrollers. | Whole site. |
| [motion.dev](https://motion.dev) | React animation (`motion/react`). | MIT | **Use** | Springs, `layout`, `AnimatePresence`, `whileInView` for simple in-view states, drag. **No `useScroll` in pinned story parts**: GSAP owns scroll. | Privacy picker, waitlist, mobile menu, phone carousel, bento, 404 ring. |
| [anime.js](https://animejs.com) v4 | Animation engine with drawables, motion paths and text splitting. | MIT | **Skip (dropped)** | Nothing. GSAP covers `createDrawable` (DrawSVG), `createMotionPath` (MotionPathPlugin), `splitText` (SplitText) and `onScroll` (ScrollTrigger). The 6A brief listed anime.js for another direction (6B), not ours. | n/a |
| [react-three-fiber](https://github.com/pmndrs/react-three-fiber) + drei + three | React renderer for Three.js. | MIT | **Use (more central now)** | `Canvas`, `useFrame`, instanced fragments, drei `PerformanceMonitor`, and drei `MeshTransmissionMaterial` as the optional glass upgrade for the three final rings. The 6A package itself says the mark "lives in R3F depth". | The 3D rings (parts 2 to 4), fallback renders, OG image. |
| Logo package living mark | The package's `AnveliMark` script: breathe, accrue, pulse. | Ours | **Use** | Ported to `LivingMark.tsx`, stepped by GSAP's ticker. | Nav signature, phone screen, waitlist, footer finale, 404. |
| [Paper Shaders](https://github.com/paper-design/shaders) | Zero-dependency canvas shaders (Paper Texture, Grain Gradient, Liquid Metal, Heatmap and more). | Apache 2.0 | **Use once, offline** | Export the static grain tile from its playground. **No runtime package**: the living mark replaced the logo moments. | `public/brand/grain.webp`. |
| [liquid-logo](https://github.com/paper-design/liquid-logo) | A demo app that turns a logo into liquid metal. | **PolyForm Shield 1.0.0** (non-compete licence) | **Skip** | Nothing. Chrome liquid doesn't fit an ice-glass mark, and the licence is restrictive. | n/a |
| [liquid-glass-js](https://github.com/dashersw/liquid-glass-js) | WebGL2 refraction "glass" containers and buttons. | MIT | **Reference only (changed)** | Not installed: one commit, no npm package, no React, and html2canvas page capture. Now useful as a **look reference for the rings' material**: its separate edge, rim and base refraction layers are exactly what the custom ice shader imitates. Interface glass is still banned. | Rings material (phase 2). |
| [ShaderGradient](https://github.com/ruucm/shadergradient) | Animated 3D gradient backgrounds. | MIT | **Skip** | It needs its own R3F canvas plus `camera-controls`, a second 3D setup for a gradient. Our only glow is one static `depth` radial gradient in CSS. (The 6A brief listed it for another direction, 6D.) | n/a |
| [Vanta](https://github.com/tengbao/vanta) | Animated WebGL backgrounds (waves, fog, birds, clouds, topology). | MIT | **Skip** | The three r134 era, a global `THREE`, and 2018-style animated backgrounds that would compete with the mark. | n/a |
| [React Bits](https://github.com/DavidHDev/react-bits) | 200+ animated components in 4 variants, installed by the shadcn or jsrepo CLI. | MIT + Commons Clause (use in a product is fine; no reselling components). Free tier only. | **Use (selectively)** | **Scroll Reveal** (part 3 word reveal), **Split Text / Masked Heading** (reference for the hero line mask), **Staggered Menu** (mobile menu choreography), **Hold Button** (part 11), **Gradual Blur** (reference for the nav plate), and new after 6A: **Fluid Glass** as a reference for setting up a drei transmission material in R3F (for the rings). The Threads reference is dropped with the thread. | Parts 1, 3, 4, 11. |
| React Bits (rest) | Neon and glow backgrounds (Strands, Aurora, Plasma, Hyperspeed, Galaxy, Lightning, Liquid Chrome, Ballpit, Dither), Magic Rings, cursor toys. | as above | **Skip** | Glow, neon and cursor effects are banned. Any ring effect (Magic Rings included) is off-limits unless it follows the mark's tangent rule. | n/a |
| [Skiper UI](https://skiper-ui.com) | Uncommon shadcn components on Motion and Tailwind, `npx shadcn add @skiper-ui/skiperNN`. | Free tier plus Pro ($129) and Exclusive ($549). **Free only.** Confirm the licence at install. | **Use (free items)** | **skiper41** Progressive Blur (nav plate), **skiper58** Text roll navigation (nav link hover), **skiper19** SVG follow scroll (reference for the part 6 baseline and rings), **skiper16 / skiper17** Card stack scroll (reference for part 10), **skiper34** Scroll images reveal 003 (reference for part 5), **skiper48** Card swipe carousel (part 9), **skiper106** Smooth caret input (waitlist field), **skiper66** SVG clip path mask (reference for the hero line mask). | Parts 1, 2, 5, 6, 9, 10, waitlist. |
| Skiper UI (rest) | Pro components, preloaders, "crazy hero" effects, web3 widgets. | Pro is paid | **Reference only / Skip** | Pro items can be looked at, never installed. Preloaders are skipped because they delay content. | n/a |
| [Fancy Components](https://www.fancycomponents.dev) | Free React + Motion + Tailwind micro-interactions. | Open source, free for commercial use (confirm the licence file at install). | **Use (selectively)** | **Marquee Along SVG Path** (part 12, now along the top arc of a large ring), **Sticky Footer** (part 13 reveal), **Vertical Cut Reveal** (reference for the hero line mask), **Parallax Floating** (part 3 fragment labels, adapted to scroll), **Typewriter** (part 7 search demo), **Underline Animation** (text links). | Parts 2, 3, 7, 12, 13, links. |
| Fancy (rest) | Gravity, Elastic Line, Screensaver, Pixel Trail, Gooey filter, Scramble text and similar. | as above | **Skip** | Playful physics and scrambles don't fit a calm health brand. | n/a |
| [ThreeUI](https://threeui.com) | Three.js components, templates and shaders (by Meng To), mostly vanilla. | Community items free; premium paid. | **Reference only** | For the rings scene: "Predictive Arc" (arc-based motion, for our fragments) and "Structure Flow: Orbital Sphere" (worth checking for a core with structure around it; only its name was seen during the audit, so review the preview first). "Ribbon Field" is no longer relevant. Nothing is copied. | Rings prototype (phase 2). |
| [Kokonut UI](https://kokonutui.com) | shadcn registry built on Motion. | MIT | **Use** | `type-writer` (fallback for part 7), `hold-button` (fallback for part 11), `smooth-tab` (fallback for part 11 tabs), `smooth-drawer` (mobile menu fallback), `file-upload` (later, for an app-like preview). | Parts 7, 11, mobile menu. |
| Watermelon UI | 850+ shadcn registry items plus an MCP. | Free registry | **Use** | `fluid-tabs` (part 11 tabs), `card-swipe` (fallback for part 9), `floating-input` (label behaviour reference for the waitlist). | Parts 9, 11, waitlist. |
| Bklit UI | Line, area and live charts. | Free; confirm the licence at install | **Use** | Line chart with a baseline band in `harbor`, out-of-range point in `amber` (part 7 cell 1). | Part 7. |

## 4. Inspiration galleries and tools

| Source | What it is | Cost | Verdict | What we take (after 6A) |
| --- | --- | --- | --- | --- |
| [GetLayers](https://www.getlayers.ai) | A library of copy-and-paste prompts for AI coding tools: templates, 3D scenes, sections, backgrounds, gradients, plus an MCP. | Paid (early-access sale $129; full price $359) | **Reference only** | Now more relevant: its 3D scene previews ("Orb", "Pixel Glass", "Halcyon Gate", "Epoxy Drift"; only the names were seen during the audit) are worth reviewing for how glassy forms are lit. We don't buy it and we don't paste prompts. |
| [deck.gallery](https://www.deck.gallery) | 100+ full brand decks: brand guidelines, impact reports, pitch decks. | Free browsing; Pro is $12/month | **Reference only** | Brand-guideline decks for laying out the root `DESIGN.md` around a symbol-led identity. Impact reports (On 2024, Lululemon 2023, Nike FY22) for the editorial layout of `/privacy-trust`. |
| [motionsites.ai](https://motionsites.ai) | Motion and background ideas. | Free | **Reference only** | Ideas for dark, object-first hero motion. No copied prompts, and no animated backgrounds. |
| [styles.refero.design](https://styles.refero.design) | DESIGN.md examples. | Free | **Reference only** | Token and component-spec format for the root `DESIGN.md`, especially dark-first systems with one accent. |
| [Mobbin](https://mobbin.com) | App screen library. | Needs a login | **Reference only** | Whoop, Oura, Bevel, Ultrahuman and Apple Health Records screens for the part 9 phone screens, which now use the app's dark UI. Also sync, import and "record added" patterns in real apps, to place the living mark's states well. |
| awesome-design-md (`design-references/`) | 60+ brand DESIGN.md files. | MIT | **Use (format)** | The format of our root `DESIGN.md`. The closest systems changed with 6A: **`apple`** (alternating dark and light chapters around one object), **`x.ai`** (a calm near-black canvas, pill outlines, one restrained gradient) and **`nvidia`** (dark chapters around a light body, like our one paper chapter). `elevenlabs` is no longer the closest. |
| taste skill (`.claude/skills/design-taste-frontend`) | Design rules and pre-flight checks. | n/a | **Use (process)** | The dials, anti-slop bans, and its GSAP skeletons: §5.A sticky-stack (part 10) and §5.B horizontal pan (part 6). It recommends Geist over Inter for display, which matches the package. Two rules matter more now: don't build a "centred hero over a dark mesh" (our hero is asymmetric with one radial glow) and keep glass purposeful (only inside the 3D rings). |
| image-to-code skill | Image-first build workflow. | n/a | **Use (process)** | Section reference images generated externally before each part is built, using the updated prompt rules in 03 §7 (ink or cool paper, the tangent mark, Geist, no neon). |
| web-design-guidelines (Vercel) | UI and accessibility audit. | n/a | **Use (process)** | The final audit in phase 8, with extra attention to contrast on ink and the Pause motion control. |

## 5. Market references

Bevel, Function Health, Superpower, Whoop, Ultrahuman, Eight Sleep and Oura are covered in [01-design-direction.md](01-design-direction.md) §3. Oura matters a little more now: it has a ring, and we have the rings of the mark.

## 6. Rules that come out of this audit

1. **One engine per element.** GSAP, Motion, the LivingMark and Three.js never animate the same DOM node or object.
2. **GSAP owns scroll.** Everything scroll-linked or pinned is a ScrollTrigger. Motion is used for state and gesture, and only `whileInView` for simple one-off entrances outside pinned parts.
3. **One WebGL context.** The rings canvas is the only one. Everything else (the living mark, diagrams, grain) is SVG, CSS or a static image.
4. **The tangent rule is universal.** Any ring from any source (a component, a diagram, a 3D form) is restyled so that circles touch at one point at the bottom. Concentric effects are rejected.
5. **Copied code is restyled.** Every installed component is converted to our tokens (colour, radius, easing), uses Phosphor instead of lucide, and loses any glow, gradient border or neon.
6. **Licences are recorded.** The licence of each copied component is noted in a comment at the top of its file and in the table above.
