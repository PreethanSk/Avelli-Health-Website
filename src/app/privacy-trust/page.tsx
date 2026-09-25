import type { Metadata } from "next";
import Link from "next/link";
import { GroundLayer } from "@/components/ground/GroundLayer";
import { SiteFooter } from "@/components/footer/SiteFooter";
import { LineReveal } from "@/components/motion/LineReveal";
import { WaitlistField } from "@/components/waitlist/WaitlistField";
import { TrustLongRead } from "@/components/privacy-trust/TrustLongRead";
import { TrustRings } from "@/components/privacy-trust/TrustRings";
import { TRUST_INTRO, TRUST_TITLE } from "@/components/privacy-trust/content";

const DESCRIPTION =
  "How anveli treats your health information: every fact has a source, you decide who sees what, private by default, and yours to take.";

const SHARE_IMAGE = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: "The anveli mark, three rings and a pale blue core all touching one point, beside the anveli wordmark and the line: Your health, understood.",
};

export const metadata: Metadata = {
  title: "Privacy and trust",
  description: DESCRIPTION,
  alternates: { canonical: "/privacy-trust" },
  // openGraph and twitter replace the layout's objects (shallow merge) and
  // drop the inherited file-based image, so they are restated in full.
  openGraph: {
    type: "article",
    siteName: "anveli",
    locale: "en_IN",
    title: "Privacy and trust · anveli",
    description: DESCRIPTION,
    url: "/privacy-trust",
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy and trust · anveli",
    description: DESCRIPTION,
    images: [SHARE_IMAGE],
  },
};

/**
 * /privacy-trust: an editorial long-read on paper (docs/website/03-site-structure.md §5).
 * A selling point, not legal text: big headings, generous margins, one visual.
 */
export default function PrivacyTrustPage() {
  return (
    <>
      <GroundLayer mode="paper" />
      <main id="main" className="on-paper relative z-[1] text-ink-reverse">
        <header className="container-site grid-site pt-[calc(var(--nav-h)+64px)] md:pt-[calc(var(--nav-h)+96px)]">
          <div className="col-span-12 lg:col-start-2 lg:col-span-9">
            <LineReveal as="h1" trigger="load" className="text-display text-ink-reverse">
              {TRUST_TITLE}
            </LineReveal>
          </div>
          <p className="col-span-12 mt-8 max-w-prose text-lead text-slate md:col-span-8 md:mt-10 lg:col-start-2 lg:col-span-6">
            {TRUST_INTRO}
          </p>
          {/* Mobile: the complete six-ring mark, small and still */}
          <div className="col-span-12 mt-12 md:hidden">
            <TrustRings className="h-auto w-[112px]" />
          </div>
        </header>

        <TrustLongRead />

        <section
          aria-labelledby="trust-join-title"
          className="container-site grid-site pt-8 pb-28 md:pt-16 md:pb-[clamp(160px,14vw,240px)]"
        >
          <div className="col-span-12 md:col-span-8 lg:col-start-2 lg:col-span-6">
            <LineReveal as="h2" id="trust-join-title" className="text-h2 text-ink-reverse">
              Six layers, all around you.
            </LineReveal>
            <p className="mt-6 text-lead text-slate">Be first to try anveli when it opens.</p>
            <div className="mt-10">
              <WaitlistField id="privacy" source="privacy-trust" ground="paper" />
            </div>
            <p className="mt-16 text-small text-slate">
              Looking for the legal text? Read the{" "}
              <Link href="/privacy" className="link-inline text-harbor-deep">
                privacy policy
              </Link>{" "}
              and the{" "}
              <Link href="/terms" className="link-inline text-harbor-deep">
                terms of use
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
      <SiteFooter ground="paper" />
    </>
  );
}
