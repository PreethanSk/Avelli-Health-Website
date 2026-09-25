/**
 * Part 5. Everyday life: the photo moment where the page turns to paper.
 * docs/website/03-site-structure.md, part 5 Build spec.
 *
 * The ground change (ink -> paper) is triggered by this section's id and run
 * by GroundLayer; this section stays transparent and is styled for paper.
 */
import { preconnect } from "react-dom";
import { EverydayPhoto } from "@/components/sections/paper/EverydayPhoto";
import { IMAGES } from "@/lib/images";

/**
 * Desktop: the headline sits on the photo's light, empty sky (columns 1 to 6,
 * 80px from the top); the support and the caption row stay under the image.
 * Set to false to fall back to the headline under the image (the spec's
 * documented fallback, e.g. for a photo whose sky fails 3:1 behind the type).
 * Mobile always places the headline under the image.
 */
export const HEADLINE_ON_IMAGE = true;

const HEADLINE = "Your health doesn't only happen at the clinic.";
const SUPPORT =
  "Sleep, activity, symptoms and how you feel sit right next to your reports, so your history finally has the days in between.";

export function EverydayLife({ headlineOnImage = HEADLINE_ON_IMAGE }: { headlineOnImage?: boolean }) {
  // React hoists this into <head> as <link rel="preconnect">.
  preconnect("https://images.unsplash.com");
  return (
    <section
      id="everyday"
      className="on-paper relative z-[1] pt-24 pb-24 text-ink-reverse lg:pt-32 lg:pb-[clamp(160px,14vw,240px)]"
    >
      <EverydayPhoto
        photo={IMAGES.everyday}
        headlineOnImage={headlineOnImage}
        headline={HEADLINE}
        support={SUPPORT}
        caption={
          <>
            Apple Health and Android Health Connect <span className="text-ink-reverse">(planned)</span>
          </>
        }
      />
    </section>
  );
}
