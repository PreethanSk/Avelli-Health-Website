"use client";

/**
 * ArcMarquee: the page's one marquee. Phrases travel at a constant ~40px/s
 * along the top arc of ONE very large ring (about 3.4x the viewport width, 2.6x on phones,
 * centre far below the section), so only a gentle dome crosses the screen.
 * Each phrase follows the tangent of the arc and always reads upright.
 *
 * Source: Fancy Components "Marquee Along SVG Path"
 * (https://www.fancycomponents.dev/docs/components/blocks/marquee-along-svg-path,
 * https://github.com/danielpetho/fancy src/fancy/components/blocks/marquee-along-svg-path.tsx,
 * MIT, Daniel Petho). What we kept: a Motion `useAnimationFrame` loop that
 * advances one `baseOffset` motion value by velocity x delta, a wrap() of each
 * item's offset around the loop, repeated copies with the repeats hidden from
 * assistive tech, and the hover slow-down through a spring on a factor
 * (Fancy's slowdownOnHover + slowDownSpringConfig, here slowing to a stop).
 * What changed: the path is a circle, so each item's point and tangent are
 * computed analytically and written as a transform (translate + rotate) instead
 * of CSS offset-path / offset-distance; offsets are spaced by measured width
 * (not by index) so the gaps are even; the loop length is a whole number of
 * phrase sets long enough that the wrap always happens off screen; no drag,
 * scroll velocity or rolling z-index. It stops off screen, on hover over a
 * phrase and whenever the global Pause motion state is on. Our tokens: 28px
 * (22px mobile) Geist in ice at 60%, a small glacier core dot between
 * phrases, a 1px hairline-ink ring.
 *
 * Reduced motion: this component is hidden by the section (CSS) and never
 * starts its loop; the section shows a static wrapped line instead.
 */
import { useAnimationFrame, useMotionValue, useSpring } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { isMotionPaused } from "@/components/motion/motion-state";
import { prefersReducedMotion } from "@/components/motion/useReducedMotionSafe";
import { cn } from "@/lib/cn";
import { COLOR } from "@/lib/tokens";

const SPEED = 40; // px per second along the arc (constant: linear is right here)
const HOVER_SPRING = { damping: 50, stiffness: 400 }; // Fancy's slowDownSpringConfig

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

type Geo = {
  ready: boolean;
  R: number;
  cx: number;
  cy: number;
  /** Half-angle (rad) at which the arc leaves the stage's side edges. */
  phiVis: number;
  /** Width of each base phrase item (phrase + dot + spacing). */
  widths: number[];
  /** Centre offset of every rendered item along the loop. */
  offsets: number[];
  itemWidths: number[];
  loop: number;
  gap: number;
};

export function ArcMarquee({ phrases, className }: { phrases: readonly string[]; className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGSVGElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const geo = useRef<Geo>({
    ready: false,
    R: 0,
    cx: 0,
    cy: 0,
    phiVis: 0,
    widths: [],
    offsets: [],
    itemWidths: [],
    loop: 1,
    gap: 16,
  });
  const inView = useRef(false);
  const hovered = useRef(false);
  const enabled = useRef(false);
  const [copies, setCopies] = useState(2);

  const baseOffset = useMotionValue(0);
  const factor = useMotionValue(1);
  const smoothFactor = useSpring(factor, HOVER_SPRING);

  /** Write every item's transform for the current offset. */
  const place = useCallback(() => {
    const g = geo.current;
    if (!g.ready) return;
    const base = baseOffset.get();
    itemRefs.current.forEach((el, j) => {
      if (!el) return;
      const d = wrap(0, g.loop, g.offsets[j] + base);
      const phi = (d - g.loop / 2) / g.R;
      const hideAt = g.phiVis + (g.itemWidths[j] / 2 + 24) / g.R;
      if (Math.abs(phi) > hideAt) {
        el.style.visibility = "hidden";
        return;
      }
      const x = g.cx + g.R * Math.sin(phi);
      const y = g.cy - g.R * Math.cos(phi);
      el.style.visibility = "visible";
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${phi.toFixed(5)}rad) translate(-50%, calc(-100% - ${g.gap}px))`;
    });
  }, [baseOffset]);

  /** Read the ring and the phrase widths from the DOM (CSS owns the sizes). */
  const measure = useCallback(() => {
    const stage = stageRef.current;
    const ring = ringRef.current;
    if (!stage || !ring) return;
    const s = stage.getBoundingClientRect();
    const r = ring.getBoundingClientRect();
    const W = s.width;
    const R = r.width / 2;
    if (!W || !R) return;

    const n = phrases.length;
    const els = itemRefs.current;
    const widths = phrases.map((_, i) => els[i]?.offsetWidth ?? 0);
    if (widths.some((w) => w === 0)) return;
    const set = widths.reduce((a, b) => a + b, 0);
    const maxW = Math.max(...widths);
    const phiVis = Math.asin(Math.min(1, W / 2 / R));

    // Enough whole sets that an item wraps only when it is out of view.
    const need = Math.max(2, Math.ceil((2 * R * phiVis + 2 * maxW + 96) / set));
    if (need !== copies) {
      setCopies(need);
      return; // re-measured after the new copies render
    }

    const offsets: number[] = [];
    const itemWidths: number[] = [];
    for (let k = 0; k < copies; k++) {
      let acc = k * set;
      for (let i = 0; i < n; i++) {
        offsets.push(acc + widths[i] / 2);
        itemWidths.push(widths[i]);
        acc += widths[i];
      }
    }
    const fontSize = parseFloat(getComputedStyle(els[0]!).fontSize) || 28;

    geo.current = {
      ready: true,
      R,
      cx: r.left - s.left + R,
      cy: r.top - s.top + R,
      phiVis,
      widths,
      offsets,
      itemWidths,
      loop: copies * set,
      gap: Math.round(fontSize * 0.55),
    };
    place();
  }, [copies, phrases, place]);

  // Measure on mount, on resize, and once the real fonts are in.
  useEffect(() => {
    enabled.current = !prefersReducedMotion();
    if (!enabled.current) return;
    const stage = stageRef.current;
    if (!stage) return;
    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(stage);
    itemRefs.current.slice(0, phrases.length).forEach((el) => el && ro.observe(el));
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) measure();
    });
    const io = new IntersectionObserver(([e]) => {
      inView.current = e.isIntersecting;
    });
    io.observe(stage);
    return () => {
      cancelled = true;
      ro.disconnect();
      io.disconnect();
    };
  }, [measure, phrases.length]);

  useAnimationFrame((_, delta) => {
    if (!enabled.current || !geo.current.ready || !inView.current) return;
    factor.set(hovered.current || isMotionPaused() ? 0 : 1);
    const f = smoothFactor.get();
    if (f < 0.0005) return;
    // Leftward travel: the classic reading direction for a marquee.
    baseOffset.set(baseOffset.get() - SPEED * (Math.min(delta, 64) / 1000) * f);
    place();
  });

  const total = copies * phrases.length;

  return (
    <div ref={stageRef} aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {/* One ring, stroked as a 1px hairline. Only its top arc is on screen. */}
      <svg
        ref={ringRef}
        viewBox="0 0 100 100"
        className="absolute top-[var(--dome-top)] left-1/2 aspect-square w-[260%] -translate-x-1/2 md:w-[340%] overflow-visible"
        focusable="false"
      >
        <circle
          cx="50"
          cy="50"
          r="50"
          fill="none"
          stroke={COLOR.hairlineInk}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {Array.from({ length: total }, (_, j) => {
        const phrase = phrases[j % phrases.length];
        return (
          <div
            key={j}
            ref={(el) => {
              itemRefs.current[j] = el;
            }}
            className="pointer-events-auto invisible absolute top-0 left-0 flex origin-top-left items-center whitespace-nowrap will-change-transform"
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") hovered.current = true;
            }}
            onPointerLeave={() => {
              hovered.current = false;
            }}
          >
            <span className="text-[22px] leading-none tracking-[-0.015em] text-ice/60 md:text-[28px]">{phrase}</span>
            <span className="mx-5 block size-[5px] shrink-0 rounded-full bg-glacier md:mx-7 md:size-1.5" />
          </div>
        );
      })}
    </div>
  );
}
