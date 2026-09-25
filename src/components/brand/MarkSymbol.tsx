/**
 * The 6A Tangent symbol as inline SVG (server-safe, no motion).
 * Full version: three rings plus the core, all tangent at one point.
 * Optical version: one heavier ring plus the core, for 32px and below.
 * Geometry comes from MARK in lib/tokens.ts, so it can never drift.
 */
import { MARK, MARK_COLORS, tangentCy, type Ground } from "@/lib/tokens";

export type MarkSymbolProps = {
  ground?: Ground;
  /** Force the optical version. Defaults to `size <= 32` when size is a number. */
  optical?: boolean;
  /** Rendered size in px (width = height). Omit to size with CSS (e.g. `1.15em`). */
  size?: number;
  className?: string;
  /** Accessible name. Omit for a decorative symbol (aria-hidden). */
  title?: string;
  style?: React.CSSProperties;
};

export function MarkSymbol({ ground = "ink", optical, size, className, title, style }: MarkSymbolProps) {
  const { ring, core } = MARK_COLORS[ground];
  const useOptical = optical ?? (typeof size === "number" && size <= MARK.opticalMaxPx);
  const a11y = title ? { role: "img" as const, "aria-label": title } : { "aria-hidden": true as const };

  return (
    <svg
      viewBox={`0 0 ${MARK.box} ${MARK.box}`}
      width={size}
      height={size}
      className={className}
      style={style}
      focusable="false"
      {...a11y}
    >
      {useOptical ? (
        <>
          <circle
            cx={MARK.cx}
            cy={MARK.optical.ringCy}
            r={MARK.optical.ring}
            fill="none"
            stroke={ring}
            strokeWidth={MARK.optical.stroke}
          />
          <circle cx={MARK.cx} cy={MARK.optical.coreCy} r={MARK.optical.core} fill={core} />
        </>
      ) : (
        <>
          <g fill="none" stroke={ring} strokeWidth={MARK.stroke}>
            {MARK.rings.map((r) => (
              <circle key={r} cx={MARK.cx} cy={tangentCy(r)} r={r} />
            ))}
          </g>
          <circle cx={MARK.cx} cy={tangentCy(MARK.core)} r={MARK.core} fill={core} />
        </>
      )}
    </svg>
  );
}
