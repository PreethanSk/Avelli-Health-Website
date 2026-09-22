# Reference Audit

Status: complete, September 2026. It covers every inspiration source, library and tool the owner has shared. Nothing is implemented yet.

This is the one place that answers "did we look at X, and what did we take from it?" The decisions here feed [01-design-direction.md](01-design-direction.md) (why), [02-brand-system.md](02-brand-system.md) (tokens and motion rules), [03-site-structure.md](03-site-structure.md) (the per-section build specs) and [04-build-plan.md](04-build-plan.md) (dependencies and architecture).

## 1. Decisions this audit locked

| Decision | Result |
| --- | --- |
| Animation stack | **GSAP + Motion.** GSAP (ScrollTrigger, SplitText, DrawSVG, MotionPathPlugin, CustomEase) runs the scroll story, pinning, text splitting and the 2D thread. Motion runs UI state (privacy picker, waitlist, menu, hovers). Lenis runs on GSAP's ticker. **anime.js is dropped.** Three.js through react-three-fiber is used for the ribbon only. |
| Paid sources | **Free only.** The build depends only on free, open-licence code. Paid tiers (Skiper UI Pro, GetLayers, React Bits Pro, deck.gallery Pro) and Mobbin are visual references and never dependencies. |
| Logo shader | **Two places only:** the huge ink-finale wordmark in the footer and the 404 page. Built with Paper Shaders (Apache 2.0), not the liquid-logo repo. Tuned to ink and teal, not chrome. It settles into the flat mark. |
| Atmosphere | **Paper grain only.** One static, very subtle grain overlay. No animated backgrounds, no ambient gradients, no glass, no Vanta. |

Verdict key: **Use** means we install or copy code from it. **Reference only** means we study it and build our own version. **Skip** means we leave it out, with the reason stated.

## 2. The two anchor sites, measured

Both were inspected live in September 2026, with their tech and type measured from the page.

### Optikka ([optikka.com](https://optikka.com))

| What | Measured |
| --- | --- |
| Stack | Astro 4.9, Lenis smooth scroll. No global GSAP or Three found (bundled scripts). |
| Structure | The whole page is **one ~11,500px section** containing a pinned WebGL scene (4 canvases). The object transforms as you scroll and the copy steps past it. There is no conventional stack of sections. |
| Display type | PP Neue Montreal, about 97px, weight 500, letter-spacing -0.03em, line-height 1.07. |
| Labels | JetBrains Mono, uppercase, small. This is the same mono we chose. |
| Ground | `rgb(230, 217, 204)`, a warm sand. |
| Text colour | Warm brown ink (`rgb(68, 50, 24)` and `rgb(99, 82, 58)`), never pure black. |
| Accent | `rgb(253, 67, 25)` orange, used on one phrase ("revenue potential"). |
| Header | Fixed, 48px, transparent: logo on the left, three mono links spread across. |
| Copy rhythm | Large statement bottom-left; a small mono label ("CREATIVITY / POWERED BY CODE") top-left; a "SCROLL DOWN" cue on the right. |

What we take: the single-object scroll scene, the display type metrics (our Figtree 500 at -0.035em and line-height 1.0 to 1.05 matches), mono labels, bottom-left statements and a quiet fixed header.

What we leave: the orange accent, the loader, the "SCROLL DOWN" cue (banned by the taste skill), and the B2B tone.

Noted, not adopted: the warm brown ink is a lovely softening. Our ink stays `#0B0C0D` because the logo package defines it. If the owner wants the softer feel later, it's a one-token change (`ink`), after the logo package is updated to match.

### Greenstack ([greenstack.zajno.com](https://greenstack.zajno.com))

| What | Measured |
| --- | --- |
| Stack | Webflow, **Lenis 1.2.3, GSAP 3.12 with ScrollTrigger and CustomEase**, SplitType for text, a custom canvas rain effect, 2 background videos. |
| Type | Switzer. |
| Palette | Cool grey-teal grounds (`rgb(234, 242, 243)`, `rgb(218, 231, 233)`) with deep navy text (`rgb(31, 38, 51)`). |
| Structure | A number-counter preloader, then a huge "GREEN STACK®" wordmark that later sits in the nav, a full-bleed cinematic media moment, numbered editorial paragraphs, and a single "Book a demo" CTA. |
| Page height | About 6,000px. |

What we take: the wordmark that shrinks into the nav, the full-bleed photo moment, calm left-aligned paragraphs, a single CTA, and proof that **Lenis + GSAP ScrollTrigger + CustomEase + split text** is the right stack for this feel.

What we leave: the preloader, big counters ("471k+ farms"), repeated placeholder paragraphs, and the rain effect.

## 3. Libraries and component sources

| Source | What it is | Licence / cost | Verdict | Exactly what we take | Where |
| --- | --- | --- | --- | --- | --- |
| [GSAP](https://github.com/greensock/gsap) | Animation engine, v3.15. Since the Webflow acquisition every plugin is free, including SplitText, DrawSVG, MorphSVG and MotionPath. | Free for commercial use (GSAP standard licence, not MIT). | **Use** | `gsap`, `@gsap/react` (`useGSAP`), ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin, CustomEase. | All scroll-linked and pinned parts, headline reveals, the 2D thread (parts 1 to 8, 10, 12, 13). |
| [Lenis](https://github.com/darkroomengineering/lenis) | Smooth scroll that wraps native scroll. Used by both Optikka and Greenstack. | MIT | **Use** | `lenis` with `lenis/react` (`ReactLenis`), driven by the GSAP ticker. `data-lenis-prevent` on nested scrollers. | Whole site. |
| [motion.dev](https://motion.dev) | React animation (`motion/react`). | MIT | **Use** | Springs, `layout`, `AnimatePresence`, `whileInView` for simple in-view states, drag. **No `useScroll` in pinned story parts**: GSAP owns scroll. | Privacy picker, waitlist, mobile menu, phone carousel, bento hovers, logo dot drop. |
| [anime.js](https://animejs.com) v4 | Animation engine with drawables, motion paths and text splitting. | MIT | **Skip (dropped)** | Nothing. GSAP now covers `createDrawable` (DrawSVG), `createMotionPath` (MotionPathPlugin), `splitText` (SplitText) and `onScroll` (ScrollTrigger). A third engine would only add weight and conflicts. | n/a |
| [react-three-fiber](https://github.com/pmndrs/react-three-fiber) + drei + three | React renderer for Three.js. | MIT | **Use** | `Canvas`, `useFrame`, drei `PerformanceMonitor`, `ContactShadows`. | The ribbon only (parts 2 to 4, and fallback renders). |
| [Paper Shaders](https://github.com/paper-design/shaders) | Zero-dependency canvas shaders: Paper Texture, Grain Gradient, Liquid Metal, Heatmap, Fluted Glass, Dithering, Halftone, Mesh Gradient and more. | Apache 2.0. Versions are 0.0.x with breaking changes expected, so **pin the exact version**. | **Use** | `@paper-design/shaders-react`: `LiquidMetal` for the logo moments (with `Heatmap` as the documented alternative). Paper Texture / Grain is used **once, offline**, to export the static grain tile. | Footer wordmark (part 13), 404 mark, grain tile. |
| [liquid-logo](https://github.com/paper-design/liquid-logo) | A demo app that turns a logo into liquid metal. | **PolyForm Shield 1.0.0** (non-compete licence). | **Skip** | Nothing from the repo. The same effect comes from Paper Shaders under Apache 2.0, so there's no licence question. It's useful for previewing how "anveli." reads as liquid at [liquid.paper.design](https://liquid.paper.design). | n/a |
| [ShaderGradient](https://github.com/ruucm/shadergradient) | Animated 3D gradient backgrounds (plane, sphere, water plane). | MIT | **Skip** | It needs its own R3F canvas plus `camera-controls`, which is a second 3D setup just for a gradient. Animated gradients also go against the "one object" rule. | n/a |
| [Vanta](https://github.com/tengbao/vanta) | Animated WebGL backgrounds (waves, fog, birds, clouds, topology). | MIT | **Skip** | Built around the older three r134 era and a global `THREE`. The effects look like 2018 hero backgrounds and compete with the ribbon. | n/a |
| [liquid-glass-js](https://github.com/dashersw/liquid-glass-js) | WebGL2 refraction "glass" containers and buttons. | MIT | **Skip** | One commit, no npm package, no React wrapper. It recaptures the page with html2canvas, which is costly and fragile over a WebGL scene. Glass is also not part of our look. The nav uses a progressive blur plate instead (skiper41). | n/a |
| [React Bits](https://github.com/DavidHDev/react-bits) | 200+ animated components in 4 variants (JS/TS × CSS/Tailwind), installed by the shadcn or jsrepo CLI. | MIT + Commons Clause (free to use in a product; not to be resold as components). Free tier only. | **Use (selectively)** | Patterns: **Scroll Reveal** (part 3 word scrub), **Split Text / Masked Heading** (reference for the hero line mask), **Staggered Menu** (mobile menu choreography), **Hold Button** (part 11), **Gradual Blur** (reference for the nav plate), **Threads / Floating Lines** (reference for loose 2D strands on the 404 and in part 3). | Parts 1, 3, 11, 404. |
| React Bits (rest) | Neon and glow backgrounds: Strands, Aurora, Plasma, Hyperspeed, Galaxy, Lightning, Liquid Chrome, Ballpit, Dither and similar. Cursor toys. | as above | **Skip** | Additive glow and cursor effects are banned by the brand (no neon, no glow, no toy cursors). | n/a |
| [Skiper UI](https://skiper-ui.com) | "Uncommon" shadcn components on Motion and Tailwind, installed as `npx shadcn add @skiper-ui/skiperNN`. | Free tier plus Pro ($129) and Exclusive ($549). Confirm the licence page at install. **Free only.** | **Use (free items)** | **skiper41** Progressive Blur (nav plate), **skiper58** Text roll navigation (nav link hover), **skiper19** SVG follow scroll (reference for the scroll-drawn thread), **skiper16 / skiper17** Card stack scroll (reference for part 10), **skiper34** Scroll images reveal 003 (reference for part 5), **skiper48** Card swipe carousel (part 9), **skiper106** Smooth caret input (waitlist field), **skiper66** SVG clip path mask (reference for the hero line mask). | Parts 1, 5, 6, 9, 10, waitlist. |
| Skiper UI (rest) | Pro components (text reveal box, parallax image, number flow, Apple feature block), preloaders, "crazy hero" effects, web3 widgets. | Pro is paid | **Reference only / Skip** | Pro items can be looked at, never installed. Preloaders are skipped because they delay content. | n/a |
| [Fancy Components](https://www.fancycomponents.dev) | Free React + Motion + Tailwind micro-interactions: text, physics, image, filter and block components. | Open source, free for commercial use (confirm the licence file at install). | **Use (selectively)** | **Marquee Along SVG Path** (part 12: the one marquee runs along the thread), **Sticky Footer** (part 13 reveal), **Vertical Cut Reveal** (reference for the hero line mask), **Parallax Floating** (part 3 fragments, adapted from pointer to scroll depth), **Typewriter** (part 7 search demo), **Underline Animation** (text links). | Parts 2, 3, 7, 12, 13, links. |
| Fancy (rest) | Gravity, Elastic Line, Screensaver, Pixel Trail, Gooey filter, Scramble text and similar. | as above | **Skip** | Playful physics and scrambles don't fit a calm health brand. | n/a |
| [ThreeUI](https://threeui.com) | Three.js components, full-page templates and shaders (by Meng To), mostly vanilla HTML/JS. | Community items are free; premium variants are paid. | **Reference only** | For the ribbon's look and strand behaviour: "Predictive Arc: Ribbon Field", "Structure Flow: Fluid Field / Topology Field", "Halftone Flow". We write our own R3F ribbon; nothing is copied. | Ribbon prototype (phase 2). |
| [Kokonut UI](https://kokonutui.com) | shadcn registry built on Motion. | MIT | **Use** | As already listed in 01: `scroll-text`, `card-stack`, `hold-button`, `type-writer`, `smooth-tab`, `smooth-drawer`, `file-upload`. Anything React Bits, Skiper or Fancy does better (above) takes priority. | Parts 7, 10, 11, mobile menu. |
| Watermelon UI | 850+ shadcn registry items plus an MCP. | Free registry | **Use** | `floating-input` (label behaviour for the waitlist), `fluid-tabs` (picker tabs), `card-swipe` (fallback for part 9). | Parts 9, 11, waitlist. |
| Bklit UI | Line, area and live charts. | Free; confirm the licence at install | **Use** | Line chart with a baseline band (part 7 cell 1). | Part 7. |

## 4. Inspiration galleries and tools

| Source | What it is | Cost | Verdict | What we take |
| --- | --- | --- | --- | --- |
| [GetLayers](https://www.getlayers.ai) | A library of copy-and-paste prompts for AI coding tools: templates, 3D scenes, sections, backgrounds, 1KB WebGL gradients, plus an MCP. | Paid (early-access sale $129; full price $359) | **Reference only** | Browse the free previews for section rhythm and 3D scene lighting ("Laminar", "Colonnade", "Cards Cascade"). We don't buy it and we don't paste prompts. Our sections are specified in 03. |
| [deck.gallery](https://www.deck.gallery) | 100+ full brand decks: brand guidelines, impact reports, pitch decks. | Free browsing; Pro is $12/month | **Reference only** | Brand-guideline decks for how to lay out the root `DESIGN.md`. Impact reports (On 2024, Lululemon 2023, Nike FY22) for the editorial long-read layout of `/privacy-trust`: big numbered headings, generous margins, one image per spread. |
| [motionsites.ai](https://motionsites.ai) | Motion and background ideas. | Free | **Reference only** | Unchanged from 01: ideas only, no copied prompts. |
| [styles.refero.design](https://styles.refero.design) | DESIGN.md examples. | Free | **Reference only** | Token and component-spec format for the root `DESIGN.md`. |
| [Mobbin](https://mobbin.com) | App screen library. | Needs a login | **Reference only** | Whoop, Oura, Bevel, Ultrahuman and Apple Health Records screens for the part 9 phone screens. |
| awesome-design-md (`design-references/`) | 60+ brand DESIGN.md files. | MIT | **Use (format)** | The format of our root `DESIGN.md`. Closest systems: `elevenlabs` and `apple`. |
| taste skill (`.claude/skills/design-taste-frontend`) | Design rules and pre-flight checks. | n/a | **Use (process)** | The dials, anti-slop bans, and its GSAP skeletons: §5.A sticky-stack (part 10) and §5.B horizontal pan (part 6). Its rule "never mix GSAP and Motion in the same component tree" is followed as: one engine per leaf component, never both on one element. |
| image-to-code skill | Image-first build workflow. | n/a | **Use (process)** | Section reference images generated externally from the prompts in 03 before each section is built. |
| web-design-guidelines (Vercel) | UI and accessibility audit. | n/a | **Use (process)** | The final audit in phase 8. |

## 5. Market references

Bevel, Function Health, Superpower, Whoop, Ultrahuman, Eight Sleep and Oura are covered in [01-design-direction.md](01-design-direction.md) §3. No change from this audit.

## 6. Rules that come out of this audit

1. **One engine per element.** GSAP and Motion never animate the same DOM node. Three.js only touches the canvas.
2. **GSAP owns scroll.** Everything scroll-linked or pinned is a ScrollTrigger. Motion is used for state and gesture, and only `whileInView` for simple one-off entrances outside pinned parts.
3. **No second 3D stack.** The ribbon is the only react-three-fiber canvas. Paper Shaders use their own tiny canvases and mount only for the logo moments.
4. **Copied code is restyled.** Every installed component is converted to our tokens (colour, radius, easing), uses Phosphor instead of lucide, and loses any glow, gradient border or neon.
5. **Licences are recorded.** The licence of each copied component is noted in a comment at the top of its file and in the table above.
