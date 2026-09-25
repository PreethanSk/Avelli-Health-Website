/**
 * The layout for /privacy and /terms: a clean paper page with a 65ch column
 * (cols 2 to 8), a calm placeholder note, and plain-language draft sections.
 * Server Component. The text is a draft and needs legal review before launch.
 */
import { Fragment } from "react";
import { InfoIcon } from "@phosphor-icons/react/ssr";
import { GroundLayer } from "@/components/ground/GroundLayer";
import { SiteFooter } from "@/components/footer/SiteFooter";

export type LegalSection = {
  id: string;
  title: string;
  /** Paragraphs and lists (<p>, <ul>), rendered in order. */
  body: React.ReactNode[];
};

export function LegalDoc({
  title,
  lead,
  sections,
}: {
  title: string;
  lead: React.ReactNode;
  sections: LegalSection[];
}) {
  return (
    <>
      <GroundLayer mode="paper" />
      <main id="main" className="on-paper relative z-[1] text-ink-reverse">
        <article className="container-site grid-site pt-[calc(var(--nav-h)+64px)] pb-28 md:pt-[calc(var(--nav-h)+96px)] md:pb-[clamp(160px,14vw,240px)]">
          <div className="col-span-12 md:col-span-9 lg:col-start-2 lg:col-span-7">
            <div
              role="note"
              className="flex max-w-prose items-start gap-3 rounded-card bg-paper-2 px-5 py-4 text-small text-slate"
            >
              <InfoIcon aria-hidden weight="light" size={20} className="mt-px shrink-0 text-harbor" />
              <p>
                <span className="font-medium text-ink-reverse">Placeholder:</span> needs legal review before
                launch. This is a plain-language draft, not the final text.
              </p>
            </div>

            <h1 className="mt-14 text-statement text-ink-reverse md:mt-20">{title}</h1>
            <div className="mt-8 max-w-prose text-lead text-slate">{lead}</div>

            <div className="mt-16 max-w-prose md:mt-24">
              {sections.map((s) => (
                <section
                  key={s.id}
                  id={s.id}
                  aria-labelledby={`${s.id}-title`}
                  className="border-t border-hairline-paper py-10 first:border-t-0 first:pt-0 md:py-12"
                >
                  <h2 id={`${s.id}-title`} className="text-h3 text-ink-reverse">
                    {s.title}
                  </h2>
                  <div className="mt-4 space-y-4 text-body text-slate">
                    {s.body.map((b, i) => (
                      <Fragment key={i}>{b}</Fragment>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </article>
      </main>
      <SiteFooter ground="paper" />
    </>
  );
}

/** The contact address is not decided yet; shown as a calm, explicit gap. */
export function ContactPending() {
  return <span className="font-medium text-ink-reverse">[contact email, to be confirmed before launch]</span>;
}
