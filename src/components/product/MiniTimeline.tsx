"use client";

/**
 * Part 7, cell 5: "One timeline". Symptom, Consultation, Test, Medication,
 * Follow-up as small rings standing on one baseline (the language of part 6):
 * each ring is tangent to the line at its bottom point, radii 12 to 20px,
 * with a mono label. Drawn left to right once in view with Motion pathLength
 * (not scroll-linked); the 14px harbor core comes to rest in the Follow-up
 * ring. Reduced motion: drawn, core at rest.
 */
import { motion, useInView } from "motion/react";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { cn } from "@/lib/cn";
import { TIMELINE_STEPS } from "@/lib/example-data";
import { DUR_S, EASE, STAGGER } from "@/lib/tokens";
import { useElementSize } from "./useElementSize";

const R_MIN = 12;
const R_MAX = 20;
const CORE = 7;
const SIDE = 44; // room for a centred label at either end
const BASE_Y = 52; // baseline y inside the svg (rings stand above it)
const SVG_H = 60;

export function MiniTimeline() {
  const [ref, { width }] = useElementSize<HTMLDivElement>({ width: 480, height: 110 });
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotionSafe();
  const drawn = reduce || inView;

  const n = TIMELINE_STEPS.length;
  const xs = TIMELINE_STEPS.map((_, i) => SIDE + (i * (width - 2 * SIDE)) / (n - 1));
  const rs = TIMELINE_STEPS.map((_, i) => R_MIN + ((R_MAX - R_MIN) * i) / (n - 1));
  const tight = (width - 2 * SIDE) / (n - 1) < 104; // stagger labels when they'd collide

  const LINE = 0.7;
  const ringDelay = (i: number) => (reduce ? 0 : LINE * 0.35 + i * STAGGER.rings * 2.5);
  const ringDur = reduce ? 0 : DUR_S.reveal * 0.8;
  const coreDelay = reduce ? 0 : ringDelay(n - 1) + ringDur;

  return (
    <div ref={ref} className="relative w-full">
      <svg
        aria-hidden
        focusable="false"
        width={width}
        height={SVG_H}
        viewBox={`0 0 ${width} ${SVG_H}`}
        className="overflow-visible"
      >
        <motion.path
          d={`M0 ${BASE_Y + 0.5} H${width}`}
          className="stroke-ink-reverse"
          strokeOpacity={0.35}
          strokeWidth={1}
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: drawn ? 1 : 0 }}
          transition={{ duration: reduce ? 0 : LINE, ease: EASE.out }}
        />
        {xs.map((x, i) => {
          const r = rs[i];
          const top = BASE_Y - 2 * r;
          // Both halves start at the tangent point and meet at the top.
          const halves = [
            `M${x} ${BASE_Y} A${r} ${r} 0 0 1 ${x} ${top}`,
            `M${x} ${BASE_Y} A${r} ${r} 0 0 0 ${x} ${top}`,
          ];
          return halves.map((d, k) => (
            <motion.path
              key={`${i}-${k}`}
              d={d}
              fill="none"
              className="stroke-ink-reverse"
              strokeWidth={1.5}
              strokeLinecap="round"
              initial={{ pathLength: reduce ? 1 : 0 }}
              animate={{ pathLength: drawn ? 1 : 0 }}
              transition={{ duration: ringDur, delay: ringDelay(i), ease: EASE.out }}
            />
          ));
        })}
        <motion.circle
          cx={xs[n - 1]}
          cy={BASE_Y - CORE}
          r={CORE}
          className="fill-harbor"
          initial={{ opacity: reduce ? 1 : 0 }}
          animate={{ opacity: drawn ? 1 : 0 }}
          transition={{ duration: reduce ? 0 : DUR_S.ui * 1.6, delay: coreDelay, ease: EASE.out }}
        />
      </svg>

      <ol className={cn("relative mt-3", tight ? "h-12" : "h-6")}>
        {TIMELINE_STEPS.map((step, i) => (
          <motion.li
            key={step}
            className={cn(
              "absolute top-0 -translate-x-1/2 font-mono text-[11px] leading-none tracking-[0.06em] whitespace-nowrap uppercase",
              i === n - 1 ? "text-harbor-deep" : "text-slate",
              tight && i % 2 === 1 && "top-5",
            )}
            style={{ left: xs[i] }}
            initial={false}
            animate={{ opacity: drawn ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : DUR_S.ui, delay: ringDelay(i) + ringDur * 0.5, ease: EASE.out }}
          >
            {step}
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
