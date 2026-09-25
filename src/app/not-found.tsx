import { ArrowLeftIcon } from "@phosphor-icons/react/ssr";
import { GroundLayer } from "@/components/ground/GroundLayer";
import { SiteFooter } from "@/components/footer/SiteFooter";
import { LooseRingMark } from "@/components/not-found/LooseRingMark";
import { PillButton } from "@/components/ui/PillButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

/**
 * 404 (docs/website/03-site-structure.md §6): ink, one depth glow, and the
 * mark with one ring that has come loose. Exported statically as out/404.html.
 */
export default function NotFound() {
  return (
    <>
      <GroundLayer mode="ink" />
      <main id="main" className="on-ink relative z-[1] flex min-h-[100svh] items-center overflow-hidden">
        <div className="container-site grid-site relative items-center gap-y-14 pt-[calc(var(--nav-h)+48px)] pb-24 md:pt-[var(--nav-h)] md:pb-16">
          <div className="relative col-span-12 mx-auto w-[min(72vw,300px)] md:order-2 md:col-span-5 md:col-start-8 md:w-full md:max-w-[400px]">
            {/* The one depth glow, rising from beneath the mark */}
            <div
              aria-hidden
              className="depth-glow-soft pointer-events-none absolute top-1/2 left-1/2 -z-10 aspect-square w-[220%] -translate-x-1/2 -translate-y-[42%]"
            />
            <LooseRingMark />
          </div>

          <div className="col-span-12 md:order-1 md:col-span-6 lg:col-start-2 lg:col-span-5">
            <h1 className="text-statement text-ice">This page isn&apos;t part of the story.</h1>
            <p className="mt-6 max-w-[34ch] text-lead text-ice-60">
              The link may be old, or the page may have moved. Everything else is where you left it.
            </p>
            <PillButton href="/" ground="ink" quiet className="mt-10">
              <ArrowLeftIcon aria-hidden weight="regular" size={18} />
              Back to the start
            </PillButton>
          </div>
        </div>
      </main>
      <SiteFooter ground="ink" />
    </>
  );
}
