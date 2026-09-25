/**
 * Part 10. Insurance companion. docs/website/03-site-structure.md.
 * Paper chapter (transparent section, paper styling). Layout family: a split
 * with a sticky stack. Left: the question as a large quote (the section's
 * heading) and one support line. Right (columns 7 to 12): three policy layers
 * that fan apart while the part is pinned (PolicyStackPin, GSAP), with the
 * disclaimer under them, always visible and never animated.
 */
import { LineReveal } from "@/components/motion/LineReveal";
import { ExampleTag } from "@/components/ui/ExampleTag";
import { PolicyRing } from "@/components/sections/product-parts/PolicyRing";
import { PolicyStackPin } from "@/components/sections/product-parts/PolicyStackPin";
import { INSURANCE_LAYERS } from "@/lib/example-data";

/** "Use first: preserves your no-claim bonus." -> "Preserves your no-claim bonus." */
function why(line: string) {
  const rest = line.includes(": ") ? line.slice(line.indexOf(": ") + 2) : line;
  return rest.charAt(0).toUpperCase() + rest.slice(1);
}

export function Insurance() {
  return (
    <section id="insurance" aria-labelledby="insurance-title" className="relative z-[1] text-ink-reverse">
      <PolicyStackPin className="on-paper flex min-h-[100dvh] items-center py-24 md:pt-[calc(var(--nav-h)+40px)] md:pb-16">
        <div className="container-site">
          <div className="grid-site items-center gap-y-14">
            <div className="col-span-12 md:col-span-6 lg:col-span-5">
              <LineReveal as="h2" id="insurance-title" className="text-h2 max-w-[15ch] text-ink-reverse">
                &ldquo;I&rsquo;m being admitted tomorrow. What am I covered for?&rdquo;
              </LineReveal>
              <p className="text-lead mt-7 max-w-[40ch] text-slate">
                anveli reads the policies you already have and shows what is likely to apply, what to check, and
                which documents you&rsquo;ll need.
              </p>
            </div>

            <div className="col-span-12 md:col-span-6 md:col-start-7">
              <ol
                data-policy-stack
                aria-label="Your policies, in the order to use them"
                className="relative [--card-h:188px] md:[--card-h:176px] lg:[--card-h:156px] xl:[--card-h:140px]"
                style={{ height: "calc(var(--card-h) * 3 + 48px)" }}
              >
                {INSURANCE_LAYERS.map((layer, i) => (
                  <li
                    key={layer.name}
                    data-policy-card
                    className="absolute inset-x-0 flex items-center gap-4 rounded-card border border-hairline-paper/70 bg-paper-2 px-4 shadow-[0_1px_2px_rgba(14,26,34,0.06),0_18px_40px_-20px_rgba(14,26,34,0.28)] will-change-transform sm:gap-5 sm:px-6"
                    style={{
                      top: `calc((var(--card-h) + 24px) * ${i})`,
                      height: "var(--card-h)",
                      zIndex: INSURANCE_LAYERS.length - i,
                    }}
                  >
                    <PolicyRing layer={layer.ring} size={56} className="shrink-0" />
                    <div className="min-w-0">
                      <p className="label-mono text-ink-reverse">{layer.order}</p>
                      <p className="mt-2 text-[19px] leading-tight font-medium tracking-[-0.015em] text-ink-reverse sm:text-[20px]">
                        {layer.name}
                      </p>
                      <p className="mt-1 text-small text-slate">{layer.cover}</p>
                      <p className="text-small text-ink-reverse">{why(layer.line)}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-6 flex items-center justify-between gap-4">
                <p className="font-mono text-[12px] leading-snug text-slate">Guidance, never a claim guarantee.</p>
                <ExampleTag ground="paper" />
              </div>
            </div>
          </div>
        </div>
      </PolicyStackPin>
    </section>
  );
}
