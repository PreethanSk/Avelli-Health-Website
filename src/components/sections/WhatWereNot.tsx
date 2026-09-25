/**
 * Part 12. What we're not (docs/website/03-site-structure.md, part 12).
 *
 * The page's one marquee, on ink: five "Not a ..." phrases travelling along
 * the top arc of one very large ring (ArcMarquee, based on Fancy Components
 * "Marquee Along SVG Path"), with a visible, labelled Pause motion button
 * beside it. Under the arc, still: "One place that remembers you."
 *
 * Mobile: 22px phrases and a smaller arc (the ring scales with the viewport).
 * Reduced motion: no arc and no loop; the phrases sit as one static wrapped
 * line. The same list is the accessible copy in every mode (visually hidden
 * while the marquee runs), so screen readers hear each phrase once.
 * The section stays transparent: the ground layer paints ink.
 */
import { PauseMotionButton } from "@/components/motion/PauseMotionButton";
import { ArcMarquee } from "./what-were-not/ArcMarquee";

const PHRASES = [
  "Not a file cabinet.",
  "Not a symptom checker.",
  "Not a wearable dashboard.",
  "Not an insurance app.",
  "Not a chatbot.",
] as const;

export function WhatWereNot() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="on-ink relative z-[1] overflow-hidden text-ice [--dome-top:120px] md:[--dome-top:152px]"
    >
      <ArcMarquee phrases={PHRASES} className="motion-reduce:hidden" />

      <div className="container-site relative flex min-h-[64svh] flex-col items-center pt-[calc(var(--dome-top)+96px)] pb-24 motion-reduce:min-h-0 motion-reduce:pt-24 md:min-h-[70svh] md:pt-[calc(var(--dome-top)+128px)] md:pb-28 lg:pb-32">
        {/* The accessible list; also the reduced-motion layout */}
        <ul className="sr-only mb-10 flex max-w-[1100px] flex-wrap items-center justify-center gap-x-5 gap-y-3 text-center text-[22px] leading-snug tracking-[-0.015em] text-ice/60 motion-reduce:not-sr-only md:mb-14 md:gap-x-7 md:text-[28px]">
          {PHRASES.map((p, i) => (
            <li key={p} className="flex items-center gap-x-5 md:gap-x-7">
              {p}
              {i < PHRASES.length - 1 && (
                <span aria-hidden className="block size-[5px] shrink-0 rounded-full bg-glacier md:size-1.5" />
              )}
            </li>
          ))}
        </ul>

        <h2 id="about-title" className="text-center text-h2 text-balance text-ice">
          One place that remembers you.
        </h2>

        {/* Beside the marquee, clear of the arc's path at the right edge */}
        <PauseMotionButton
          withLabel
          className="mt-12 border border-hairline-ink motion-reduce:hidden md:mt-auto md:self-end"
        />
      </div>
    </section>
  );
}
