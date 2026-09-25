# Brand System for the Website

Status: planned, rebuilt around the **6A Tangent** logo (September 2026). It is now the root [`DESIGN.md`](../../DESIGN.md) (awesome-design-md format); tokens live in `src/lib/tokens.ts` and `src/app/globals.css`.

The source of truth for the mark is the logo package in [`../new-logo-latest-final/anveli-6a-package/`](../new-logo-latest-final/anveli-6a-package/README.md): its README, `anveli-logo.css`, the SVGs, and the living mark. This doc sets out how the website uses it. If the two ever disagree, the package wins for the mark itself and this doc wins for everything else on the site.

The previous "anveli." period wordmark (Figtree, teal dot) in `docs/Logo design brief/` is **superseded**.

## 1. Logo

### The idea

Four circles, one point. Every layer of a life (years, providers, records) is a different size, and every one touches the same point: the person. The core is the person. The site is built on the same idea (see [01-design-direction.md](01-design-direction.md) §4).

### Symbol

| Property | Value |
| --- | --- |
| Construction | All circles are internally tangent at one point on the vertical axis, so each centre sits at `y = tangent − r`. In a 100 box: R = 40 (cy 50), rings at 0.725R (r 29, cy 61) and 0.4625R (r 18.5, cy 71.5), core 0.225R (r 9, cy 81, solid). Ring stroke 0.075R (3 in a 100 box). |
| Optical version | For 32px and below: one ring (r 38, stroke 11) plus the core. Never thicken the full mark; switch to the optical version instead. |
| Colours on ink | Rings `ice`, core `glacier`. |
| Colours on paper | Rings `ink-reverse`, core `harbor`. |
| Mono | Rings and core in one colour (white or black) for embroidery, foil and fax. Not used on the website. |

### Wordmark and lockups

- Text: `anveli`, always lowercase, **no period**. The person is now the core of the symbol.
- Typeface: **Geist 500**, tracking -0.035em. Use 600 at 16px and below.
- Horizontal lockup: the symbol is 1.15× the wordmark's font size with a 0.3em gap, and it sits optically centred on the x-height. The CSS is `.anv-lockup` in `anveli-logo.css`.
- Stacked lockup: the symbol is 1.7em with a 0.36em gap.
- Clearspace: the core's diameter × 2 on all sides. Screen floor: 16px (optical symbol, weight 600). Below the floor, use the symbol alone.
- Dark ground is primary.

### Files the site uses

Copied from the package into `public/brand/` at build phase 1:

| Use | File |
| --- | --- |
| Nav and footer lockups (inline SVG + live Geist text) | `symbol-primary-ice.svg` (on ink), `symbol-reverse-ink.svg` (on paper) |
| Small sizes (≤ 32px) | `symbol-optical-ice.svg`, `symbol-optical-ink.svg` |
| Favicon | `favicon.svg` (optical, ink tile) |
| Apple touch icon, PWA icons | `app-icon-dark.svg`, `app-icon-light.svg`, plus PNG exports |
| OG image base | `png/lockup-horizontal-dark.png` composed with the hero render |

The SVGs carry a large embedded metadata block. Strip it (SVGO) before shipping; the geometry is unchanged.

### The living mark

The package ships an animated version of the symbol (`living-mark/anveli-living-mark.html`, API `AnveliMark(svgEl).set('breathe' | 'sync' | 'added')`). On the website it replaces the old "dot drop" signature and the planned Paper Shaders logo moments.

| State | What it does | Where on the site |
| --- | --- | --- |
| **Breathe** (idle) | The inner rings swell ±7% out of phase and stay tangent. The period is about 7s. | Resting state of the large marks: the part 13 finale mark and the 404 mark. It stops after 2 cycles or when motion is paused (see §6). |
| **Accrue** (syncing) | A ring is born from the core and every layer moves out one step while the oldest fades. It loops in about 1.8s. | Plays **once**, not looped, as the finale mark enters view (part 13), and in the waitlist "submitting" state. |
| **Added** (pulse) | The core swells and the pulse travels outward ring by ring (80ms apart, 0.9s), then it returns to idle. | Once on first load on the nav lockup (the new signature), on waitlist success, and on the 404 mark when hovered or tapped. |

Rules:

- The web version is a React port of the package script (`components/brand/LivingMark.tsx`). It keeps the same geometry and timings, is stepped by GSAP's ticker instead of its own `requestAnimationFrame` loop, and pauses when off screen.
- With reduced motion it renders the static symbol and ignores `set()`.
- It's SVG only. No WebGL is ever needed to show the logo.

### Don't

From the package, plus site rules:

- Don't centre the rings. That's a target, not a person.
- Don't rotate the mark. The point always rests at the bottom.
- Don't colour-code the rings. One ring colour, one core colour.
- Don't thicken the full mark; use the optical version.
- Don't add the old period to the wordmark, and don't set it in Figtree.
- Don't place the mark on a busy photo without a solid plate.
- Don't use a centred-ring or concentric pattern anywhere as decoration. Every ring motif on the site is tangent at one point.

## 2. Colour

The palette comes from the logo package and is extended with text and surface tokens for the site. Contrast values were computed against the ground named.

**Ink grounds (primary)**

| Token | Hex | Use |
| --- | --- | --- |
| `ink` | `#0B0C0D` | The main page ground. |
| `depth` | `#14202A` | **Glow only**: one soft radial gradient behind a mark or the 3D object (as in the package's living-mark stage). Never a flat fill, never text. |
| `ink-2` | `#12181C` (to confirm) | Raised surfaces on ink: cards, picker items, the phone bezel. |
| `ice` | `#E9EEF0` | Text on ink (16.7:1), rings of the mark on ink. |
| `ice-60` | `#9AA6AD` | Secondary text on ink (7.9:1; 7.2:1 on `ink-2`). |
| `glacier` | `#9FD8E8` | The accent on ink: the core, links, focus rings, the "shared" state, the 3D core glow (12.6:1). |
| `hairline-ink` | `#2A3238` | Decorative lines on ink. Never text. |

**Paper grounds (the one light chapter)**

| Token | Hex | Use |
| --- | --- | --- |
| `paper` | `#EEF2F4` | Ground of the paper chapter (parts 5 to 10) and `/privacy-trust`. |
| `paper-2` | `#E3E9EC` (to confirm) | Bento cells, phone screens and policy cards on paper. |
| `ink-reverse` | `#0E1A22` | Text on paper (15.7:1), rings of the mark on paper. |
| `slate` | `#4A5A64` | Secondary text on paper (6.4:1; 5.8:1 on `paper-2`). |
| `harbor` | `#3E8FA8` | The accent on paper for **non-text** use: the core, focus rings, chart lines, markers (3.3:1, which passes the 3:1 graphics rule). |
| `harbor-deep` | `#2F7389` | Accent **text** on paper: links and inline emphasis (4.7:1). |
| `hairline-paper` | `#C9D2D7` | Decorative lines on paper. Never text. |

**Data state**

| Token | Hex | Use |
| --- | --- | --- |
| `amber` | `#E0A85A` on ink, `#A8651A` on paper | **Data state only**: a value outside the person's own baseline in a chart. Never a button, banner or alarm. |

Rules:

- **One accent family:** `glacier` on ink and `harbor` on paper. These are the same colour idea at two lightnesses. There's no teal, no second blue, and no green badge anywhere.
- **No red anywhere.** Health anxiety is real, and we never signal alarm on a marketing page.
- No pure `#000` or `#FFF`.
- Glow is `depth` only: one radial gradient, low contrast, never neon, never animated colour.
- Shadows on paper are tinted toward `ink-reverse` at low opacity; on ink use elevation (`ink-2`) instead of shadows.

## 3. Typography

| Role | Font | Weight | Notes |
| --- | --- | --- | --- |
| Wordmark | Geist | 500 (600 at ≤ 16px) | Tracking -0.035em, per the logo package |
| Display (hero, big statements) | Geist | 500 | Tracking about -0.035em, line-height 1.0 to 1.05 |
| Headings | Geist | 500 to 600 | |
| Body | Geist | 400 | 16 to 18px, line-height about 1.6, max 65ch |
| Labels, values, metadata | JetBrains Mono | 400 to 500 | Uppercase, +0.18em tracking, small sizes |

- Both load through `next/font/google`. The scaffold already loads Geist; keep it and replace Geist Mono with JetBrains Mono. Geist is SIL OFL, free for commercial use.
- Suggested scale (fluid with `clamp`): display 64 to 120px, h2 40 to 64px, h3 24 to 32px, body 17px, small 14px, mono label 12px.
- The hero headline is at most 2 lines on desktop. Emphasis uses the same family (weight), never a mixed-in serif.
- Mono labels above headings ("eyebrows") are limited to 1 per 3 sections. Mono is mainly used for data: values, dates, units and source names inside product previews.

## 4. Shape, space and depth

- **Radius rule:** buttons and chips are full pills, media and cards are 20px, inputs match the button pill. This is the same everywhere. (The app-icon tile radius from the package is for icons only.)
- **Circles are the brand's shape.** Round elements (the core, markers, avatar frames, ring diagrams) follow the tangent rule: when circles nest, they touch at one point at the bottom.
- **Spacing:** gallery-airy. Sections are separated by roughly 160 to 240px on desktop and about 96px on mobile. Content max width is about 1400px, with a 16px minimum side gutter on phones.
- **Cards only when they mean something** (a bento cell, a phone screen, a policy layer). Otherwise group with space and hairlines. No cards inside cards.
- **Depth glow:** on ink, the 3D object and large marks sit in one `depth` radial gradient (about 120% × 100% at the bottom centre, fading to `ink` by 62%, as in the package's living-mark stage). One glow per screen at most.
- **Grain:** a very subtle grain, the site's only texture. Spec:

  | Property | Value |
  | --- | --- |
  | Source | A static, seamless 512×512 monochrome tile, exported **once** from the Paper Shaders playground (Paper Texture or Grain) and committed as `public/brand/grain.webp` (under 40 KB). No shader and no shader package ship with the site. |
  | Layer | One `position: fixed; inset: 0; pointer-events: none` element at the top of the z-index scale, `aria-hidden`. Never on scrolling containers, and never animated. |
  | On ink | `mix-blend-mode: soft-light`, `--grain-opacity: 0.06` (tune between 0.04 and 0.08). It keeps the dark from looking flat and digital, and softens the depth glow's banding. |
  | On paper | `mix-blend-mode: multiply`, about 0.04. |
  | Off when | `prefers-reduced-transparency: reduce`, `forced-colors: active`, and print. |
  | Photos and previews | Grain is never baked into photos, product previews or the 3D render. Everything gets it from the one shared overlay. |

## 5. Iconography

- Phosphor Icons, one weight (regular or light) across the site.
- Components pulled from any registry (Kokonut, Watermelon, React Bits, Skiper, Fancy) that ship with lucide or other icons get swapped to Phosphor.
- No hand-drawn icon SVGs and no emoji. The only custom drawing is the mark itself and its ring diagrams.

## 6. Motion principles

- **Every animation has a job:** storytelling (the rings accruing), hierarchy (revealing the one thing to read), feedback (button press, form states, the living mark's pulse) or state change (the privacy picker).
- **Only animate `transform` and `opacity`**, plus SVG `stroke-dashoffset` (DrawSVG), SVG circle attributes in the living mark, and shader uniforms. Scroll-linked values go through ScrollTrigger callbacks, refs or uniforms, never React state.
- **No linear easing** except where the motion is scrubbed by scroll (scroll is the easing) or a marquee's constant speed.
- **Ambient loops are pausable.** The hero's idle breathe, the marquee and any living-mark breathe share one global motion state. A 44px "Pause motion" button in the nav (desktop and mobile sheet) and the one next to the marquee both toggle it, and the choice is remembered for the session. Nothing moves on its own for more than 5 seconds without that control.
- **Reduced motion:** the 3D object becomes a static render, pinned sections become normal stacked sections, the marquee stops, text appears without splitting, and every living mark is static.

### Library split

| Engine | Owns | Never |
| --- | --- | --- |
| **GSAP** (ScrollTrigger, SplitText, DrawSVG, MotionPathPlugin, CustomEase) | Everything tied to scroll: pins, scrubs, the rings' accrual progress, headline and word reveals, ring diagrams drawing, the core travelling along the baseline. | UI state that the user toggles. |
| **Motion** | UI state and gesture: the privacy picker, waitlist states, mobile menu, phone carousel drag, hover and press feedback, simple one-off `whileInView` entrances outside pinned parts. | Reading scroll inside a pinned part (no `useScroll` there). |
| **Three.js (react-three-fiber)** | The 3D rings canvas only. | Anything in the DOM. |
| **LivingMark** (package port) | The animated logo, stepped by GSAP's ticker. | Anything that isn't the mark. |
| **Lenis** | Smooth scroll, stepped by GSAP's ticker. | Running its own animation frame loop. |

A single DOM element is animated by **one** engine only. Each animated piece is its own small client component.

### Motion tokens

These names are used in the section specs in [03-site-structure.md](03-site-structure.md). They live in code in `lib/tokens.ts` (GSAP eases are registered once in `components/motion/gsap.ts`).

**Eases**

| Token | Value | Use |
| --- | --- | --- |
| `ease.out` | CSS `cubic-bezier(0.16, 1, 0.3, 1)`; GSAP `CustomEase.create("anveli.out", "0.16,1,0.3,1")` | Every reveal: line masks, fades, the photo settling, rings drawing. |
| `ease.inOut` | CSS `cubic-bezier(0.65, 0, 0.35, 1)`; GSAP `CustomEase.create("anveli.inOut", "0.65,0,0.35,1")` | Things that travel and stop: the core's lap in part 8, the picker's items moving. It matches the living mark's accrue curve. |
| `ease.scrub` | GSAP `"none"` | Anything scrubbed by scroll. |
| `spring.ui` | Motion `{ type: "spring", stiffness: 100, damping: 20 }` | Layout changes, the picker, the carousel. |
| `spring.press` | Motion `{ type: "spring", stiffness: 400, damping: 30 }` | Button press (scale 0.97) and toggle feedback. |

**Durations**

| Token | Value | Use |
| --- | --- | --- |
| `dur.micro` | 150ms | Hover colour, underline, press. |
| `dur.ui` | 250ms | Tabs, field state changes, menu items. |
| `dur.reveal` | 900ms | Headline line masks, paragraph reveals. |
| `dur.pulse` | 900ms | The living mark's "added" pulse (fixed by the package). |
| `dur.accrue` | 1800ms | One living-mark accrue step (fixed by the package). |
| `dur.draw` | 1600ms | A ring diagram drawing itself on enter (part 8). |
| `dur.settle` | 1200ms | Large, slow moves (photo scale when not scrubbed, fan-outs). |

**Staggers**

| Token | Value | Use |
| --- | --- | --- |
| `stagger.lines` | 0.08s | Lines of a headline. |
| `stagger.items` | 0.05s | Menu links, chips, list rows. |
| `stagger.rings` | 0.08s | Ring-by-ring effects (matches the package's pulse). |
| `stagger.words` | spread across the scrub (`each` computed from word count) | Part 3 word inking. |

**ScrollTrigger conventions**

| Kind | Settings |
| --- | --- |
| Pinned part | `start: "top top"`, `end: "+=<length>"` (the length is given per part in 03), `pin: true`, `scrub: true`, `anticipatePin: 1`. Lenis supplies the smoothing, so scrub has no extra lag. |
| Scrubbed in-view effect (no pin) | `start: "top bottom"`, `end: "bottom top"` or as given, `scrub: 0.6`. |
| One-off reveal | `start: "top 80%"`, `once: true`, eased with `ease.out` and `dur.reveal`. |
| Horizontal pan | The taste skill's §5.B skeleton: pin the wrapper, move the inner track by `-(track width - viewport width)`, `end: "+=" + that distance`, `invalidateOnRefresh: true`. Per-stop effects use `containerAnimation`. |
| Sticky stack | The taste skill's §5.A skeleton, `start: "top top"`. |

**Lenis settings**

`lerp: 0.1`, `smoothWheel: true`, `syncTouch: false` (touch devices keep native scroll), `autoRaf: false` (GSAP's ticker calls `lenis.raf`). Anchor links go through `lenis.scrollTo` with a 72px nav offset. With reduced motion Lenis is not started at all.

## 7. Voice and copy

anveli sounds **calm, clear and on your side**. Like a friend who is good with paperwork, not a doctor and not a salesperson.

Do:

- Short sentences. Concrete nouns: reports, prescriptions, follow-ups, policies, nights of sleep.
- Observation language: "your LDL rose across these three reports", "11 headache days in six weeks".
- Make the user the one who decides: "you choose", "you approve", "only when you say so".
- Pull wording from the product docs so the site and the product say the same thing.
- Lean on the mark's language where it helps: layers, every layer touching you, one point.

Don't:

- Diagnose, predict or promise outcomes. Guarantee insurance claims.
- Use filler verbs: elevate, seamless, unleash, revolutionise, next-gen, empower.
- Use em dashes or en dashes in site copy. Use periods, commas or colons.
- Show sample data without labelling it "Example".
- Use fear hooks.

Key lines (drafts):

| Where | Line |
| --- | --- |
| Motto / hero | Your health, understood. |
| Hero sub | anveli keeps your records, wearables and everyday health in one living history that grows with you. |
| Problem | Healthcare remembers encounters. It doesn't remember you. |
| The rings (part 4) | Remembered. Then understood. (support: Every layer of your health touches one point: you.) |
| Everyday life | Your health doesn't only happen at the clinic. |
| Protect | Having your information should never mean sharing it. |
| Insurance | I'm being admitted tomorrow. What am I covered for? |
| CTA label (everywhere) | Join the waitlist |
| Disclaimer | anveli helps you understand and organise your health information. It does not give medical advice or diagnoses. |
