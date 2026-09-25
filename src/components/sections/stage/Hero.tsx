/**
 * Part 2. Hero: object-first on ink. The 3D rings (fragments state) live in
 * the shared sticky canvas behind this section (RingsStage); this section
 * only carries the text, bottom-left, and the static renders for phones and
 * reduced motion.
 *
 * Layout: 12-col grid, text in cols 1 to 6 anchored 64px above the bottom of
 * the viewport. The top-left ~200px stays clear for the nav's large lockup,
 * which starts there and flies into the nav on scroll. No eyebrow.
 */
import { StageRender, stageBoxStyle } from "@/components/three/StageRender";
import { HeroCopy } from "./HeroCopy";

export function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="on-ink relative z-[1] md:h-[100vh] md:min-h-[600px]">
      {/* Phones: the fragments render at 4:5, full width, above the text */}
      <div aria-hidden="true" className="relative overflow-x-clip pt-[var(--nav-h)] md:hidden">
        <div className="depth-glow-soft pointer-events-none absolute top-[58%] left-1/2 aspect-square w-[170%] -translate-x-1/2 -translate-y-1/2" />
        <StageRender state={0} framing="portrait" idPrefix="hero-m" className="relative aspect-[4/5] w-full" />
      </div>

      {/* Desktop with reduced motion: the same render, still, where the object sits */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden overflow-hidden md:motion-reduce:block">
        <div className="depth-glow absolute inset-0" />
        <StageRender state={0} idPrefix="hero-r" style={stageBoxStyle("68%")} />
      </div>

      <div className="container-site relative pb-24 md:h-full md:pb-16">
        <div className="grid-site md:h-full md:items-end">
          <div className="col-span-12 md:col-span-7 lg:col-span-6">
            <HeroCopy />
          </div>
        </div>
      </div>
    </section>
  );
}
