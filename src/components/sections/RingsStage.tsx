/**
 * The rings stage: parts 2 (Hero), 3 (The problem) and 4 (The rings) share
 * ONE sticky canvas (docs/website/03-site-structure.md §3.1). The backdrop is
 * `position: sticky; top: 0; height: 100vh; margin-bottom: -100vh`, so the
 * parts scroll over it; when this wrapper ends (after part 4's pin) the
 * canvas scrolls away with it and stops rendering.
 *
 * Server Component: the parts are small client leaves, the text is SSR.
 */
import { StageBackdrop } from "@/components/three/StageBackdrop";
import { Hero } from "./stage/Hero";
import { Problem } from "./stage/Problem";
import { Rings } from "./stage/Rings";

export function RingsStage() {
  return (
    <div id="top" className="relative text-ice">
      <StageBackdrop />
      <Hero />
      <Problem />
      <Rings />
    </div>
  );
}
