"use client";

/**
 * The 404 mark: one ring has come loose. The innermost ring floats up and
 * away from the core (up and to the right, clear of the other rings) instead
 * of touching it. Spec: docs/website/03-site-structure.md §6.
 *
 * Motion + LivingMark (own SVG, geometry and colours from MARK):
 *  - the loose ring drifts y +-6px over 6s, two cycles at most, then holds
 *    still (paused by the global Pause motion state);
 *  - hovering, tapping or focusing the mark settles the ring back into place,
 *    tangent at the core, with spring.ui; on landing the static layers are
 *    swapped for the LivingMark (pixel identical at rest), which plays
 *    "added" once and then breathes two cycles and holds still;
 *  - reduced motion: the loose ring is still, settling is instant, no pulse.
 *
 * Layers, all in the same 100-unit mark box so they line up exactly:
 *   base   the outer rings (29, 40) and the core, static SVG
 *   loose  a Motion wrapper offset by (LOOSE_DX, LOOSE_DY) of the box, which
 *          springs to (0, 0); inside it a drift wrapper (useAnimate) holding
 *          the ring drawn at its rest position.
 */
import { motion, useAnimate, type AnimationPlaybackControls } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { LivingMark, type LivingMarkHandle } from "@/components/brand/LivingMark";
import { useMotionPaused } from "@/components/motion/motion-state";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { MARK, MARK_COLORS, SPRING, tangentCy } from "@/lib/tokens";

const LOOSE_R = MARK.rings[2]; // 18.5, the ring nearest the person
const HELD = MARK.rings.slice(0, 2); // 40, 29 stay tangent
// Where the loose ring floats, in mark units from its rest centre (50, 71.5):
// centre (88, -12), which leaves a clear gap outside the outer ring.
const LOOSE_DX = 38;
const LOOSE_DY = -83.5;
// The composition box (mark units) that contains the mark and the loose ring.
const COMP = { x: 0, y: -34, w: 112, h: 128 };
const pct = (v: number, of: number) => `${(v / of) * 100}%`;
const MARK_BOX_STYLE: React.CSSProperties = {
  left: pct(0 - COMP.x, COMP.w),
  top: pct(0 - COMP.y, COMP.h),
  width: pct(MARK.box, COMP.w),
  height: pct(MARK.box, COMP.h),
};

type Phase = "loose" | "settling" | "settled";

export function LooseRingMark({ className }: { className?: string }) {
  const { ring, core } = MARK_COLORS.ink;
  const reduce = useReducedMotionSafe();
  const paused = useMotionPaused();
  const [phase, setPhase] = useState<Phase>("loose");
  const [driftScope, animateDrift] = useAnimate<HTMLDivElement>();
  const drift = useRef<{ controls: AnimationPlaybackControls | null; done: boolean }>({ controls: null, done: false });
  const markRef = useRef<LivingMarkHandle>(null);

  // The drift: y +-6px over 6s, two cycles, then still.
  useEffect(() => {
    if (reduce || phase !== "loose" || !driftScope.current) return;
    const state = drift.current;
    if (state.done) return;
    const controls = animateDrift(
      driftScope.current,
      { y: [0, -6, 0, 6, 0] },
      { duration: 6, ease: "easeInOut", repeat: 1, delay: 0.8 },
    );
    state.controls = controls;
    controls.then(() => {
      state.done = true;
    });
    return () => {
      controls.stop();
      state.controls = null;
    };
  }, [reduce, phase, animateDrift, driftScope]);

  // Global Pause motion holds the drift where it is.
  useEffect(() => {
    const c = drift.current.controls;
    if (!c || drift.current.done) return;
    if (paused) c.pause();
    else c.play();
  }, [paused]);

  const settle = useCallback(() => {
    if (phase !== "loose") return;
    const state = drift.current;
    state.controls?.stop();
    state.done = true;
    if (driftScope.current) {
      animateDrift(driftScope.current, { y: 0 }, reduce ? { duration: 0 } : SPRING.ui);
    }
    setPhase(reduce ? "settled" : "settling");
  }, [phase, reduce, animateDrift, driftScope]);

  // Landed: the LivingMark has mounted in place of the static layers.
  useEffect(() => {
    if (phase !== "settled" || reduce) return;
    markRef.current?.play([{ mode: "added" }, { mode: "breathe", loops: 2 }]);
  }, [phase, reduce]);

  const replay = () => {
    if (phase === "settled" && !reduce) {
      markRef.current?.play([{ mode: "added" }, { mode: "breathe", loops: 2 }]);
    }
  };

  const settled = phase === "settled";

  return (
    <button
      type="button"
      onPointerEnter={settle}
      onFocus={settle}
      onClick={settled ? replay : settle}
      aria-label={settled ? "The anveli mark, every ring back in place" : "Put the loose ring back in place"}
      className={`on-ink relative block w-full touch-manipulation rounded-card ${className ?? ""}`}
      style={{ aspectRatio: `${COMP.w} / ${COMP.h}` }}
    >
      <span aria-hidden className="absolute" style={MARK_BOX_STYLE}>
        {settled ? (
          <LivingMark ref={markRef} state="static" ground="ink" className="h-full w-full" />
        ) : (
          <>
            <svg viewBox={`0 0 ${MARK.box} ${MARK.box}`} className="absolute inset-0 h-full w-full overflow-visible">
              <g fill="none" stroke={ring} strokeWidth={MARK.stroke}>
                {HELD.map((r) => (
                  <circle key={r} cx={MARK.cx} cy={tangentCy(r)} r={r} />
                ))}
              </g>
              <circle cx={MARK.cx} cy={tangentCy(MARK.core)} r={MARK.core} fill={core} />
            </svg>
            <motion.span
              className="absolute inset-0 block"
              initial={false}
              animate={
                phase === "loose"
                  ? { x: pct(LOOSE_DX, MARK.box), y: pct(LOOSE_DY, MARK.box) }
                  : { x: "0%", y: "0%" }
              }
              transition={reduce ? { duration: 0 } : SPRING.ui}
              onAnimationComplete={() => {
                if (phase === "settling") setPhase("settled");
              }}
            >
              <span ref={driftScope} className="absolute inset-0 block">
                <svg viewBox={`0 0 ${MARK.box} ${MARK.box}`} className="h-full w-full overflow-visible">
                  <circle
                    cx={MARK.cx}
                    cy={tangentCy(LOOSE_R)}
                    r={LOOSE_R}
                    fill="none"
                    stroke={ring}
                    strokeWidth={MARK.stroke}
                  />
                </svg>
              </span>
            </motion.span>
          </>
        )}
      </span>
    </button>
  );
}
