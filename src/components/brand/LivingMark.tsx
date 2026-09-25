"use client";

/**
 * LivingMark: a React port of the logo package's AnveliMark script
 * (docs/new-logo-latest-final/anveli-6a-package/living-mark/anveli-living-mark.html).
 *
 * Same levels (core 9, rings 18.5 / 29 / 40, and the 51 hand-off ring), same
 * breathe (inner rings about +-7%, out of phase, ~7s period), accrue (~1.8s,
 * in-out curve) and pulse (~0.9s, 80ms ring stagger), and the same 0.5s cubic
 * hand-off between states. Differences from the package script:
 *  - stepped by gsap.ticker, never its own requestAnimationFrame loop;
 *  - pauses when off screen and when the global motion state is paused, and
 *    renders the static symbol under reduced motion (set() is ignored);
 *  - `loops`: breathe and accrue can stop after N cycles and settle to rest;
 *  - play([...]) runs a short sequence (used by the footer finale).
 * Circle attributes are written straight to the SVG through refs, never state.
 */
import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import { gsap } from "@/components/motion/gsap";
import { isMotionPaused } from "@/components/motion/motion-state";
import { prefersReducedMotion } from "@/components/motion/useReducedMotionSafe";
import { MARK, MARK_COLORS, type Ground } from "@/lib/tokens";

export type LivingMarkMode = "breathe" | "sync" | "added" | "static";
export type LivingMarkStep = { mode: Exclude<LivingMarkMode, "static">; loops?: number };

export type LivingMarkHandle = {
  /** Switch state. `loops` limits breathe/accrue cycles before it settles. */
  set: (mode: LivingMarkMode, opts?: { loops?: number }) => void;
  /** Run steps in order. The last one keeps going, or settles if it has loops. */
  play: (steps: LivingMarkStep[]) => void;
  readonly mode: LivingMarkMode;
};

export type LivingMarkProps = {
  /** Initial (and controlled) state. Default "breathe". */
  state?: LivingMarkMode;
  /** Cycles for `state` before it settles (breathe and sync only). */
  loops?: number;
  size?: number;
  ground?: Ground;
  /** Optical version (one ring + core, pulse only). Defaults to size <= 32. */
  optical?: boolean;
  /** Override the ring stroke (in the 100 box), e.g. for a small full-ring mark. */
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
  /** Accessible name. Omit for a decorative mark (aria-hidden). */
  title?: string;
  ref?: Ref<LivingMarkHandle>;
};

const LV = MARK.levels; // [9, 18.5, 29, 40, 51]
const T = MARK.tangentY; // 90
const SYNC_RATE = 0.55; // accrue cycles per second (~1.8s each)
const BREATHE_W = 0.9; // rad/s (~7s period)
const BREATHE_PERIOD = (Math.PI * 2) / BREATHE_W;
const PULSE_LEN = 1.4;
const HANDOFF = 0.5;

type Geo = { r: number[]; o: number[]; d: number };

const REST: Geo = { r: [LV[0], LV[1], LV[2], LV[3]], o: [0, 1, 1, 1], d: LV[0] };
const cloneGeo = (g: Geo): Geo => ({ r: [...g.r], o: [...g.o], d: g.d });

/** The package's pulse bump: a quick swell with a soft tail. */
const bump = (k: number) => {
  k = Math.max(0, Math.min(1, k));
  return Math.sin(Math.PI * k) * (1 - k * 0.3);
};
const easeInOutQuad = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);

/** The animation engine: plain state plus the step logic, created once per mark. */
function createEngine() {
  const st = {
    mode: "breathe" as "breathe" | "sync" | "static",
    t: 0,
    tc: -9, // hand-off start
    ta: -9, // pulse start
    snap: null as Geo | null,
    out: cloneGeo(REST),
    amp: 1, // breathe envelope (0 = at rest)
    modeStart: 0,
    loops: Infinity, // cycles allowed in the current mode
    stepEnds: Infinity, // when the current step hands over to the queue
    queue: [] as LivingMarkStep[],
    visible: true,
    reduce: false,
  };

  const handoff = () => {
    st.snap = cloneGeo(st.out);
    st.tc = st.t;
  };

  const begin = (step: LivingMarkStep) => {
    const loops = step.loops ?? Infinity;
    if (step.mode === "added") {
      // The pulse rides on top of breathe.
      if (st.mode !== "breathe") {
        handoff();
        st.mode = "breathe";
        st.modeStart = st.t;
        st.loops = Infinity;
      }
      st.ta = st.t;
      st.stepEnds = st.t + PULSE_LEN;
      return;
    }
    handoff();
    st.mode = step.mode;
    st.modeStart = st.t;
    st.loops = loops;
    st.stepEnds = st.t + (step.mode === "sync" ? loops / SYNC_RATE : loops * BREATHE_PERIOD);
  };

  const api: LivingMarkHandle = {
    set(mode, opts) {
      if (st.reduce) return;
      st.queue = [];
      if (mode === "static") {
        handoff();
        st.mode = "static";
        st.stepEnds = Infinity;
        return;
      }
      begin({ mode, loops: opts?.loops });
    },
    play(steps) {
      if (st.reduce || steps.length === 0) return;
      const [first, ...rest] = steps;
      st.queue = rest;
      begin(first);
    },
    get mode() {
      return st.mode;
    },
  };

  /** Geometry for the current mode at time t (before hand-off blending). */
  const target = (): Geo => {
    if (st.mode === "static") return cloneGeo(REST);
    if (st.mode === "sync") {
      const p = ((st.t - st.modeStart) * SYNC_RATE) % 1;
      const e = easeInOutQuad(p);
      return {
        r: [0, 1, 2, 3].map((j) => LV[j] + (LV[j + 1] - LV[j]) * e),
        o: [e, 1, 1, 1 - e],
        d: LV[0],
      };
    }
    const a = st.amp;
    const w = st.t * BREATHE_W;
    const r = [LV[0], LV[1] + 2.2 * a * Math.sin(w), LV[2] + 2.6 * a * Math.sin(w - 0.9), LV[3]];
    let d = LV[0] + 1.1 * a * Math.sin(w + 0.9);
    const u = st.t - st.ta;
    if (u < PULSE_LEN) {
      d += 5 * bump(u / 0.55);
      r[1] += 5 * bump((u - 0.08) / 0.6);
      r[2] += 4 * bump((u - 0.16) / 0.65);
      r[3] += 2.5 * bump((u - 0.24) / 0.7);
    }
    return { r, o: [0, 1, 1, 1], d };
  };

  /** Advance by dt seconds and return the geometry to draw. */
  const step = (dt: number): Geo => {
    st.t += dt;

    if (st.t >= st.stepEnds) {
      st.stepEnds = Infinity;
      if (st.mode === "sync") {
        // A finished accrue step is the rest pose with every ring shifted
        // out one level, so hand off from the equivalent rest pose: no jump.
        st.snap = cloneGeo(REST);
        st.tc = st.t;
        st.mode = "breathe";
        st.modeStart = st.t;
        st.loops = st.queue.length ? Infinity : 0; // nothing queued: settle
      }
      const next = st.queue.shift();
      if (next) begin(next);
    }

    const settling = st.mode === "breathe" && st.t - st.modeStart >= st.loops * BREATHE_PERIOD;
    const ampTarget = st.mode === "static" || settling ? 0 : 1;
    st.amp += (ampTarget - st.amp) * Math.min(1, dt * 2.5);

    let g = target();
    const k = Math.min(1, (st.t - st.tc) / HANDOFF);
    if (st.snap && k < 1) {
      const e = 1 - Math.pow(1 - k, 3);
      const snap = st.snap;
      const L = (a: number, c: number) => a + (c - a) * e;
      g = { r: g.r.map((v, i) => L(snap.r[i], v)), o: g.o.map((v, i) => L(snap.o[i], v)), d: L(snap.d, g.d) };
    }
    st.out = g;
    return g;
  };

  return { st, api, step };
}

export function LivingMark({
  state = "breathe",
  loops,
  size,
  ground = "ink",
  optical,
  strokeWidth,
  className,
  style,
  title,
  ref,
}: LivingMarkProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const ringRefs = useRef<(SVGCircleElement | null)[]>([]);
  const dotRef = useRef<SVGCircleElement>(null);
  const engineRef = useRef<ReturnType<typeof createEngine> | null>(null);
  if (engineRef.current == null) {
    engineRef.current = createEngine();
  }
  const useOptical = optical ?? (typeof size === "number" && size <= MARK.opticalMaxPx);

  useImperativeHandle(ref, () => engineRef.current!.api, []);

  // Reduced motion is read before the state effect so set() can ignore it.
  useEffect(() => {
    engineRef.current!.st.reduce = prefersReducedMotion();
  }, []);

  // Controlled state prop
  useEffect(() => {
    const { api } = engineRef.current!;
    if (state === "static") api.set("static");
    else api.set(state, { loops });
  }, [state, loops]);

  useEffect(() => {
    const { st, step } = engineRef.current!;
    const svg = svgRef.current;
    if (!svg) return;

    const write = (g: Geo) => {
      if (useOptical) {
        // Optical: one ring + core, pulse only (rings can't animate this small).
        const u = st.t - st.ta;
        const ringR = MARK.optical.ring + 1.5 * bump((u - 0.24) / 0.7);
        const coreR = MARK.optical.core + 4.5 * bump(u / 0.55);
        const ringEl = ringRefs.current[0];
        ringEl?.setAttribute("r", ringR.toFixed(2));
        ringEl?.setAttribute("cy", (T - ringR).toFixed(2));
        dotRef.current?.setAttribute("r", coreR.toFixed(2));
        dotRef.current?.setAttribute("cy", (T - coreR).toFixed(2));
        return;
      }
      ringRefs.current.forEach((c, i) => {
        if (!c) return;
        c.setAttribute("r", g.r[i].toFixed(2));
        c.setAttribute("cy", (T - g.r[i]).toFixed(2));
        c.setAttribute("opacity", g.o[i].toFixed(3));
      });
      dotRef.current?.setAttribute("r", g.d.toFixed(2));
      dotRef.current?.setAttribute("cy", (T - g.d).toFixed(2));
    };

    if (st.reduce) return; // the server-rendered static symbol stays

    const frame = (_time: number, deltaMs: number) => {
      if (!st.visible || isMotionPaused()) return;
      write(step(Math.min(0.05, deltaMs / 1000)));
    };
    gsap.ticker.add(frame);

    const io = new IntersectionObserver(
      ([entry]) => {
        st.visible = entry.isIntersecting;
      },
      { rootMargin: "64px" },
    );
    io.observe(svg);

    return () => {
      gsap.ticker.remove(frame);
      io.disconnect();
    };
  }, [useOptical]);

  const { ring, core } = MARK_COLORS[ground];
  const a11y = title ? { role: "img" as const, "aria-label": title } : { "aria-hidden": true as const };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${MARK.box} ${MARK.box}`}
      width={size}
      height={size}
      className={className}
      style={{ overflow: "visible", ...style }}
      focusable="false"
      {...a11y}
    >
      {useOptical ? (
        <>
          <circle
            ref={(el) => {
              ringRefs.current[0] = el;
            }}
            cx={MARK.cx}
            cy={MARK.optical.ringCy}
            r={MARK.optical.ring}
            fill="none"
            stroke={ring}
            strokeWidth={strokeWidth ?? MARK.optical.stroke}
          />
          <circle ref={dotRef} cx={MARK.cx} cy={MARK.optical.coreCy} r={MARK.optical.core} fill={core} />
        </>
      ) : (
        <>
          <g fill="none" stroke={ring} strokeWidth={strokeWidth ?? MARK.stroke}>
            {REST.r.map((r, i) => (
              <circle
                key={i}
                ref={(el) => {
                  ringRefs.current[i] = el;
                }}
                cx={MARK.cx}
                cy={T - r}
                r={r}
                opacity={REST.o[i]}
              />
            ))}
          </g>
          <circle ref={dotRef} cx={MARK.cx} cy={T - LV[0]} r={LV[0]} fill={core} />
        </>
      )}
    </svg>
  );
}
