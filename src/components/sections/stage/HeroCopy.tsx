"use client";

/**
 * Part 2 copy: the H1 revealed line by line behind a mask (LineReveal, GSAP
 * SplitText, starts on fonts ready), then the sub and the CTA fade up 200ms
 * after the last line starts. Also writes the "hero leaving" progress
 * (top top -> bottom top) that slides the object from 0.18 to 0.08.
 *
 * Sources: Fancy "Vertical Cut Reveal" and skiper66 "SVG clip path mask"
 * (reference only: per-line mask, travel from below) and React Bits
 * "Split Text" (reference: split after document.fonts.ready, revert on
 * unmount). Rebuilt on GSAP SplitText through LineReveal.
 */
import { useCallback, useRef } from "react";
import { LineReveal } from "@/components/motion/LineReveal";
import { gsap, ScrollTrigger, useGSAP } from "@/components/motion/gsap";
import { prefersReducedMotion } from "@/components/motion/useReducedMotionSafe";
import { WaitlistField } from "@/components/waitlist/WaitlistField";
import { writeStageProgress } from "@/components/three/stage-store";
import { DUR_S, EASE, MQ, STAGGER } from "@/lib/tokens";

export const HERO_REVEALED_EVENT = "anveli:hero-revealed";

export function HeroCopy() {
  const root = useRef<HTMLDivElement>(null);
  const after = useRef<HTMLDivElement>(null);

  // Sub and CTA: 200ms after the last headline line starts.
  const onLastLineStart = useCallback(() => {
    const el = after.current;
    if (!el || el.hasAttribute("data-revealed")) return;
    if (prefersReducedMotion()) {
      el.setAttribute("data-revealed", "");
      return;
    }
    const items = Array.from(el.children);
    gsap.set(items, { opacity: 0, y: 12 });
    el.setAttribute("data-revealed", "");
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: DUR_S.reveal,
      ease: EASE.gsapOut,
      delay: 0.2,
      stagger: STAGGER.lines,
      clearProps: "transform",
    });
  }, []);

  // Lets the nav time its signature pulse after the headline lands.
  const onComplete = useCallback(() => {
    window.dispatchEvent(new CustomEvent(HERO_REVEALED_EVENT));
  }, []);

  useGSAP(
    () => {
      const section = root.current?.closest("section");
      if (!section) return;
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop} and ${MQ.motionOk}`, () => {
        const st = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom top",
          onUpdate: (self) => writeStageProgress("hero", self.progress),
          onRefresh: (self) => writeStageProgress("hero", self.progress),
        });
        return () => {
          st.kill();
          writeStageProgress("hero", 0);
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <LineReveal
        as="h1"
        id="hero-title"
        trigger="load"
        onLastLineStart={onLastLineStart}
        onComplete={onComplete}
        className="max-w-[12ch] text-[clamp(44px,12vw,64px)] leading-[1.02] font-medium tracking-[-0.035em] text-ice md:text-display"
      >
        Your health, understood.
      </LineReveal>
      <div ref={after} data-reveal="fade">
        <p className="mt-6 max-w-[60ch] text-lead text-ice-60">
          anveli keeps your records, wearables and everyday health in one living history that grows with you.
        </p>
        <div className="mt-8">
          <WaitlistField id="hero" source="hero" ground="ink" />
        </div>
      </div>
    </div>
  );
}
