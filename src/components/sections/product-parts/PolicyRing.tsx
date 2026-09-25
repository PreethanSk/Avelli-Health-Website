/**
 * The small ring on each policy card's left edge (part 10). One ring resting
 * on the core, drawn with the mark's own geometry: the ring's size says which
 * layer of cover it is (small, middle, outer), and like every ring on the site
 * it touches the core at one point at the bottom (never concentric).
 * Paper colours: ring ink-reverse, core harbor.
 */
import { MARK, MARK_COLORS, tangentCy } from "@/lib/tokens";

const RING_R = { small: MARK.rings[2], middle: MARK.rings[1], outer: MARK.rings[0] } as const;

export type PolicyLayer = keyof typeof RING_R;

export function PolicyRing({ layer, size = 56, className }: { layer: PolicyLayer; size?: number; className?: string }) {
  const r = RING_R[layer];
  const { ring, core } = MARK_COLORS.paper;
  return (
    <svg
      viewBox={`0 0 ${MARK.box} ${MARK.box}`}
      width={size}
      height={size}
      className={className}
      aria-hidden
      focusable="false"
    >
      <circle cx={MARK.cx} cy={tangentCy(r)} r={r} fill="none" stroke={ring} strokeWidth={MARK.stroke * 1.2} />
      <circle cx={MARK.cx} cy={tangentCy(MARK.core)} r={MARK.core} fill={core} />
    </svg>
  );
}
