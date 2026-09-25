"use client";

/**
 * The page ground. The base is ink; one fixed full-bleed paper layer sits
 * behind all content and only its opacity ever animates (never
 * background-color). At the midpoint of each change, data-ground on <html>
 * flips so the nav variant and the grain blend follow.
 *
 * mode="story": the homepage. Ink -> paper at #everyday (part 5) and
 *   paper -> ink at #protect (part 11), scrubbed. Instant under reduced motion.
 * mode="paper": a paper page (/privacy-trust, /privacy, /terms).
 * mode="ink":   an ink page (404).
 */
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/components/motion/gsap";
import { MQ } from "@/lib/tokens";
import type { Ground } from "@/lib/tokens";

export const GROUND_ENTER_ID = "everyday";
export const GROUND_EXIT_ID = "protect";

function setGround(g: Ground) {
  document.documentElement.setAttribute("data-ground", g);
}

export function GroundLayer({ mode }: { mode: "story" | Ground }) {
  const layer = useRef<HTMLDivElement>(null);

  // Static grounds
  useEffect(() => {
    if (mode === "story") return;
    setGround(mode);
    return () => setGround("ink");
  }, [mode]);

  useGSAP(
    () => {
      if (mode !== "story" || !layer.current) return;
      setGround("ink");
      const el = layer.current;
      const enter = document.getElementById(GROUND_ENTER_ID);
      const exit = document.getElementById(GROUND_EXIT_ID);
      if (!enter || !exit) return;

      const mm = gsap.matchMedia();

      mm.add(MQ.motionOk, () => {
        // Opacity = enter progress x (1 - exit progress), so the two
        // scrubbed changes can never fight over the same layer.
        let pIn = 0;
        let pOut = 0;
        let current: Ground | null = null;
        const apply = () => {
          gsap.set(el, { opacity: pIn * (1 - pOut) });
          const next: Ground = pIn >= 0.5 && pOut < 0.5 ? "paper" : "ink";
          if (next !== current) {
            current = next;
            setGround(next);
          }
        };
        ScrollTrigger.create({
          trigger: enter,
          start: "top 75%",
          end: "top 25%",
          refreshPriority: -10,
          onUpdate: (st) => {
            pIn = st.progress;
            apply();
          },
          onRefresh: (st) => {
            pIn = st.progress;
            apply();
          },
        });
        ScrollTrigger.create({
          trigger: exit,
          start: "top 75%",
          end: "top 25%",
          refreshPriority: -10,
          onUpdate: (st) => {
            pOut = st.progress;
            apply();
          },
          onRefresh: (st) => {
            pOut = st.progress;
            apply();
          },
        });
      });

      mm.add(MQ.reduce, () => {
        // Instant changes at top 50%
        const apply = (paper: boolean) => {
          gsap.set(el, { opacity: paper ? 1 : 0 });
          setGround(paper ? "paper" : "ink");
        };
        ScrollTrigger.create({
          trigger: enter,
          start: "top 50%",
          endTrigger: exit,
          end: "top 50%",
          refreshPriority: -10,
          onToggle: (st) => apply(st.isActive),
        });
      });

      return () => {
        mm.revert();
        setGround("ink");
      };
    },
    { dependencies: [mode] },
  );

  return (
    <div
      ref={layer}
      aria-hidden
      className="ground-paper"
      style={mode === "paper" ? { opacity: 1 } : undefined}
    />
  );
}

export function Grain() {
  return <div aria-hidden className="grain" />;
}
