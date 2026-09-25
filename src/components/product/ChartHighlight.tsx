"use client";

/**
 * The highlight for a data point: a ring 6px wider than the point, tangent
 * to it at the bottom (the mark's rule: rings touch at one point, never
 * centred), plus a small tooltip pill above it. Both fade in `dur.micro`.
 */
import { AnimatePresence, motion } from "motion/react";
import { DUR_S, EASE } from "@/lib/tokens";

export const HIGHLIGHT_GAP = 6;

/** SVG part: render inside the chart's <svg>. */
export function HighlightRing({ x, y, pointR, show }: { x: number; y: number; pointR: number; show: boolean }) {
  const R = pointR + HIGHLIGHT_GAP;
  const bottom = y + pointR; // the shared tangent point
  return (
    <AnimatePresence>
      {show ? (
        <motion.circle
          key="ring"
          cx={x}
          cy={bottom - R}
          r={R}
          fill="none"
          className="stroke-harbor"
          strokeWidth={1.5}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DUR_S.micro, ease: EASE.out }}
        />
      ) : null}
    </AnimatePresence>
  );
}

/** HTML part: render in a relatively positioned wrapper over the <svg>. */
export function HighlightTooltip({
  x,
  y,
  pointR,
  show,
  children,
  containerWidth,
}: {
  x: number;
  y: number;
  pointR: number;
  show: boolean;
  children: React.ReactNode;
  containerWidth: number;
}) {
  // Keep the pill inside the chart: nudge it in near either edge.
  const edge = 76;
  const cx = Math.min(Math.max(x, edge), Math.max(edge, containerWidth - edge));
  const top = y + pointR - 2 * (pointR + HIGHLIGHT_GAP) - 8;
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="tip"
          role="presentation"
          className="pointer-events-none absolute z-[2] whitespace-nowrap rounded-full bg-ink-reverse px-3 py-1.5 font-mono text-[11px] leading-none text-paper"
          style={{ left: cx, top, x: "-50%", y: "-100%" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DUR_S.micro, ease: EASE.out }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
