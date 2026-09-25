/**
 * Part 9. In your hand (the app). docs/website/03-site-structure.md.
 * Paper chapter: the section is transparent (the GroundLayer paints paper) and
 * styled for paper; the phone itself is a piece of the brand's dark ground.
 * Layout family: a phone carousel with one changing line beside it.
 * Motion: CardSwipe (Motion drag + snap), the line swap (AnimatePresence) and
 * the small living mark on screen 1. Server component; client leaves inside.
 */
import { LineReveal } from "@/components/motion/LineReveal";
import { PhoneShowcase } from "@/components/sections/product-parts/PhoneShowcase";
import { ScreenImportantNow } from "@/components/product/phone/ScreenImportantNow";
import { ScreenVisitPrep } from "@/components/product/phone/ScreenVisitPrep";
import { ScreenDoctorSummary } from "@/components/product/phone/ScreenDoctorSummary";
import { PHONE_LINES } from "@/lib/example-data";

const TITLES = ["What's important now", "Visit prep", "Doctor summary"] as const;

export function InYourHand() {
  return (
    <section
      id="in-your-hand"
      aria-labelledby="in-your-hand-title"
      className="section-y relative z-[1] text-ink-reverse"
    >
      <div className="container-site">
        <PhoneShowcase
          heading={
            <LineReveal as="h2" id="in-your-hand-title" className="text-h2 max-w-[12ch] text-ink-reverse">
              Ready before you walk in.
            </LineReveal>
          }
          slides={[<ScreenImportantNow key="now" />, <ScreenVisitPrep key="prep" />, <ScreenDoctorSummary key="summary" />]}
          titles={TITLES}
          lines={PHONE_LINES}
        />
      </div>
    </section>
  );
}
