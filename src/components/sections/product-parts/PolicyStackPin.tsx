"use client";

/**
 * Part 10 choreography: three policy cards fan apart as the part is pinned.
 *
 * Pattern: the taste skill's §5.A sticky-stack skeleton
 *   (.claude/skills/design-taste-frontend/SKILL.md): a real pin at the viewport
 *   top (start "top top", pin: true), transforms scrubbed by scroll, cleaned up
 *   with the context. Reference only: Skiper UI skiper16 / skiper17 "Card stack
 *   scroll" (https://skiper-ui.com/r/skiper16.json, https://skiper-ui.com/r/skiper17.json,
 *   free tier, attribution to Skiper UI): skiper17's one pinned GSAP timeline with
 *   per-card y / scale / rotation tweens at set positions, and skiper16's stepped
 *   scale per depth. Our version fans the stack OUT (to show order of use)
 *   instead of piling cards in.
 *
 * GSAP owns every transform here (one engine per element). Timeline (0 to 1):
 *   0      stacked: y offsets 0 / 12 / 24px from the middle slot, scale 1 / 0.97 / 0.94,
 *          "Use first" in front
 *   0.15 to 0.75  fan to y = index x (card height + 24px), scale 1
 *   0.15 to 0.45  rotation to -1.5 / 0 / 1.5deg, settling to 0 by 0.9
 * The server-rendered layout IS the fanned state, so reduced motion (and no JS)
 * shows the cards already fanned. Mobile: no pin; the fan plays once when the
 * stack reaches 70% of the viewport (dur.settle, ease.out).
 */
import { useRef } from "react";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { DUR_S, EASE, MQ } from "@/lib/tokens";

const GAP = 24;
const STACK_OFFSET = 12;
const SCALES = [1, 0.97, 0.94];
const ROTATIONS = [-1.5, 0, 1.5];

export function PolicyStackPin({ children, className }: { children: React.ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-policy-card]", el);
      const stack = el.querySelector<HTMLElement>("[data-policy-stack]");
      if (!cards.length || !stack) return;

      const step = () => cards[0].offsetHeight + GAP;
      // Cards sit in their fanned slots; stacked means gathered on the middle slot.
      const stackedY = (i: number) => (1 - i) * step() + i * STACK_OFFSET;

      const mm = gsap.matchMedia();

      mm.add(`${MQ.motionOk} and ${MQ.desktop}`, () => {
        const tl = gsap.timeline({
          defaults: { ease: EASE.scrub },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        cards.forEach((card, i) => {
          tl.fromTo(
            card,
            { y: () => stackedY(i), scale: SCALES[i] },
            { y: 0, scale: 1, duration: 0.6 },
            0.15,
          );
          tl.fromTo(card, { rotation: 0 }, { rotation: ROTATIONS[i], duration: 0.3 }, 0.15);
          tl.to(card, { rotation: 0, duration: 0.45 }, 0.45);
        });
        // Hold the fanned state for the last tenth of the pin.
        tl.to({}, { duration: 0.1 }, 0.9);
      });

      mm.add(`${MQ.motionOk} and ${MQ.mobile}`, () => {
        gsap.fromTo(
          cards,
          { y: (i: number) => stackedY(i), scale: (i: number) => SCALES[i] },
          {
            y: 0,
            scale: 1,
            duration: DUR_S.settle,
            ease: EASE.gsapOut,
            scrollTrigger: { trigger: stack, start: "top 70%", once: true },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
