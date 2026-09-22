# Brand System for the Website

Status: planned, updated after the reference audit ([05-reference-audit.md](05-reference-audit.md)). It will be turned into the root `DESIGN.md` (awesome-design-md format) when building starts. It is based on the logo package in `docs/Logo design brief/anvelli-brand/`, corrected to the name **anveli.**

## 1. Logo

### Wordmark

- Text: `anveli.`, always lowercase and never capitalised.
- Typeface: Figtree, weight 500 (600 at 20px or smaller, 700 at 14px or smaller).
- Tracking: -0.035em. Never re-track or re-space.
- The period is the accent: teal `#1F8C77` on light grounds, `#7FD1C1` on dark grounds.
- On any ground that is not near-black or near-white, use the mono version (the dot takes the word's colour).
- Clearspace: the cap height of the "l" on all sides. Minimum size: 14px tall on screen. Below that, use the icon.

### Icon

- "a." on a rounded tile with a radius of 23% of the tile.
- At 16px (favicon), drop the dot and set the "a" at weight 700.
- Variants: ink tile, paper tile, teal tile.

### Logo changes planned

1. **Correct the name**: regenerate every lockup PNG as "anveli." and add outlined SVGs for large and print use.
2. **Motion signature** (new): on first load the dot drops onto the baseline with a small settle, as if the person has "arrived". The drop is about 400ms, spring-eased, and plays once. With reduced motion it's shown static.
3. **The dot as a system element**: the same dot is the travelling "you" marker on the thread, and the end-point of the thread in the footer wordmark. No new symbol is added; the brief's "wordmark only" rule stays.

Don't: italicise, outline, add a shadow or gradient, rotate, colour the word instead of the dot, or place the mark on a busy photo without a solid plate.

### Logo shader moments

The flat mark is always the source of truth. A shader treatment is allowed in **exactly two places**, and in both it resolves into the flat mark:

| Where | Behaviour |
| --- | --- |
| Footer wordmark (part 13, on ink) | Plays **once per page load** when the footer is at least 60% in view. It runs for about 2.5s, then crossfades (400ms) to the flat SVG wordmark and the shader canvas unmounts. |
| 404 page mark | Plays once on load (about 4s), then settles to flat. Hovering or tapping the mark replays it. It never loops on its own, so nothing moves for longer than 5 seconds without the user asking. |

Rules:

- **Shader:** Paper Shaders `LiquidMetal` from `@paper-design/shaders-react`, fed the outlined "anveli." SVG as its shape. `Heatmap` is the documented alternative if `LiquidMetal` still reads as chrome after tuning. The choice is made side by side in build phase 2 and recorded here.
- **Palette, not chrome:** the back colour is `ink`, the tint is `teal-light`, and highlights never go brighter than `paper`. It should feel like dark satin or wet ink, not a mirror. No rainbow or iridescent tints.
- **Settle, don't loop:** the effect's distortion eases to zero and the final frame matches the flat wordmark's position and size exactly, so the crossfade is invisible.
- **The dot stays teal** in the flat end state, and the page's 2D thread ends at it (part 13).
- **Reduced motion, no WebGL, or low power:** show the flat mark only. The shader is never required to read the logo.
- **Don't** use the shader on paper grounds, in the nav, in the hero, on the icon or favicon, or in any repeated element.

The liquid-logo repo (PolyForm Shield licence) is not used; the same effect comes from Paper Shaders under Apache 2.0. See [05-reference-audit.md](05-reference-audit.md).

## 2. Colour

| Token | Hex | Use |
| --- | --- | --- |
| `paper` | `#F4F3F1` | Main page ground |
| `paper-2` | `#ECEAE6` (to confirm) | Slightly deeper paper for bento cells and phone screens |
| `ink` | `#0B0C0D` | Text on paper; ground for the Protect chapter and footer |
| `ink-2` | `#16181A` (to confirm) | Raised surfaces on ink |
| `ink-60` | `#595E62` (to confirm, must be at least 4.5:1 on paper) | Secondary text on paper |
| `muted` | `#9BA1A6` | Decorative only: hairlines, disabled marks. Only 2.4:1 on paper, so never for text. |
| `teal` | `#1F8C77` | The accent on paper: the dot, links, focus rings, the thread core |
| `teal-light` | `#7FD1C1` | The accent on ink |
| `amber` | to define, soft and desaturated | **Data state only**: a value outside the person's baseline in charts. Never a button or a banner. |

Rules:

- One accent (teal) for the whole site. The colour lock applies: no blue link in section 9, no green badge in the footer.
- No red anywhere. Health anxiety is real, and we never signal alarm on a marketing page.
- No pure `#000` or `#FFF`.
- Shadows are tinted toward paper (warm grey at low opacity), never black.
- Note: the taste skill bans warm "cream" grounds by default. `#F4F3F1` is a brand-specified colour, which is the skill's allowed override. We avoid the rest of that cliché (no brass, clay or espresso tones).

## 3. Typography

| Role | Font | Weight | Notes |
| --- | --- | --- | --- |
| Display (hero, big statements) | Figtree | 500 | Tight tracking (about -0.035em), line-height 1.0 to 1.05 |
| Headings | Figtree | 500 to 600 | |
| Body | Figtree | 400 | 16 to 18px, line-height about 1.6, max 65ch |
| Labels, values, metadata | JetBrains Mono | 400 to 500 | Uppercase, +0.18em tracking, small sizes |

- Both fonts load through `next/font/google`, replacing the Geist fonts from the scaffold.
- Suggested scale (fluid with `clamp`): display 64 to 120px, h2 40 to 64px, h3 24 to 32px, body 17px, small 14px, mono label 12px.
- The hero headline is at most 2 lines on desktop. Emphasis uses the same family (italic or weight), never a mixed-in serif.
- Mono labels above headings ("eyebrows") are limited to 1 per 3 sections. Mono is mainly used for data: values, dates, units and source names inside product previews.

## 4. Shape, space and depth

- **Radius rule:** buttons and chips are full pills, media and cards are 20px, inputs match the button pill. This is the same everywhere.
- **Spacing:** gallery-airy. Sections are separated by roughly 160 to 240px on desktop and about 96px on mobile. Content max width is about 1400px, with a 16px minimum side gutter on phones.
- **Cards only when they mean something** (a bento cell, a phone screen, a policy layer). Otherwise group with space and hairlines. No cards inside cards.
- **Grain:** a very subtle paper grain, the site's only atmosphere. Spec:

  | Property | Value |
  | --- | --- |
  | Source | A static, seamless 512×512 tile exported **once** from Paper Shaders (Paper Texture or Grain) in monochrome and committed as `public/brand/grain.webp` (under 40 KB). No shader runs at runtime. |
  | Layer | One `position: fixed; inset: 0; pointer-events: none` element at the top of the z-index scale, `aria-hidden`. Never on scrolling containers, and never animated. |
  | Blend | `mix-blend-mode: multiply` over paper. |
  | Opacity | `--grain-opacity: 0.05` on paper (tune between 0.035 and 0.06; body text must still pass AA). Reduced to about 0.03 on the ink chapter, with `soft-light` blending. |
  | Off when | `prefers-reduced-transparency: reduce`, `forced-colors: active`, and print. |
  | Photos and previews | Grain is never baked into photos, product previews or the ribbon. Everything gets it only from the one shared overlay, so the texture is identical everywhere. |

## 5. Iconography

- Phosphor Icons, one weight (regular or light) across the site.
- Components pulled from any registry (Kokonut, Watermelon, React Bits, Skiper, Fancy) that ship with lucide or other icons get swapped to Phosphor.
- No hand-drawn icon SVGs and no emoji.

## 6. Motion principles

- **Every animation has a job:** storytelling (the braid), hierarchy (revealing the one thing to read), feedback (button press, form states) or state change (the privacy picker).
- **Only animate `transform` and `opacity`**, plus SVG `stroke-dashoffset` (DrawSVG) and shader uniforms. Scroll-linked values go through ScrollTrigger callbacks, refs or uniforms, never React state.
- **No linear easing** except where the motion is scrubbed by scroll (scroll is the easing) or a marquee's constant speed.
- **Reduced motion:** the ribbon becomes a static image, pinned sections become normal stacked sections, the marquee stops, text appears without splitting, and the logo moments show the flat mark.

### Library split

| Engine | Owns | Never |
| --- | --- | --- |
| **GSAP** (ScrollTrigger, SplitText, DrawSVG, MotionPathPlugin, CustomEase) | Everything tied to scroll: pins, scrubs, the braid's progress, headline and word reveals, the 2D thread drawing and the dot travelling along it. | UI state that the user toggles. |
| **Motion** | UI state and gesture: the privacy picker, waitlist states, mobile menu, phone carousel drag, hover and press feedback, the logo dot drop, simple one-off `whileInView` entrances outside pinned parts. | Reading scroll inside a pinned part (no `useScroll` there). |
| **Three.js (react-three-fiber)** | The ribbon canvas only. | Anything in the DOM. |
| **Paper Shaders** | The two logo moments. | Backgrounds or anything that loops. |
| **Lenis** | Smooth scroll, stepped by GSAP's ticker. | Running its own animation frame loop. |

A single DOM element is animated by **one** engine only. Each animated piece is its own small client component.

### Motion tokens

These names are used in the section specs in [03-site-structure.md](03-site-structure.md). They live in code in `lib/tokens.ts` (GSAP eases are registered once in `components/motion/gsap.ts`).

**Eases**

| Token | Value | Use |
| --- | --- | --- |
| `ease.out` | CSS `cubic-bezier(0.16, 1, 0.3, 1)`; GSAP `CustomEase.create("anveli.out", "0.16,1,0.3,1")` | Every reveal: line masks, fades, the photo settling, the loop drawing. |
| `ease.inOut` | CSS `cubic-bezier(0.65, 0, 0.35, 1)`; GSAP `CustomEase.create("anveli.inOut", "0.65,0,0.35,1")` | Things that travel and stop: the dot's lap in part 8, the picker's items moving. |
| `ease.scrub` | GSAP `"none"` | Anything scrubbed by scroll. |
| `spring.ui` | Motion `{ type: "spring", stiffness: 100, damping: 20 }` | Layout changes, the picker, the carousel. |
| `spring.press` | Motion `{ type: "spring", stiffness: 400, damping: 30 }` | Button press (scale 0.97) and toggle feedback. |
| `spring.dot` | Motion `{ type: "spring", duration: 0.4, bounce: 0.35 }` | The logo dot drop and the waitlist success dot. One small overshoot, then still. |

**Durations**

| Token | Value | Use |
| --- | --- | --- |
| `dur.micro` | 150ms | Hover colour, underline, press. |
| `dur.ui` | 250ms | Tabs, field state changes, menu items. |
| `dur.reveal` | 900ms | Headline line masks, paragraph reveals. |
| `dur.draw` | 1600ms | A thread path drawing itself on enter (part 8). |
| `dur.settle` | 1200ms | Large, slow moves (photo scale when not scrubbed, logo crossfade chains). |

**Staggers**

| Token | Value | Use |
| --- | --- | --- |
| `stagger.lines` | 0.08s | Lines of a headline. |
| `stagger.items` | 0.05s | Menu links, chips, list rows. |
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
| Braid | Remembered. Then understood. |
| Everyday life | Your health doesn't only happen at the clinic. |
| Protect | Having your information should never mean sharing it. |
| Insurance | I'm being admitted tomorrow. What am I covered for? |
| CTA label (everywhere) | Join the waitlist |
| Disclaimer | anveli helps you understand and organise your health information. It does not give medical advice or diagnoses. |
