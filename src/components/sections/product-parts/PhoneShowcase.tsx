"use client";

/**
 * Part 9 stage: the phone carousel and the one line that changes beside it.
 * Motion owns the carousel (CardSwipe) and the line swap (AnimatePresence,
 * opacity plus y 8 -> 0 over dur.ui), announced with aria-live="polite".
 * No autoplay. Reduced motion: the screens swap in place, the line swaps
 * without moving.
 *
 * Layout (docs/website/03-site-structure.md, part 9): from 768px the phone sits in
 * columns 2 to 6 (1 to 6 on tablets) and the headline, the line and the controls
 * sit beside it; below 768px everything stacks: headline, full-width phone,
 * controls, then the line.
 */
import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { CardSwipe, CardSwipeControls } from "@/components/ui/CardSwipe";
import { ExampleTag } from "@/components/ui/ExampleTag";
import { PhoneFrame } from "@/components/product/phone/PhoneFrame";
import { DUR_S, EASE } from "@/lib/tokens";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";

const VIEWPORT_ID = "in-your-hand-screens";

export function PhoneShowcase({
  heading,
  slides,
  titles,
  lines,
}: {
  heading: ReactNode;
  slides: ReactNode[];
  /** Short name of each screen (for the slide labels). */
  titles: readonly string[];
  /** One line per screen, shown beside the phone. */
  lines: readonly string[];
}) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotionSafe();
  const n = slides.length;
  const of = (i: number) => `Screen ${i + 1} of ${n}`;

  return (
    <div className="grid-site on-paper gap-y-10 md:grid-rows-[1fr_auto_auto_auto_1fr] md:gap-y-0">
      {/* Headline */}
      <div className="col-span-12 md:col-span-6 md:col-start-7 md:row-start-2 lg:col-span-5 lg:col-start-8">
        {heading}
      </div>

      {/* The phone */}
      <div className="col-span-12 md:col-span-6 md:col-start-1 md:row-span-5 md:row-start-1 lg:col-span-5 lg:col-start-2">
        <PhoneFrame>
          <CardSwipe
            id={VIEWPORT_ID}
            slides={slides}
            index={index}
            onIndexChange={setIndex}
            label="The anveli app, example screens"
            slideLabel={(i) => `${of(i)}: ${titles[i]}`}
            className="h-full rounded-[38px]"
          />
        </PhoneFrame>
        <div className="mt-5 hidden justify-center md:flex">
          <ExampleTag ground="paper" />
        </div>
      </div>

      {/* Controls (and, on phones, the Example label beside them) */}
      <div className="col-span-12 -mt-4 flex items-center justify-between md:col-span-6 md:col-start-7 md:row-start-4 md:mt-8 md:justify-start lg:col-span-5 lg:col-start-8">
        <ExampleTag ground="paper" className="md:hidden" />
        <CardSwipeControls
          count={n}
          index={index}
          onIndexChange={setIndex}
          controls={VIEWPORT_ID}
          dotLabel={of}
          className="-mr-0.5 md:-ml-0.5 md:mr-0"
        />
      </div>

      {/* The line for this screen */}
      <div className="col-span-12 -mt-4 md:col-span-6 md:col-start-7 md:row-start-3 md:mt-8 lg:col-span-4 lg:col-start-8">
        <div aria-live="polite" className="grid min-h-[2.7em] text-[22px] leading-[1.35] tracking-[-0.015em] text-slate md:text-[24px]">
          <AnimatePresence initial={false}>
            <motion.p
              key={index}
              className="[grid-area:1/1]"
              initial={{ opacity: 0, y: reduce ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: DUR_S.ui / 2, ease: EASE.out } }}
              transition={{ duration: DUR_S.ui, ease: EASE.out }}
            >
              {lines[index]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
