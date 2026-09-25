"use client";

/**
 * Part 4. The rings (signature moment).
 *
 * Desktop (motion allowed): pinned `start: top top, end: +=250%`, scrubbed.
 * The pin's progress drives the rings rows of the uniform map (§3.1) through
 * the stage store: 0.05..0.30 the smallest ring closes, ..0.52 the middle,
 * ..0.74 the outer, 0.74..0.90 the core lights and pulses, 0.90..1 breathe.
 * The four copy steps sit in cols 1 to 4, vertically centred, each visible in
 * its ring's window (in: opacity 0 -> 1, y 24 -> 0; out: to -24; 0.04 each).
 * Every step stays in the DOM (hidden ones are only visually hidden).
 *
 * Mobile: no pin, the four renders crossfade on a scrubbed trigger
 * (top 60% -> bottom 40%), lines stacked below. Reduced motion: the lit
 * render and the four lines as plain text.
 */
import { useRef } from "react";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { StageRender, stageBoxStyle, type StageRenderState } from "@/components/three/StageRender";
import { writeStageProgress } from "@/components/three/stage-store";
import { EASE, MQ } from "@/lib/tokens";

const STEPS = [
  { text: "Every report, prescription and scan.", window: [0, 0.3] },
  { text: "Every night of sleep and every symptom you noted.", window: [0.3, 0.52] },
  { text: "Every policy you hold.", window: [0.52, 0.74] },
] as const;
const FINAL_FROM = 0.76;
const CHANGE = 0.04;
const RENDERS: StageRenderState[] = [0, 1, 2, 3];

const stepStack = "md:motion-safe:[grid-area:1/1] md:motion-safe:self-center";

export function Rings() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const steps = gsap.utils.toArray<HTMLElement>("[data-step]", section);
      const renders = gsap.utils.toArray<HTMLElement>("[data-render]", section);
      const mm = gsap.matchMedia();

      mm.add(`${MQ.desktop} and ${MQ.motionOk}`, () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=250%",
            pin: true,
            scrub: true,
            anticipatePin: 1,
            onUpdate: (self) => writeStageProgress("rings", self.progress),
            onRefresh: (self) => writeStageProgress("rings", self.progress),
          },
        });
        // The first line is already in place as the section scrolls in, so the
        // hand-off from part 3 never leaves an empty screen. The rest step in.
        gsap.set(steps.slice(1), { opacity: 0, y: 24 });
        steps.forEach((el, i) => {
          const from = i < STEPS.length ? STEPS[i].window[0] : FINAL_FROM;
          if (i > 0) tl.fromTo(
            el,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: CHANGE, ease: EASE.gsapOut, immediateRender: false },
            from,
          );
          if (i < STEPS.length) {
            tl.to(el, { opacity: 0, y: -24, duration: CHANGE, ease: EASE.gsapOut }, STEPS[i].window[1] - CHANGE);
          }
        });
        tl.set({}, {}, 1); // the timeline spans exactly the pin
        return () => writeStageProgress("rings", 0);
      });

      mm.add(`${MQ.mobile} and ${MQ.motionOk}`, () => {
        const box = section.querySelector("[data-renders]");
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: box ?? section, start: "top 60%", end: "bottom 40%", scrub: true },
        });
        // Crossfade 0 -> 1 -> 2 -> 3 with a short hold on each.
        for (let k = 1; k < renders.length; k++) {
          const at = (k - 1) * 1.3;
          tl.to(renders[k - 1], { opacity: 0, duration: 1 }, at);
          tl.to(renders[k], { opacity: 1, duration: 1 }, at);
        }
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="rings"
      aria-labelledby="rings-title"
      className="on-ink relative z-[1] pb-24 md:h-[100vh] md:pb-0"
    >
      {/* Phones: the four renders crossfade (reduced motion: the lit mark) */}
      <div aria-hidden="true" className="relative overflow-x-clip md:hidden">
        <div className="depth-glow-soft pointer-events-none absolute top-[58%] left-1/2 aspect-square w-[170%] -translate-x-1/2 -translate-y-1/2" />
        <div data-renders className="relative aspect-[4/5] w-full">
          {RENDERS.map((s) => (
            <div
              key={s}
              data-render
              className={
                s === 0
                  ? "absolute inset-0 opacity-100 motion-reduce:hidden"
                  : s === 3
                    ? "absolute inset-0 opacity-0 motion-reduce:opacity-100!"
                    : "absolute inset-0 opacity-0 motion-reduce:hidden"
              }
            >
              <StageRender state={s} framing="portrait" idPrefix="rings-m" className="h-full w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop with reduced motion: the full lit mark, still */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden overflow-hidden md:motion-reduce:block">
        <div className="depth-glow absolute inset-0" />
        <StageRender state={3} idPrefix="rings-r" style={stageBoxStyle("58%")} />
      </div>

      <div className="container-site relative md:h-full">
        <div className="grid-site md:h-full md:items-center">
          <div className="col-span-12 mt-10 flex flex-col gap-6 md:col-span-5 md:mt-0 md:motion-safe:grid md:motion-safe:gap-0 lg:col-span-4">
            {STEPS.map((s) => (
              <p
                key={s.text}
                data-step
                className={`max-w-[22ch] text-[clamp(24px,2.4vw,32px)] leading-[1.25] font-medium tracking-[-0.02em] text-ice ${stepStack}`}
              >
                {s.text}
              </p>
            ))}
            <div data-step className={`mt-4 md:mt-0 ${stepStack}`}>
              <h2 id="rings-title" className="text-h2 text-ice">
                <span className="block whitespace-nowrap">Remembered.</span>
                <span className="block whitespace-nowrap">Then understood.</span>
              </h2>
              <p className="mt-5 max-w-[30ch] text-lead text-ice-60">Every layer of your health touches one point: you.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
