"use client";

/**
 * TextRoll: a nav label whose letters roll up and are replaced by a second
 * copy rolling in from below, one after another.
 *
 * Source: Skiper UI "skiper58 / Text roll navigation" (TextRoll)
 * https://skiper-ui.com/v1/skiper58, registry https://skiper-ui.com/r/skiper58.json
 * Author gxuri (Gurvinder Singh). Licence: Skiper UI free tier, free for
 * personal and commercial use with attribution to Skiper UI.
 * Adapted: framer-motion -> motion/react; the easeInOut default -> our
 * dur.ui + ease.out; per-letter stagger tightened for a 15px label; a
 * line-height that keeps descenders; the visible letters are aria-hidden and
 * the label is read once from a visually hidden copy. The variant names are
 * driven by the parent link (hover and keyboard focus). Reduced motion: plain
 * text.
 */
import { motion, type Variants } from "motion/react";
import { DUR_S, EASE } from "@/lib/tokens";

const LETTER_STAGGER = 0.016;

const top: Variants = {
  rest: { y: "0%" },
  roll: { y: "-100%" },
};
const bottom: Variants = {
  rest: { y: "100%" },
  roll: { y: "0%" },
};

export function TextRoll({ children, reduce }: { children: string; reduce: boolean }) {
  if (reduce) return <span>{children}</span>;
  const letters = Array.from(children);

  const row = (variants: Variants, className?: string) => (
    <span aria-hidden className={className} style={{ display: "block", whiteSpace: "pre" }}>
      {letters.map((l, i) => (
        <motion.span
          key={i}
          variants={variants}
          transition={{ duration: DUR_S.ui, ease: EASE.out, delay: i * LETTER_STAGGER }}
          style={{ display: "inline-block" }}
        >
          {l === " " ? " " : l}
        </motion.span>
      ))}
    </span>
  );

  return (
    <span style={{ position: "relative", display: "block", overflow: "hidden", lineHeight: 1.25 }}>
      <span className="sr-only">{children}</span>
      {row(top)}
      <span style={{ position: "absolute", inset: 0 }}>{row(bottom)}</span>
    </span>
  );
}
