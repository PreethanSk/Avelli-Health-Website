/**
 * The rings stage: one place for the 3D object's numbers.
 *
 * Geometry is DERIVED from MARK (src/lib/tokens.ts), so the 3D mark can never
 * drift from the SVG symbol and the living mark. Everything is in "R units":
 * the outer ring has radius 1 and the shared tangent point is the origin.
 * Every circle's centre therefore sits at (0, r, 0), and the tangent point
 * never moves.
 *
 * Index order everywhere in the scene is innermost first (0 = smallest ring,
 * the first to close), because that is the order the rings accrue in.
 *
 * `ringsTune` is a mutable object: the scene reads it every frame, and the
 * dev-only Leva panel (?tune, development only) writes to it.
 */
import { COLOR, MARK } from "@/lib/tokens";

const R = MARK.R;

/** Ring radii in R units, innermost first: 0.4625, 0.725, 1. */
export const RING_RADII = [...MARK.ringRatios].reverse() as [number, number, number];
/** Core radius in R units (0.225). */
export const CORE_RADIUS = MARK.coreRatio;
/** The object's visual centre (the outer ring's centre). */
export const OBJECT_CENTRE: [number, number, number] = [0, 1, 0];

/**
 * Tilt of each ring about the vertical axis through the tangent point, in
 * degrees, innermost first. Spec order (R, 0.725R, 0.4625R) is (0, 14, -10).
 */
export const RING_TILTS_DEG: [number, number, number] = [-10, 14, 0];

/**
 * Breathe and pulse offsets, in the package's 100-box units (R = 40), copied
 * from the living mark so the 3D mark breathes exactly like the logo:
 * inner ring +-2.2, middle +-2.6 (0.9 rad behind), outer still, core +-1.1.
 */
export const BREATHE = {
  w: 0.9, // rad/s, about a 7s period
  amp: [2.2 / R, 2.6 / R, 0] as [number, number, number],
  phase: [0, -0.9, 0] as [number, number, number],
  coreAmp: 1.1 / R,
  corePhase: 0.9,
};

/** The living mark's "added" pulse: size (100-box units / R) and ring delays. */
export const PULSE = {
  core: { amp: 5 / R, delay: 0, len: 0.55 },
  rings: [
    { amp: 5 / R, delay: 0.08, len: 0.6 },
    { amp: 4 / R, delay: 0.16, len: 0.65 },
    { amp: 2.5 / R, delay: 0.24, len: 0.7 },
  ],
  total: 1.4,
};

/** The package's pulse bump: a quick swell with a soft tail. */
export function pulseBump(k: number) {
  const c = Math.max(0, Math.min(1, k));
  return Math.sin(Math.PI * c) * (1 - c * 0.3);
}

/** Raw sRGB triplets (0..1). The shaders write these straight out (no colour management). */
export function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export const SCENE_COLORS = {
  ice: hexToRgb(COLOR.ice),
  glacier: hexToRgb(COLOR.glacier),
  ink: hexToRgb(COLOR.ink),
  depth: hexToRgb(COLOR.depth),
  ink2: hexToRgb(COLOR.ink2),
  /** The sleeping core: a deep glacier, so the dim core stays in the accent family (never grey). */
  coreDim: hexToRgb("#1E3440"),
};

/**
 * Framing. The object's scale is chosen so R is 29% of the viewport height
 * (never more than 20% of its width), and the tangent point sits at 72% of the
 * height. uGroupX moves it horizontally in viewport widths (0.18 = right side).
 */
export const FRAMING = {
  rOfHeight: 0.29,
  rOfWidth: 0.2,
  tangentY: 0.72,
  fov: 22,
  cameraZ: 10,
};

/** Fragment counts per performance tier (drei PerformanceMonitor steps down). */
export const FRAGMENT_TIERS = [96, 78, 60] as const;

/**
 * Loose pieces are drawn this much longer than their slot, so they read as
 * broken arcs rather than dashes; they shorten to exactly their slot as they
 * land, so a closed ring has no overlaps beyond a hair.
 */
export const SCATTER_LENGTH = 1.9;

/** Loose pieces curl on a tighter radius (this fraction of their ring's) so they read as arcs; they relax onto the ring as they land. */
export const SCATTER_CURL = 0.42;

/** Seed for the deterministic fragment layout (shared by WebGL and the SVG renders). */
export const FRAGMENT_SEED = 6;

export type RingsTune = {
  /** Tube radius in R units (spec: about 0.012R). */
  tube: number;
  /** Tilts in degrees, innermost first. */
  tilts: [number, number, number];
  /** Ice look. */
  base: number;
  rim: number;
  rimPower: number;
  spec: number;
  caustic: number;
  refract: number;
  /** Slow drift of loose fragments (R units) and its speed. */
  drift: number;
  driftSpeed: number;
  /** Max pointer parallax in degrees and the per-frame lerp at 60fps. */
  parallaxDeg: number;
  parallaxLerp: number;
  /** Dev override of the scroll-driven uniforms (Leva only). */
  override: {
    enabled: boolean;
    accrue: number;
    scatter: number;
    core: number;
    breathe: number;
    groupX: number;
  };
};

/** Tuned defaults. The dev panel mutates this object in place. */
export const ringsTune: RingsTune = {
  tube: 0.012,
  tilts: [...RING_TILTS_DEG],
  base: 0.1,
  rim: 1.05,
  rimPower: 2.2,
  spec: 0.9,
  caustic: 0.42,
  refract: 0.08,
  drift: 0.065,
  driftSpeed: 1,
  parallaxDeg: 3,
  parallaxLerp: 0.05,
  override: { enabled: false, accrue: 0, scatter: 1, core: 0.25, breathe: 0, groupX: 0.18 },
};
