"use client";

import { VERBS_SUPPORT } from "./verbs";

/**
 * Part 6, desktop: the horizontal pinned rail. A baseline (time) runs across
 * the track; the core (the person) travels it; at each verb a ring blooms up
 * from the tangent point where the core stands and stays behind. Every stop
 * carries the layers before it, nested and tangent at the same point, so the
 * row reads as layers accruing around one person (Protect ends as the mark).
 *
 * Sources:
 * - Taste skill §5.B "Horizontal-Pan" canonical skeleton
 *   (.claude/skills/design-taste-frontend/SKILL.md): pin the wrapper at
 *   "top top", move the inner track by -(track width - viewport width),
 *   end "+=" that distance, invalidateOnRefresh. Adapted to useGSAP +
 *   gsap.matchMedia and scrub: true (Lenis supplies the smoothing).
 * - Skiper UI skiper19 "SVG follow scroll" (reference;
 *   https://skiper-ui.com/v1/skiper19, free tier, attribution to Skiper UI).
 *   What we took: one SVG stroke whose drawn length is tied to scroll
 *   progress. What we changed: GSAP DrawSVG instead of Motion pathLength, a
 *   straight baseline instead of a scribble, and a core placed on the same
 *   path with MotionPathPlugin.
 *
 * Only mounted visibly at >= 768px with motion allowed; the stacked list
 * (VerbsList) covers mobile and reduced motion.
 */
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/components/motion/gsap";
import { EASE, MQ } from "@/lib/tokens";
import { RAIL, RAIL_TRACK_VW, VERBS, ringHalves, ringRadius } from "./verbs";

const DESKTOP_MOTION = `${MQ.desktop} and ${MQ.motionOk}`;

/** SSR geometry (1440 x 900); replaced by real measurements before paint. */
const SSR_W = 1440;
const SSR_H = 900;

function pointVw(i: number) {
  return RAIL.leadIn + RAIL.stop * i + RAIL.pointInset;
}

export function VerbsRail() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rail = root.current;
      if (!rail) return;
      const q = gsap.utils.selector(rail);
      const track = q<HTMLElement>("[data-track]")[0];
      const svg = q<SVGSVGElement>("[data-svg]")[0];
      const base = q<SVGPathElement>("[data-base]")[0];
      const drawn = q<SVGPathElement>("[data-drawn]")[0];
      const core = q<SVGCircleElement>("[data-core]")[0];
      const stops = q<HTMLElement>("[data-stop]");
      const texts = q<HTMLElement>("[data-stop-text]");
      const ringGroups = q<SVGGElement>("[data-ring]");

      const mm = gsap.matchMedia();
      mm.add(DESKTOP_MOTION, () => {
        /* ---- Geometry (px), rebuilt on every refresh ---- */
        const dist = () => Math.max(0, track.offsetWidth - window.innerWidth);
        // Each text block starts at its ring's left edge, so the ring (tangent at
        // the point) sits directly above the word: point = text left + radius.
        const pointsPx = () => stops.map((s, i) => s.offsetLeft + ringRadius(i));
        const lineY = () => Math.round(rail.clientHeight * RAIL.baselineY) + 0.5;

        const layout = () => {
          const W = track.offsetWidth;
          const H = rail.clientHeight;
          const y = lineY();
          svg.setAttribute("width", String(W));
          svg.setAttribute("height", String(H));
          svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
          const d = `M0 ${y} L${W} ${y}`;
          base.setAttribute("d", d);
          drawn.setAttribute("d", d);
          const pts = pointsPx();
          ringGroups.forEach((g, i) => {
            g.querySelectorAll<SVGPathElement>("path").forEach((p) => {
              const layer = Number(p.dataset.layer);
              const [left, right] = ringHalves(pts[i], y, ringRadius(layer));
              p.setAttribute("d", p.dataset.side === "left" ? left : right);
            });
          });
        };
        layout();

        /* ---- Where the core starts and stops, as fractions of the track ---- */
        // The core starts 4vw before Remember and comes to rest on Protect's
        // tangent point, inside every ring: the mark.
        const coreStart = (pointVw(0) - RAIL.pointInset) / RAIL_TRACK_VW;
        const coreEnd = pointVw(VERBS.length - 1) / RAIL_TRACK_VW;
        const LEAD = 0.04; // the drawn line runs 4% of the track ahead of the core

        /** Scroll progress p at which the core reaches stop i. */
        const arrival = (i: number) => (pointVw(i) / RAIL_TRACK_VW - coreStart) / (coreEnd - coreStart);
        /** Each ring blooms from just before the core arrives to just after. */
        const WINDOW = 0.042;
        const ringStart = (i: number) => gsap.utils.clamp(0, 1 - WINDOW, arrival(i) - 0.012);

        /* ---- The pan (the containerAnimation) ---- */
        const follow = gsap.timeline({ paused: true });
        follow.fromTo(
          drawn,
          { drawSVG: `0% ${(coreStart + LEAD) * 100}%` },
          { drawSVG: `0% ${Math.min(1, coreEnd + LEAD) * 100}%`, ease: EASE.scrub, duration: 1 },
          0,
        );
        follow.to(
          core,
          {
            motionPath: { path: drawn, start: coreStart, end: coreEnd },
            ease: EASE.scrub,
            duration: 1,
            immediateRender: true,
          },
          0,
        );

        let active = -1;
        const setActive = (p: number) => {
          let next = 0;
          for (let i = 0; i < VERBS.length; i++) if (p >= ringStart(i)) next = i;
          if (next === active) return;
          active = next;
          texts.forEach((t, i) =>
            gsap.to(t, {
              opacity: i === next ? 1 : 0.3,
              y: i === next ? 0 : 12,
              duration: 0.5,
              ease: EASE.gsapOut,
              overwrite: "auto",
            }),
          );
        };
        gsap.set(texts, { opacity: 0.3, y: 12 });

        const sync = (p: number) => {
          follow.progress(p);
          setActive(p);
        };

        const pan = gsap.to(track, {
          x: () => -dist(),
          ease: EASE.scrub,
          scrollTrigger: {
            trigger: rail,
            start: "top top",
            end: () => `+=${dist()}`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (st) => sync(st.progress),
            onRefresh: (st) => {
              follow.invalidate();
              sync(st.progress);
            },
          },
        });

        /* ---- Each stop's ring draws as the core arrives (containerAnimation) ---- */
        // The point's left edge is at (point - dist * p) on screen; convert the
        // ring's progress window into "left X%" positions for the trigger.
        const screenPct = (i: number, p: number) =>
          ((pointsPx()[i] - dist() * p) / window.innerWidth) * 100;

        ringGroups.forEach((g, i) => {
          const paths = g.querySelectorAll<SVGPathElement>("path");
          gsap.fromTo(
            paths,
            { drawSVG: "0% 0%" },
            {
              drawSVG: "0% 100%",
              ease: EASE.scrub,
              scrollTrigger: {
                trigger: stops[i],
                containerAnimation: pan,
                start: () => `left ${screenPct(i, ringStart(i))}%`,
                end: () => `left ${screenPct(i, ringStart(i) + WINDOW)}%`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        });

        // Geometry depends on the viewport: rebuild it before every refresh.
        ScrollTrigger.addEventListener("refreshInit", layout);
        return () => {
          ScrollTrigger.removeEventListener("refreshInit", layout);
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  // SSR markup: finished state at 1440 x 900 so nothing is missing before JS.
  const y = Math.round(SSR_H * RAIL.baselineY) + 0.5;
  const W = (SSR_W * RAIL_TRACK_VW) / 100;
  const ssrPoint = (i: number) => (SSR_W * pointVw(i)) / 100;

  return (
    <div ref={root} className="relative h-[100dvh] overflow-hidden">
      {/* The section's heading, held still while the verbs pan beneath it
          (the real h2 lives in SevenVerbs for the outline). */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[calc(var(--nav-h)+40px)] z-[1]">
        <div className="container-site">
          <p className="text-h2 text-ink-reverse">How anveli works</p>
          <p className="mt-4 max-w-[40ch] text-lead text-slate">{VERBS_SUPPORT}</p>
        </div>
      </div>
      <div data-track className="relative h-full will-change-transform" style={{ width: `${RAIL_TRACK_VW}vw` }}>
        <svg
          data-svg
          aria-hidden
          focusable="false"
          className="pointer-events-none absolute left-0 top-0 overflow-visible"
          width={W}
          height={SSR_H}
          viewBox={`0 0 ${W} ${SSR_H}`}
          fill="none"
        >
          <path data-base d={`M0 ${y} L${W} ${y}`} className="stroke-hairline-paper" strokeWidth={1} />
          <path data-drawn d={`M0 ${y} L${W} ${y}`} className="stroke-ink-reverse" strokeWidth={1} />
          {VERBS.map((v, i) => (
            <g data-ring={i} key={v.verb}>
              {Array.from({ length: i + 1 }, (_, layer) => {
                const newest = layer === i;
                const [left, right] = ringHalves(ssrPoint(i), y, ringRadius(layer));
                const common = {
                  "data-layer": layer,
                  className: "stroke-ink-reverse",
                  strokeWidth: newest ? 1.5 : 1,
                  strokeOpacity: newest ? 1 : 0.28,
                  strokeLinecap: "round" as const,
                };
                return (
                  <g key={layer}>
                    <path {...common} data-side="left" d={left} />
                    <path {...common} data-side="right" d={right} />
                  </g>
                );
              })}
            </g>
          ))}
          <circle data-core cx={0} cy={-RAIL.coreR} r={RAIL.coreR} className="fill-harbor" />
        </svg>

        {VERBS.map((v, i) => (
          <div
            key={v.verb}
            data-stop
            className="absolute"
            style={{ left: `calc(${pointVw(i)}vw - ${ringRadius(i)}px)`, top: `calc(${RAIL.baselineY * 100}% + 36px)` }}
          >
            <div data-stop-text>
              <h3 className="text-h2 text-ink-reverse">{v.verb}</h3>
              <p className="mt-4 max-w-[32ch] text-[18px] leading-[1.55] text-slate">{v.line}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
