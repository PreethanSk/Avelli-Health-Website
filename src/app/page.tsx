import { GroundLayer } from "@/components/ground/GroundLayer";
import { RingsStage } from "@/components/sections/RingsStage";
import { EverydayLife } from "@/components/sections/EverydayLife";
import { SevenVerbs } from "@/components/sections/SevenVerbs";
import { Bento } from "@/components/sections/Bento";
import { Continuity } from "@/components/sections/Continuity";
import { InYourHand } from "@/components/sections/InYourHand";
import { Insurance } from "@/components/sections/Insurance";
import { Protect } from "@/components/sections/Protect";
import { WhatWereNot } from "@/components/sections/WhatWereNot";
import { FinalFooter } from "@/components/sections/FinalFooter";

/**
 * The homepage: one scroll story in 13 parts (docs/website/03-site-structure.md).
 * Ink ground with one paper chapter (parts 5 to 10). The nav (part 1) lives in
 * the root layout. Sections are Server Components; motion lives in client leaves.
 */
export default function Home() {
  return (
    <>
      <main id="main" className="relative z-[1]">
        {/* Parts 2 to 4 share one sticky 3D canvas */}
        <RingsStage />
        {/* The paper chapter: parts 5 to 10 */}
        <EverydayLife />
        <SevenVerbs />
        <Bento />
        <Continuity />
        <InYourHand />
        <Insurance />
        {/* Back to ink */}
        <Protect />
        <WhatWereNot />
      </main>
      <FinalFooter />
      {/* Created last so its triggers measure after every pin above */}
      <GroundLayer mode="story" />
    </>
  );
}
