/**
 * Part 7. Understand: the intelligence bento.
 * docs/website/03-site-structure.md, part 7 Build spec.
 *
 * Exactly five cells in an asymmetric 2 + 3 arrangement (row 1: 7 + 5
 * columns at 440px; row 2: 4 + 3 + 5 at 320px). Every preview is a real,
 * coded React component reading lib/example-data.ts, and every sample value
 * carries an "Example" label. Mobile: one column in the order 1 to 5.
 * Tablet (768 to 1023px): cell 1 full width, then 6 + 6 and 5 + 7, because a
 * three-column cell is too narrow there to hold its preview.
 */
import { LineReveal } from "@/components/motion/LineReveal";
import { AskHistory } from "@/components/product/AskHistory";
import { BaselineChart } from "@/components/product/BaselineChart";
import { HighlightProvider } from "@/components/product/highlight-context";
import { MiniTimeline } from "@/components/product/MiniTimeline";
import { OrganisedPath } from "@/components/product/OrganisedPath";
import { SourceChips } from "@/components/product/SourceChips";
import { monthYear } from "@/components/product/chart-utils";
import { BentoCell } from "@/components/sections/paper/BentoCell";
import { BASELINE_MARKER, SOURCED_OBSERVATION } from "@/lib/example-data";

export function Bento() {
  const latest = BASELINE_MARKER.points[BASELINE_MARKER.points.length - 1];
  return (
    <section id="understand" className="on-paper section-y relative z-[1] text-ink-reverse">
      <div className="container-site">
        <LineReveal as="h2" className="max-w-[16ch] text-h2 text-ink-reverse">
          Not a folder. A history that makes sense.
        </LineReveal>

        <HighlightProvider>
          <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6 lg:mt-20 lg:grid-rows-[minmax(440px,auto)_minmax(320px,auto)]">
            <BentoCell index={0} title="Your baseline" example className="md:col-span-12 lg:col-span-7">
              <p className="font-mono text-[12px] text-slate">
                {BASELINE_MARKER.name}, {BASELINE_MARKER.unit}
              </p>
              <BaselineChart className="mt-2 min-h-[240px] flex-1" />
              <p className="mt-4 text-[16px] leading-snug text-ink-reverse">
                {BASELINE_MARKER.caption}{" "}
                <span className="font-mono text-[12px] whitespace-nowrap text-slate">
                  {latest.value} {BASELINE_MARKER.unit}, {monthYear(latest.date)}
                </span>
              </p>
            </BentoCell>

            <BentoCell index={1} title="Sourced, always" example className="md:col-span-6 lg:col-span-5">
              <p className="max-w-[22ch] text-[24px] leading-[1.25] font-medium tracking-[-0.015em] text-ink-reverse">
                {SOURCED_OBSERVATION.sentence}
              </p>
              <SourceChips />
            </BentoCell>

            <BentoCell index={2} title="Ask your history" example className="md:col-span-6 lg:col-span-4">
              <AskHistory />
            </BentoCell>

            <BentoCell index={3} title="Organised for you" example className="md:col-span-5 lg:col-span-3">
              <OrganisedPath />
            </BentoCell>

            <BentoCell index={4} title="One timeline" tinted className="md:col-span-7 lg:col-span-5">
              <p className="max-w-[34ch] text-[16px] leading-snug text-slate">
                From the first symptom to the follow-up, every step on one line.
              </p>
              <div className="mt-auto pt-8">
                <MiniTimeline />
              </div>
            </BentoCell>
          </div>
        </HighlightProvider>
      </div>
    </section>
  );
}
