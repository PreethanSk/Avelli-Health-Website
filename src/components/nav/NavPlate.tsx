/**
 * The nav plate: the current ground at 72% over a progressive blur that is
 * strongest at the top edge and fades out just below the bar.
 *
 * Sources:
 *  - Skiper UI "skiper41 / Progressive Blur" (https://skiper-ui.com/v1/skiper41,
 *    registry https://skiper-ui.com/r/skiper41.json; author gxuri; Skiper UI
 *    free tier, free for personal and commercial use with attribution):
 *    the ground-tinted gradient that fades toward the content, masked so the
 *    edge dissolves instead of ending on a line.
 *  - React Bits "Gradual Blur" (https://reactbits.dev/animations/gradual-blur,
 *    https://github.com/DavidHDev/react-bits, MIT + Commons Clause): the
 *    stacked backdrop-filter layers, each masked to an overlapping band, with
 *    blur = 0.0625rem x (progress x divCount + 1) x strength (divCount 5,
 *    strength 2, linear curve, position "top").
 * Restyled: our ground colours at 72%, opacity-only fades driven by
 * [data-scrolled] on the header (dur.ui), solid under reduced transparency
 * and reduced motion. No React state: this renders once.
 */
import type { CSSProperties } from "react";
import styles from "./nav.module.css";

const DIV_COUNT = 5;
const STRENGTH = 2;

const layers: CSSProperties[] = Array.from({ length: DIV_COUNT }, (_, idx) => {
  const i = idx + 1;
  const inc = 100 / DIV_COUNT;
  const progress = i / DIV_COUNT; // linear curve
  const blurRem = 0.0625 * (progress * DIV_COUNT + 1) * STRENGTH;
  const p1 = Math.round((inc * i - inc) * 10) / 10;
  const p2 = Math.round(inc * i * 10) / 10;
  const p3 = Math.round((inc * i + inc) * 10) / 10;
  const p4 = Math.round((inc * i + inc * 2) * 10) / 10;
  let band = `transparent ${p1}%, black ${p2}%`;
  if (p3 <= 100) band += `, black ${p3}%`;
  if (p4 <= 100) band += `, transparent ${p4}%`;
  const mask = `linear-gradient(to top, ${band})`;
  return {
    maskImage: mask,
    WebkitMaskImage: mask,
    backdropFilter: `blur(${blurRem.toFixed(3)}rem)`,
    WebkitBackdropFilter: `blur(${blurRem.toFixed(3)}rem)`,
  };
});

export function NavPlate() {
  return (
    <div aria-hidden className={styles.plate}>
      {layers.map((style, i) => (
        <div key={i} className={`${styles.plateLayer} ${styles.blur}`} style={style} />
      ))}
      <div className={`${styles.plateLayer} ${styles.tintInk}`} />
      <div className={`${styles.plateLayer} ${styles.tintPaper}`} />
    </div>
  );
}
