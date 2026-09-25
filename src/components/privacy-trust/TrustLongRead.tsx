"use client";

/**
 * /privacy-trust long-read: six sections in a 65ch column (cols 2 to 7) and
 * one pinned illustration (cols 9 to 12) that gains a ring per section.
 * Spec: docs/website/03-site-structure.md §5.
 *
 * GSAP (desktop, motion allowed only):
 *  - pin the figure from "top 96px" until the last section's end (no pin
 *    spacing: it rides beside the text column);
 *  - ring i draws from the tangent point (DrawSVG "50% 50%" -> "0% 100%"),
 *    scrubbed across section i as it crosses a reading line at 75% of the
 *    viewport (lower if the figure is taller), ease "none".
 * Mobile: the figure is not rendered (a small static mark sits under the
 * title instead). Reduced motion: no pin, the illustration is complete.
 * Headings reveal by line once (LineReveal).
 */
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/components/motion/gsap";
import { LineReveal } from "@/components/motion/LineReveal";
import { EASE, MQ } from "@/lib/tokens";
import { TRUST_SECTIONS } from "./content";
import { TrustRings } from "./TrustRings";

const PIN_TOP = 96;

/*
 * Where the draw will run, the rings are hidden until GSAP has set them to
 * zero length, so the complete mark never flashes before hydration. The
 * failsafe (the shared reveal-failsafe keyframes) shows them after 2.5s if
 * scripts never run.
 */
const PREHYDRATION_CSS = `
@media (prefers-reduced-motion: no-preference) and (min-width: 768px) {
  html[data-js] [data-trust-rings]:not([data-ready]) .trust-ring {
    visibility: hidden;
    animation: reveal-failsafe 0s linear 2.5s forwards;
  }
}`;

export function TrustLongRead() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add(`${MQ.motionOk} and ${MQ.desktop}`, () => {
        const figure = el.querySelector<HTMLElement>("[data-trust-figure]");
        const svg = el.querySelector<SVGSVGElement>("[data-trust-rings]");
        const rings = gsap.utils.toArray<SVGPathElement>(".trust-ring", el);
        const sections = gsap.utils.toArray<HTMLElement>("[data-trust-section]", el);
        if (!figure || !svg || !sections.length) return;
        const last = sections[sections.length - 1];

        gsap.set(rings, { drawSVG: "50% 50%" });
        svg.setAttribute("data-ready", "");

        ScrollTrigger.create({
          trigger: figure,
          start: `top ${PIN_TOP}px`,
          endTrigger: last,
          end: () => `bottom ${PIN_TOP + figure.offsetHeight}px`,
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });

        // Each ring draws while its section crosses one reading line: 75% of
        // the viewport, or the figure's bottom edge if that is lower, so the
        // sixth ring always completes before the figure unpins.
        const line = () => Math.max(window.innerHeight * 0.75, PIN_TOP + figure.offsetHeight);

        rings.forEach((ring, i) => {
          const section = sections[i];
          if (!section) return;
          gsap.fromTo(
            ring,
            { drawSVG: "50% 50%" },
            {
              drawSVG: "0% 100%",
              ease: EASE.scrub,
              scrollTrigger: {
                trigger: section,
                start: () => `top ${line()}px`,
                end: () => `bottom ${line()}px`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        });

        return () => svg.removeAttribute("data-ready");
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="container-site grid-site">
      <style>{PREHYDRATION_CSS}</style>

      <div className="col-span-12 md:col-span-7 lg:col-start-2 lg:col-span-6">
        {TRUST_SECTIONS.map((s) => (
          <section
            key={s.id}
            id={s.id}
            data-trust-section
            aria-labelledby={`${s.id}-title`}
            className="py-20 first:pt-8 md:py-[clamp(112px,11vw,176px)] md:first:pt-12"
          >
            <LineReveal as="h2" id={`${s.id}-title`} className="text-h2 text-ink-reverse">
              {s.title}
            </LineReveal>
            <div className="mt-8 max-w-prose space-y-5 text-lead text-slate md:mt-10">
              {s.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-12 max-w-prose border-t border-hairline-paper pt-6 md:mt-14">
              <p className="text-small font-medium text-harbor-deep">What this means for you</p>
              <p className="mt-3 text-h3 text-ink-reverse">{s.takeaway}</p>
            </div>
          </section>
        ))}
      </div>

      {/* The one visual of the spread (desktop and tablet) */}
      <div className="hidden md:col-span-4 md:col-start-9 md:block">
        <figure data-trust-figure className="pt-8 md:pt-12">
          <TrustRings
            animated
            className="mx-auto h-auto max-h-[calc(100svh-240px)] w-full"
          />
          <figcaption className="mt-8 text-center text-small text-slate">
            Every protection is another layer around you.
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
