"use client";

/**
 * The sticky layer behind parts 2 to 4 (docs/website/03-site-structure.md §3.1):
 * `position: sticky; top: 0; height: 100vh; margin-bottom: -100vh`, so the
 * parts scroll over it and it scrolls away with the RingsStage wrapper.
 *
 * It holds the one depth glow (static CSS) and, on desktop with motion
 * allowed, the lazy WebGL canvas. If WebGL is unavailable or fails, the same
 * story plays on four SVG renders crossfaded by the same uniform map.
 * Phones and reduced motion never mount any of this (CSS hides the layer and
 * nothing loads); the parts show their own static renders instead.
 *
 * A small DOM driver on GSAP's ticker applies the canvas opacity (part 3 dims
 * it to 0.35) and the SVG crossfade. Nothing here re-renders per frame.
 */
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { gsap } from "@/components/motion/gsap";
import { useMediaQuery } from "@/components/motion/useReducedMotionSafe";
import { MQ } from "@/lib/tokens";
import { CanvasBoundary } from "./CanvasBoundary";
import { StageRender, stageBoxStyle, type StageRenderState } from "./StageRender";
import { createStageValues, deriveStage, resetStageProgress, stageProgress, writePointer } from "./stage-store";

const RingsCanvas = dynamic(() => import("./RingsCanvas"), { ssr: false, loading: () => null });

type Mode = "waiting" | "webgl" | "static";

const STATES: StageRenderState[] = [0, 1, 2, 3];

function hasWebGL() {
  // Checks the API only: creating a probe context would be a second WebGL
  // context. A real failure is caught by CanvasBoundary / context loss.
  return typeof window !== "undefined" && ("WebGL2RenderingContext" in window || "WebGLRenderingContext" in window);
}

export function StageBackdrop() {
  const layer = useRef<HTMLDivElement>(null);
  const canvasWrap = useRef<HTMLDivElement>(null);
  const svgBox = useRef<HTMLDivElement>(null);
  const svgLayers = useRef<(HTMLDivElement | null)[]>([]);

  // Only desktop/tablet with motion allowed ever loads the canvas.
  const enabled = useMediaQuery(`${MQ.desktop} and ${MQ.motionOk}`);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const mode: Mode = !enabled ? "waiting" : failed || !hasWebGL() ? "static" : loaded ? "webgl" : "waiting";
  const [active, setActive] = useState(true);
  const [ready, setReady] = useState(false);
  const [Tuner, setTuner] = useState<ComponentType | null>(null);

  // Lazy-load the canvas after the hero headline has painted (the H1 is the
  // LCP): fonts ready, two frames, then an idle slot.
  useEffect(() => {
    if (!enabled || !hasWebGL()) return;
    let cancelled = false;
    let idle = 0;
    const go = () => {
      if (!cancelled) setLoaded(true);
    };
    document.fonts.ready.then(() => {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (cancelled) return;
          if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(go, { timeout: 700 });
          else idle = globalThis.setTimeout(go, 200) as unknown as number;
        }),
      );
    });
    return () => {
      cancelled = true;
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
      globalThis.clearTimeout(idle);
    };
  }, [enabled]);

  // On screen? (frameloop stays "never"; the ticker only advances while visible)
  useEffect(() => {
    const stage = layer.current?.parentElement;
    if (!stage) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "64px 0px" });
    io.observe(stage);
    return () => io.disconnect();
  }, []);

  // Pointer parallax input: fine pointers only (no effect on touch).
  useEffect(() => {
    if (!enabled) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      writePointer((e.clientX / window.innerWidth) * 2 - 1);
    };
    const onLeave = () => writePointer(0);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  // DOM driver: canvas opacity and the SVG crossfade, from the uniform map.
  useEffect(() => {
    if (!enabled) return;
    const values = createStageValues();
    let seen = -1;
    const tick = () => {
      if (stageProgress.version === seen) return;
      seen = stageProgress.version;
      const v = deriveStage(values);
      if (canvasWrap.current) canvasWrap.current.style.opacity = v.opacity.toFixed(3);
      if (svgBox.current) {
        svgBox.current.style.opacity = v.opacity.toFixed(3);
        svgBox.current.style.transform = `translate3d(${(v.groupX * window.innerWidth).toFixed(1)}px,0,0)`;
        // 0..2 as the first two rings close, 2..3 across the outer ring and the core lighting.
        const core = (v.core - 0.25) / 0.75;
        const x = Math.min(v.accrue, 2) + Math.max(0, v.accrue - 2) * 0.5 + core * 0.5;
        svgLayers.current.forEach((el, k) => {
          if (el) el.style.opacity = Math.max(0, 1 - Math.abs(x - k)).toFixed(3);
        });
      }
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [enabled, mode]);

  useEffect(() => () => resetStageProgress(), []);

  // Dev-only tuning panel: development builds AND ?tune. The branch is
  // compiled out of production bundles.
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      if (!new URLSearchParams(window.location.search).has("tune")) return;
      import("./RingsTuner").then((m) => setTuner(() => m.RingsTuner));
    }
  }, []);

  const onReady = useCallback(() => setReady(true), []);
  const onFail = useCallback(() => setFailed(true), []);

  return (
    <div
      ref={layer}
      aria-hidden="true"
      className="pointer-events-none sticky top-0 z-0 -mb-[100vh] hidden h-[100vh] overflow-hidden md:motion-safe:block"
    >
      {/* The one depth glow, static, under the object */}
      <div className="depth-glow absolute inset-0" />

      {mode === "webgl" && (
        <div ref={canvasWrap} className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-[1200ms] ease-[var(--ease-out)] data-[ready]:opacity-100"
            data-ready={ready ? "" : undefined}
          >
            <CanvasBoundary onError={onFail}>
              <RingsCanvas active={active} onReady={onReady} onFail={onFail} />
            </CanvasBoundary>
          </div>
        </div>
      )}

      {mode === "static" && (
        <div ref={svgBox} className="absolute inset-0 will-change-transform">
          {STATES.map((s) => (
            <div
              key={s}
              ref={(el) => {
                svgLayers.current[s] = el;
              }}
              className="absolute inset-0"
              style={{ opacity: s === 0 ? 1 : 0 }}
            >
              <StageRender state={s} idPrefix="stage-svg" style={stageBoxStyle("50%")} />
            </div>
          ))}
        </div>
      )}

      {Tuner && <Tuner />}
    </div>
  );
}
