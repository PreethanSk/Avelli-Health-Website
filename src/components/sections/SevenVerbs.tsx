/**
 * Part 6. The seven verbs: how it works (the nav's "How it works" anchor).
 * docs/website/03-site-structure.md, part 6 Build spec.
 *
 * Desktop with motion: a horizontal pinned rail (VerbsRail). Mobile, and
 * reduced motion at any width: the same verbs stacked on a vertical baseline
 * (VerbsList). Only one of the two is displayed; the hidden one is
 * display:none, so assistive tech reads the verbs once.
 */
import { VerbsList } from "@/components/sections/paper/VerbsList";
import { VerbsRail } from "@/components/sections/paper/VerbsRail";
import { VERBS_SUPPORT } from "@/components/sections/paper/verbs";

export function SevenVerbs() {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-title" className="on-paper relative z-[1] text-ink-reverse">
      {/* The verbs carry the section visually; the heading keeps the outline whole. */}
      <h2 id="how-it-works-title" className="sr-only-soft">
        How anveli works
      </h2>

      <div className="hidden md:motion-safe:block">
        <VerbsRail />
      </div>

      <div className="section-y md:motion-safe:hidden">
        {/* Full-bleed on phones so the baseline sits 24px from the screen edge */}
        <div className="container-site mb-14" aria-hidden>
          <p className="text-h2 text-ink-reverse">How anveli works</p>
          <p className="mt-4 max-w-[40ch] text-lead text-slate">{VERBS_SUPPORT}</p>
        </div>
        <div className="md:container-site">
          <VerbsList />
        </div>
      </div>
    </section>
  );
}
