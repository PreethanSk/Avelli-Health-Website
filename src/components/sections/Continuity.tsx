/**
 * Part 8. Nothing forgotten: the continuity loop.
 * docs/website/03-site-structure.md, part 8 Build spec.
 *
 * One large ring resting on the person, centred-left in a wide field, with
 * the struck-through usual story underneath. >= 1024px: a 360px ring with
 * the labels around it. Below 1024px: a 260px ring with the labels as a list
 * under it (the wide diagram needs about 820px).
 */
import { LineReveal } from "@/components/motion/LineReveal";
import { RingDiagram } from "@/components/product/RingDiagram";

export function Continuity() {
  return (
    <section id="continuity" className="on-paper section-y relative z-[1] text-ink-reverse">
      <div className="container-site">
        <LineReveal as="h2" className="max-w-[14ch] text-h2 text-ink-reverse">
          What the doctor said, remembered.
        </LineReveal>

        <div className="mt-16 hidden lg:mt-20 lg:block lg:pl-[6%] xl:pl-[12%]">
          <RingDiagram variant="wide" />
        </div>
        <div className="mt-12 lg:hidden">
          <RingDiagram variant="compact" />
        </div>
      </div>
    </section>
  );
}
