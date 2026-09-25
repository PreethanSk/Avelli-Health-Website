/**
 * Part 11. Protect (back to ink). docs/website/03-site-structure.md.
 * The page's emotional peak. The GroundLayer turns paper back into ink while
 * this section's top travels from 75% to 25% of the viewport, so everything
 * here is styled for ink from the start and the generous top padding keeps the
 * headline below the half-changed ground (it only enters once the change is
 * past its midpoint, and reveals at 80% when the ground is nearly ink).
 * Layout family: an interactive picker. Server component; the picker is a
 * client leaf (Motion).
 */
import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { LineReveal } from "@/components/motion/LineReveal";
import { PurposePicker } from "@/components/product/PurposePicker";

const PRINCIPLES = ["Never sold.", "Export anytime.", "AI sees only what the task needs."] as const;

export function Protect() {
  return (
    <section
      id="protect"
      aria-labelledby="protect-title"
      className="on-ink relative z-[1] pt-[50vh] pb-24 text-ice lg:pb-[clamp(160px,14vw,240px)]"
    >
      <div className="container-site">
        <LineReveal as="h2" id="protect-title" className="text-statement max-w-[15ch] text-ice">
          Having your information should never mean sharing it.
        </LineReveal>
        <p className="text-lead mt-8 max-w-[42ch] text-ice-60">
          You choose who sees what, and for how long. Nothing leaves until you approve it.
        </p>

        <div className="mt-16 md:mt-24">
          <PurposePicker />
        </div>

        <div className="mt-20 flex flex-col gap-8 border-t border-hairline-ink pt-10 md:mt-28 lg:flex-row lg:items-end lg:justify-between">
          <ul className="flex flex-col gap-y-2 md:flex-row md:flex-wrap md:gap-x-10">
            {PRINCIPLES.map((p) => (
              <li key={p} className="text-h3 text-ice">
                {p}
              </li>
            ))}
          </ul>
          <Link
            href="/privacy-trust"
            className="link-underline group relative inline-flex shrink-0 after:absolute after:-inset-y-2 after:inset-x-0 after:content-[''] items-center gap-2 self-start text-[17px] font-medium text-glacier lg:self-auto"
          >
            Read how we protect your data
            <ArrowRightIcon
              size={18}
              weight="regular"
              aria-hidden
              className="transition-transform duration-150 ease-[var(--ease-out)] group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
