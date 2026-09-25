"use client";

/**
 * The site's ONLY WebGL context: the rings canvas (parts 2 to 4).
 * Lazy-loaded by StageBackdrop with next/dynamic (ssr: false) after the hero
 * headline has painted, so the H1 stays the LCP element.
 *
 * Rendering: frameloop="never". GSAP's ticker (the same tick that steps Lenis
 * and ScrollTrigger) advances the frame, so uniforms always match the scroll
 * position of that frame, with no one-frame lag. The ticker only advances
 * while the stage is on screen and the tab is visible, and while motion is
 * paused it only renders when something changed (scroll, pointer, resize).
 *
 * Performance: dpr [1, 1.5]; drei PerformanceMonitor steps the fragment count
 * down (96 -> 78 -> 60), then drops dpr to 1. (There is no transmission pass
 * to drop: see the ring material decision in shaders.ts / the report.)
 */
import { useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { gsap } from "@/components/motion/gsap";
import { isMotionPaused, useMotionPaused } from "@/components/motion/motion-state";
import { FRAGMENT_TIERS, FRAMING } from "./config";
import { RingsScene } from "./RingsScene";
import { sceneActivity, stageProgress } from "./stage-store";

type Props = {
  /** The stage is on screen (IntersectionObserver in StageBackdrop). */
  active: boolean;
  /** First frame rendered: the backdrop fades the canvas in. */
  onReady?: () => void;
  /** WebGL context lost or failed: the backdrop swaps to the SVG renders. */
  onFail?: () => void;
};

/** Steps R3F from GSAP's ticker while the stage is visible. */
function TickerDriver({ active, onReady }: { active: boolean; onReady?: () => void }) {
  const advance = useThree((s) => s.advance);
  const size = useThree((s) => s.size);
  const activeRef = useRef(active);
  const dirty = useRef(true);
  const readyRef = useRef(onReady);

  useEffect(() => {
    activeRef.current = active;
    dirty.current = true;
  }, [active]);
  useEffect(() => {
    readyRef.current = onReady;
  }, [onReady]);
  useEffect(() => {
    dirty.current = true;
  }, [size]);

  useEffect(() => {
    let seen = -1;
    let first = true;
    const tick = (time: number) => {
      if (!activeRef.current || document.hidden) return;
      const changed = stageProgress.version !== seen || dirty.current || sceneActivity.busy;
      if (isMotionPaused() && !changed) return; // idle: nothing to draw
      seen = stageProgress.version;
      dirty.current = false;
      advance(time);
      if (first) {
        first = false;
        readyRef.current?.();
      }
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [advance]);

  return null;
}

export default function RingsCanvas({ active, onReady, onFail }: Props) {
  const [tier, setTier] = useState(0);
  const [dpr, setDpr] = useState<number | [number, number]>([1, 1.5]);
  // PerformanceMonitor measures frame rate; idle skipped frames (motion
  // paused) would read as a slow device, so it only runs while things move.
  const paused = useMotionPaused();
  const failRef = useRef(onFail);
  useEffect(() => {
    failRef.current = onFail;
  }, [onFail]);

  const decline = () => {
    if (tier < FRAGMENT_TIERS.length - 1) setTier((t) => t + 1);
    else setDpr(1);
  };

  return (
    <Canvas
      frameloop="never"
      dpr={dpr}
      flat
      linear
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance", premultipliedAlpha: true }}
      camera={{ fov: FRAMING.fov, position: [0, 0, FRAMING.cameraZ], near: 0.1, far: 40 }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          failRef.current?.();
        });
      }}
    >
      {!paused && active && (
        <PerformanceMonitor
          flipflops={3}
          onDecline={decline}
          onFallback={() => {
            setTier(FRAGMENT_TIERS.length - 1);
            setDpr(1);
          }}
        />
      )}
      <TickerDriver active={active} onReady={onReady} />
      <RingsScene tier={tier} />
    </Canvas>
  );
}
