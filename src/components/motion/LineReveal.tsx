"use client";

/**
 * A headline that reveals line by line behind a mask (GSAP SplitText).
 * Reference: Fancy "Vertical Cut Reveal" and skiper66 "SVG clip path mask";
 * rebuilt on GSAP per the library split (GSAP owns reveals tied to scroll/load).
 *
 * The text is real server-rendered HTML. Before hydration it is hidden only
 * when JS is on and motion is allowed (see globals.css [data-reveal]); a CSS
 * failsafe shows it after 2.5s regardless. Reduced motion: shown as-is.
 */
import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "./gsap";
import { DUR_S, EASE, MQ, STAGGER } from "@/lib/tokens";

type RevealTag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";

type Props = {
  as?: RevealTag;
  children: React.ReactNode;
  className?: string;
  id?: string;
  /** "load": after fonts are ready (hero). "inView": once at top 80%. */
  trigger?: "load" | "inView";
  delay?: number;
  /** Called when the last line has started (hero uses it to cue the sub). */
  onLastLineStart?: () => void;
  /** Called when the reveal completes. */
  onComplete?: () => void;
};

export function LineReveal({
  as: Tag = "h2",
  children,
  className,
  id,
  trigger = "inView",
  delay = 0,
  onLastLineStart,
  onComplete,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motionOk, () => {
        let split: SplitText | null = null;
        let cancelled = false;
        const run = () => {
          if (cancelled) return;
          split = SplitText.create(el, {
            type: "lines",
            mask: "lines",
            linesClass: "split-line",
            autoSplit: true,
            onSplit(self) {
              self.masks.forEach((m) => (m as HTMLElement).classList.add("split-line-mask"));
              gsap.set(el, { visibility: "visible" });
              el.setAttribute("data-revealed", "");
              const n = self.lines.length;
              const tween = gsap.from(self.lines, {
                yPercent: 105,
                duration: DUR_S.reveal,
                ease: EASE.gsapOut,
                stagger: STAGGER.lines,
                delay,
                scrollTrigger: trigger === "inView" ? { trigger: el, start: "top 80%", once: true } : undefined,
                onComplete,
              });
              if (onLastLineStart) {
                gsap.delayedCall(delay + STAGGER.lines * Math.max(0, n - 1), onLastLineStart);
              }
              return tween;
            },
          });
        };
        if (trigger === "load") document.fonts.ready.then(run);
        else run();
        return () => {
          cancelled = true;
          split?.revert();
        };
      });
      mm.add(MQ.reduce, () => {
        el.setAttribute("data-revealed", "");
        onLastLineStart?.();
        onComplete?.();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  // A narrow tag union keeps JSX typing sound (R3F augments JSX.IntrinsicElements).
  const T = Tag as "h2";
  return (
    <T ref={ref as React.Ref<HTMLHeadingElement>} id={id} className={className} data-reveal="lines">
      {children}
    </T>
  );
}
