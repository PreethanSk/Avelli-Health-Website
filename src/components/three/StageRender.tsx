/**
 * The four fallback "renders" of the rings object, drawn as crisp SVG from
 * the same geometry and the same fragment layout as the WebGL scene:
 *   0 fragments, 1 one ring, 2 two rings, 3 the full lit mark.
 * Used on phones, under reduced motion and when WebGL is unavailable.
 *
 * Deviation (recorded): the spec asks for AVIF/WebP renders exported from the
 * scene. They can't be exported in this build environment, so these are SVG
 * compositions derived from MARK and makeFragments(): glass-like tubes (a
 * faint body, two light-catching edges, a key-light highlight top left and a
 * faint refracted caustic bottom right), tilted rings drawn as the ellipses the
 * 3D tilt produces, and fragments projected from their 3D scattered poses.
 * Every ring still rests on the one tangent point.
 *
 * Server-safe (no hooks); pass a unique `idPrefix` per instance.
 */
import { COLOR } from "@/lib/tokens";
import { CORE_RADIUS, FRAGMENT_SEED, FRAMING, RING_RADII, RING_TILTS_DEG } from "./config";
import { fragmentCentreline, makeFragments, type Vec3 } from "./fragments";

export type StageRenderState = 0 | 1 | 2 | 3;
export type StageFraming = "wide" | "portrait";

/** viewBoxes in SVG units (100 per R, tangent point at the origin, y down). */
export const FRAMING_BOX: Record<StageFraming, { x: number; y: number; w: number; h: number }> = {
  wide: { x: -230, y: -262, w: 460, h: 322 },
  portrait: { x: -165, y: -326, w: 330, h: 412.5 },
};

const U = 100; // SVG units per R
const TUBE_W = 2.9; // tube body width in SVG units (about 0.012R radius, widened for 1x screens)
/** Camera distance in R units, matching the WebGL framing (fov 22 at z 10). */
const CAM_D = FRAMING.cameraZ / (FRAMING.rOfHeight * 2 * FRAMING.cameraZ * Math.tan(((FRAMING.fov / 2) * Math.PI) / 180));
const SVG_FRAGMENTS = 60; // the calmest tier: a still image has no depth or drift to separate pieces

const fragments = makeFragments(SVG_FRAGMENTS, RING_TILTS_DEG, FRAGMENT_SEED);

function project(p: Vec3): { x: number; y: number; s: number } {
  const s = CAM_D / (CAM_D - p[2]);
  return { x: p[0] * s * U, y: -p[1] * s * U, s };
}

const f1 = (n: number) => Math.round(n * 10) / 10;
const smoothstep = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

type Props = {
  state: StageRenderState;
  framing?: StageFraming;
  idPrefix: string;
  className?: string;
  style?: React.CSSProperties;
};

/** A point on a tilted ring's ellipse at parameter phi (0 = right, pi/2 = bottom). */
function ellipsePoint(rx: number, ry: number, cy: number, phi: number) {
  return { x: rx * Math.cos(phi), y: cy + ry * Math.sin(phi) };
}

function ellipseArc(rx: number, ry: number, cy: number, from: number, to: number) {
  const a = ellipsePoint(rx, ry, cy, from);
  const b = ellipsePoint(rx, ry, cy, to);
  const large = Math.abs(to - from) > Math.PI ? 1 : 0;
  return `M${f1(a.x)} ${f1(a.y)}A${f1(rx)} ${f1(ry)} 0 ${large} 1 ${f1(b.x)} ${f1(b.y)}`;
}

function GlassRing({ r, tiltDeg, id }: { r: number; tiltDeg: number; id: string }) {
  const ry = r * U;
  const rx = ry * Math.cos((tiltDeg * Math.PI) / 180);
  const cy = -ry;
  const edge = TUBE_W / 2 - 0.3;
  return (
    <g>
      {/* The glass body: faint ice */}
      <ellipse cx={0} cy={cy} rx={rx} ry={ry} stroke={COLOR.ice} strokeOpacity={0.13} strokeWidth={TUBE_W} />
      {/* Two light-catching edges (fresnel), brighter top left */}
      <ellipse cx={0} cy={cy} rx={rx + edge} ry={ry + edge} stroke={`url(#${id}-rim)`} strokeWidth={0.55} />
      <ellipse cx={0} cy={cy} rx={rx - edge} ry={ry - edge} stroke={`url(#${id}-rim)`} strokeWidth={0.45} strokeOpacity={0.8} />
      {/* Key light, top left */}
      <path
        d={ellipseArc(rx, ry, cy, Math.PI * 1.12, Math.PI * 1.36)}
        stroke={COLOR.ice}
        strokeOpacity={0.92}
        strokeWidth={1.05}
        strokeLinecap="round"
      />
      {/* Refracted caustic on the far wall, bottom right */}
      <path
        d={ellipseArc(rx - 0.5, ry - 0.5, cy, Math.PI * 0.08, Math.PI * 0.34)}
        stroke={COLOR.glacier}
        strokeOpacity={0.4}
        strokeWidth={0.8}
        strokeLinecap="round"
      />
    </g>
  );
}

function Core({ lit, id }: { lit: boolean; id: string }) {
  const r = CORE_RADIUS * U;
  return (
    <g>
      <circle cx={0} cy={-r} r={r} fill={COLOR.ink2} />
      <circle cx={0} cy={-r} r={r} fill={COLOR.glacier} fillOpacity={lit ? 1 : 0.26} />
      <circle cx={0} cy={-r} r={r} fill={`url(#${id}-core-light)`} />
      <circle cx={0} cy={-r} r={r} fill={`url(#${id}-core-shade)`} />
    </g>
  );
}

export function StageRender({ state, framing = "wide", idPrefix, className, style }: Props) {
  const box = FRAMING_BOX[framing];
  const id = `${idPrefix}-${state}`;
  const closed = state; // rings closed so far, innermost first
  const lit = state === 3;

  const loose = fragments
    .filter((f) => f.ring >= closed)
    .map((f) => {
      const pts = fragmentCentreline(f, { tiltsDeg: RING_TILTS_DEG }).map(project);
      const mid = fragmentCentreline(f, { tiltsDeg: RING_TILTS_DEG, samples: 2 })[1];
      const depth = smoothstep(-1.5, 0.75, mid[2]);
      const alpha = 0.3 + 0.7 * depth;
      const s = pts[Math.floor(pts.length / 2)].s;
      const d = pts.map((p, i) => `${i ? "L" : "M"}${f1(p.x)} ${f1(p.y)}`).join("");
      return { d, alpha, s, z: mid[2] };
    })
    .sort((a, b) => a.z - b.z); // far first

  return (
    <svg
      viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
      className={className}
      style={style}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={COLOR.ice} stopOpacity="0.95" />
          <stop offset="0.55" stopColor={COLOR.ice} stopOpacity="0.5" />
          <stop offset="0.75" stopColor={COLOR.ice} stopOpacity="0.22" />
          <stop offset="1" stopColor={COLOR.glacier} stopOpacity="0.55" />
        </linearGradient>
        <radialGradient id={`${id}-core-light`} cx="0.36" cy="0.3" r="0.62">
          <stop offset="0" stopColor={COLOR.ice} stopOpacity={lit ? 0.55 : 0.2} />
          <stop offset="1" stopColor={COLOR.ice} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-core-shade`} cx="0.72" cy="0.82" r="0.7">
          <stop offset="0" stopColor={COLOR.ink} stopOpacity={lit ? 0.28 : 0.4} />
          <stop offset="1" stopColor={COLOR.ink} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Loose fragments, far to near */}
      <g strokeLinecap="butt">
        {loose.map((f, i) => (
          <g key={i} opacity={f1(f.alpha * 100) / 100}>
            <path d={f.d} stroke={COLOR.ice} strokeOpacity={0.16} strokeWidth={f1(TUBE_W * f.s * 10) / 10} />
            <path d={f.d} stroke={COLOR.ice} strokeOpacity={0.72} strokeWidth={f1(0.62 * f.s * 100) / 100} />
          </g>
        ))}
      </g>

      {/* Closed rings, innermost first; the core rests on the same point */}
      {RING_RADII.slice(0, closed).map((r, i) => (
        <GlassRing key={r} r={r} tiltDeg={RING_TILTS_DEG[i]} id={id} />
      ))}
      <Core lit={lit} id={id} />
    </svg>
  );
}

/**
 * Absolute-position style that frames a "wide" render exactly like the WebGL
 * object: R = min(29% of the height, 20% of the width), tangent point at 72%
 * of the height, horizontally at `centreX` (a CSS length or percentage).
 */
export function stageBoxStyle(centreX = "50%"): React.CSSProperties {
  const b = FRAMING_BOX.wide;
  return {
    ["--u" as string]: `min(${FRAMING.rOfHeight}vh, ${FRAMING.rOfWidth}vw)`,
    position: "absolute",
    width: `calc(var(--u) * ${b.w})`,
    height: `calc(var(--u) * ${b.h})`,
    left: `calc(${centreX} - var(--u) * ${-b.x})`,
    top: `calc(${FRAMING.tangentY * 100}% - var(--u) * ${-b.y})`,
  };
}
