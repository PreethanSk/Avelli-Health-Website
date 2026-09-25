/**
 * The /privacy-trust illustration: the mark growing one ring per protection.
 *
 * Geometry is derived from MARK so it reads as the logo, extended outward:
 * the core (9) and the logo's three rings (18.5, 29, 40), then the living
 * mark's next level (51) and two more at the same step (62, 73). Same stroke,
 * same core. Every ring is internally tangent at one point at the bottom
 * (centre y = tangent - r); nothing is ever centred.
 *
 * Each ring is a path that starts at the top and returns to it, so its
 * midpoint (50%) is the tangent point: DrawSVG from "50% 50%" to "0% 100%"
 * grows the ring up both sides from where it touches the core.
 * Server-safe: no motion here. TrustLongRead animates the paths.
 */
import { MARK, MARK_COLORS } from "@/lib/tokens";

const STEP = MARK.levels[4] - MARK.levels[3]; // 11, the living mark's outer step
export const TRUST_RING_RADII = [
  ...[...MARK.rings].reverse(), // 18.5, 29, 40
  MARK.levels[4], // 51
  MARK.levels[4] + STEP, // 62
  MARK.levels[4] + STEP * 2, // 73
] as const;

const R_MAX = TRUST_RING_RADII[TRUST_RING_RADII.length - 1];
const PAD = MARK.stroke / 2 + 1.5;
const BOX = Math.ceil(R_MAX * 2 + PAD * 2); // 152
const CX = BOX / 2;
const T = BOX - PAD; // the tangent point

/** A full circle of radius r resting on the tangent point, drawn top -> right -> bottom -> left -> top. */
const ringPath = (r: number) => {
  const top = T - 2 * r;
  return `M ${CX} ${top} A ${r} ${r} 0 0 1 ${CX} ${T} A ${r} ${r} 0 0 1 ${CX} ${top}`;
};

export function TrustRings({
  className,
  animated = false,
  title,
}: {
  className?: string;
  /** Marks the rings for the scroll draw (hidden pre-hydration where it will run). */
  animated?: boolean;
  title?: string;
}) {
  const { ring, core } = MARK_COLORS.paper;
  const a11y = title ? { role: "img" as const, "aria-label": title } : { "aria-hidden": true as const };
  return (
    <svg
      viewBox={`0 0 ${BOX} ${BOX}`}
      className={className}
      focusable="false"
      data-trust-rings={animated ? "" : undefined}
      {...a11y}
    >
      <g fill="none" stroke={ring} strokeWidth={MARK.stroke} strokeLinecap="butt">
        {TRUST_RING_RADII.map((r, i) => (
          <path key={r} d={ringPath(r)} className={animated ? "trust-ring" : undefined} data-ring={i} />
        ))}
      </g>
      <circle cx={CX} cy={T - MARK.core} r={MARK.core} fill={core} />
    </svg>
  );
}
