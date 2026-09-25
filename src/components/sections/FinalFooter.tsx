/**
 * Part 13. Final CTA and footer (docs/website/03-site-structure.md, part 13).
 *
 * On ink, uncovered from underneath as part 12 scrolls away (Fancy Components
 * "Sticky Footer", clip-path form; see final-footer/finale.module.css). 100vh
 * on desktop, its content's height on mobile.
 *
 * Top to bottom: "Your health, understood." (h2), the support line, the
 * waitlist field, the links row with the disclaimer and copyright, then the
 * finale: the stacked lockup (symbol 1.7em above the wordmark) centred low in
 * the one depth glow, its wordmark fitted to about 60% of the container width
 * (capped by the height left in the 100vh footer). The symbol is a LivingMark
 * that plays accrue, added, then two breathes once (FinaleMark).
 * No h1 here: the only h1 is the hero's.
 */
import { Lockup } from "@/components/brand/Lockup";
import { FooterLinks, FooterNote } from "@/components/footer/FooterLegal";
import { FOOTER_COPY } from "@/components/footer/footer-data";
import { WaitlistField } from "@/components/waitlist/WaitlistField";
import { FinaleMark } from "./final-footer/FinaleMark";
import styles from "./final-footer/finale.module.css";

export function FinalFooter() {
  return (
    <footer id="join" aria-labelledby="join-title" className={`on-ink relative z-[1] text-ice ${styles.shell}`}>
      <div className={styles.track}>
        <div className={`depth-glow ${styles.stage}`}>
          <div className="container-site flex min-h-0 flex-1 flex-col pt-24 pb-10 md:pt-[calc(var(--nav-h)+48px)] md:pb-12">
            <div className="grid-site gap-y-12">
              <div className="col-span-12 md:col-span-7">
                <h2 id="join-title" className="text-h2 text-ice">
                  {FOOTER_COPY.headline}
                </h2>
                <p className="mt-4 text-lead text-ice-60">{FOOTER_COPY.support}</p>
                <WaitlistField id="footer" source="footer" ground="ink" initiallyOpen className="mt-8" />
              </div>
              <div className="col-span-12 flex flex-col gap-5 md:col-span-5 md:pt-2 lg:col-span-4 lg:col-start-9">
                <FooterLinks ground="ink" className="-my-2" />
                <FooterNote ground="ink" />
              </div>
            </div>

            <div className={styles.finaleBox}>
              <Lockup
                variant="stacked"
                ground="ink"
                optical={false}
                className={styles.finale}
                symbol={<FinaleMark />}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
