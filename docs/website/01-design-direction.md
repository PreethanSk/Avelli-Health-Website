# Website Design Direction

Status: agreed in planning, September 2026, and updated after the reference audit ([05-reference-audit.md](05-reference-audit.md)). Nothing is implemented yet.

This document records *why* the anveli website looks and behaves the way it will. Read it before designing or writing any page. The product itself is described in [`../product/`](../product/); the site must stay consistent with it.

## 1. Name

The brand is **anveli.** Always lowercase in the wordmark, one "l", followed by the accent period.

Earlier names are wrong and should be replaced wherever they appear:

| Where | Currently says | Should say |
| --- | --- | --- |
| Repo folder, GitHub repo, `package.json` | avelli | anveli |
| `docs/README.md` title | Avelli Health | anveli |
| Logo package `docs/Logo design brief/anvelli-brand/` | anvelli | anveli |

The rename is a planned build step (see [04-build-plan.md](04-build-plan.md)). Renaming the GitHub repository is done by the owner.

## 2. Positioning

anveli is a **modern health-lifestyle product**, in the same family as Whoop and Oura. It is not a hospital portal, an insurance app or a clinical tool, and the website must not look like one.

What that means in practice:

- **Aspirational, not administrative.** The site sells a feeling: someone finally has their health in one place and understands it.
- **Premium and sculptural.** The site is built around one beautiful object, generous space, confident type and very little UI chrome.
- **Trust lives in the story, not in a cautious look.** We earn trust through what we show: every fact traces back to a source, the product never diagnoses, and sharing is always the user's choice. We do not earn it by looking conservative or clinical.
- **Health basics still apply.** No fear imagery, no alarm reds, no invented statistics, no fake testimonials. Contrast and reduced-motion support are non-negotiable.

Motto: **"Your health, understood."**

It works as the hero headline, the footer sign-off and the default page title. "Remembered" is the supporting idea (the vault); "understood" is the promise (the intelligence on top). The site moves from one to the other.

## 3. References and what we take from each

| Reference | What we take | What we leave |
| --- | --- | --- |
| [optikka.com](https://optikka.com) | Warm neutral ground. One sculptural 3D object that transforms as you scroll and carries the whole story (measured: the entire page is one ~11,500px section with a pinned WebGL scene on Lenis). Sparse, large statements beside it, set at about 97px, weight 500, -0.03em, line-height 1.07, with JetBrains Mono labels. A single switch to a dark ground near the end. Very quiet 48px fixed nav. | Orange accent, the "design-as-code" B2B tone, a loader screen that delays content, the "Scroll down" cue. Its warm brown ink is noted as a possible later softening of our `ink` token, not adopted. |
| [greenstack.zajno.com](https://greenstack.zajno.com) | A cinematic full-bleed photo moment. A huge wordmark that shrinks into the nav on scroll. Calm, left-aligned editorial paragraphs. Images stacking in on one side as you read. A single clear CTA. Its stack (measured: Lenis + GSAP ScrollTrigger + CustomEase + split text) is the stack we use. | Big "471k+" style counters (we have no real numbers yet), the number preloader, repeated placeholder copy, the rain effect. |
| Whoop | Confidence, bold type, real people doing real things, a data-forward product story. | All-black athletic intensity, performance-bro tone. |
| Oura | The product shot like jewellery, soft warm neutrals, tactile materials, calm voice. | Hardware focus. We have no device, so our "object" is the thread (see section 4). |

### Market references (studied September 2026)

| Site | What we learned | Takeaway for anveli |
| --- | --- | --- |
| [Bevel](https://bevel.health) | **Closest competitor in look and pitch**: "Make sense of your health data, from wearables to bloodwork." Its health records feature is one module in a wearable-first coach. It has a short privacy line ("We never sell it"). | We must make the difference obvious. Bevel starts from the wearable and a daily score; anveli starts from **your whole record over time**: records, follow-ups, doctor visits, insurance and purpose-based sharing. Privacy gets a full chapter, not one line. |
| [Function Health](https://functionhealth.com) | Premium lab-testing brand. Groups markers into readable categories (Heart & metabolic, Hormones & thyroid). Has a **"Pause motion" control** on its marquee. It also runs a scrolling list of frightening diseases. | Copy the pause control and the grouping. Never copy the fear list. |
| [Superpower](https://superpower.com) | Opens with a personal story from a real member in their own words. | Story-led beats feature-led. When we have real early users, one honest story beats ten feature cards. We don't invent one before then. |
| [Whoop](https://whoop.com) | "Calibrates to your unique baseline"; plain explanation of what you get; strong personal-coaching story. | Personal baselines are already a trusted consumer idea. We extend it from wearable signals to lab results. |
| [Ultrahuman](https://ultrahuman.com) | Indian premium health brand; tabs per signal (Activity, Sleep, Recovery, Women's Health), each with one line of explanation. | Proves the Indian market expects this level of polish. Tabs with one clear line each are a good pattern for dense capability lists. |
| [Eight Sleep](https://eightsleep.com) | Explains a system in three parts (Cover, Hub, App), then shows it for real situations (couples, recovery, pregnancy). | Show the product in life situations: "before a doctor visit", "the night before admission", "managing a parent's health". |

### Libraries and tools

Every source (libraries, component registries, galleries and skills) was audited in September 2026. The full audit, with licences, verdicts and exactly which components we take, is in **[05-reference-audit.md](05-reference-audit.md)**. The locked result:

| Job | Tool |
| --- | --- |
| Scroll story, pinning, headline and word splitting, the 2D thread | **GSAP** (ScrollTrigger, SplitText, DrawSVG, MotionPathPlugin, CustomEase) through `@gsap/react` |
| Smooth scroll | **Lenis**, driven by GSAP's ticker |
| UI state and gesture (privacy picker, waitlist, menu, carousel, hovers, logo dot drop) | **Motion** (`motion/react`) |
| The 3D ribbon | **Three.js + react-three-fiber + drei**, the only 3D canvas on the site |
| Logo shader moments (footer wordmark and 404 only) and the grain tile | **Paper Shaders** (`@paper-design/shaders-react`) |
| Charts | **Bklit UI** |
| Component patterns (free items only) | **React Bits**, **Skiper UI**, **Fancy Components**, **Kokonut UI**, **Watermelon UI**, all restyled to our tokens |
| Icons | **Phosphor** |
| Visual reference only | ThreeUI, GetLayers, deck.gallery, motionsites.ai, styles.refero.design, Mobbin |
| Process | taste skill (rules and pre-flight), image-to-code skill (section reference images, generated externally from the prompts in [03-site-structure.md](03-site-structure.md)), web-design-guidelines (final audit), awesome-design-md (the format of our `DESIGN.md`; closest systems `elevenlabs` and `apple`) |
| Dev only | Leva (live ribbon tuning, never shipped); Spline or Blender only if we later want a pre-rendered ribbon video for social |

Dropped or rejected: anime.js (GSAP now covers everything we used it for), Vanta, ShaderGradient, liquid-glass-js and the liquid-logo repo. The reasons are in the audit.

## 4. The core concept: the thread

The logo already contains the idea. **The dot is the person. A line is time.**

The whole homepage is one continuous object, the thread:

1. **Fragments.** Dozens of loose strands float apart. Each strand stands for a piece of someone's health: a lab PDF, a prescription sitting in a chat, a paper file, a night of sleep data, an insurance policy, a memory.
2. **The braid.** As you scroll, the strands pull together and braid into one continuous ribbon. It's a slatted, matte, paper-toned sculpture in the Optikka style, with a thin teal core running through it.
3. **The journey.** The teal dot (the person) travels along the finished thread and passes through the seven things anveli does:

   **Remember → Structure → Understand → Monitor → Act → Communicate → Protect**

4. **The finale.** At Protect the page turns to ink. The thread ends in the dot of the "anveli." wordmark in the footer.

The same thread comes back in 2D (drawn SVG lines) inside sections such as the follow-up loop and the timeline, so every section feels like part of one system and not a set of separate features.

Why this works: it tells the product's actual argument (fragmented → continuous) without a single diagram of boxes, and it gives a software product a "hero object" the way Oura has the ring.

## 5. Design read and dials

> Premium consumer health-lifestyle landing page for design-aware adults, India-first, with an object-first, calm, sculptural language, leaning toward Optikka and Oura.

India-first because the product's insurance concepts are Indian (group policies, super top-ups, room-rent limits, cashless network hospitals). Photography, names and examples should reflect that.

Taste-skill dials:

| Dial | Value | Meaning here |
| --- | --- | --- |
| DESIGN_VARIANCE | 7 | Asymmetric, offset compositions; never a centred template. Everything collapses to one clean column on mobile. |
| MOTION_INTENSITY | 7 | Scroll-linked story with pinned moments, but every animation has a reason. |
| VISUAL_DENSITY | 3 | Gallery-airy. Big gaps between sections, few elements per screen. |

## 6. Theme

- **Warm paper** is the page ground from the hero to the insurance section.
- **One deliberate switch to ink** at the Protect chapter, continuing through the final CTA and footer. It's the only theme change on the page, and it carries meaning: this is where your information is locked down.
- We don't build a separate dark mode for the page in phase 1. The brand uses both grounds as part of the story. This is a deliberate exception to the taste skill's dual-mode rule and should be revisited if users ask.
- **Paper grain** is the only atmosphere: one static, very subtle grain texture fixed over the page (spec in [02-brand-system.md](02-brand-system.md) §4). It adds a tactile, printed feel. It never moves.
- **Two logo moments** are the only shader effects outside the ribbon: the huge footer wordmark on ink, and the 404 mark. Both settle into the flat logo (spec in [02-brand-system.md](02-brand-system.md) §1).

## 7. Things we will not do

- Stethoscopes, hospital corridors, blue-glow "health tech" holograms, stock doctors pointing at tablets.
- Red warnings, alarm states, fear-based copy ("Don't let your health slip through the cracks").
- Invented numbers ("10,000+ users", "99% accuracy"), fake testimonials, fake press logos.
- Claims the product can't make: diagnosing, predicting disease, guaranteeing claims.
- Wearable or partner logos presented as live integrations before they exist.
- AI-slop patterns banned by the taste skill: purple gradients, three equal feature cards, eyebrows on every section, em dashes in copy, scroll cues, fake div screenshots.
- Animated or ambient backgrounds (aurora, plasma, mesh gradients, particles, Vanta-style waves), neon or glow effects, glass panels, and custom cursor effects.
- A preloader or intro screen. Content and the headline appear immediately.
