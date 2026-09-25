# Site Structure and Section Specs

Status: built (September 2026). Where the build deliberately departs from a Build spec below, the change is listed in [04-build-plan.md §11](04-build-plan.md#11-as-built-september-2026). Updated after the reference audit ([05-reference-audit.md](05-reference-audit.md)) and rebuilt around the **6A Tangent** mark. It describes every page and every homepage section: purpose, layout, copy, and a **Build spec** (source components, scroll choreography, and desktop, mobile and reduced-motion states). Copy is draft. Colour and type tokens, the living mark, motion tokens (`ease.*`, `dur.*`, `spring.*`, `stagger.*`) and voice rules are in [02-brand-system.md](02-brand-system.md).

How to read a Build spec:

- **Source** names the exact component we start from (library, item, licence). "Reference" means we study it and write our own; "Use" means we install or copy it and restyle it to our tokens.
- **Choreography** gives the engine (GSAP, Motion, R3F or LivingMark), the trigger, `start`/`end`, whether it pins and for how long, and what happens across progress 0 to 1.
- **States** gives desktop (≥ 1024px), tablet (768 to 1023px, follows desktop unless stated), mobile (< 768px) and reduced motion.

Numbers are starting values. If one changes during the build, update it here so this doc stays the source of truth.

## 1. Sitemap (phase 1)

| Route | Ground | Purpose |
| --- | --- | --- |
| `/` | Ink, with one paper chapter (parts 5 to 10) | The scroll story and waitlist |
| `/privacy-trust` | Paper | An editorial long-read on how anveli treats your information (a selling point, not legal text) |
| `/privacy` | Paper | Privacy policy (placeholder, **needs legal review**) |
| `/terms` | Paper | Terms of use (placeholder, **needs legal review**) |
| `/404` | Ink | A ring that doesn't touch the person, and "This page isn't part of the story." with a link home |

Nav links: **How it works** (anchor to the seven verbs) · **Privacy** (`/privacy-trust`) · **Join the waitlist** (pill). (An "About" link to "What we're not" was dropped in the build: with no About content yet, it promised something the page didn't have. Add it back with a real About page.)

Later phases, only when there is content: an Insurance deep-dive page, a For families page, and an About/team page.

## 2. Homepage rules

- 13 parts. Every one uses a **different layout family**. There's one marquee (part 12) and **one paper chapter** (parts 5 to 10), entered and left with a scrubbed ground change.
- At most 4 mono eyebrows on the whole page.
- One CTA label everywhere: **Join the waitlist**.
- Each part has **one** message: a headline of 8 words or fewer, 25 words or fewer of support, and one visual.
- Every sample value is labelled **Example**.
- Every ring drawn on the page follows the mark's rule: rings touch one point, never centred.
- No preloader, no scroll cue, no animated background. The grain overlay ([02-brand-system.md](02-brand-system.md) §4) sits over everything.
- Ambient loops (the hero's breathe, the marquee, the finale mark's breathe) obey the one global "Pause motion" state ([02-brand-system.md](02-brand-system.md) §6).

### 2.1 Ground changes

The page base is `ink`. One fixed full-bleed `paper` layer sits behind all content at opacity 0.

| Change | Trigger | Scrub | Also switches |
| --- | --- | --- | --- |
| Ink → paper | Part 5, `start: "top 75%"`, `end: "top 25%"` | `scrub: true`, opacity 0 → 1 | At the midpoint: the nav to its paper variant and the grain blend to `multiply` (class on `<html>`) |
| Paper → ink | Part 11, `start: "top 75%"`, `end: "top 25%"` | `scrub: true`, opacity 1 → 0 | At the midpoint: the nav back to ink and the grain back to `soft-light` |

Only the layer's opacity animates, never `background-color`. Text in parts 5 to 10 is styled for paper and text in 11 to 13 for ink from the start; the ground change happens while the section's top is still low on the screen, so text never sits on the wrong ground. With reduced motion the changes happen instantly at `top 50%`.

### 2.2 Component map

| Part | Ground | Engine | Main source |
| --- | --- | --- | --- |
| 1 Navigation | follows the page | GSAP (lockup shrink) + Motion (menu, hovers) + LivingMark | skiper41 Progressive Blur (use), skiper58 Text roll navigation (use), React Bits Staggered Menu (reference) |
| 2 Hero | ink | GSAP SplitText + R3F | Fancy Vertical Cut Reveal and skiper66 SVG clip mask (reference) |
| 3 Problem | ink | GSAP ScrollTrigger + SplitText | React Bits Scroll Reveal (reference), Fancy Parallax Floating (reference, adapted to scroll) |
| 4 The rings | ink | GSAP ScrollTrigger → R3F uniforms | Own scene; React Bits Fluid Glass and liquid-glass-js (material reference), ThreeUI "Predictive Arc" (fragments reference) |
| 5 Everyday life | paper (enters) | GSAP scrub | skiper34 Scroll images reveal 003 (reference) |
| 6 Seven verbs | paper | GSAP horizontal pan + DrawSVG + MotionPath | Taste skill §5.B skeleton, skiper19 SVG follow scroll (reference) |
| 7 Bento | paper | Motion + Bklit | Bklit line chart (use), Fancy Typewriter (use), Kokonut `type-writer` (fallback) |
| 8 Continuity ring | paper | GSAP DrawSVG + MotionPath | Own SVG |
| 9 In your hand | paper | Motion + LivingMark | skiper48 Card swipe carousel (use), Watermelon `card-swipe` (fallback) |
| 10 Insurance | paper | GSAP sticky-stack | Taste skill §5.A skeleton, skiper16 / skiper17 Card stack scroll (reference) |
| 11 Protect | ink (returns) | GSAP (ground) + Motion (picker, hold) | Watermelon `fluid-tabs` (use), React Bits Hold Button or Kokonut `hold-button` (use) |
| 12 What we're not | ink | Motion | Fancy Marquee Along SVG Path (use, on a ring's arc) |
| 13 Final CTA and footer | ink | LivingMark + GSAP | Fancy Sticky Footer (use) |
| Waitlist field | any | Motion + LivingMark | skiper106 Smooth caret input (use), Watermelon `floating-input` (label reference) |
| 404 | ink | Motion + LivingMark | Own SVG |

### 2.3 Scroll budget (desktop, 1440×900)

| Part | Section height | Pin length |
| --- | --- | --- |
| 2 Hero | 100vh | none |
| 3 Problem | 100vh | 120vh |
| 4 The rings | 100vh | 250vh |
| 5 Everyday life | about 100vh | none |
| 6 Seven verbs | 100vh | about 220vw of horizontal travel (≈ 350vh) |
| 7 Bento | about 130vh | none |
| 8 Continuity | about 100vh | none |
| 9 In your hand | about 110vh | none |
| 10 Insurance | 100vh | 150vh |
| 11 Protect | about 150vh | none |
| 12 What we're not | about 70vh | none |
| 13 Footer | about 100vh | none (revealed from underneath) |

That totals about 20 screens. If it feels long in the phase 3 review, shorten the pins of parts 4 and 6 first, never by more than a third.

## 3. Homepage, part by part

### Part 1. Navigation

- **Layout:** the lockup (symbol + "anveli") on the left, 3 text links in the centre-right, then a small Pause motion button and the pill CTA on the right. Height 72px on desktop and 64px on mobile, transparent, with a blur plate once you scroll.
- **Greenstack move:** the hero shows the lockup large. On scroll it scales down and flies into the nav position.
- **Signature:** on first load the nav symbol plays the living mark's **added** pulse once.
- **Mobile:** lockup plus menu button; the menu is a full-height sheet with big links, the Pause motion toggle and the waitlist field.
- **Reduced motion:** the lockup is already small in the nav, with no fly-in and no pulse.

**Build spec**

- **Source:** skiper41 Progressive Blur (use) for the plate; skiper58 Text roll navigation (use) for link hover; React Bits Staggered Menu (reference) for the mobile sheet's rhythm, rebuilt in Motion.
- **Lockup:** inline SVG symbol plus live Geist text, using the package ratios (symbol 1.15em, gap 0.3em). At nav size the wordmark is 22px, which makes the symbol about 25px. That's under the package's 32px limit, so the nav uses **the optical symbol**. In the hero the lockup starts at a 56px wordmark with the full symbol (about 64px).
- **Lockup shrink (GSAP):** one lockup element. At page top it sits 96px from the top at 56px. A ScrollTrigger on the document, `start: 0`, `end: 240` (pixels), `scrub: true`, moves it into the nav slot at 22px using `scale` and `translate` only. The full symbol crossfades to the optical symbol at 60% of the scrub (both are in the DOM; only opacity changes).
- **Signature (LivingMark):** 400ms after the headline reveal finishes, `set('added')` once per session (`sessionStorage`, wrapped in try/catch).
- **Plate:** a ScrollTrigger at `start: 24` toggles `data-scrolled`. The plate fades in over `dur.ui`: the current ground at 72% opacity plus the progressive blur (strongest at the top edge). With `prefers-reduced-transparency` it's solid.
- **Ground variants:** ink variant by default (`ice` text, `glacier` core). The paper variant (`ink-reverse` text, `harbor` core) is switched by the ground changes in §2.1.
- **Links:** Geist 15px. Hover plays the text roll (`dur.ui`, `ease.out`). Focus shows a 2px accent ring (`glacier` or `harbor`) with 3px offset.
- **Pause motion:** a 44px icon button (Phosphor Pause/Play) with the accessible name "Pause motion" / "Play motion", toggling the global motion state.
- **CTA pill:** height 44px. On ink: `ice` fill, `ink` text. On paper: `ink-reverse` fill, `paper` text. `spring.press` on press. It opens the waitlist field in the hero if the hero is in view; otherwise it opens it in a popover under the pill.
- **Mobile sheet (Motion):** a 44×44 menu button. The sheet slides down (`y: -100% → 0`, `spring.ui`) on the current ground. Links are set at 40px and enter with `stagger.items`, followed by the Pause motion toggle and the waitlist field. The sheet traps focus, closes on Escape and returns focus to the button, and calls `lenis.stop()` while open (`lenis.start()` on close).
- **States:** mobile has a 64px bar, no text links, and the lockup shrinks from 40px to 20px (optical symbol throughout). Reduced motion shows the nav-size lockup from the start, a solid plate and a sheet that appears without sliding.

### Part 2. Hero

- **Purpose:** the first impression. The mark as an object, and the motto.
- **Layout:** object-first on ink. The 3D rings sit in their **fragments state** (broken arcs floating apart) inside the depth glow, filling the right two-thirds. The headline sits bottom-left, Optikka style, with the sub and CTA underneath. The hero, headline and CTA must be visible without scrolling on a 1280×720 laptop.
- **Copy:**
  - H1: **Your health, understood.**
  - Sub: anveli keeps your records, wearables and everyday health in one living history that grows with you.
  - CTA: Join the waitlist (opens the inline field; see section 4).
- **Motion:** the fragments drift slowly; the pointer adds a very small parallax. The headline appears line by line (a mask reveal), not letter by letter.
- **Mobile:** a static render of the fragments above the text; the text stacks below.
- **Reduced motion:** the same static render with no drift.

**Build spec**

- **Source:** Fancy Vertical Cut Reveal and skiper66 SVG clip path mask (reference) for the line mask. Built with GSAP SplitText.
- **Grid:** 12 columns, 24px gutters, max width 1400px. Text block in columns 1 to 6, anchored 64px above the bottom of the viewport. The object's tangent point sits at about 66% of the width and 72% of the height.
- **Glow:** one `depth` radial gradient centred under the object, as specified in 02 §4. It's static.
- **Type at 1280×720:** H1 at `clamp(64px, 7.5vw, 120px)` (96px here), 2 lines, line-height 1.02, tracking -0.035em, `ice`. Sub at 19px, `ice-60`, 60ch max, 24px below the H1. CTA 32px below the sub. At 720px tall everything must fit above the fold with at least 48px to spare.
- **Headline reveal (GSAP):** `SplitText.create(h1, { type: "lines", mask: "lines", autoSplit: true })`. Lines go from `yPercent: 100` to `0` over `dur.reveal` with `ease.out` and `stagger.lines`. It starts after `document.fonts.ready`, and it must start within 100ms of first paint. The H1 is real server-rendered text, so it stays the LCP element.
- **Sub and CTA:** fade from opacity 0 to 1 and `y` 12 to 0 over `dur.reveal` with `ease.out`, 200ms after the last headline line starts.
- **Object:** see §3.1 "The rings stage". Pointer parallax rotates the group about the vertical axis through the tangent point by at most ±3° (the point never moves), eased with a 0.05 lerp in `useFrame`. There's no pointer effect on touch devices.
- **States:** mobile shows the fragments fallback render at 4:5, full width, above the text; the H1 is `clamp(44px, 12vw, 64px)`. Reduced motion shows the same static render and the headline, sub and CTA simply visible.

### 3.1 The rings stage (parts 2 to 4)

Parts 2, 3 and 4 share **one** canvas. The whole story of the object lives in one place so it's easy to tune.

- **Structure:** a wrapper `RingsStage` holds parts 2 to 4. The canvas sits inside it with `position: sticky; top: 0; height: 100vh` and a `-100vh` bottom margin, so the parts scroll over it. When the wrapper ends (after part 4's pin), the canvas scrolls away with it. Once it's fully off screen the render loop stops (`frameloop="never"`), and restarts if you scroll back.
- **The object:** the 6A construction in 3D. Three rings and a core, all tangent at one point on the vertical axis, with the package's proportions (R, 0.725R, 0.4625R, core 0.225R). Each ring is tilted a little about the vertical axis through the tangent point (0°, 14°, -10°), which gives depth without moving the point. The rings are thin tubes in a glass-like "ice" material; the core is a solid sphere with a soft `glacier` emissive glow.
- **Fragments:** about 60 to 120 short arc segments (fewer on low-power devices), each assigned to a target ring and a target angle. Scattered, they float in the depth around the object with slow noise drift.
- **Uniform map.** Every value below is written from ScrollTrigger `onUpdate` into a ref, and copied into uniforms in `useFrame`. No React state is involved.

| Moment | Trigger | Progress window | What changes |
| --- | --- | --- | --- |
| Hero idle | none | n/a | `uAccrue = 0` (all fragments scattered), `uTime` drifts, `uCore = 0.25` (the core is dim), group offset `uGroupX = 0.18` (right side). |
| Hero leaving | part 2, `start: "top top"`, `end: "bottom top"`, scrub | 0 → 1 | `uGroupX` 0.18 → 0.08. |
| Problem | part 3 pin (120vh) | 0 → 0.2 | Canvas CSS opacity 1 → 0.35, so the big type reads. `uScatter` 1 → 1.15: the fragments drift a little further apart. |
| | | 0.2 → 0.85 | Held. |
| | | 0.85 → 1 | Opacity back to 1, `uGroupX` 0.08 → 0 (centred horizontally; the object is still asymmetric in the frame because it rests on its point). |
| The rings | part 4 pin (250vh) | 0.05 → 0.30 | `uAccrue` 0 → 1: the fragments for the **smallest ring** fly in and close it. It's born at the core and grows outward to its size, like the living mark's accrue. |
| | | 0.30 → 0.52 | `uAccrue` 1 → 2: the middle ring. |
| | | 0.52 → 0.74 | `uAccrue` 2 → 3: the outer ring. |
| | | 0.74 → 0.90 | `uCore` 0.25 → 1: the core lights in `glacier`, and one pulse travels outward ring by ring (`stagger.rings`). |
| | | 0.90 → 1.00 | `uBreathe` 0 → 1: the finished mark starts to breathe (inner rings ±7%, out of phase, staying tangent), paused if motion is paused. |

  Within each ring's window, each fragment has its own delay (0 to 0.3 of the window) and a smoothstep, so pieces arrive one after another, not all at once.

- **Mobile and reduced motion:** there's no canvas. The stage uses four fallback renders exported from the same scene (fragments, one ring, two rings, the full lit mark), as described in each part.

### Part 3. The problem

- **Purpose:** name the pain in the product's own words.
- **Layout:** a full-width kinetic statement, very large type, left-aligned across two lines, over the dimmed fragments.
- **Copy:** **Healthcare remembers encounters. It doesn't remember you.**
- **Motion:** pinned for a short scroll. Words go from faint to full as you scroll. Around the type, small fragment labels drift past and away: *Lab report (PDF)*, *Prescription in a chat*, *Discharge summary*, *Six months of sleep*, *Policy document*, *What the doctor said*.
- **Mobile:** not pinned; the words reveal on enter.
- **Reduced motion:** the text is fully shown, with the fragments static in a loose grid.

**Build spec**

- **Source:** React Bits Scroll Reveal (reference) for the word reveal; Fancy Parallax Floating (reference) for the fragments, driven by scroll depth instead of the pointer.
- **Type:** `clamp(48px, 6vw, 96px)`, weight 500, tracking -0.03em, `ice`, columns 1 to 10.
- **Words (GSAP):** `SplitText` by words. Pin `start: "top top"`, `end: "+=120%"`, `scrub: true`. Across progress 0.05 to 0.80, each word's opacity goes from 0.15 to 1 in reading order (`stagger.words`: `each` = 0.75 ÷ word count).
- **Fragment labels:** six mono chips (12px, uppercase, +0.18em, `ice-60` text on an `ink-2` pill with a 1px `hairline-ink` border), absolutely placed around the statement at hand-picked positions. Each has a depth `d` between 0.3 and 1. Across the pin, each moves `y` by `-120px × d` and `x` by ±40px, and fades from 0.9 to 0 over progress 0.6 to 1, so they "leave" as the statement lands and the rings begin.
- **States:** mobile has no pin; each word reveals as the line enters (`start: "top 80%"`, once, `stagger.items`), and the chips sit as a 2-column wrap under the statement. Reduced motion shows everything at full opacity, with the chips in a static loose grid.

### Part 4. The rings (signature moment)

- **Purpose:** show the product idea without explaining it. Scattered becomes layered around you.
- **Layout:** pinned for about 250vh of scroll. The object takes the centre of the screen. Short lines step in on the left, one per ring.
- **Copy steps:**
  1. Every report, prescription and scan. *(the smallest ring closes)*
  2. Every night of sleep and every symptom you noted. *(the middle ring)*
  3. Every policy you hold. *(the outer ring)*
  4. **Remembered. Then understood.** Support: Every layer of your health touches one point: you. *(the core lights)*
- **Motion:** scroll progress drives the rings in the shader. Fragments fly in and close each ring from the core outward, then the core lights and the mark begins to breathe.
- **Mobile:** a crossfade between the 4 static renders, with the lines stacked.
- **Reduced motion:** the full lit render with the 4 lines as plain text.

**Build spec**

- **Source:** our own scene (see [04-build-plan.md](04-build-plan.md) §4). React Bits Fluid Glass and liquid-glass-js are material references (refraction and rim light); ThreeUI "Predictive Arc" is a reference for how the arc fragments move.
- **Pin (GSAP):** `start: "top top"`, `end: "+=250%"`, `pin: true`, `scrub: true`. It drives the rings rows of the uniform map in §3.1.
- **Copy steps:** lines 1 to 3 at `clamp(24px, 2.4vw, 32px)`, line 4 at the h2 size with its support line at 19px in `ice-60`. Columns 1 to 4, vertically centred. Each step is visible in the same window as its ring: step 1 from 0.05 to 0.30, step 2 from 0.30 to 0.52, step 3 from 0.52 to 0.74, step 4 from 0.76 to the end (it stays). Entering: opacity 0 → 1, `y` 24 → 0. Leaving: opacity 1 → 0, `y` 0 → -24. Each change takes 0.04 of progress. All four lines are in the DOM for screen readers; the hidden ones are only visually hidden.
- **States:** mobile has no pin; the four renders crossfade on a scrubbed ScrollTrigger (`start: "top 60%"`, `end: "bottom 40%"`), with the lines stacked beneath. Reduced motion shows the lit render and the four lines as plain text.

### Part 5. Everyday life (photo moment, the paper chapter begins)

- **Purpose:** make it human, and connect clinical life with everyday life. The page moves into daylight.
- **Layout:** the ground changes to paper (§2.1). A full-bleed cinematic photo (Greenstack) with the headline on a quiet part of the image. A small caption row underneath the image, not overlaid on it.
- **Copy:**
  - Headline: **Your health doesn't only happen at the clinic.**
  - Support: Sleep, activity, symptoms and how you feel sit right next to your reports, so your history finally has the days in between.
  - Caption row: Apple Health and Android Health Connect **(planned)**.
- **Motion:** slow scale-down of the image as it enters (1.08 to 1.0). Nothing else.
- **Image:** see shot list, image A.

**Build spec**

- **Source:** skiper34 Scroll images reveal 003 (reference).
- **Frame:** full-bleed, height `min(100vh, 56.25vw)` (16:9), `overflow: hidden`. The headline sits on the image's empty sky in `ink-reverse`, in columns 1 to 6, 80px from the top. The photo is graded so that area stays light; contrast is checked at 3:1 or better for the large headline. If it fails, the headline moves under the image with the caption.
- **Scrub (GSAP):** the image goes from `scale: 1.08` to `1` with `start: "top bottom"`, `end: "top top"`, `scrub: 0.6`. The headline and support fade in once (`start: "top 60%"`, `dur.reveal`, `ease.out`).
- **Caption row:** 24px under the image, mono 12px, `slate`.
- **States:** mobile uses a 4:5 crop and places the headline under the image. Reduced motion uses `scale: 1` and no fades.

### Part 6. The seven verbs (how it works)

- **Purpose:** explain the whole product in one calm pass. This is the "How it works" anchor.
- **Layout:** a horizontal pinned rail on paper. A baseline runs across the screen; it's time. The core (the person) travels along it as you scroll. At each verb a ring blooms up from the point where the core stands, tangent at that point, and stays behind as a small mark. Each stop has the verb name large and one sentence.
- **Copy (from `03-our-approach.md`):**

  | Verb | Line |
  | --- | --- |
  | Remember | Every record in one lifelong vault, with the original always kept. |
  | Structure | Reports become data: test, value, range, date and where it came from. |
  | Understand | See how things change over time against your own baseline. |
  | Monitor | Follow-ups and check-ups tracked, so nothing depends on memory. |
  | Act | Walk into a doctor's visit or a hospital admission prepared. |
  | Communicate | Share a clear summary, not a stack of PDFs. |
  | Protect | You decide who sees what, for how long, and why. |

- **Motion:** GSAP DrawSVG draws the baseline just ahead of the core, MotionPathPlugin moves the core, and each ring draws itself (DrawSVG) as the core reaches its stop. All scroll-scrubbed.
- **Mobile:** a vertical baseline down the left side with the verbs stacked; the core moves with scroll and a small ring blooms beside each verb.
- **Reduced motion:** a static vertical list with a finished ring beside each verb.

**Build spec**

- **Source:** the taste skill's §5.B horizontal pan skeleton; skiper19 SVG follow scroll (reference).
- **Track:** 7 stops, each 40vw wide, with a 24vw lead-in and a 16vw tail (320vw in total). The verb name is at the h2 size in `ink-reverse`; the sentence is 18px in `slate` with a 32ch max, sitting under the baseline.
- **Baseline:** one straight SVG line across the whole track at 58% of the viewport height. The undrawn line is a 1px `hairline-paper` (decorative). The drawn line is 1px `ink-reverse`.
- **Core:** a 14px `harbor` circle sitting on the baseline (its bottom touches the line).
- **Rings:** one per stop, drawn above the baseline and tangent to it at the stop's point: 1.5px `ink-reverse` stroke, no fill. Radii grow slightly by stop (Remember 36px, rising by 8px per stop to Protect 84px), so the row reads as layers accruing. Each ring's DrawSVG starts at the tangent point and runs both ways around to meet at the top.
- **Pan (GSAP):** pin the section with `start: "top top"`, `end: "+=" + (trackWidth - innerWidth)` and `scrub: true`, and move the track by `x: -(trackWidth - innerWidth)` with `ease.scrub` and `invalidateOnRefresh: true`. With the same progress `p`: the baseline's DrawSVG shows `0% → min(100%, p + 4%)`, and MotionPathPlugin places the core at `p` along the baseline.
- **Stops:** each stop has a `containerAnimation` trigger, `start: "left 60%"`, `end: "left 40%"`, `scrub: true`, that draws its ring 0 → 100% as the core arrives. Separately, the active stop's verb and sentence go from opacity 0.3 to 1 and `y` 12 → 0; the others rest at 0.3.
- **Anchor:** the nav's "How it works" link scrolls to the pin start.
- **States:** mobile uses a vertical baseline 24px from the left, the verbs stacked with 48px gaps, the core following the scroll (`start: "top 60%"`, `end: "bottom 60%"`), and each ring (24px) drawing once as its verb enters. Reduced motion shows the finished rings and a static list.

### Part 7. Understand (the intelligence bento)

- **Purpose:** show that this is not a file cabinet. Real, coded mini components, not fake screenshots.
- **Layout:** bento with exactly 5 cells in an asymmetric 2+3 arrangement. At least 2 cells have a visual background (the chart, the tinted timeline).
- **Cells:**
  1. **Your baseline (large cell):** a Bklit line chart of an example marker (Vitamin D or LDL) over 4 years with a soft band for "your usual range". The latest point sits outside the band, marked in amber. Caption: *Still inside the lab's range. Outside yours.* Label: Example.
  2. **Sourced, always:** the sentence "Your LDL rose across these three reports." with three source chips (lab name, date). Hovering a chip highlights that point on the chart.
  3. **Ask your history:** a search field that types "When was my last thyroid test?", then shows the answer with its source.
  4. **Organised for you:** the path *Endocrine → Thyroid → Monitoring → Sept 2026* appears step by step, next to a plain "Lab reports / 2026" folder that fades.
  5. **One timeline:** a mini timeline, Symptom → Consultation → Test → Medication → Follow-up, drawn as small rings on a baseline, the same language as part 6.
- **Headline:** **Not a folder. A history that makes sense.**
- **Mobile:** single column in the order 1, 2, 3, 4, 5.
- **Reduced motion:** final states shown directly.

**Build spec**

- **Source:** Bklit line chart (use); Fancy Typewriter (use; Kokonut `type-writer` as a fallback). React Bits Magic Bento is a layout reference only (no glow, no spotlight).
- **Grid:** 12 columns. Row 1: cell 1 spans 7, cell 2 spans 5, height 440px. Row 2: cell 3 spans 4, cell 4 spans 3, cell 5 spans 5, height 320px. No two cells in a row are the same width. Cells are `paper-2` with a 20px radius and 32px padding. Cell 5 has a faint `harbor` tint (6%).
- **Chart colours:** the line in `harbor`, the "your usual range" band in `harbor` at 12%, the out-of-range point in paper `amber`, axis text in `slate` mono.
- **Entrances (Motion):** each cell uses `whileInView` (once, 30% visible) from opacity 0 and `y` 24 with `spring.ui`, staggered with `stagger.items`.
- **Cell 1:** the line draws once when in view (1200ms, `ease.out`); the band and the amber point fade in after it. It doesn't loop or pulse.
- **Cell 2:** hovering or focusing a chip highlights the matching point on cell 1's chart (a shared hover id through context) with a 6px ring and a tooltip (`dur.micro`). Chips are buttons.
- **Cell 3:** when the cell is 50% in view it types once at 35ms a character, then the answer and its source chip fade in (`dur.ui`). There's a small "Replay" text button.
- **Cell 4:** the four path steps appear with `stagger.items` × 3 (150ms apart); the plain folder fades to 40% as they arrive.
- **Cell 5:** five small rings (12 to 20px) tangent to one baseline, each with a mono label. They draw left to right once in view (a Motion `pathLength` reveal, not scroll-linked), with a 14px-wide `harbor` core resting at "Follow-up".
- **States:** mobile is a single column in the order 1 to 5, each cell auto-height. Reduced motion shows final states: the line drawn, the text typed, the path complete, the rings drawn.

### Part 8. Nothing forgotten (continuity)

- **Purpose:** the closed follow-up loop, a very relatable pain.
- **Layout:** a single large ring centred-left in a wide field, resting on the person, with a small comparison line underneath.
- **Copy:**
  - Headline: **What the doctor said, remembered.**
  - Loop: Recommendation → Reminder → Follow-up → Result → Keep monitoring.
  - Comparison (struck through): Recommendation → Forgotten document.
  - Symptom example: "Headaches on 11 days in the last six weeks, mostly evenings." Label: Example.
- **Motion:** GSAP DrawSVG draws the ring from the core around and back, then the core runs one lap along it (MotionPathPlugin) as it enters view.
- **Mobile:** the ring gets smaller and the comparison moves below it.

**Build spec**

- **Source:** our own SVG.
- **Diagram:** a circle about 360px across, stroked 1.5px `ink-reverse`. The core (16px, `harbor`) sits at its bottom tangent point: that's the person, and the loop always comes back to them. The five labels sit outside the ring at 1, 3, 5, 7 and 9 o'clock positions measured from the bottom, in Geist 15px `ink-reverse`, each with a 6px `ink-reverse` node on the ring. The symptom example is a mono chip beside "Keep monitoring".
- **Sequence (GSAP timeline, `start: "top 70%"`, once):**
  1. DrawSVG 0 → 100% over `dur.draw` with `ease.out`, starting at the core and going clockwise. Each label fades in as the line reaches its node (positions come from the path length).
  2. The core runs one lap over 2400ms with `ease.inOut` and comes to rest back at the bottom. As it passes each node, the node scales 1 → 1.4 → 1 (`dur.ui`).
  3. The comparison line fades in, and a strike line draws through it with DrawSVG over 600ms.
- **States:** mobile scales the ring to 260px and stacks the labels as a list under it. Reduced motion shows the ring drawn, the core at rest and the strike in place.

### Part 9. In your hand (the app)

- **Purpose:** show that it's a real product people will use every day (Whoop and Oura pattern), and that the mark lives inside the app.
- **Layout:** one phone frame centred-left; screens swipe inside it. One short line changes beside the phone for each screen.
- **Screens (real React components, designed from Mobbin patterns):**
  1. **What's important now:** a follow-up due, a new report connected, a claim document missing. The "new report connected" row shows a small living mark playing **accrue** once, then **added**, the same states the app will use.
  2. **Visit prep:** reason for visit, recent symptoms, current medications, 2 relevant trends, questions to ask.
  3. **Doctor summary:** conditions, medications, allergies, recent tests, and a "Share for 7 days" button.
- **Headline:** **Ready before you walk in.**
- **Mobile:** a full-width phone with swipe; the lines sit below it.

**Build spec**

- **Source:** skiper48 Card swipe carousel (use); Watermelon `card-swipe` (fallback).
- **Phone:** a CSS frame about 340×700 (radius 48px, 10px `ink` bezel) in columns 2 to 6. The screens use the app's dark UI (`ink` and `ink-2` with `ice` text), so the phone reads as a piece of the brand's dark ground inside the paper chapter.
- **Carousel (Motion):** drag on the x axis with snap (`spring.ui`), plus 44px previous and next buttons and three dots (`aria-label="Screen 1 of 3"`). Arrow keys work when the carousel has focus. **No autoplay.**
- **Living mark in screen 1:** 24px, plays accrue once then added when screen 1 first becomes visible; static afterwards.
- **Beside the phone:** one line per screen, swapped with `AnimatePresence` (opacity plus `y` 8 → 0, `dur.ui`), and announced with `aria-live="polite"`.
- **States:** mobile uses a full-width phone and puts the line below it. Reduced motion swaps screens without sliding and shows the static mark.

### Part 10. Insurance companion

- **Purpose:** a real Indian pain that competitors like Bevel don't touch.
- **Layout:** split. Left: the question as a large quote. Right: three policy layers stacked like cards that fan apart as you scroll to show the order of use.
- **Copy:**
  - Question: **"I'm being admitted tomorrow. What am I covered for?"**
  - Layers: Employer group policy, Personal policy, Super top-up. Each has one line (for example, "Use first: preserves your no-claim bonus", labelled Example).
  - Support: anveli reads the policies you already have and shows what is likely to apply, what to check, and which documents you'll need.
  - Always visible: **Guidance, never a claim guarantee.**
- **Mobile:** the question on top, the layers stacked below with a short fan animation.

**Build spec**

- **Source:** the taste skill's §5.A sticky-stack skeleton; skiper16 and skiper17 Card stack scroll (reference).
- **Cards:** 3 cards, 140px tall, `paper-2`, 20px radius, in columns 7 to 12. Each card's left edge carries a small ring icon whose size matches its layer (small, middle, outer), echoing the mark. Order labels are words, not numbers: "Use first", "Then", "If needed".
- **Pin (GSAP):** `start: "top top"`, `end: "+=150%"`, `pin: true`, `scrub: true`. At progress 0 the cards are stacked (`y` offsets 0 / 12 / 24px, `scale` 1 / 0.97 / 0.94, with the top card in front). From 0.15 to 0.75 they fan to their final order: `y` = index × (140 + 24)px, `scale` 1, and a rotation of -1.5° / 0° / 1.5° that settles to 0 by 0.9.
- **Disclaimer:** "Guidance, never a claim guarantee." sits under the cards in mono 12px `slate` and is always visible, never animated.
- **States:** mobile has no pin; the fan plays once on enter (`start: "top 70%"`, `dur.settle`, `ease.out`). Reduced motion shows the cards already fanned.

### Part 11. Protect (back to ink)

- **Purpose:** turn privacy into a reason to join. This is the page's emotional peak.
- **Layout:** the page returns to ink (§2.1). The headline sits on top, then an interactive **purpose picker**.
- **Copy:**
  - Headline: **Having your information should never mean sharing it.**
  - Picker tabs: Doctor · Insurer · Emergency · Caregiver.
  - Below the tabs is a grid of record items (Conditions, Medications, Allergies, Lab trends, Hospital stay 2024, Mental health notes, Policy documents, Emergency contacts). Picking a recipient lights the items that would be shared and dims the rest:
    - Doctor: broad relevant history.
    - Insurer: **this episode only**, never the full history.
    - Emergency: allergies, conditions, medications, contacts.
    - Caregiver: only what you allow.
  - A share bar at the bottom: "Share for 7 days · Revocable · Logged", with a press-and-hold "Approve". This demonstrates "you review before anything leaves".
  - Principles strip: Never sold. Export anytime. AI sees only what the task needs.
  - Link: Read how we protect your data → `/privacy-trust`.
- **Motion:** items fade and scale gently (Motion `layout`). The hold button fills as you press.
- **Accessibility:** tabs use proper `role="tablist"`; the lit and dimmed state is also stated in text ("Shared" / "Not shared"), not by colour alone.

**Build spec**

- **Source:** Watermelon `fluid-tabs` (use) for the tabs; React Bits Hold Button (use; Kokonut `hold-button` as a fallback).
- **Ground:** the paper → ink change in §2.1.
- **Tabs (Motion):** a sliding pill behind the active tab with `layoutId` and `spring.ui`. Arrow keys move between tabs; Home and End jump.
- **Item grid:** 4×2 on desktop and 2×4 on mobile, each item an `ink-2` card with a 20px radius. Lit: opacity 1, `scale` 1, a 1px `glacier` border, and the label "Shared". Dimmed: opacity 0.35, `scale` 0.98, and the label "Not shared". Changes use `spring.ui`. The summary ("5 of 8 items shared with Doctor") is announced with `aria-live="polite"`.
- **Hold to approve:** hold for 1200ms. The fill is a `scaleX` 0 → 1 over the hold time with linear timing (the user's hold is the easing), in `glacier`. Releasing early reverses it over `dur.ui`. On completion: a check icon, then "Approved. Shared for 7 days." announced, and a "Reset" text button. Holding Space or Enter works the same way.
- **States:** mobile as above. Reduced motion has lit and dimmed changes with no scale.

### Part 12. What we're not

- **Layout:** the page's one marquee, on ink. The phrases travel along the top arc of one very large ring, with a visible **Pause motion** button (a pattern taken from Function Health).
- **Copy:** Not a file cabinet. Not a symptom checker. Not a wearable dashboard. Not an insurance app. Not a chatbot. And then, still: **One place that remembers you.**
- **Reduced motion:** a static, wrapped line of the same phrases.

**Build spec**

- **Source:** Fancy Marquee Along SVG Path (use).
- **Path:** the top arc of a circle about 1.6× the viewport width across, whose centre sits well below the section, so only a gentle dome crosses the screen (the text always reads upright). The arc is stroked as a 1px `hairline-ink` line. Phrases are 28px Geist in `ice` at 60% opacity, separated by a small `glacier` core dot.
- **Motion:** a constant speed of about 40px a second (linear is right here). It pauses when the section is off screen, while the pointer is over it, and whenever the global motion state is paused.
- **Pause motion:** a visible 44px button beside the marquee (Phosphor Pause/Play plus a text label). It's the same global toggle as the nav's.
- **Closing line:** "One place that remembers you." at the h2 size, under the arc, static.
- **States:** mobile uses 22px phrases and a smaller arc. Reduced motion shows the phrases as a static wrapped line with no arc.

### Part 13. Final CTA and footer

- **Layout:** on ink. The full mark, large, as the finale. Above it: a short line and the waitlist field.
- **Copy:**
  - **Your health, understood.**
  - Be first to try anveli when it opens.
  - Waitlist field.
  - Footer links: Privacy & trust, Privacy policy, Terms, Contact (email).
  - Disclaimer: anveli helps you understand and organise your health information. It does not give medical advice or diagnoses. In an emergency, contact your local emergency services.
  - © 2026 anveli.

**Build spec**

- **Source:** Fancy Sticky Footer (use) for the reveal; LivingMark for the finale.
- **Reveal:** the footer sits underneath the page and is uncovered as part 12 scrolls away (the Sticky Footer clip pattern). The footer is 100vh on desktop.
- **Order, top to bottom:** "Your health, understood." (h2), the support line, the waitlist field, the links row with the disclaimer, then the finale: the stacked lockup (symbol 1.7em above the wordmark, per the package) with the wordmark fitted to about 60% of the container width, centred low in the footer, sitting in one `depth` glow.
- **Finale (LivingMark):** when the footer is 60% in view: `set('sync')` for exactly one accrue step (`dur.accrue`: a new ring is born from the core and every layer moves out), then `set('added')` (the pulse), then `breathe` for 2 cycles (about 14s), then it holds still. Once per page load. It respects the global Pause motion state.
- **States:** mobile stacks everything, with the wordmark at the container width and the footer's height set by its content. Reduced motion shows the static mark.

## 4. Waitlist experience

**States:**

1. **Idle:** a pill button, "Join the waitlist".
2. **Open:** the button expands into an email field in place, with a real visible label, not a placeholder standing in for one.
3. **Submitting:** the button shows the small living mark in its **accrue** state; the field is locked.
4. **Error:** inline text under the field ("That email doesn't look right." / "Couldn't reach us. Try again?"). Focus returns to the field.
5. **Success:** "You're on the list." The small mark plays **added** once: you've just been added.
6. **Optional follow-up:** "What would you use first?" with chips for Records, Trends, Doctor visits, Insurance, Family. One tap sends it; skipping is fine.

**Rules:**

- Consent line under the field: "We'll only email you about anveli. Privacy policy." No pre-ticked boxes, no spam.
- It's the same component in the hero, nav sheet and footer; it remembers that you already joined (localStorage, as a convenience only).
- The backend is a static-friendly service (Loops or Formspree) with a client POST, because the site is `output: "export"`.

**Build spec**

- **Source:** skiper106 Smooth caret input (use) for the field; Watermelon `floating-input` (reference) for label behaviour, but our label always stays visible above the field.
- **Open (Motion):** the pill and the field share a `layoutId`. The pill widens to 480px (full width on mobile) with `spring.ui`. The label "Email" (mono 12px) sits above; the field gets focus. The submit button inside the field on the right keeps the label "Join the waitlist".
- **Submitting:** the button's label is replaced by a 20px living mark looping accrue (it stops as soon as the request settles), and `aria-busy` is set.
- **Error:** the message fades in under the field (`dur.ui`), is linked with `aria-describedby`, and is announced (`aria-live="polite"`). The field shakes by no more than 4px, and only without reduced motion.
- **Success:** the field collapses into the text "You're on the list." with a 20px mark beside it playing added once.
- **Keyboard:** Escape closes the open field if it's empty. Enter submits.

## 5. `/privacy-trust` page

- **Layout:** an editorial long-read on paper: a narrow column (65ch), large section headings, one pinned side illustration of the mark gaining a ring per section. Layout reference: the impact reports on deck.gallery (On 2024, Lululemon 2023): big headings, generous margins, one visual per spread.
- **Sections** (from `03-our-approach.md` §40 to §45):
  1. Every fact has a source (provenance and explainability).
  2. You can correct it (data quality, originals never changed).
  3. You decide who sees what (consent, permissions, audit history).
  4. Private by default (encryption, minimum necessary disclosure, never sold).
  5. AI only sees what the task needs (permissioned AI).
  6. It's yours to take (data portability).
- Each section ends with a plain "What this means for you" line.
- Ends with the waitlist.

**Build spec**

- **Grid:** the text in columns 2 to 7; the illustration in columns 9 to 12, pinned with GSAP (`start: "top 96px"`, `end` at the last section's end) on desktop only.
- **Illustration:** the mark in `ink-reverse` and `harbor`, starting as the core alone. Each section draws one more ring tangent at the core (DrawSVG, scrubbed across that section), six rings in total, the largest at the end: every protection is another layer around you.
- **Headings:** reveal by line once (`SplitText` with a line mask, as in the hero), not scrubbed.
- **States:** mobile has no pin; a small static six-ring mark sits under the title. Reduced motion shows the illustration complete.

## 6. `/404` page

- **Ground:** ink, with one `depth` glow.
- **Content:** the mark with one ring that has come loose: it floats up and away from the core instead of touching it. The headline is "This page isn't part of the story." with a link "Back to the start" to `/`.
- **Build spec (Motion + LivingMark):** the loose ring drifts slowly (`y` ±6px over 6s) for at most two cycles, then holds still. Hovering or tapping the mark settles the ring back into place, tangent at the core (`spring.ui`), and plays added. Reduced motion shows the loose ring still and no pulse. The ring and core use the mark's exact stroke and colours.

## 7. Imagery: shot list and generation prompts

Style for all images: soft natural daylight, a clean, cool-neutral grade that sits well on `#EEF2F4` paper (true whites, gentle shadows, natural warm skin tones), light film grain, real Indian people, candid rather than posed, and room for type. No stethoscopes, hospital corridors, holograms, blue glow or neon.

| ID | Use | Shot | Prompt (starting point) |
| --- | --- | --- | --- |
| A | Part 5 full-bleed | A woman in her 30s stretching after an early morning walk on a Mumbai or Bengaluru terrace, soft dawn light, city haze behind | "Candid editorial photo, Indian woman in her early 30s stretching on a rooftop terrace at dawn, soft pale morning haze, clean cool-neutral whites, natural skin tones, light film grain, calm, wide composition with empty pale sky on the left, 35mm, natural light, no logos" |
| B | Part 9 backdrop, OG | A father and a young daughter at a kitchen table in the morning, phone face down, relaxed | "Editorial photo, Indian father and young daughter at a bright kitchen table in soft morning daylight, relaxed, candid, clean cool-neutral grade, soft shadows, minimal props, space on the right for text" |
| C | `/privacy-trust` | Hands holding a phone close, in a quiet interior, screen not visible | "Close crop of hands holding a phone against a linen shirt, quiet bright interior, shallow depth of field, calm, private feeling, clean cool-neutral grade, light film grain" |
| D | Part 10 (optional) | An adult child helping an elderly parent with papers at home | "Candid photo, Indian woman in her 40s sitting beside her elderly father at home sorting papers together, soft afternoon window light, tender, unposed, muted cool-neutral palette" |
| E | Part 8 (optional) | A calm consultation, seen from behind the patient, the doctor slightly out of focus | "Editorial photo, calm doctor consultation in a bright modern clinic, seen over the patient's shoulder, doctor out of focus, soft daylight, no stethoscope in frame, reassuring, clean cool-neutral grade" |

Until the real images exist, use `picsum.photos/seed/anveli-<id>/<w>/<h>` placeholders at the right aspect ratios. The 3D mark is always code-rendered, except for its own fallback renders. Photos never have grain baked in; the site-wide overlay provides it.

**Section reference images (image-to-code skill).** Before each part is built, generate its reference image externally. Every prompt states: ink `#0B0C0D` ground with one soft `#14202A` radial glow (or `#EEF2F4` paper for parts 5 to 10), the anveli mark (three thin ice rings and a pale blue core, all touching at one point at the bottom), Geist type, generous negative space, no neon, no holograms.

## 8. SEO and sharing

- Title pattern: `anveli · Your health, understood.` for the homepage; `<Page> · anveli` elsewhere.
- Meta description (homepage): One living health history for your records, wearables, doctor visits and insurance. Private by default. Join the waitlist.
- OG image: the lit 3D mark on ink in its depth glow, with the horizontal lockup (a static render, 1200×630).
- `favicon.svg` from the package (optical symbol on an ink tile), plus apple-touch-icon and PWA icons from the package's app icons.
- `sitemap.xml` and `robots.txt`.
