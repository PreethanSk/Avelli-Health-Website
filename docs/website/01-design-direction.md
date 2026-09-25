# Website Design Direction

Status: agreed in planning, September 2026. Updated after the reference audit ([05-reference-audit.md](05-reference-audit.md)) and again when the **6A Tangent** logo was chosen. Built September 2026; see [04-build-plan.md §11](04-build-plan.md#11-as-built-september-2026).

This document records *why* the anveli website looks and behaves the way it will. Read it before designing or writing any page. The product itself is described in [`../product/`](../product/); the site must stay consistent with it.

## 1. Name and mark

The brand is **anveli**: always lowercase, one "l", and **no period**. The mark is the **6A Tangent** symbol (four circles touching one point) next to a Geist wordmark. The logo package is in [`../new-logo-latest-final/anveli-6a-package/`](../new-logo-latest-final/anveli-6a-package/README.md); how the site uses it is in [02-brand-system.md](02-brand-system.md) §1.

Why 6A: it's a real drawn symbol, so the same mark carries into the app (icon, loading and sync states, avatars), the website (hero object, diagrams, favicon) and everything else. The old period wordmark couldn't do that.

Earlier names and marks are wrong and should be replaced wherever they appear:

| Where | Currently says | Should say |
| --- | --- | --- |
| Repo folder, GitHub repo, `package.json` | avelli | anveli |
| Old logo package `docs/Logo design brief/anvelli-brand/` | "anvelli." period wordmark in Figtree with a teal dot | Superseded by the 6A package. Kept only for history. |
| Any doc or asset showing "anveli." with a period | anveli. | anveli (with the 6A symbol) |

The rename is a planned build step (see [04-build-plan.md](04-build-plan.md)). Renaming the GitHub repository is done by the owner.

## 2. Positioning

anveli is a **modern health-lifestyle product**, in the same family as Whoop and Oura. It is not a hospital portal, an insurance app or a clinical tool, and the website must not look like one.

What that means in practice:

- **Aspirational, not administrative.** The site sells a feeling: someone finally has their health in one place and understands it.
- **Premium and sculptural.** The site is built around one beautiful object (the mark, in 3D), generous space, confident type and very little UI chrome.
- **Deep and calm, not cold.** The ground is ink with a soft depth glow, and the accent is a pale ice blue. That palette can drift toward sterile "health tech" or sci-fi, so we keep it human with real photography, warm natural light in the paper chapter, a tactile grain, and a calm voice.
- **Trust lives in the story, not in a cautious look.** We earn trust through what we show: every fact traces back to a source, the product never diagnoses, and sharing is always the user's choice. We do not earn it by looking conservative or clinical.
- **Health basics still apply.** No fear imagery, no alarm reds, no invented statistics, no fake testimonials. Contrast and reduced-motion support are non-negotiable.

Motto: **"Your health, understood."**

It works as the hero headline, the footer sign-off and the default page title. "Remembered" is the supporting idea (the vault); "understood" is the promise (the intelligence on top). The site moves from one to the other.

## 3. References and what we take from each

| Reference | What we take | What we leave |
| --- | --- | --- |
| [optikka.com](https://optikka.com) | One sculptural 3D object that transforms as you scroll and carries the whole story (measured: the entire page is one ~11,500px section with a pinned WebGL scene on Lenis). Sparse, large statements beside it, set at about 97px, weight 500, -0.03em, line-height 1.07, with JetBrains Mono labels. Deliberate ground changes that carry meaning. Very quiet 48px fixed nav. | Its warm sand ground and brown ink (our palette now comes from the 6A package), the orange accent, the "design-as-code" B2B tone, a loader screen that delays content, the "Scroll down" cue. |
| [greenstack.zajno.com](https://greenstack.zajno.com) | A cinematic full-bleed photo moment. A huge wordmark that shrinks into the nav on scroll. Its cool grey-blue palette is close to ours and shows that cool tones can still feel human. Calm, left-aligned editorial paragraphs. Images stacking in on one side as you read. A single clear CTA. Its stack (measured: Lenis + GSAP ScrollTrigger + CustomEase + split text) is the stack we use. | Big "471k+" style counters (we have no real numbers yet), the number preloader, repeated placeholder copy, the rain effect. |
| Whoop | Confidence, bold type, real people doing real things, a data-forward product story. | All-black athletic intensity, performance-bro tone. |
| Oura | The product shot like jewellery, tactile materials, calm voice. Oura has a ring; we have the rings of the mark. | Hardware focus. We have no device, so our "object" is the 6A mark in 3D (see section 4). |

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

Every source (libraries, component registries, galleries and skills) was audited in September 2026 and re-checked after the 6A logo was chosen. The full audit, with licences, verdicts and exactly which components we take, is in **[05-reference-audit.md](05-reference-audit.md)**. The locked result:

| Job | Tool |
| --- | --- |
| Scroll story, pinning, headline and word splitting, ring diagrams drawing, the core travelling | **GSAP** (ScrollTrigger, SplitText, DrawSVG, MotionPathPlugin, CustomEase) through `@gsap/react` |
| Smooth scroll | **Lenis**, driven by GSAP's ticker |
| UI state and gesture (privacy picker, waitlist, menu, carousel, hovers) | **Motion** (`motion/react`) |
| The 3D rings | **Three.js + react-three-fiber + drei**, the only 3D canvas on the site |
| The animated logo (breathe, accrue, pulse) | **LivingMark**, a React port of the logo package's script |
| The grain tile (exported once, offline) | **Paper Shaders** playground; nothing ships at runtime |
| Charts | **Bklit UI** |
| Component patterns (free items only) | **React Bits**, **Skiper UI**, **Fancy Components**, **Kokonut UI**, **Watermelon UI**, all restyled to our tokens |
| Icons | **Phosphor** |
| Visual reference only | ThreeUI, GetLayers, deck.gallery, motionsites.ai, styles.refero.design, Mobbin, and React Bits Fluid Glass and liquid-glass-js (for the rings' glass material only) |
| Process | taste skill (rules and pre-flight), image-to-code skill (section reference images, generated externally from the prompts in [03-site-structure.md](03-site-structure.md)), web-design-guidelines (final audit), awesome-design-md (the format of our `DESIGN.md`; the closest systems are now `apple` for alternating dark and light chapters around one object, `x.ai` for a calm near-black canvas with pill outlines, and `nvidia` for dark chapters around a light body) |
| Dev only | Leva (live tuning of the rings, never shipped); Spline or Blender only if we later want a pre-rendered video of the mark for social |

Dropped or rejected: anime.js (GSAP covers everything we used it for), Vanta, ShaderGradient, the liquid-logo repo, and runtime Paper Shaders (the living mark replaced the logo moments). liquid-glass-js is not installed but is now a look reference for the rings. The reasons are in the audit.

## 4. The core concept: the rings

The logo contains the idea. **Every layer of a life touches one point: the person.** The core is you. Each ring is a layer: a year, a provider, a record set, a policy.

The homepage is built around the mark as a 3D object:

1. **Fragments.** Dozens of broken arc fragments float apart in the dark. Each one stands for a piece of someone's health: a lab PDF, a prescription sitting in a chat, a paper file, a night of sleep data, an insurance policy, a memory.
2. **Accrue.** As you scroll, the fragments settle into rings, one layer at a time: first your records, then your everyday health, then your cover. Each ring is born at the core and grows outward (the living mark's "accrue"), and every ring touches the core. When the last layer lands, the core lights up in glacier: **Remembered. Then understood.** The rings are glass-like and sit in the soft depth glow.
3. **The journey.** In the page's daylight chapter the same idea turns 2D. The person (the core) moves along a baseline, which is time. At each of the seven things anveli does, a ring blooms up from the point where the core stands:

   **Remember → Structure → Understand → Monitor → Act → Communicate → Protect**

4. **The finale.** At Protect the page returns to ink. It ends on the full mark, large, in the footer: one last ring accrues, and then it breathes.

Tangent rings are the site's only diagram language. The follow-up loop in part 8 is a ring resting on the person, the timeline is small rings on a baseline, and the marquee runs around a ring. So every section feels like part of one system, not a set of separate features.

Why this works: it tells the product's actual argument (fragmented → layered around you) without a single diagram of boxes. It gives a software product a "hero object" the way Oura has the ring. And the object *is* the logo, so the website, the app's loading and sync states, and the icon all say the same thing.

## 5. Design read and dials

> Premium consumer health-lifestyle landing page for design-aware adults, India-first, with an object-first, calm, deep language built around the anveli mark, leaning toward Optikka and Oura in structure and Apple's dark product chapters in tone.

India-first because the product's insurance concepts are Indian (group policies, super top-ups, room-rent limits, cashless network hospitals). Photography, names and examples should reflect that.

Taste-skill dials:

| Dial | Value | Meaning here |
| --- | --- | --- |
| DESIGN_VARIANCE | 7 | Asymmetric, offset compositions; never a centred template. Everything collapses to one clean column on mobile. |
| MOTION_INTENSITY | 7 | Scroll-linked story with pinned moments, but every animation has a reason. |
| VISUAL_DENSITY | 3 | Gallery-airy. Big gaps between sections, few elements per screen. |

## 6. Theme

- **Ink is the primary ground**, as the logo package specifies. The 3D rings and large marks sit in one soft `depth` radial glow.
- **One paper chapter.** The page opens into cool paper (`#EEF2F4`) at part 5 ("Your health doesn't only happen at the clinic") and stays on paper through the product parts to part 10 (insurance). This is daylight: everyday life and the product in use.
- **Back to ink at Protect** (part 11) through the final CTA and footer. The return carries meaning: this is where your information is locked down.
- That makes exactly two ground changes, both scrubbed with scroll, around one chapter. No other section changes ground.
- The hero must not become the taste skill's banned "centred hero over dark mesh": the layout is asymmetric and object-first, and the glow is a single soft radial gradient, not a mesh.
- We don't build a light/dark toggle in phase 1. Both grounds are part of the story. This is a deliberate exception to the taste skill's dual-mode rule and should be revisited if users ask.
- **Grain** is the only texture: one static, very subtle grain fixed over the page (spec in [02-brand-system.md](02-brand-system.md) §4). It keeps the dark from feeling flat and digital. It never moves.
- **The living mark** is the only animated logo. There are no shader effects on the logo (spec in [02-brand-system.md](02-brand-system.md) §1).

## 7. Things we will not do

- Stethoscopes, hospital corridors, holographic or HUD "health tech" visuals, glowing wireframe bodies, neon blue light, stock doctors pointing at tablets. Our blue is a pale ice accent and one soft depth glow, nothing more.
- Red warnings, alarm states, fear-based copy ("Don't let your health slip through the cracks").
- Invented numbers ("10,000+ users", "99% accuracy"), fake testimonials, fake press logos.
- Claims the product can't make: diagnosing, predicting disease, guaranteeing claims.
- Wearable or partner logos presented as live integrations before they exist.
- AI-slop patterns banned by the taste skill: purple gradients, three equal feature cards, eyebrows on every section, em dashes in copy, scroll cues, fake div screenshots, a centred hero over a dark mesh.
- Animated or ambient backgrounds (aurora, plasma, mesh gradients, particles, Vanta-style waves), neon or glow effects beyond the one depth glow, glass panels in the interface (glass lives only in the 3D rings), and custom cursor effects.
- Concentric (centred) ring patterns, targets or radar graphics. Every ring touches one point.
- A preloader or intro screen. Content and the headline appear immediately.
