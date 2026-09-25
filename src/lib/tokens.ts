/**
 * anveli design tokens: one source for colour, motion, layering and the
 * mark's geometry. Values come from docs/website/02-brand-system.md and the
 * 6A logo package (docs/new-logo-latest-final/anveli-6a-package).
 * CSS mirrors of these live in src/app/globals.css (@theme).
 */

export const COLOR = {
  // Ink grounds (primary)
  ink: "#0B0C0D",
  depth: "#14202A", // glow only, never a flat fill or text
  ink2: "#12181C",
  ice: "#E9EEF0",
  ice60: "#9AA6AD",
  glacier: "#9FD8E8",
  hairlineInk: "#2A3238",
  // Paper grounds (the one light chapter)
  paper: "#EEF2F4",
  paper2: "#E3E9EC",
  inkReverse: "#0E1A22",
  slate: "#4A5A64",
  harbor: "#3E8FA8", // non-text accent on paper
  harborDeep: "#2F7389", // accent text on paper
  hairlinePaper: "#C9D2D7",
  // Data state only
  amberInk: "#E0A85A",
  amberPaper: "#A8651A",
} as const;

export type Ground = "ink" | "paper";

/** Ring and core colours of the mark per ground. */
export const MARK_COLORS: Record<Ground, { ring: string; core: string }> = {
  ink: { ring: COLOR.ice, core: COLOR.glacier },
  paper: { ring: COLOR.inkReverse, core: COLOR.harbor },
};

/**
 * The 6A Tangent construction in a 100 box. Every circle is internally
 * tangent at one point on the vertical axis, so each centre sits at
 * `TANGENT_Y - r`. Never centre the rings; never rotate the mark.
 */
export const MARK = {
  box: 100,
  cx: 50,
  tangentY: 90,
  R: 40,
  /** Ring radii as a fraction of R, outermost first. */
  ringRatios: [1, 0.725, 0.4625] as const,
  coreRatio: 0.225,
  strokeRatio: 0.075,
  /** Radii in the 100 box, outermost first: 40, 29, 18.5. */
  rings: [40, 29, 18.5] as const,
  core: 9,
  stroke: 3,
  /** Living-mark levels (core, rings, and the 51 hand-off ring for accrue). */
  levels: [9, 18.5, 29, 40, 51] as const,
  /** Optical version for 32px and below: one ring plus the core. */
  optical: { ring: 38, ringCy: 52, stroke: 11, core: 14, coreCy: 76 },
  /** At or below this rendered size (px), use the optical symbol. */
  opticalMaxPx: 32,
} as const;

/** Centre y of a circle of radius r that rests on the tangent point. */
export const tangentCy = (r: number, tangentY: number = MARK.tangentY) => tangentY - r;

export const EASE = {
  /** CSS / Motion cubic-bezier arrays */
  out: [0.16, 1, 0.3, 1] as [number, number, number, number],
  inOut: [0.65, 0, 0.35, 1] as [number, number, number, number],
  outCss: "cubic-bezier(0.16, 1, 0.3, 1)",
  inOutCss: "cubic-bezier(0.65, 0, 0.35, 1)",
  /** GSAP CustomEase names, registered in components/motion/gsap.ts */
  gsapOut: "anveli.out",
  gsapInOut: "anveli.inOut",
  scrub: "none",
} as const;

/** Durations in milliseconds. */
export const DUR = {
  micro: 150,
  ui: 250,
  reveal: 900,
  pulse: 900,
  accrue: 1800,
  draw: 1600,
  settle: 1200,
} as const;

/** Durations in seconds (GSAP / Motion). */
export const DUR_S = Object.fromEntries(
  Object.entries(DUR).map(([k, v]) => [k, v / 1000]),
) as { [K in keyof typeof DUR]: number };

/** Staggers in seconds. */
export const STAGGER = {
  lines: 0.08,
  items: 0.05,
  rings: 0.08,
} as const;

export const SPRING = {
  ui: { type: "spring", stiffness: 100, damping: 20 },
  press: { type: "spring", stiffness: 400, damping: 30 },
} as const;

export const BREAKPOINT = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

/** gsap.matchMedia() conditions shared by every scroll leaf. */
export const MQ = {
  motionOk: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 768px)",
  mobile: "(max-width: 767.98px)",
} as const;

export const NAV_HEIGHT = { desktop: 72, mobile: 64 } as const;
/** Anchor links land this far below the top (the nav height). */
export const ANCHOR_OFFSET = 72;

/**
 * Z-index scale. The paper ground layer sits behind content; the grain sits
 * over everything and never takes pointer events.
 */
export const Z = {
  ground: 0,
  content: 1,
  stage: 0,
  raised: 10,
  nav: 50,
  sheet: 60,
  popover: 70,
  grain: 100,
} as const;

export const LENIS = {
  lerp: 0.1,
  smoothWheel: true,
  syncTouch: false,
} as const;
