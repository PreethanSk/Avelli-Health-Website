# Site Structure and Section Specs

Status: planned, updated after the reference audit ([05-reference-audit.md](05-reference-audit.md)). It describes every page and every homepage section: purpose, layout, copy, and a **Build spec** (source components, scroll choreography, and desktop, mobile and reduced-motion states). Copy is draft. Tokens, motion tokens (`ease.*`, `dur.*`, `spring.*`, `stagger.*`) and voice rules are in [02-brand-system.md](02-brand-system.md).

How to read a Build spec:

- **Source** names the exact component we start from (library, item, licence). "Reference" means we study it and write our own; "Use" means we install or copy it and restyle it to our tokens.
- **Choreography** gives the engine (GSAP or Motion), the trigger, `start`/`end`, whether it pins and for how long, and what happens across progress 0 to 1.
- **States** gives desktop (≥ 1024px), tablet (768 to 1023px, follows desktop unless stated), mobile (< 768px) and reduced motion.

Numbers are starting values. If one changes during the build, update it here so this doc stays the source of truth.

## 1. Sitemap (phase 1)

| Route | Purpose |
| --- | --- |
| `/` | The scroll story and waitlist |
| `/privacy-trust` | An editorial long-read on how anveli treats your information (a selling point, not legal text) |
| `/privacy` | Privacy policy (placeholder, **needs legal review**) |
| `/terms` | Terms of use (placeholder, **needs legal review**) |
| `/404` | Custom not-found page on ink: a short loose strand, the logo moment, and "This page isn't part of the story." with a link home |

Nav links: **How it works** (anchor to the seven verbs) · **Privacy** (`/privacy-trust`) · **About** (anchor to "What we're not" plus the footer note) · **Join the waitlist** (pill).

Later phases, only when there is content: an Insurance deep-dive page, a For families page, and an About/team page.

## 2. Homepage rules

- 13 parts. Every one uses a **different layout family**. There's one marquee (part 12) and one theme switch (part 11).
- At most 4 mono eyebrows on the whole page.
- One CTA label everywhere: **Join the waitlist**.
- Each part has **one** message: a headline of 8 words or fewer, 25 words or fewer of support, and one visual.
- Every sample value is labelled **Example**.
- No preloader, no scroll cue, no animated background. The paper grain overlay ([02-brand-system.md](02-brand-system.md) §4) sits over everything.

### 2.1 Component map

| Part | Engine | Main source |
| --- | --- | --- |
| 1 Navigation | GSAP (wordmark shrink) + Motion (menu, hovers) | skiper41 Progressive Blur (use), skiper58 Text roll navigation (use), React Bits Staggered Menu (reference) |
| 2 Hero | GSAP SplitText + Motion (dot) + R3F | Fancy Vertical Cut Reveal and skiper66 SVG clip mask (reference) |
| 3 Problem | GSAP ScrollTrigger + SplitText | React Bits Scroll Reveal (reference), Fancy Parallax Floating (reference, adapted to scroll) |
| 4 Braid | GSAP ScrollTrigger → R3F uniforms | Own ribbon; ThreeUI "Ribbon Field" and "Fluid Field" (reference) |
| 5 Everyday life | GSAP scrub | skiper34 Scroll images reveal 003 (reference) |
| 6 Seven verbs | GSAP horizontal pan + DrawSVG + MotionPath | Taste skill §5.B skeleton, skiper19 SVG follow scroll (reference) |
| 7 Bento | Motion + Bklit | Bklit line chart (use), Fancy Typewriter (use), Kokonut `type-writer` (fallback) |
| 8 Continuity loop | GSAP DrawSVG + MotionPath | Own SVG |
| 9 In your hand | Motion | skiper48 Card swipe carousel (use), Watermelon `card-swipe` (fallback) |
| 10 Insurance | GSAP sticky-stack | Taste skill §5.A skeleton, skiper16 / skiper17 Card stack scroll (reference) |
| 11 Protect | GSAP (ink layer) + Motion (picker, hold) | Watermelon `fluid-tabs` (use), React Bits Hold Button or Kokonut `hold-button` (use) |
| 12 What we're not | Motion | Fancy Marquee Along SVG Path (use) |
| 13 Final CTA and footer | GSAP DrawSVG + Paper Shaders | Fancy Sticky Footer (use), Paper Shaders `LiquidMetal` (use) |
| Waitlist field | Motion | skiper106 Smooth caret input (use), Watermelon `floating-input` (label behaviour reference) |
| 404 | GSAP DrawSVG + Paper Shaders | React Bits Threads (reference for the loose strand) |

### 2.2 Scroll budget (desktop, 1440×900)

| Part | Section height | Pin length | Notes |
| --- | --- | --- | --- |
| 2 Hero | 100vh | none | |
| 3 Problem | 100vh | 120vh | |
| 4 Braid | 100vh | 250vh | |
| 5 Everyday life | about 100vh | none | |
| 6 Seven verbs | 100vh | about 220vw of horizontal travel (≈ 350vh) | |
| 7 Bento | about 130vh | none | |
| 8 Continuity | about 100vh | none | |
| 9 In your hand | about 110vh | none | |
| 10 Insurance | 100vh | 150vh | |
| 11 Protect | about 150vh | none | |
| 12 What we're not | about 60vh | none | |
| 13 Footer | about 100vh | none | Revealed from underneath |

That totals about 20 screens. If it feels long in the phase 3 review, shorten the pins of parts 4 and 6 first, never by more than a third.

## 3. Homepage, part by part

### Part 1. Navigation

- **Layout:** wordmark on the left, 3 text links in the centre-right, pill CTA on the right. Height 72px on desktop and 64px on mobile, transparent over paper, with a paper blur plate once you scroll.
- **Greenstack move:** the hero shows the wordmark large. On scroll it scales down and flies into the nav position.
- **Mobile:** wordmark plus menu button; the menu is a full-height sheet with big links and the waitlist field inside it.
- **Reduced motion:** the wordmark is already small in the nav, with no fly-in.

**Build spec**

- **Source:** skiper41 Progressive Blur (use) for the plate; skiper58 Text roll navigation (use) for link hover; React Bits Staggered Menu (reference) for the mobile sheet's rhythm, rebuilt in Motion.
- **Wordmark shrink (GSAP):** one `anveli.` element. At page top it sits 96px from the top at 64px font size. A ScrollTrigger on the document, `start: 0`, `end: 240` (pixels), `scrub: true`, moves it into the nav slot (26px font size, vertically centred in the 72px bar) using `scale` and `translate` only. There's no second copy of the wordmark and no `layoutId`.
- **Plate:** a ScrollTrigger at `start: 24` toggles `data-scrolled` on the header. The plate fades in over `dur.ui`: paper at 72% opacity plus the progressive blur (strongest at the top edge, fading to none at the bottom). With `prefers-reduced-transparency` it's solid `paper`.
- **Ink variant:** when part 11's top reaches the bottom of the nav (`start: "top 72px"`), a class switches the nav to ink (paper text, `teal-light` dot, plate in `ink` at 72%). It reverses on scroll back.
- **Links:** Figtree 15px, `ink`. Hover plays the text roll (the label slides up and a copy slides in from below, `dur.ui`, `ease.out`). Focus shows a 2px teal ring with 3px offset.
- **CTA pill:** height 44px, `ink` fill, `paper` text, `spring.press` on press. It opens the waitlist field in the hero if the hero is in view; otherwise it opens it in the nav as a popover under the pill.
- **Mobile sheet (Motion):** a 44×44 menu button. The sheet slides down (`y: -100% → 0`, `spring.ui`) on `paper`. Links are set at 40px and enter with `stagger.items`, followed by the waitlist field. The sheet traps focus, closes on Escape and returns focus to the button, and calls `lenis.stop()` while open (`lenis.start()` on close).
- **States:** desktop as above. Mobile: 64px bar and no text links, and the wordmark shrink runs from 44px to 22px. Reduced motion: the wordmark is at nav size from the start, the plate is solid and the sheet appears without sliding.

### Part 2. Hero

- **Purpose:** the first impression. A beautiful object and the motto.
- **Layout:** object-first. The 3D ribbon sits in its **loose state** (strands apart) and fills the right two-thirds. The headline sits bottom-left, Optikka style, with the sub and CTA underneath. The hero, headline and CTA must be visible without scrolling on a 1280×720 laptop.
- **Copy:**
  - H1: **Your health, understood.**
  - Sub: anveli keeps your records, wearables and everyday health in one living history that grows with you.
  - CTA: Join the waitlist (opens the inline field; see section 4).
- **Motion:** strands drift slowly; the pointer adds a very small parallax; the logo dot drops in once. The headline appears line by line (a mask reveal), not letter by letter.
- **Mobile:** a static render of the loose ribbon above the text; the text stacks below.
- **Reduced motion:** the same static render with no drift.

**Build spec**

- **Source:** Fancy Vertical Cut Reveal and skiper66 SVG clip path mask (reference) for the line mask. Built with GSAP SplitText.
- **Grid:** 12 columns, 24px gutters, max width 1400px. Text block in columns 1 to 6, anchored 64px above the bottom of the viewport. The ribbon's visual centre sits at about 66% of the width.
- **Type at 1280×720:** H1 at `clamp(64px, 7.5vw, 120px)` (96px here), 2 lines, line-height 1.02, tracking -0.035em. Sub at 19px and 60ch max, 24px below the H1. CTA 32px below the sub. At 720px tall everything must fit above the fold with at least 48px to spare.
- **Headline reveal (GSAP):** `SplitText.create(h1, { type: "lines", mask: "lines", autoSplit: true })`. Lines go from `yPercent: 100` to `0` over `dur.reveal` with `ease.out` and `stagger.lines`. It starts after `document.fonts.ready`, and it must start within 100ms of first paint. The H1 is real server-rendered text, so it stays the LCP element.
- **Sub and CTA:** fade from opacity 0 to 1 and `y` 12 to 0 over `dur.reveal` with `ease.out`, 200ms after the last headline line starts.
- **Dot drop (Motion):** the H1 has no dot; the dot is the nav wordmark's. It drops from `y: -24` to `0` with `spring.dot`, 300ms after the headline finishes. It plays once per session (`sessionStorage`, wrapped in try/catch).
- **Ribbon:** see §3.1 "The ribbon stage". In the hero it's in the loose state with an idle drift. Pointer parallax rotates the group by at most ±2°, eased with a 0.05 lerp in `useFrame`. There's no pointer effect on touch devices.
- **States:** mobile shows the loose fallback render at 4:5, full width, above the text; the H1 is `clamp(44px, 12vw, 64px)`. Reduced motion shows the same static render; the headline, sub and CTA are simply visible, and the dot is in place.

### 3.1 The ribbon stage (parts 2 to 4)

Parts 2, 3 and 4 share **one** canvas. The whole story of the object lives in one place so it's easy to tune.

- **Structure:** a wrapper `RibbonStage` holds parts 2 to 4. The canvas sits inside it with `position: sticky; top: 0; height: 100vh` and a `-100vh` bottom margin, so the parts scroll over it. When the wrapper ends (after part 4's pin), the canvas scrolls away with it. Once it's fully off screen the render loop stops (`frameloop="never"`), and restarts if you scroll back.
- **Uniform map.** Every value below is written from ScrollTrigger `onUpdate` into a ref, and copied into uniforms in `useFrame`. No React state is involved.

| Moment | Trigger | Progress window | What changes |
| --- | --- | --- | --- |
| Hero idle | none | n/a | `uBraid = 0`, `uTime` drifts, group offset `uGroupX = 0.18` (right side). |
| Hero leaving | part 2, `start: "top top"`, `end: "bottom top"`, scrub | 0 → 1 | `uGroupX` 0.18 → 0.08. |
| Problem | part 3 pin (120vh) | 0 → 0.2 | Canvas CSS opacity 1 → 0.35, so the big type reads. `uScatter` 1 → 1.15: the strands drift a little further apart. |
| | | 0.2 → 0.85 | Held. |
| | | 0.85 → 1 | Opacity back to 1, `uGroupX` 0.08 → 0 (centred). |
| Braid | part 4 pin (250vh) | 0.05 → 0.70 | `uBraid` 0 → 1. In the shader each strand has its own delay (0 to 0.25) and a smoothstep, so strands arrive one after another, not all at once. |
| | | 0.30 → 0.80 | `uTwist` 0 → 1. |
| | | 0.55 → 0.90 | `uCore` 0 → 1: the teal core lights along the ribbon. |
| | | 0.90 → 1.00 | `uDot` fades in at the start of the thread. |

- **Mobile and reduced motion:** there's no canvas. The stage uses the three fallback renders (loose, braiding, braided) as described in each part.

### Part 3. The problem

- **Purpose:** name the pain in the product's own words.
- **Layout:** a full-width kinetic statement, very large type, left-aligned across two lines.
- **Copy:** **Healthcare remembers encounters. It doesn't remember you.**
- **Motion:** pinned for a short scroll. Words go from faint to ink as you scroll. Behind and around the type, small fragment labels drift past and away: *Lab report (PDF)*, *Prescription in a chat*, *Discharge summary*, *Six months of sleep*, *Policy document*, *What the doctor said*.
- **Mobile:** not pinned; the words reveal on enter.
- **Reduced motion:** the text is fully inked, with fragments static in a loose grid.

**Build spec**

- **Source:** React Bits Scroll Reveal (reference) for the word inking; Fancy Parallax Floating (reference) for the fragments, driven by scroll depth instead of the pointer.
- **Type:** `clamp(48px, 6vw, 96px)`, weight 500, tracking -0.03em, columns 1 to 10, split across the two sentences.
- **Words (GSAP):** `SplitText` by words. Pin `start: "top top"`, `end: "+=120%"`, `scrub: true`. Across progress 0.05 to 0.80, each word's opacity goes from 0.15 to 1 in reading order (`stagger.words`: `each` = 0.75 ÷ word count).
- **Fragments:** six mono chips (12px, uppercase, +0.18em, `ink-60` text on a `paper-2` pill), absolutely placed around the statement at hand-picked positions. Each has a depth `d` between 0.3 and 1. Across the pin, each moves `y` by `-120px × d` and `x` by ±40px, and fades from 0.9 to 0 over progress 0.6 to 1, so they "leave" as the statement lands.
- **States:** mobile has no pin; each word inks as the line enters (`start: "top 80%"`, once, `stagger.items`), and the fragments sit as a 2-column wrap under the statement. Reduced motion shows full ink and the fragments in a static loose grid.

### Part 4. The braid (signature moment)

- **Purpose:** show the product idea without explaining it. Scattered becomes continuous.
- **Layout:** pinned for about 250vh of scroll. The ribbon takes the centre of the screen. Short lines step in on the left, one at a time.
- **Copy steps:**
  1. Every report, prescription and scan.
  2. Every night of sleep and every symptom you noted.
  3. Every policy you hold.
  4. **Remembered. Then understood.**
- **Motion:** scroll progress drives the braid in the shader. The strands pull in and twist into one ribbon, and the teal core lights along its length. At the end, the teal dot appears at the start of the thread.
- **Mobile:** a crossfade between 3 static renders (loose, braiding, braided), with the lines stacked.
- **Reduced motion:** a single braided render with the 4 lines as plain text.

**Build spec**

- **Source:** our own ribbon (see [04-build-plan.md](04-build-plan.md) §4). ThreeUI "Predictive Arc: Ribbon Field" and "Structure Flow: Fluid Field" are look references only.
- **Pin (GSAP):** `start: "top top"`, `end: "+=250%"`, `pin: true`, `scrub: true`. It drives the braid rows of the uniform map in §3.1.
- **Copy steps:** lines 1 to 3 at `clamp(24px, 2.4vw, 32px)`, line 4 at the h2 size. Columns 1 to 4, vertically centred. Each step is visible in its own window: step 1 from 0.08 to 0.28, step 2 from 0.28 to 0.48, step 3 from 0.48 to 0.68, step 4 from 0.72 to the end (it stays). Entering: opacity 0 → 1, `y` 24 → 0. Leaving: opacity 1 → 0, `y` 0 → -24. Each change takes 0.04 of progress. All four lines are in the DOM for screen readers; the hidden ones are only visually hidden.
- **States:** mobile has no pin; the three renders crossfade on a scrubbed ScrollTrigger (`start: "top 60%"`, `end: "bottom 40%"`), with the lines stacked beneath. Reduced motion shows the braided render and the four lines as plain text.

### Part 5. Everyday life (photo moment)

- **Purpose:** make it human, and connect clinical life with everyday life.
- **Layout:** full-bleed cinematic photo (Greenstack) with the headline on a quiet part of the image. A small caption row underneath the image, not overlaid on it.
- **Copy:**
  - Headline: **Your health doesn't only happen at the clinic.**
  - Support: Sleep, activity, symptoms and how you feel sit right next to your reports, so your history finally has the days in between.
  - Caption row: Apple Health and Android Health Connect **(planned)**.
- **Motion:** slow scale-down of the image as it enters (1.08 to 1.0). Nothing else.
- **Image:** see shot list, image A.

**Build spec**

- **Source:** skiper34 Scroll images reveal 003 (reference).
- **Frame:** full-bleed, height `min(100vh, 56.25vw)` (16:9), `overflow: hidden`. The headline sits on the image's empty sky in `ink`, in columns 1 to 6, 80px from the top. The photo is graded so that area stays light; contrast is checked at 3:1 or better for the large headline. If it fails, the headline moves under the image with the caption.
- **Scrub (GSAP):** the image goes from `scale: 1.08` to `1` with `start: "top bottom"`, `end: "top top"`, `scrub: 0.6`. The headline and support fade in once (`start: "top 60%"`, `dur.reveal`, `ease.out`).
- **Caption row:** 24px under the image, mono 12px, `ink-60`.
- **States:** mobile uses a 4:5 crop and places the headline under the image. Reduced motion uses `scale: 1` and no fades.

### Part 6. The seven verbs (how it works)

- **Purpose:** explain the whole product in one calm pass. This is the "How it works" anchor.
- **Layout:** a horizontal pinned rail. A single line runs across the screen; the teal dot moves along it as you scroll; each verb has a stop with its name large and one sentence.
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

- **Motion:** GSAP DrawSVG draws the line just ahead of the dot, and MotionPathPlugin moves the dot. Both are scroll-scrubbed.
- **Mobile:** a vertical line down the left side with the verbs stacked; the dot moves with scroll.
- **Reduced motion:** a static vertical list with the dot at each item.

**Build spec**

- **Source:** the taste skill's §5.B horizontal pan skeleton; skiper19 SVG follow scroll (reference).
- **Track:** 7 stops, each 40vw wide, with a 24vw lead-in and a 16vw tail (320vw in total). The verb name is at the h2 size, and the sentence is 18px with a 32ch max, sitting under the line.
- **Line:** one SVG path across the whole track at 45% of the viewport height, with a gentle wave (amplitude 24px). The undrawn path is a 1px `muted` hairline (decorative). The drawn path is 1.5px `teal`. The dot is 12px `teal` with a 4px `paper` ring.
- **Pan (GSAP):** pin the section with `start: "top top"`, `end: "+=" + (trackWidth - innerWidth)` and `scrub: true`, and move the track by `x: -(trackWidth - innerWidth)` with `ease.scrub` and `invalidateOnRefresh: true`. With the same progress `p`: DrawSVG shows `0% → min(100%, p + 4%)`, and MotionPathPlugin places the dot at `p` along the path (`align` to the path, centred).
- **Stops:** each stop has a `containerAnimation` trigger, `start: "left 60%"`, `end: "right 40%"`. The active stop's verb and sentence go from opacity 0.3 to 1 and `y` 12 → 0; the others rest at 0.3.
- **Anchor:** the nav's "How it works" link scrolls to the pin start.
- **States:** mobile uses a vertical line 24px from the left, the verbs stacked with 48px gaps, DrawSVG scrubbed from `start: "top 60%"` to `end: "bottom 60%"`, and the dot following. Reduced motion shows a static vertical list, the line fully drawn and a dot beside each verb.

### Part 7. Understand (the intelligence bento)

- **Purpose:** show that this is not a file cabinet. Real, coded mini components, not fake screenshots.
- **Layout:** bento with exactly 5 cells in an asymmetric 2+3 arrangement. At least 2 cells have a visual background (the chart, the tinted timeline).
- **Cells:**
  1. **Your baseline (large cell):** a Bklit line chart of an example marker (Vitamin D or LDL) over 4 years with a soft band for "your usual range". The latest point sits outside the band, marked in amber. Caption: *Still inside the lab's range. Outside yours.* Label: Example.
  2. **Sourced, always:** the sentence "Your LDL rose across these three reports." with three source chips (lab name, date). Hovering a chip highlights that point on the chart.
  3. **Ask your history:** a search field that types "When was my last thyroid test?", then shows the answer with its source.
  4. **Organised for you:** the path *Endocrine → Thyroid → Monitoring → Sept 2026* appears step by step, next to a plain "Lab reports / 2026" folder that fades.
  5. **One timeline:** a mini timeline, Symptom → Consultation → Test → Medication → Follow-up, drawn as the thread.
- **Headline:** **Not a folder. A history that makes sense.**
- **Mobile:** single column in the order 1, 2, 3, 4, 5.
- **Reduced motion:** final states shown directly.

**Build spec**

- **Source:** Bklit line chart (use); Fancy Typewriter (use; Kokonut `type-writer` as a fallback). React Bits Magic Bento is a layout reference only (no glow, no spotlight).
- **Grid:** 12 columns. Row 1: cell 1 spans 7, cell 2 spans 5, height 440px. Row 2: cell 3 spans 4, cell 4 spans 3, cell 5 spans 5, height 320px. No two cells in a row are the same width. Cells are `paper-2` with a 20px radius and 32px padding. Cell 5 has a faint teal-tinted ground.
- **Entrances (Motion):** each cell uses `whileInView` (once, 30% visible) from opacity 0 and `y` 24 with `spring.ui`, staggered with `stagger.items`.
- **Cell 1:** the line draws once when in view (1200ms, `ease.out`); the band and the amber point fade in after it. It doesn't loop or pulse.
- **Cell 2:** hovering or focusing a chip highlights the matching point on cell 1's chart (a shared hover id through context) with a 6px ring and a tooltip (`dur.micro`). Chips are buttons.
- **Cell 3:** when the cell is 50% in view it types once at 35ms a character, then the answer and its source chip fade in (`dur.ui`). There's a small "Replay" text button.
- **Cell 4:** the four path steps appear with `stagger.items` × 3 (150ms apart); the plain folder fades to 40% as they arrive.
- **Cell 5:** the timeline is a short thread drawn with the same style as part 6 (a static SVG with a Motion `pathLength` reveal, since this is not scroll-linked).
- **States:** mobile is a single column in the order 1 to 5, each cell auto-height. Reduced motion shows final states: the line drawn, the text typed, the path complete.

### Part 8. Nothing forgotten (continuity)

- **Purpose:** the closed follow-up loop, a very relatable pain.
- **Layout:** an animated diagram centred in a wide field, with a small comparison line underneath.
- **Copy:**
  - Headline: **What the doctor said, remembered.**
  - Loop: Recommendation → Reminder → Follow-up → Result → Keep monitoring.
  - Comparison (struck through): Recommendation → Forgotten document.
  - Symptom example: "Headaches on 11 days in the last six weeks, mostly evenings." Label: Example.
- **Motion:** GSAP DrawSVG draws the loop as a thread that closes on itself, and the dot runs one lap along it (MotionPathPlugin) as it enters view.
- **Mobile:** the loop gets smaller and the comparison moves below it.

**Build spec**

- **Source:** our own SVG.
- **Diagram:** a closed, slightly irregular loop about 720×360 with 5 nodes. Node labels are 15px Figtree; the symptom example is a mono chip beside "Keep monitoring".
- **Sequence (GSAP timeline, `start: "top 70%"`, once):**
  1. DrawSVG 0 → 100% over `dur.draw` with `ease.out`. Each node label fades in as the line reaches it (positions come from the path length).
  2. The dot runs one lap over 2400ms with `ease.inOut`, then rests at "Keep monitoring".
  3. The comparison line fades in, and a strike line draws through it with DrawSVG over 600ms.
- **States:** mobile scales the loop to the container width and stacks the comparison below. Reduced motion shows the loop drawn, the dot at rest and the strike in place.

### Part 9. In your hand (the app)

- **Purpose:** show that it's a real product people will use every day (Whoop and Oura pattern).
- **Layout:** one phone frame centred-left; screens swipe inside it. One short line changes beside the phone for each screen.
- **Screens (real React components, designed from Mobbin patterns):**
  1. **What's important now:** a follow-up due, a new report connected, a claim document missing.
  2. **Visit prep:** reason for visit, recent symptoms, current medications, 2 relevant trends, questions to ask.
  3. **Doctor summary:** conditions, medications, allergies, recent tests, and a "Share for 7 days" button.
- **Headline:** **Ready before you walk in.**
- **Mobile:** a full-width phone with swipe; the lines sit below it.

**Build spec**

- **Source:** skiper48 Card swipe carousel (use); Watermelon `card-swipe` (fallback).
- **Phone:** a CSS frame about 340×700 (radius 48px, 10px `ink` bezel) in columns 2 to 6. Screens are real components at 1:1 scale inside it.
- **Carousel (Motion):** drag on the x axis with snap (`spring.ui`), plus 44px previous and next buttons and three dots (`aria-label="Screen 1 of 3"`). Arrow keys work when the carousel has focus. **No autoplay.**
- **Beside the phone:** one line per screen, swapped with `AnimatePresence` (opacity plus `y` 8 → 0, `dur.ui`), and announced with `aria-live="polite"`.
- **States:** mobile uses a full-width phone and puts the line below it. Reduced motion swaps screens without sliding.

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
- **Cards:** 3 cards, 140px tall, `paper-2`, 20px radius, in columns 7 to 12. Order labels are words, not numbers: "Use first", "Then", "If needed".
- **Pin (GSAP):** `start: "top top"`, `end: "+=150%"`, `pin: true`, `scrub: true`. At progress 0 the cards are stacked (`y` offsets 0 / 12 / 24px, `scale` 1 / 0.97 / 0.94, with the top card in front). From 0.15 to 0.75 they fan to their final order: `y` = index × (140 + 24)px, `scale` 1, and a rotation of -1.5° / 0° / 1.5° that settles to 0 by 0.9.
- **Disclaimer:** "Guidance, never a claim guarantee." sits under the cards in mono 12px and is always visible, never animated.
- **States:** mobile has no pin; the fan plays once on enter (`start: "top 70%"`, `dur.settle`, `ease.out`). Reduced motion shows the cards already fanned.

### Part 11. Protect (theme switch to ink)

- **Purpose:** turn privacy into a reason to join. This is the page's emotional peak.
- **Layout:** the page turns ink (a full-bleed colour transition as the section enters). The headline sits on top, then an interactive **purpose picker**.
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
- **Ink switch (GSAP):** one fixed full-bleed `ink` layer behind the content, at opacity 0. A ScrollTrigger on part 11, `start: "top 75%"`, `end: "top 25%"`, `scrub: true`, takes it to opacity 1. It stays at 1 for the rest of the page (parts 12 and 13 are on ink). Text in parts 11 to 13 is styled for ink from the start. Only opacity animates, never `background-color`.
- **Tabs (Motion):** a sliding pill behind the active tab with `layoutId` and `spring.ui`. Arrow keys move between tabs; Home and End jump.
- **Item grid:** 4×2 on desktop and 2×4 on mobile, each item an `ink-2` card with a 20px radius. Lit: opacity 1, `scale` 1, a 1px `teal-light` border, and the label "Shared". Dimmed: opacity 0.35, `scale` 0.98, and the label "Not shared". Changes use `spring.ui`. The summary ("5 of 8 items shared with Doctor") is announced with `aria-live="polite"`.
- **Hold to approve:** hold for 1200ms. The fill is a `scaleX` 0 → 1 over the hold time with linear timing (the user's hold is the easing). Releasing early reverses it over `dur.ui`. On completion: a check icon, then "Approved. Shared for 7 days." announced, and a "Reset" text button. Holding Space or Enter works the same way.
- **States:** mobile as above. Reduced motion switches the ink layer on at `start: "top 50%"` without a scrub, and lit/dimmed changes happen with no scale.

### Part 12. What we're not

- **Layout:** the page's one marquee, on ink, with a visible **Pause motion** button (a pattern taken from Function Health).
- **Copy:** Not a file cabinet. Not a symptom checker. Not a wearable dashboard. Not an insurance app. Not a chatbot. And then, still: **One place that remembers you.**
- **Reduced motion:** a static, wrapped line of the same phrases.

**Build spec**

- **Source:** Fancy Marquee Along SVG Path (use). The phrases travel along the thread, so the marquee *is* the thread passing through.
- **Path:** a gentle wave across the full width (amplitude 40px), stroked as a 1px `muted` hairline. Phrases are 28px Figtree in `paper` at 60% opacity, separated by a `teal-light` dot.
- **Motion:** a constant speed of about 40px a second (linear is right here). It pauses when the section is off screen and while the pointer is over it.
- **Pause motion:** a visible 44px button with a Phosphor Pause/Play icon and a text label. Its state is remembered for the session.
- **Closing line:** "One place that remembers you." at the h2 size, below the marquee, static.
- **States:** mobile uses 22px phrases and a smaller amplitude. Reduced motion shows the phrases as a static wrapped line with no path.

### Part 13. Final CTA and footer

- **Layout:** on ink. A huge "anveli." wordmark across the width. The thread from the page ends exactly at its dot. Above it: a short line and the waitlist field.
- **Copy:**
  - **Your health, understood.**
  - Be first to try anveli when it opens.
  - Waitlist field.
  - Footer links: Privacy & trust, Privacy policy, Terms, Contact (email).
  - Disclaimer: anveli helps you understand and organise your health information. It does not give medical advice or diagnoses. In an emergency, contact your local emergency services.
  - © 2026 anveli.

**Build spec**

- **Source:** Fancy Sticky Footer (use) for the reveal; Paper Shaders `LiquidMetal` (use) for the logo moment (rules in [02-brand-system.md](02-brand-system.md) §1).
- **Reveal:** the footer sits underneath the page and is uncovered as part 12 scrolls away (the Sticky Footer clip pattern). The footer is 100vh on desktop.
- **Order, top to bottom:** "Your health, understood." (h2), the support line, the waitlist field, the links row with the disclaimer, then the huge wordmark at the bottom, fitted to the container width (about 22vw font size), with its baseline 24px above the bottom edge.
- **The thread ends here (GSAP):** an SVG path starts at the top of the footer where part 12's path leaves the screen, curves down and ends precisely at the centre of the wordmark's dot. DrawSVG goes 0 → 100% with `start: "top bottom"`, `end: "bottom bottom"` and `scrub: true`. When it completes, the dot scales 0.9 → 1 with `spring.dot`.
- **Logo moment:** when the footer is 60% in view, the shader canvas mounts over the flat wordmark, plays about 2.5s, then crossfades to the flat wordmark over 400ms and unmounts. Once per page load.
- **States:** mobile stacks everything, with the wordmark at the container width and the footer's height set by its content. Reduced motion shows the thread already drawn and the flat wordmark only.

## 4. Waitlist experience

**States:**

1. **Idle:** a pill button, "Join the waitlist".
2. **Open:** the button expands into an email field in place, with a real visible label, not a placeholder standing in for one.
3. **Submitting:** the button shows a small progress state; the field is locked.
4. **Error:** inline text under the field ("That email doesn't look right." / "Couldn't reach us. Try again?"). Focus returns to the field.
5. **Success:** "You're on the list." The teal dot drops into place, the same motion as the logo signature.
6. **Optional follow-up:** "What would you use first?" with chips for Records, Trends, Doctor visits, Insurance, Family. One tap sends it; skipping is fine.

**Rules:**

- Consent line under the field: "We'll only email you about anveli. Privacy policy." No pre-ticked boxes, no spam.
- It's the same component in the hero, nav sheet and footer; it remembers that you already joined (localStorage, as a convenience only).
- The backend is a static-friendly service (Loops or Formspree) with a client POST, because the site is `output: "export"`.

**Build spec**

- **Source:** skiper106 Smooth caret input (use) for the field; Watermelon `floating-input` (reference) for label behaviour, but our label always stays visible above the field.
- **Open (Motion):** the pill and the field share a `layoutId`. The pill widens to 480px (full width on mobile) with `spring.ui`. The label "Email" (mono 12px) sits above; the field gets focus. The submit button inside the field on the right keeps the label "Join the waitlist".
- **Submitting:** the button's label is replaced by a small three-dot progress (opacity only), and `aria-busy` is set.
- **Error:** the message fades in under the field (`dur.ui`), is linked with `aria-describedby`, and is announced (`aria-live="polite"`). The field shakes by no more than 4px, and only without reduced motion.
- **Success:** the field collapses into the text "You're on the list." and a teal dot drops beside it with `spring.dot`.
- **Keyboard:** Escape closes the open field if it's empty. Enter submits.

## 5. `/privacy-trust` page

- **Layout:** an editorial long-read on paper: a narrow column (65ch), large section headings, one pinned side illustration of the thread passing through a closed ring. Layout reference: the impact reports on deck.gallery (On 2024, Lululemon 2023): big headings, generous margins, one visual per spread.
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
- **Illustration:** an SVG thread passing through a ring. For each section the ring rotates a step and the thread draws a little further (DrawSVG, scrubbed across that section).
- **Headings:** reveal by line once (`SplitText` with a line mask, as in the hero), not scrubbed.
- **States:** mobile has no illustration pin; a small static version sits under the title. Reduced motion shows the illustration complete.

## 6. `/404` page

- **Ground:** ink, so the logo moment follows the "ink only" rule.
- **Content:** a short loose strand drawn across the upper half, the "anveli." mark (flat, then the logo moment), the headline "This page isn't part of the story." and a link "Back to the start" to `/`.
- **Build spec:** the strand is one SVG path (React Bits Threads as a look reference) that draws once with DrawSVG over `dur.draw` and `ease.out`, then drifts no more. The mark plays the logo moment (about 4s, then flat; hover or tap replays it; see [02-brand-system.md](02-brand-system.md) §1). Reduced motion shows the strand drawn and the flat mark.

## 7. Imagery: shot list and generation prompts

Style for all images: warm natural light, soft film grain, paper-toned grade (warm whites, gentle shadows), real Indian people, candid rather than posed, and room for type. No stethoscopes, hospital corridors, holograms or blue glow.

| ID | Use | Shot | Prompt (starting point) |
| --- | --- | --- | --- |
| A | Part 5 full-bleed | A woman in her 30s stretching after an early morning walk on a Mumbai or Bengaluru terrace, soft dawn light, city haze behind | "Candid editorial photo, Indian woman in her early 30s stretching on a rooftop terrace at dawn, soft warm haze, muted warm whites, film grain, calm, wide composition with empty sky on the left, 35mm, natural light, no logos" |
| B | Part 9 backdrop, OG | A father and a young daughter at a kitchen table in the morning, phone face down, relaxed | "Warm editorial photo, Indian father and young daughter at a sunlit kitchen table in the morning, relaxed, candid, paper-toned grade, soft shadows, minimal props, space on the right for text" |
| C | `/privacy-trust` | Hands holding a phone close, in a quiet interior, screen not visible | "Close crop of hands holding a phone against a linen shirt, quiet warm interior, shallow depth of field, calm, private feeling, paper-toned, film grain" |
| D | Part 10 (optional) | An adult child helping an elderly parent with papers at home | "Candid photo, Indian woman in her 40s sitting beside her elderly father at home sorting papers together, warm afternoon window light, tender, unposed, muted palette" |
| E | Part 8 (optional) | A calm consultation, seen from behind the patient, the doctor slightly out of focus | "Editorial photo, calm doctor consultation in a bright modern clinic, seen over the patient's shoulder, doctor out of focus, warm natural light, no stethoscope in frame, reassuring" |

Until the real images exist, use `picsum.photos/seed/anveli-<id>/<w>/<h>` placeholders at the right aspect ratios. The ribbon is always code-rendered and never an image, except for its own fallback renders. Photos never have grain baked in; the site-wide overlay provides it.

## 8. SEO and sharing

- Title pattern: `anveli · Your health, understood.` for the homepage; `<Page> · anveli` elsewhere.
- Meta description (homepage): One living health history for your records, wearables, doctor visits and insurance. Private by default. Join the waitlist.
- OG image: the braided ribbon on paper with the wordmark (a static render, 1200×630).
- `sitemap.xml`, `robots.txt`, favicon set and apple-touch-icon made from the icon tile.
