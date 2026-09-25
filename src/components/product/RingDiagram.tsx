"use client";

/**
 * Part 8, the continuity loop: one ring resting on the person. The core sits
 * at the ring's bottom tangent point; the loop (Recommendation, Reminder,
 * Follow-up, Result, Keep monitoring) runs clockwise from it and always comes
 * back to it. Under the ring, the usual story is struck through:
 * Recommendation, then Forgotten document.
 *
 * Source: our own SVG (docs/website/03-site-structure.md part 8), drawn with
 * GSAP DrawSVGPlugin and MotionPathPlugin (GSAP standard licence).
 *
 * Sequence (one GSAP timeline, start "top 70%", once):
 *  1. DrawSVG 0 -> 100% over dur.draw (ease.out) from the core, clockwise;
 *     each node and label appears as the line reaches it.
 *  2. The core runs one lap inside the ring (2400ms, ease.inOut) and comes to
 *     rest at the bottom; each node pulses 1 -> 1.4 -> 1 (dur.ui) as passed.
 *  3. The comparison fades in and a strike draws through it (600ms).
 * Reduced motion: ring drawn, labels shown, core at rest, strike in place.
 *
 * `variant="wide"` (>= 1024px): a 360px ring with the labels around it at
 * 1, 3, 5, 7 and 9 o'clock counted from the bottom. `variant="compact"`
 * (< 1024px): a 260px ring with the labels as a list under it.
 */
import { ArrowRightIcon } from "@phosphor-icons/react";
import { useRef } from "react";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { ExampleTag } from "@/components/ui/ExampleTag";
import { cn } from "@/lib/cn";
import { CONTINUITY_BROKEN, CONTINUITY_LOOP, SYMPTOM_EXAMPLE } from "@/lib/example-data";
import { DUR_S, EASE, MQ } from "@/lib/tokens";

const WIDE_MQ = "(min-width: 1024px)";
const COMPACT_MQ = "(max-width: 1023.98px)";

/** Label angles, clockwise from the bottom (the core): 1, 3, 5, 7, 9 o'clock. */
const ANGLES = [30, 90, 150, 210, 270];
const CORE_R = 8;
const NODE_R = 3;

type Geo = { W: number; H: number; cx: number; cy: number; R: number };
const GEO: Record<"wide" | "compact", Geo> = {
  wide: { W: 820, H: 424, cx: 330, cy: 212, R: 180 },
  compact: { W: 280, H: 284, cx: 140, cy: 142, R: 130 },
};

const polar = (g: Geo, deg: number, r = g.R) => {
  const t = (deg * Math.PI) / 180;
  return { x: g.cx - r * Math.sin(t), y: g.cy + r * Math.cos(t) };
};

/** A full circle starting at the bottom point, clockwise on screen. */
const circleFromBottom = (cx: number, cy: number, r: number) =>
  `M${cx} ${cy + r} A${r} ${r} 0 1 1 ${cx} ${cy - r} A${r} ${r} 0 1 1 ${cx} ${cy + r}`;

export function RingDiagram({ variant }: { variant: "wide" | "compact" }) {
  const root = useRef<HTMLDivElement>(null);
  const g = GEO[variant];
  const wide = variant === "wide";

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const ring = gsap.utils.toArray<SVGPathElement>("[data-ring]", el)[0];
      const guide = gsap.utils.toArray<SVGPathElement>("[data-guide]", el)[0];
      const core = gsap.utils.toArray<SVGCircleElement>("[data-core]", el)[0];
      const nodes = gsap.utils.toArray<SVGCircleElement>("[data-node]", el);
      const labels = gsap.utils.toArray<HTMLElement>("[data-label]", el);
      const compare = gsap.utils.toArray<HTMLElement>("[data-compare]", el)[0];
      const strikeSvg = gsap.utils.toArray<SVGSVGElement>("[data-strike-svg]", el)[0];
      const strike = gsap.utils.toArray<SVGPathElement>("[data-strike]", el)[0];

      // The strike spans the comparison text: size it to the text, always.
      const text = gsap.utils.toArray<HTMLElement>("[data-compare-text]", el)[0];
      const sizeStrike = () => {
        const w = Math.round(text.getBoundingClientRect().width);
        strikeSvg.setAttribute("width", String(w));
        strike.setAttribute("d", `M0 1 H${w}`);
      };
      sizeStrike();
      const ro = new ResizeObserver(sizeStrike);
      ro.observe(text);

      const mm = gsap.matchMedia();
      mm.add(`${wide ? WIDE_MQ : COMPACT_MQ} and ${MQ.motionOk}`, () => {
        const fracs = ANGLES.map((a) => a / 360);
        gsap.set(labels, { autoAlpha: 0, y: 6 });
        gsap.set(nodes, { scale: 0, transformOrigin: "50% 50%" });
        gsap.set([compare, strike], { autoAlpha: 0 });

        const shown = new Set<number>();
        const pulsed = new Set<number>();

        const tl = gsap.timeline({
          paused: true,
          scrollTrigger: { trigger: el, start: "top 70%", once: true },
        });

        tl.fromTo(
          ring,
          { drawSVG: "0% 0%" },
          {
            drawSVG: "0% 100%",
            duration: DUR_S.draw,
            ease: EASE.gsapOut,
            onUpdate(this: gsap.core.Tween) {
              const r = this.ratio;
              fracs.forEach((f, i) => {
                if (r >= f && !shown.has(i)) {
                  shown.add(i);
                  gsap.to(nodes[i], { scale: 1, duration: DUR_S.ui, ease: EASE.gsapOut });
                  if (labels[i]) gsap.to(labels[i], { autoAlpha: 1, y: 0, duration: DUR_S.ui * 2, ease: EASE.gsapOut });
                }
              });
            },
          },
        );

        tl.to(core, {
          motionPath: { path: guide },
          duration: 2.4,
          ease: EASE.gsapInOut,
          onUpdate(this: gsap.core.Tween) {
            const r = this.ratio;
            fracs.forEach((f, i) => {
              if (r >= f && !pulsed.has(i)) {
                pulsed.add(i);
                gsap.to(nodes[i], {
                  scale: 1.4,
                  duration: DUR_S.ui / 2,
                  yoyo: true,
                  repeat: 1,
                  ease: EASE.gsapInOut,
                });
              }
            });
          },
        });

        tl.to(compare, { autoAlpha: 1, duration: DUR_S.ui * 2, ease: EASE.gsapOut });
        tl.set(strike, { autoAlpha: 1 });
        tl.fromTo(
          strike,
          { drawSVG: "0% 0%" },
          { drawSVG: "0% 100%", duration: 0.6, ease: EASE.gsapOut, immediateRender: false },
        );
      });

      return () => {
        ro.disconnect();
        mm.revert();
      };
    },
    { scope: root },
  );

  const ringD = circleFromBottom(g.cx, g.cy, g.R);
  const guideD = circleFromBottom(g.cx, g.cy, g.R - CORE_R);
  const rest = { x: g.cx, y: g.cy + g.R - CORE_R };

  const symptomChip = (
    <p className="mt-3 max-w-[272px] rounded-card border border-hairline-paper bg-paper-2 px-3.5 py-3 font-mono text-[12px] leading-[1.5] text-ink-reverse">
      <ExampleTag ground="paper" className="mb-2 flex w-fit" />
      {SYMPTOM_EXAMPLE}
    </p>
  );

  return (
    <div ref={root} className={cn("relative", wide ? "w-[820px] pb-24" : "w-full max-w-[340px]")}>
      <div className="relative" style={{ width: g.W, height: g.H }}>
        <svg
          aria-hidden
          focusable="false"
          width={g.W}
          height={g.H}
          viewBox={`0 0 ${g.W} ${g.H}`}
          className="absolute inset-0 overflow-visible"
          fill="none"
        >
          <path data-guide d={guideD} stroke="none" />
          <path data-ring d={ringD} className="stroke-ink-reverse" strokeWidth={1.5} strokeLinecap="round" />
          {ANGLES.map((a) => {
            const p = polar(g, a);
            return <circle key={a} data-node cx={p.x} cy={p.y} r={NODE_R} className="fill-ink-reverse" />;
          })}
          <circle
            data-core
            cx={0}
            cy={0}
            r={CORE_R}
            transform={`translate(${rest.x} ${rest.y})`}
            className="fill-harbor"
          />
        </svg>

        {wide ? (
          <ol aria-label="The follow-up loop" className="absolute inset-0">
            {CONTINUITY_LOOP.map((label, i) => {
              const a = ANGLES[i];
              const p = polar(g, a, g.R + 22);
              const side = Math.sin((a * Math.PI) / 180);
              const last = i === CONTINUITY_LOOP.length - 1;
              return (
                <li
                  key={label}
                  data-label
                  className="absolute text-[15px] leading-[22px] whitespace-nowrap text-ink-reverse"
                  style={{
                    left: p.x,
                    top: last ? p.y - 11 : p.y,
                    transform: last
                      ? undefined
                      : `translate(${side > 0.01 ? "-100%" : side < -0.01 ? "0" : "-50%"}, -50%)`,
                  }}
                >
                  {label}
                  {last ? symptomChip : null}
                </li>
              );
            })}
          </ol>
        ) : null}
      </div>

      {!wide ? (
        <div className="mt-8">
          <ol aria-label="The follow-up loop" className="flex flex-wrap items-center gap-x-2 gap-y-2 text-[15px] text-ink-reverse">
            {CONTINUITY_LOOP.map((label, i) => (
              <li key={label} data-label className="inline-flex items-center gap-2">
                {label}
                {i < CONTINUITY_LOOP.length - 1 ? (
                  <ArrowRightIcon aria-hidden size={14} weight="regular" className="text-slate" />
                ) : null}
              </li>
            ))}
          </ol>
          {symptomChip}
        </div>
      ) : null}

      <div
        data-compare
        className={cn("mt-10", wide && "absolute mt-0 -translate-x-1/2")}
        style={wide ? { left: g.cx, top: g.H + 40 } : undefined}
      >
        <p className="text-[15px] text-slate">
          <span className="sr-only-soft">Not this: </span>
          <span data-compare-text className="relative inline-flex items-center gap-2 whitespace-nowrap">
            {CONTINUITY_BROKEN[0]}
            <ArrowRightIcon aria-hidden size={14} weight="regular" />
            {CONTINUITY_BROKEN[1]}
            <svg
              data-strike-svg
              aria-hidden
              focusable="false"
              width={0}
              height={2}
              className="pointer-events-none absolute top-1/2 left-0 -mt-px overflow-visible"
            >
              <path data-strike d="M0 1 H0" className="stroke-ink-reverse" strokeWidth={1.5} />
            </svg>
          </span>
        </p>
      </div>
    </div>
  );
}
