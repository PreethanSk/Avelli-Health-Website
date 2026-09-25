---
version: 1.0
name: anveli
description: The active design system for the anveli website. A calm, sculptural health-lifestyle identity built on one idea, the 6A Tangent mark (four circles touching one point, the person). A near-black ink ground with one soft depth glow, one light paper chapter, a single ice-blue accent family, Geist for everything with JetBrains Mono for data, full pills and 20px cards, and scroll-told motion where every animation has a job.

colors:
  # Ink grounds (primary)
  ink: "#0B0C0D"
  depth: "#14202A"          # glow only: one radial gradient, never a fill, never text
  ink-2: "#12181C"          # raised surfaces on ink
  ice: "#E9EEF0"            # text on ink, rings of the mark on ink
  ice-60: "#9AA6AD"         # secondary text on ink
  glacier: "#9FD8E8"        # the accent on ink: core, links, focus
  hairline-ink: "#2A3238"   # decorative lines on ink, never text
  # Paper grounds (the one light chapter)
  paper: "#EEF2F4"
  paper-2: "#E3E9EC"        # cells, phone screens, policy cards on paper
  ink-reverse: "#0E1A22"    # text on paper, rings of the mark on paper
  slate: "#4A5A64"          # secondary text on paper
  harbor: "#3E8FA8"         # accent on paper, NON-TEXT only (core, focus, charts)
  harbor-deep: "#2F7389"    # accent TEXT on paper (links, emphasis)
  hairline-paper: "#C9D2D7" # decorative lines on paper, never text
  # Data state only
  amber-ink: "#E0A85A"      # a value outside the person's own baseline, on ink
  amber-paper: "#A8651A"    # the same, on paper

typography:
  display:
    fontFamily: Geist, ui-sans-serif, system-ui, sans-serif
    fontSize: clamp(64px, 7.5vw, 120px)
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: -0.035em
  statement:
    fontFamily: Geist, ui-sans-serif, system-ui, sans-serif
    fontSize: clamp(48px, 6vw, 96px)
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -0.03em
  h2:
    fontFamily: Geist, ui-sans-serif, system-ui, sans-serif
    fontSize: clamp(40px, 4.4vw, 64px)
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -0.03em
  h3:
    fontFamily: Geist, ui-sans-serif, system-ui, sans-serif
    fontSize: clamp(24px, 2.2vw, 32px)
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.02em
  lead:
    fontFamily: Geist, ui-sans-serif, system-ui, sans-serif
    fontSize: 19px
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: Geist, ui-sans-serif, system-ui, sans-serif
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.6
  small:
    fontFamily: Geist, ui-sans-serif, system-ui, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  label-mono:
    fontFamily: JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.18em
    textTransform: uppercase
  button:
    fontFamily: Geist, ui-sans-serif, system-ui, sans-serif
    fontSize: 15px            # 16px on the large pill
    fontWeight: 500
    lineHeight: 1
  wordmark:
    fontFamily: Geist, ui-sans-serif, system-ui, sans-serif
    fontWeight: 500           # 600 at 16px and below
    letterSpacing: -0.035em
    textTransform: lowercase

rounded:
  card: 20px                  # media, cards, bento cells, phone screens
  pill: 9999px                # buttons, chips, inputs, tags
  full: 9999px                # circles (core, markers)

spacing:
  gutter-mobile: 16px         # < 768px
  gutter-tablet: 32px         # >= 768px
  gutter-desktop: 48px        # >= 1024px
  grid-gap: 24px              # 12-column grid column gap
  container: 1400px           # content max width (plus gutters)
  prose: 65ch                 # reading column
  section-mobile: 96px        # section padding block, < 1024px
  section-desktop: clamp(160px, 14vw, 240px)
  nav-desktop: 72px
  nav-mobile: 64px
  anchor-offset: 72px

motion:
  ease-out: cubic-bezier(0.16, 1, 0.3, 1)      # GSAP "anveli.out"
  ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)  # GSAP "anveli.inOut"
  ease-scrub: none                             # only for scroll-scrubbed motion
  spring-ui: { type: spring, stiffness: 100, damping: 20 }
  spring-press: { type: spring, stiffness: 400, damping: 30 }
  dur-micro: 150ms
  dur-ui: 250ms
  dur-reveal: 900ms
  dur-pulse: 900ms
  dur-accrue: 1800ms
  dur-draw: 1600ms
  dur-settle: 1200ms
  stagger-lines: 0.08s
  stagger-items: 0.05s
  stagger-rings: 0.08s

mark:
  box: 100
  tangentY: 90                # every circle's centre y = 90 - r
  rings: [40, 29, 18.5]       # R, 0.725R, 0.4625R
  core: 9                     # 0.225R, solid
  stroke: 3                   # 0.075R
  levels: [9, 18.5, 29, 40, 51]
  optical: { ring: 38, ringCy: 52, stroke: 11, core: 14, coreCy: 76, maxPx: 32 }
  onInk: { ring: "{colors.ice}", core: "{colors.glacier}" }
  onPaper: { ring: "{colors.ink-reverse}", core: "{colors.harbor}" }

components:
  nav-bar:
    height: "{spacing.nav-desktop}"
    textColor: "{colors.ice}"          # switches to ink-reverse on paper (html[data-ground])
    typography: "{typography.small}"
  pill-primary-ink:
    backgroundColor: "{colors.ice}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: 44px
    padding: 0 20px
    typography: "{typography.button}"
  pill-primary-paper:
    backgroundColor: "{colors.ink-reverse}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    height: 44px
    padding: 0 20px
    typography: "{typography.button}"
  pill-quiet-ink:
    backgroundColor: transparent
    textColor: "{colors.ice}"
    borderColor: "{colors.hairline-ink}"
    rounded: "{rounded.pill}"
    height: 44px
  pill-quiet-paper:
    backgroundColor: transparent
    textColor: "{colors.ink-reverse}"
    borderColor: "{colors.hairline-paper}"
    rounded: "{rounded.pill}"
    height: 44px
  waitlist-field-ink:
    backgroundColor: "{colors.ink-2}"
    borderColor: "{colors.hairline-ink}"
    rounded: "{rounded.pill}"
    height: 56px
    width: 480px
    labelTypography: "{typography.label-mono}"
  waitlist-field-paper:
    backgroundColor: "{colors.paper-2}"
    borderColor: "{colors.hairline-paper}"
    rounded: "{rounded.pill}"
    height: 56px
    width: 480px
    labelTypography: "{typography.label-mono}"
  card-ink:
    backgroundColor: "{colors.ink-2}"
    rounded: "{rounded.card}"
  card-paper:
    backgroundColor: "{colors.paper-2}"
    rounded: "{rounded.card}"
  chip:
    rounded: "{rounded.pill}"
    height: 44px
    typography: "{typography.small}"
  example-tag:
    typography: "{typography.label-mono}"
    fontSize: 11px
    height: 24px
    rounded: "{rounded.pill}"
  placeholder-note:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.slate}"
    rounded: "{rounded.card}"
    typography: "{typography.small}"
---

## Overview

anveli is a personal health continuity layer: one living history for your records, wearables, doctor visits and insurance. The website sells a feeling (someone finally has their health in one place and understands it), so it looks like a modern health-lifestyle brand in the family of Whoop, Oura and Optikka, never like a hospital portal.

The whole system grows out of one drawn symbol, the **6A Tangent** mark: three rings and a solid core, every circle touching one point at the bottom. The core is the person; each ring is a layer of a life (years, providers, records, cover). The homepage is built around that mark as a 3D object, the diagrams are tangent rings, the logo animates (breathe, accrue, pulse), and every page repeats the same promise: every layer touches one point, you.

**Key characteristics**

- Ink first. A near-black `{colors.ink}` ground with exactly one soft `{colors.depth}` radial glow behind the mark or the 3D object.
- One paper chapter. The homepage opens into cool `{colors.paper}` daylight for the product parts (parts 5 to 10) and returns to ink at Protect. Both changes are scrubbed opacity on one fixed layer, never a background-colour animation. `/privacy-trust`, `/privacy` and `/terms` are paper pages; the 404 is ink.
- One accent family: `{colors.glacier}` on ink, `{colors.harbor}` on paper (`{colors.harbor-deep}` for accent text). No second hue, no red, no teal, no purple, no pure black or white.
- Geist for everything, JetBrains Mono only for data and labels.
- Full pills and 20px cards. Circles follow the tangent rule.
- Scroll-told motion (GSAP) with calm UI feedback (Motion), and a global Pause motion control.
- Voice: calm, clear, on your side. "You decide." Never diagnosing, predicting or promising.

**Design references.** The awesome-design-md library in `design-references/` shaped the format and three systems informed the content: `apple` (alternating dark and light chapters around one hero object, UI chrome that recedes), `x.ai` (a calm near-black canvas, pill outlines as the interactive vocabulary, a mono caption face) and `nvidia` (dark chapters around a light body, hairlines instead of shadows). Motion and scroll structure come from Optikka and Greenstack (docs/website/01-design-direction.md §3).

**Superseded.** The old "anvelli." / "anveli." period wordmark set in Figtree with a teal dot (`docs/Logo design brief/anvelli-brand/`) is superseded by the 6A package and kept for history only. The brand is **anveli**: lowercase, one "l", no period.

**Sources of truth.** The mark: `docs/new-logo-latest-final/anveli-6a-package/` (the package wins for the mark). Everything else: `docs/website/02-brand-system.md` and `docs/website/03-site-structure.md`. In code, `src/lib/tokens.ts` (JS) and `src/app/globals.css` (`@theme`) hold these exact values. If this file and the code ever disagree, fix whichever is wrong in the same change.

## Colors

The default Tailwind palette is removed in `globals.css` (`--color-*: initial`), so only these colours exist as utilities (`bg-ink`, `text-ice-60`, `border-hairline-paper`, and so on).

### Ink grounds (primary)

| Token | Hex | Use | Contrast |
| --- | --- | --- | --- |
| `{colors.ink}` | `#0B0C0D` | The page ground. | |
| `{colors.depth}` | `#14202A` | **Glow only**: one radial gradient behind a mark or the 3D object. Never a flat fill, never text. | |
| `{colors.ink-2}` | `#12181C` | Raised surfaces on ink: cards, picker items, the phone bezel, the waitlist field. | |
| `{colors.ice}` | `#E9EEF0` | Text on ink, rings of the mark on ink. | 16.7:1 on ink |
| `{colors.ice-60}` | `#9AA6AD` | Secondary text on ink. | 7.9:1 on ink, 7.2:1 on ink-2 |
| `{colors.glacier}` | `#9FD8E8` | The accent on ink: the core, links, focus rings, the "shared" state, the 3D core. | 12.6:1 on ink |
| `{colors.hairline-ink}` | `#2A3238` | Decorative lines and quiet borders on ink. Never text. | |

### Paper grounds (the one light chapter)

| Token | Hex | Use | Contrast |
| --- | --- | --- | --- |
| `{colors.paper}` | `#EEF2F4` | Ground of the paper chapter and the paper pages. | |
| `{colors.paper-2}` | `#E3E9EC` | Bento cells, phone screens, policy cards, the placeholder note. | |
| `{colors.ink-reverse}` | `#0E1A22` | Text on paper, rings of the mark on paper. | 15.7:1 on paper |
| `{colors.slate}` | `#4A5A64` | Secondary text on paper. | 6.4:1 on paper, 5.8:1 on paper-2 |
| `{colors.harbor}` | `#3E8FA8` | Accent on paper for **non-text** use: the core, focus rings, chart lines, markers. | 3.3:1 (graphics only) |
| `{colors.harbor-deep}` | `#2F7389` | Accent **text** on paper: links, inline emphasis, the "What this means for you" line. | 4.7:1 on paper |
| `{colors.hairline-paper}` | `#C9D2D7` | Decorative lines on paper. Never text. | |

### Data state

| Token | Hex | Use |
| --- | --- | --- |
| `{colors.amber-ink}` / `{colors.amber-paper}` | `#E0A85A` / `#A8651A` | **Data state only**: a value outside the person's own baseline in a chart. Never a button, banner or alarm. |

### Rules

- One accent family. `glacier` and `harbor` are the same idea at two lightnesses.
- No red anywhere, no teal, no second blue, no green badges, no neon.
- No pure `#000` or `#FFF`. Hover tints on pills are the only off-token colours (`#D7DFE2` on ice, `#1C2B35` on ink-reverse).
- Text selection: `glacier` on ink, `harbor` on paper.

## Typography

Both faces load through `next/font/google` (`--font-geist`, `--font-jetbrains`) and are SIL OFL.

| Token | Size | Weight | Line height | Tracking | Utility | Use |
| --- | --- | --- | --- | --- | --- | --- |
| `{typography.display}` | clamp(64px, 7.5vw, 120px) | 500 | 1.02 | -0.035em | `text-display` | Hero, page titles |
| `{typography.statement}` | clamp(48px, 6vw, 96px) | 500 | 1.05 | -0.03em | `text-statement` | Big statements, the 404, legal titles |
| `{typography.h2}` | clamp(40px, 4.4vw, 64px) | 500 | 1.05 | -0.03em | `text-h2` | Section headlines |
| `{typography.h3}` | clamp(24px, 2.2vw, 32px) | 500 | 1.2 | -0.02em | `text-h3` | Sub-heads, takeaways |
| `{typography.lead}` | 19px | 400 | 1.55 | 0 | `text-lead` | Support lines, intros, long-read body |
| `{typography.body}` | 17px | 400 | 1.6 | 0 | `text-body` | Default body (max 65ch) |
| `{typography.small}` | 14px | 400 | 1.5 | 0 | `text-small` | Captions, consent lines, footer |
| `{typography.label-mono}` | 12px | 400 | 1.4 | +0.18em, uppercase | `label-mono` | Data labels, values, units, field labels |

Principles:

- Headlines are sentences, at most 8 words; support lines at most 25 words. The hero headline is at most 2 lines on desktop.
- Emphasis uses weight inside the same family. Never a mixed-in serif, never gradient text, never italics as decoration.
- `text-wrap: balance` on headings and `pretty` on paragraphs are set globally.
- Mono is for data first. Mono eyebrows above headlines are capped at 4 on the homepage and allocated centrally.
- The wordmark is Geist 500, lowercase, tracking -0.035em (600 at 16px and below).

## Layout

### Spacing and grid

- **Container:** `container-site`, 1400px max plus the side gutter (16px phones, 32px from 768px, 48px from 1024px).
- **Grid:** `grid-site`, 12 columns with 24px column gaps. Asymmetric compositions (DESIGN_VARIANCE 7): text rarely starts in column 1 on desktop; a common long-read split is text in columns 2 to 7 and a visual in 9 to 12.
- **Reading column:** 65ch (`max-w-prose`).
- **Section rhythm:** `section-y`, 96px on mobile and clamp(160px, 14vw, 240px) from 1024px. Gallery-airy (VISUAL_DENSITY 3): few elements per screen.
- **Nav:** 72px desktop, 64px mobile (`--nav-h`). Anchor links land 72px below the top.
- **Z scale:** ground 0, content 1, raised 10, nav 50, sheet 60, popover 70, grain 100.

### Whitespace philosophy

Group with space and hairlines, not boxes. One message per section: a headline, one short support line, one visual. Every homepage part uses a different layout family.

## Elevation & Depth

| Level | Treatment | Use |
| --- | --- | --- |
| 0 | Flat on the ground | Almost everything. Sections are transparent; the ground layer paints the page. |
| 1 | `ink-2` surface on ink, `paper-2` on paper | Cards, cells, fields, phone screens. |
| 2 | Hairline border (`hairline-ink` / `hairline-paper`) | Quiet pills, tags, section dividers in long text. |
| Paper only | Shadow tinted toward `ink-reverse` at low opacity | Rare: a phone or card resting on paper. On ink, use `ink-2` instead of shadows. |

**Decorative depth** comes from exactly two things:

- **The depth glow.** One `depth` radial gradient per screen, 120% x 100% anchored at the bottom centre of its box and fading to `ink` by 62% (`depth-glow` utility), behind the 3D rings, a large mark or the 404 mark. Never animated, never neon.
- **Grain.** One static 256px tile (`public/brand/grain.webp`) in a fixed full-screen overlay at the top of the z scale: `soft-light` at 0.06 on ink, `multiply` at 0.04 on paper. Off under `prefers-reduced-transparency`, `forced-colors` and print. Never baked into photos, previews or renders.

No glass panels in the UI (glass lives only in the 3D rings), no glows beyond depth, no animated backgrounds.

## Shapes

| Token | Value | Use |
| --- | --- | --- |
| `{rounded.pill}` | 9999px | Buttons, chips, inputs, tags. Inputs match the button pill. |
| `{rounded.card}` | 20px | Media, cards, bento cells, phone screens, notes. |
| `{rounded.full}` | 9999px | The core, markers, avatar frames. |

**Circles are the brand's shape, and every circle follows the tangent rule:** when circles nest, they touch at one point at the bottom (centre y = tangent - r). Never concentric, never centred, never a target or radar. The app-icon tile radius from the package is for icons only. No cards inside cards.

## Components

### Navigation

A quiet fixed bar, 72px (64px mobile), on one line: the lockup (the nav's living mark pulses once on first load), How it works, Privacy (`/privacy-trust`), About, a Pause motion toggle and the Join the waitlist pill. It follows the ground through `html[data-ground]`. Mobile opens a sheet with its own scroll (`data-lenis-prevent`).

### Buttons and pills

- **Primary:** `{components.pill-primary-ink}` (ice fill, ink text) or `{components.pill-primary-paper}` (ink-reverse fill, paper text). 44px tall (48px large), Geist 500 at 15px (16px large).
- **Quiet:** `{components.pill-quiet-ink}` / `{components.pill-quiet-paper}`: transparent with a hairline border; the border darkens on hover.
- Press feedback: `spring.press` to scale 0.97. Hover: colour only, `dur.micro`.
- One CTA label everywhere: **Join the waitlist**. Other actions use quiet pills or text links.

### Waitlist field

The same component everywhere (hero, nav sheet, footer, `/privacy-trust`). Idle pill "Join the waitlist" -> open field (the pill widens to 480px, full width on mobile, shared `layoutId`, `spring.ui`) with a visible mono label "Email" above it -> submitting (a 20px living mark looping accrue inside the button, `aria-busy`) -> error (inline text, announced, a shake of at most 4px) or success ("You're on the list." with a 20px mark playing added once) -> an optional follow-up with chips. Field: 56px pill, `ink-2` / `paper-2` fill with a hairline border that darkens on focus. Consent line under it: "We'll only email you about anveli. Privacy policy."

### Cards

`{components.card-ink}` and `{components.card-paper}`: flat surfaces with a 20px radius and no shadow on ink. Used only when they mean something: a bento cell, a phone screen, a policy layer, a picker item. Never three equal cards in a row.

### Chips and tags

- **Chips** (waitlist follow-up, filters): 44px pills, Geist 14px, hairline border at rest, filled with the ground's primary colour when chosen.
- **Example tag** (`{components.example-tag}`): mono 11px uppercase in a 24px hairline pill. Every sample value on the site carries one.
- **Placeholder note** (`{components.placeholder-note}`): a calm `paper-2` card with a light Phosphor Info icon in `harbor`, used on draft legal pages. Never styled as an alarm.

### Product previews

Real React components (the baseline chart, source chips, phone screens, the purpose picker, ring diagrams), never div screenshots or images of UI. Values come from `src/lib/example-data.ts`, all labelled Example, with Indian names and places. Mono for values, units, dates and sources. The purpose picker states "Shared" / "Not shared" in text, not only by colour.

### The mark and ring diagrams

- **Symbol** (`MarkSymbol`): three rings (40, 29, 18.5) and a solid core (9), stroke 3, all tangent at y 90 in a 100 box. On ink: ice rings, glacier core. On paper: ink-reverse rings, harbor core.
- **Optical symbol** at 32px and below: one ring (r 38, stroke 11) plus the core (r 14). Never thicken the full mark; switch to the optical one.
- **Lockups** (`Lockup`): horizontal (symbol 1.15em, gap 0.3em, centred on the x-height) and stacked (symbol 1.7em, gap 0.36em). Clearspace: the core's diameter x 2. Screen floor 16px.
- **Living mark** (`LivingMark`, a port of the package script on GSAP's ticker): breathe (inner rings about +-7%, out of phase, about 7s, stops after 2 cycles), accrue (a ring born from the core, every layer moves out, about 1.8s, played once), added (the core swells and the pulse travels out ring by ring, 80ms apart, 0.9s). Static under reduced motion; paused off screen and by Pause motion.
- **Ring diagrams:** every diagram is tangent rings. Radii extend the mark's own step (9, 18.5, 29, 40, 51, then +11), same stroke, same colours. Diagrams draw from the tangent point outward with DrawSVG (a path whose midpoint is the tangent point, drawn "50% 50%" -> "0% 100%").
- **Don't:** centre the rings, rotate the mark, colour-code rings, add a period to the wordmark, set it in Figtree, or put the mark on a busy photo without a solid plate.

### Footer

On ink on the homepage (the sticky-footer reveal with the stacked lockup finale in a depth glow), following the page's ground elsewhere. Links: Privacy and trust, Privacy policy, Terms, Contact. The disclaimer is always present: "anveli helps you understand and organise your health information. It does not give medical advice or diagnoses. In an emergency, contact your local emergency services."

## Motion

Every animation has a job: storytelling (the rings accruing), hierarchy (revealing the one thing to read), feedback (press, form states, the mark's pulse) or state change (the privacy picker). Only `transform` and `opacity` animate, plus SVG `stroke-dashoffset` (DrawSVG), circle attributes in the living mark and shader uniforms.

### Library split (one engine per element)

| Engine | Owns | Never |
| --- | --- | --- |
| **GSAP** (ScrollTrigger, SplitText, DrawSVG, MotionPath, CustomEase), via `useGSAP({ scope })` and `gsap.matchMedia()` | Everything tied to scroll: pins, scrubs, line reveals, ring diagrams drawing, the ground changes. | UI state the user toggles. |
| **Motion** (`motion/react`) | UI state and gesture: the picker, waitlist states, menus, carousel drag, hover and press, one-off `whileInView` entrances outside pinned parts, the 404 ring. | Reading scroll inside a pinned part. |
| **Three.js / R3F** | The 3D rings canvas only (the site's one WebGL context). | Anything in the DOM. |
| **LivingMark** | The animated logo, stepped by GSAP's ticker. | Anything that isn't the mark. |
| **Lenis** | Smooth scroll on GSAP's ticker (`lerp 0.1`, `syncTouch false`). Off under reduced motion. | Its own animation frame loop. |

### Tokens

| Token | Value | Use |
| --- | --- | --- |
| `ease.out` | `cubic-bezier(0.16, 1, 0.3, 1)` / GSAP `anveli.out` | Every reveal. |
| `ease.inOut` | `cubic-bezier(0.65, 0, 0.35, 1)` / GSAP `anveli.inOut` | Things that travel and stop. |
| `ease.scrub` | GSAP `none` | Anything scrubbed by scroll (the only linear motion, plus a marquee's constant speed). |
| `spring.ui` | stiffness 100, damping 20 | Layout changes, the picker, the carousel, the 404 ring settling. |
| `spring.press` | stiffness 400, damping 30 | Press (scale 0.97) and toggles. |
| `dur.micro` / `ui` / `reveal` | 150 / 250 / 900ms | Hover / state changes / headline masks. |
| `dur.pulse` / `accrue` / `draw` / `settle` | 900 / 1800 / 1600 / 1200ms | Mark pulse / mark accrue / ring draw / large slow moves. |
| `stagger.lines` / `items` / `rings` | 0.08 / 0.05 / 0.08s | Headline lines / list items / ring-by-ring. |

### ScrollTrigger conventions

- Pinned part: `start: "top top"`, `end: "+=<length>"`, `pin: true`, `scrub: true`, `anticipatePin: 1`. Exception: the `/privacy-trust` side illustration pins from `top 96px` to the last section's end without pin spacing.
- Scrubbed in-view effect: `start: "top bottom"`, `end: "bottom top"`, `scrub: 0.6`.
- One-off reveal: `start: "top 80%"`, `once: true`, `ease.out`, `dur.reveal` (`LineReveal`).
- Never `window.addEventListener('scroll')`, never React state for scroll values, never layout properties or `background-color`.

### Ambient loops and reduced motion

- The hero breathe, the marquee and every living mark obey one global **Pause motion** state (`html[data-motion="paused"]`, remembered for the session). Nothing moves on its own for more than 5 seconds without that control.
- `prefers-reduced-motion`: no pins, final states shown, text appears without splitting, the marquee is static, every living mark is static, ground changes are instant, Lenis is off.

## Do's and Don'ts

### Do

- Keep ink primary and use the one paper chapter for daylight moments.
- Put one depth glow behind the one hero object per screen.
- Draw every ring tangent at one point at the bottom, from `MARK` in `src/lib/tokens.ts`.
- Use `harbor-deep` for accent text on paper and `harbor` only for graphics.
- Label every sample value "Example".
- Write short, concrete sentences where the person decides: "you choose", "only when you say so".
- Use Phosphor icons (regular or light, consistently) and real photography of real people in daylight.

### Don't

- Don't use red, teal, purple, neon, glows beyond depth, glass panels, mesh or animated backgrounds.
- Don't use em dashes or en dashes in site copy, or "seamless / elevate / unleash / empower / revolutionise / next-gen".
- Don't diagnose, predict, promise outcomes or guarantee insurance claims. No fear hooks, no invented numbers, no fake testimonials.
- Don't add eyebrows above headlines beyond the page budget, three equal cards, scroll cues, decorative dots, pills on photos, or div-built fake screenshots.
- Don't centre or rotate the mark, colour-code its rings, thicken the full mark, or bring back the period wordmark.
- Don't use two animation engines on one element.

## Responsive Behavior

### Breakpoints

| Name | Width | Key changes |
| --- | --- | --- |
| Mobile | < 768px | One column; 16px gutter; 64px nav with a sheet; every pinned part has its own mobile choreography or none; the 3D canvas uses static fallbacks. |
| Tablet | 768 to 1023px | Follows desktop unless a spec says otherwise; 32px gutter. |
| Desktop | >= 1024px | Full 12-column compositions, 48px gutter, pinned scroll story. |
| Wide | >= 1440px | Content holds at 1400px; margins grow. |

`gsap.matchMedia()` splits `(min-width: 768px)` from `(max-width: 767.98px)` and `(prefers-reduced-motion: no-preference)` from `reduce`, so each part builds only the choreography for its state.

### Touch targets

Every interactive element is at least 44 x 44px: pills (44 or 48px), chips (44px), the Pause motion toggle (44px), the waitlist submit (44px inside a 56px field).

### Collapsing strategy

- Asymmetric splits stack: the visual goes above or below the text as each section's spec says.
- Pinned side visuals (the `/privacy-trust` rings) are dropped on mobile for a small static version under the title.
- Display type scales with `clamp()`; headlines never exceed 2 lines in the hero.

### Image behavior

Every image has explicit width and height or an aspect ratio (CLS < 0.1). Static export: plain `<img>` or `next/image` with `unoptimized`. Placeholders use `picsum.photos/seed/anveli-<id>/<w>/<h>` at the final ratio until real photography lands. No grain baked in.

## Accessibility

- Contrast AA or better: body on ink uses `ice` / `ice-60`; on paper, `ink-reverse` / `slate`; accent text on paper is `harbor-deep`.
- Real headings in order, one `h1` per page. A "Skip to content" link targets `#main`.
- Visible focus everywhere: a 2px ring with 3px offset, `glacier` on ink and `harbor` on paper (`.on-ink` / `.on-paper` on containers).
- Keyboard: tabs use arrow keys, Home and End; hold-to-approve works with Space or Enter; Escape closes the open waitlist field.
- `aria-live="polite"` for waitlist errors and success, and the picker summary. States are also written in text, never colour alone.
- Decorative SVG (marks, rings, the 3D canvas) is `aria-hidden`; its meaning is told in the adjacent text.
- Reduced motion and Pause motion are honoured by every animated part.

## Iteration Guide

1. Change a token in three places together: `src/lib/tokens.ts`, `src/app/globals.css` (`@theme`) and this file's front matter. Then update `docs/website/02-brand-system.md` if the rule changes.
2. Reference tokens by name (`{colors.harbor-deep}`, `text-h2`, `rounded-card`, `DUR.reveal`); never inline a hex or a duration.
3. New ring motifs must be derived from `MARK` and pass the tangent rule before anything else.
4. When a part needs emphasis, change the ground or give it more space before adding chrome.
5. Any deliberate change to a Build spec (numbers, windows, eases, states) is written back into `docs/website/03-site-structure.md` in the same change.
6. Before shipping, search the source for `—`, `–`, "Avelli", "anvelli", "anveli." (period wordmark), "Figtree", "teal", "seamless", "elevate", and confirm every sample value is labelled Example.

## Known Gaps

- `ink-2` and `paper-2` were proposed values and are in use; confirm them in context during the review phase.
- The waitlist provider (Loops or Formspree), domain, analytics and the contact email are open decisions (docs/website/04-build-plan.md §10).
- `/privacy` and `/terms` carry placeholder text that needs legal review before launch; they are noindex until then.
