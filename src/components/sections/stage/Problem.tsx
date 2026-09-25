"use client";

/**
 * Part 3. The problem: one kinetic statement over the dimmed fragments.
 *
 * Desktop (motion allowed): pinned `start: top top, end: +=120%`, scrubbed.
 * Words ink from 0.15 to 1 in reading order across 0.05..0.80 (each =
 * 0.75 / word count). Six mono chips drift with scroll depth (y -120px x d,
 * x +-40px) and fade 0.9 -> 0 over 0.6..1, so they leave as the statement
 * lands. The pin's progress also drives the canvas (opacity 0.35, scatter
 * 1.15, then the slide to centre) through the stage store.
 * Mobile: no pin; words reveal once at top 80% (stagger.items); chips wrap
 * under the statement. Reduced motion: everything shown, chips in a loose grid.
 *
 * Sources: React Bits "Scroll Reveal" (reference: per-word opacity from a
 * low base, scrubbed, ease none; we drop its blur and rotation and pin it)
 * and Fancy "Parallax Floating" (reference: depth-weighted offsets per
 * element; driven here by scroll progress instead of the pointer).
 */
import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/components/motion/gsap";
import { writeStageProgress } from "@/components/three/stage-store";
import { PROBLEM_FRAGMENTS } from "@/lib/example-data";
import { DUR_S, EASE, MQ, STAGGER } from "@/lib/tokens";

/** Hand-picked positions around the statement (desktop), depth d and x drift direction. */
const CHIP_LAYOUT = [
  { x: "58%", y: "12%", d: 0.8, dir: 1 },
  { x: "6%", y: "19%", d: 0.45, dir: -1 },
  { x: "70%", y: "74%", d: 1, dir: 1 },
  { x: "34%", y: "86%", d: 0.6, dir: -1 },
  { x: "80%", y: "21%", d: 0.35, dir: 1 },
  { x: "5%", y: "78%", d: 0.9, dir: -1 },
] as const;

export function Problem() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      const statement = section?.querySelector<HTMLElement>("[data-statement]");
      if (!section || !statement) return;
      const chips = gsap.utils.toArray<HTMLElement>("[data-chip]", section);
      const mm = gsap.matchMedia();

      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile, motionOk: MQ.motionOk }, (ctx) => {
        const { desktop, mobile, motionOk } = ctx.conditions as Record<string, boolean>;
        if (!motionOk) return;
        const split = SplitText.create(statement, { type: "words" });
        const words = split.words as HTMLElement[];

        if (desktop) {
          const each = 0.75 / words.length;
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=120%",
              pin: true,
              scrub: true,
              anticipatePin: 1,
              onUpdate: (self) => writeStageProgress("problem", self.progress),
              onRefresh: (self) => writeStageProgress("problem", self.progress),
            },
          });
          tl.fromTo(words, { opacity: 0.15 }, { opacity: 1, duration: each, stagger: each }, 0.05);
          chips.forEach((chip, i) => {
            const c = CHIP_LAYOUT[i % CHIP_LAYOUT.length];
            tl.fromTo(chip, { x: 0, y: 0 }, { x: 40 * c.dir, y: -120 * c.d, duration: 1 }, 0);
            tl.fromTo(chip, { opacity: 0.9 }, { opacity: 0, duration: 0.4 }, 0.6);
          });
          tl.set({}, {}, 1); // the timeline spans exactly the pin
        } else if (mobile) {
          gsap.fromTo(
            words,
            { opacity: 0.15 },
            {
              opacity: 1,
              duration: DUR_S.reveal,
              ease: EASE.gsapOut,
              stagger: STAGGER.items,
              scrollTrigger: { trigger: statement, start: "top 80%", once: true },
            },
          );
        }

        return () => {
          split.revert();
          writeStageProgress("problem", 0);
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="problem"
      aria-labelledby="problem-title"
      className="on-ink relative z-[1] py-24 md:flex md:h-[100vh] md:items-center md:py-0"
    >
      <div className="container-site w-full">
        <div className="grid-site">
          <h2 id="problem-title" data-statement className="col-span-12 text-statement text-ice md:col-span-10">
            <span className="block">Healthcare remembers encounters.</span>
            <span className="block">It doesn&rsquo;t remember you.</span>
          </h2>
        </div>

        <ul
          aria-label="Where health information ends up today"
          className="mt-10 flex flex-wrap gap-3 md:mt-16 md:gap-x-10 md:gap-y-5 md:motion-safe:mt-0"
        >
          {PROBLEM_FRAGMENTS.map((label, i) => {
            const c = CHIP_LAYOUT[i % CHIP_LAYOUT.length];
            return (
              <li
                key={label}
                data-chip
                style={{ ["--x" as string]: c.x, ["--y" as string]: c.y }}
                className="label-mono rounded-full border border-hairline-ink bg-ink-2 px-4 py-2.5 text-ice-60 md:motion-reduce:odd:translate-y-4 md:motion-safe:absolute md:motion-safe:top-[var(--y)] md:motion-safe:left-[var(--x)] md:motion-safe:opacity-90 md:motion-safe:will-change-transform"
              >
                {label}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
