"use client";

/**
 * Part 6, mobile and reduced motion: the verbs stacked on a vertical
 * baseline 24px from the left. On mobile the core follows the scroll down the
 * line (start "top 60%", end "bottom 60%") and each verb's 24px ring draws
 * once as the core reaches it. Under reduced motion it is a static list:
 * every ring finished, the line drawn, the core resting in the last ring.
 *
 * Every ring is threaded on the line and tangent at its bottom point, which
 * is where the core comes to rest: the mark, once per verb.
 */
import { useRef } from "react";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { DUR_S, EASE, MQ } from "@/lib/tokens";
import { VERBS, ringHalves } from "./verbs";

const MOBILE_MOTION = `${MQ.mobile} and ${MQ.motionOk}`;
const RING = 12; // 24px rings
const CORE = 7; // 14px core
const LINE_X = 24;

export function VerbsList() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const list = root.current;
      if (!list) return;
      const q = gsap.utils.selector(list);
      const core = q("[data-core]")[0] as HTMLElement;
      const drawn = q("[data-drawn]")[0] as HTMLElement;
      const rings = gsap.utils.toArray<SVGSVGElement>("[data-ring]", list);

      /** Core top (px, list coordinates) when resting in ring i. */
      const restY = (i: number) => {
        const top = list.getBoundingClientRect().top;
        const r = rings[i].getBoundingClientRect();
        return r.bottom - top - 2 * CORE;
      };

      const mm = gsap.matchMedia();

      mm.add(MOBILE_MOTION, () => {
        const setY = gsap.quickSetter(core, "y", "px");
        const setScale = gsap.quickSetter(drawn, "scaleY");
        // Cached on every refresh, so scrolling never reads layout.
        let first = 0;
        let last = 0;
        let H = 1;
        const measure = () => {
          first = restY(0);
          last = restY(rings.length - 1);
          H = list.offsetHeight || 1;
        };
        const update = (p: number) => {
          const y = gsap.utils.clamp(first, last, p * H - CORE);
          setY(y);
          setScale(Math.min(1, (y + 2 * CORE) / H + 0.04));
        };

        rings.forEach((svg) => {
          const halves = svg.querySelectorAll("path");
          const disc = svg.querySelector("circle");
          const tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: "bottom 60%", once: true } });
          tl.fromTo(halves, { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: DUR_S.reveal, ease: EASE.gsapOut }, 0);
          if (disc) tl.fromTo(disc, { autoAlpha: 0 }, { autoAlpha: 1, duration: DUR_S.ui, ease: EASE.gsapOut }, 0);
        });

        gsap.timeline({
          scrollTrigger: {
            trigger: list,
            start: "top 60%",
            end: "bottom 60%",
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (st) => update(st.progress),
            onRefresh: (st) => {
              measure();
              update(st.progress);
            },
          },
        });
      });

      mm.add(MQ.reduce, () => {
        // Static: the core rests in the last ring.
        const place = () => gsap.set(core, { y: restY(rings.length - 1) });
        place();
        window.addEventListener("resize", place);
        return () => window.removeEventListener("resize", place);
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative">
      <span aria-hidden className="absolute top-0 bottom-0 w-px bg-hairline-paper" style={{ left: LINE_X }} />
      <span
        data-drawn
        aria-hidden
        className="absolute top-0 bottom-0 w-px origin-top bg-ink-reverse"
        style={{ left: LINE_X }}
      />
      <ol className="relative flex flex-col gap-12 pr-4" style={{ paddingLeft: LINE_X + 36 }}>
        {VERBS.map((v, i) => {
          const [left, right] = ringHalves(RING, 2 * RING - 0.75, RING - 0.75);
          return (
            <li key={v.verb}>
              <h3 className="relative text-h2 text-ink-reverse">
                <svg
                  data-ring={i}
                  aria-hidden
                  focusable="false"
                  width={2 * RING}
                  height={2 * RING}
                  viewBox={`0 0 ${2 * RING} ${2 * RING}`}
                  className="absolute top-[calc(0.525em-12px)] overflow-visible"
                  style={{ left: -(36 + RING) }}
                >
                  {/* paper disc so the line reads as threading behind the ring */}
                  <circle cx={RING} cy={RING} r={RING - 0.75} className="fill-paper" />
                  <path d={left} className="stroke-ink-reverse" strokeWidth={1.5} fill="none" strokeLinecap="round" />
                  <path d={right} className="stroke-ink-reverse" strokeWidth={1.5} fill="none" strokeLinecap="round" />
                </svg>
                {v.verb}
              </h3>
              <p className="mt-3 max-w-[32ch] text-[18px] leading-[1.55] text-slate">{v.line}</p>
            </li>
          );
        })}
      </ol>
      <span
        data-core
        aria-hidden
        className="absolute top-0 rounded-full bg-harbor"
        style={{ left: LINE_X - CORE, width: 2 * CORE, height: 2 * CORE }}
      />
    </div>
  );
}
