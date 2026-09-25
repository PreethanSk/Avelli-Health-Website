"use client";

/**
 * The finale mark: the symbol of the footer's stacked lockup as a LivingMark.
 * When the footer is 60% in view it plays, once per page load:
 * one accrue step (a ring is born from the core and every layer moves out),
 * then the "added" pulse, then two breathe cycles, then it holds still.
 *
 * Trigger (GSAP ScrollTrigger, once): with the reveal (>= 768px wide and
 * >= 600px tall), the footer shell's top reaching 40% of the viewport means
 * 60% of the 100vh footer is uncovered. Elsewhere the footer has its content's
 * height, so the cue is the finale itself being fully on screen.
 * Pause motion: the LivingMark freezes while paused and resumes after.
 * Reduced motion: no trigger; the LivingMark renders the static symbol.
 */
import { useRef } from "react";
import { LivingMark, type LivingMarkHandle } from "@/components/brand/LivingMark";
import { gsap, ScrollTrigger, useGSAP } from "@/components/motion/gsap";
import { MQ } from "@/lib/tokens";

const REVEAL_MQ = "(min-width: 768px) and (min-height: 600px)";

export function FinaleMark() {
  const wrap = useRef<HTMLSpanElement>(null);
  const mark = useRef<LivingMarkHandle>(null);

  useGSAP(
    () => {
      const el = wrap.current;
      const shell = el?.closest("footer");
      if (!el || !shell) return;
      let played = false;
      const play = () => {
        if (played) return;
        played = true;
        mark.current?.play([{ mode: "sync", loops: 1 }, { mode: "added" }, { mode: "breathe", loops: 2 }]);
      };

      const mm = gsap.matchMedia();
      mm.add({ reveal: REVEAL_MQ, motionOk: MQ.motionOk }, (ctx) => {
        const { reveal, motionOk } = ctx.conditions as { reveal: boolean; motionOk: boolean };
        if (!motionOk) return;
        ScrollTrigger.create(
          reveal
            ? { trigger: shell, start: "top 40%", once: true, onEnter: play }
            : { trigger: el, start: "bottom bottom", once: true, onEnter: play },
        );
      });
      return () => mm.revert();
    },
    { scope: wrap },
  );

  return (
    <span ref={wrap} className="block h-full w-full">
      <LivingMark ref={mark} state="static" optical={false} className="h-full w-full" />
    </span>
  );
}
