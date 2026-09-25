/**
 * Part 6 copy: the seven verbs (docs/product/03-our-approach.md, via
 * docs/website/03-site-structure.md part 6) and the rail's geometry, shared
 * by the desktop rail and the stacked list.
 */
export const VERBS = [
  { verb: "Remember", line: "Every record in one lifelong vault, with the original always kept." },
  { verb: "Structure", line: "Reports become data: test, value, range, date and where it came from." },
  { verb: "Understand", line: "See how things change over time against your own baseline." },
  { verb: "Monitor", line: "Follow-ups and check-ups tracked, so nothing depends on memory." },
  { verb: "Act", line: "Walk into a doctor's visit or a hospital admission prepared." },
  { verb: "Communicate", line: "Share a clear summary, not a stack of PDFs." },
  { verb: "Protect", line: "You decide who sees what, for how long, and why." },
] as const;

/** Rail geometry in vw (Build spec: 24vw lead-in, 7 stops of 40vw, 16vw tail). */
export const RAIL = {
  leadIn: 24,
  stop: 40,
  tail: 16,
  /** Where each stop's point (ring tangent, text edge) sits inside its stop. */
  pointInset: 4,
  /** The baseline, as a fraction of the viewport height. */
  baselineY: 0.58,
  /** Ring radii in px: Remember 36, +8 per stop, Protect 84. */
  ringR0: 36,
  ringStep: 8,
  /** The core: 14px, resting on the line. */
  coreR: 7,
} as const;

export const RAIL_TRACK_VW = RAIL.leadIn + RAIL.stop * VERBS.length + RAIL.tail; // 320

export const ringRadius = (i: number) => RAIL.ringR0 + RAIL.ringStep * i;

/**
 * Two half arcs that start at a ring's tangent point (x, y) and meet at the
 * top: left side first, then right. Drawing both 0 -> 100% at once draws the
 * ring "from the tangent point both ways around".
 */
export function ringHalves(x: number, y: number, r: number): [string, string] {
  const top = y - 2 * r;
  return [`M${x} ${y} A${r} ${r} 0 0 1 ${x} ${top}`, `M${x} ${y} A${r} ${r} 0 0 0 ${x} ${top}`];
}

/** Support line under the "How anveli works" heading. */
export const VERBS_SUPPORT = "Seven things it does, and every one comes back to you.";
