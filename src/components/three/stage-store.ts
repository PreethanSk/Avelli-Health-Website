/**
 * The rings stage's shared progress store.
 *
 * ScrollTriggers of parts 2 to 4 write their progress here (onUpdate), and the
 * WebGL frame (and the DOM stage driver) read it on GSAP's ticker. It is a
 * plain mutable object: no React state is ever touched per frame.
 *
 * `deriveStage()` is the uniform map of docs/website/03-site-structure.md
 * §3.1, in one function, so the canvas, the canvas opacity and the SVG
 * fallback stack can never disagree.
 */
import { ringsTune } from "./config";

export type StageKey = "hero" | "problem" | "rings";

export const stageProgress = {
  /** Part 2 leaving: top top -> bottom top. */
  hero: 0,
  /** Part 3 pin (120%). */
  problem: 0,
  /** Part 4 pin (250%). */
  rings: 0,
  /** Pointer x in -1..1 (fine pointers only; 0 on touch). */
  pointerX: 0,
  /** Bumped on every write, so idle frames can be skipped. */
  version: 0,
};

export function writeStageProgress(key: StageKey, value: number) {
  if (stageProgress[key] === value) return;
  stageProgress[key] = value;
  stageProgress.version++;
}

export function writePointer(x: number) {
  stageProgress.pointerX = x;
  stageProgress.version++;
}

/** Reset on unmount so a remount (route change) starts from the hero pose. */
export function resetStageProgress() {
  stageProgress.hero = 0;
  stageProgress.problem = 0;
  stageProgress.rings = 0;
  stageProgress.pointerX = 0;
  stageProgress.version++;
}

export type StageValues = {
  /** 0..3: rings closed so far (innermost first). */
  accrue: number;
  /** How far apart the loose fragments sit (1 = rest). */
  scatter: number;
  /** Core emissive strength 0.25 (dim) .. 1 (lit). */
  core: number;
  /** 0..1: how much the finished mark breathes. */
  breathe: number;
  /** Horizontal offset in viewport widths (0.18 = right side, 0 = centred). */
  groupX: number;
  /** CSS opacity of the canvas (dims to 0.35 while part 3's type reads). */
  opacity: number;
  /** Part 4 progress, for the pulse trigger. */
  rings: number;
};

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** Linear progress through a window [a, b]. Scroll is the easing. */
const win = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
/** A travel-and-stop window (the object's slide to centre). */
const smooth = (t: number) => t * t * (3 - 2 * t);

export function deriveStage(out: StageValues, p = stageProgress): StageValues {
  const { hero, problem, rings } = p;

  // Part 2 leaving: 0.18 -> 0.08. Part 3 0.85..1: 0.08 -> 0.12, so the lit
  // mark settles right of part 4's copy column (a centred object collides
  // with "Then understood." at h2 size). It still rests on its own point.
  out.groupX = 0.18 - 0.1 * hero + 0.04 * smooth(win(problem, 0.85, 1));
  // Part 3 0..0.2: opacity 1 -> 0.35, scatter 1 -> 1.15. 0.85..1: opacity back to 1.
  out.opacity = 1 - 0.65 * win(problem, 0, 0.2) + 0.65 * win(problem, 0.85, 1);
  out.scatter = 1 + 0.15 * win(problem, 0, 0.2);
  // Part 4: one ring per window, innermost first.
  out.accrue = win(rings, 0, 0.3) + win(rings, 0.3, 0.52) + win(rings, 0.52, 0.74);
  out.core = 0.25 + 0.75 * win(rings, 0.74, 0.9);
  out.breathe = win(rings, 0.9, 1);
  out.rings = rings;

  const o = ringsTune.override;
  if (o.enabled) {
    out.accrue = o.accrue;
    out.scatter = o.scatter;
    out.core = o.core;
    out.breathe = o.breathe;
    out.groupX = o.groupX;
    out.opacity = 1;
    out.rings = o.core > 0.6 ? 0.85 : 0;
  }
  return out;
}

export function createStageValues(): StageValues {
  return { accrue: 0, scatter: 1, core: 0.25, breathe: 0, groupX: 0.18, opacity: 1, rings: 0 };
}

/** Set by the scene each frame: true while the pointer lerp or the pulse still moves. */
export const sceneActivity = { busy: false };

/** Ask for a fresh frame (the tuning panel, a resize). */
export function markStageDirty() {
  stageProgress.version++;
}
