"use client";

/**
 * The nav CTA: "Join the waitlist". On the homepage it first asks the hero's
 * waitlist field to open (when the hero field is on screen); otherwise it
 * opens a small popover under the pill with the same field.
 *
 * The pill's fill follows the ground through CSS (two fills crossfading by
 * opacity, no background-color animation). Press: spring.press to 0.97.
 * Popover (Motion): non-modal dialog, focus moves to the email field, Escape
 * or an outside click closes it, Escape returns focus to the pill.
 */
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { WaitlistField } from "@/components/waitlist/WaitlistField";
import { requestOpenWaitlist } from "@/components/waitlist/waitlist-client";
import { DUR_S, EASE, SPRING } from "@/lib/tokens";
import { CTA_LABEL } from "./nav-data";
import { useGround } from "./useGround";
import styles from "./nav.module.css";

export function NavCta({ home }: { home: boolean }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotionSafe();
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popId = useId();

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }, []);

  const onClick = () => {
    if (open) {
      close(false);
      return;
    }
    if (home && requestOpenWaitlist("hero")) return;
    setOpen(true);
  };

  // Escape, outside click and focus leaving close the popover.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(true);
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) close(false);
    };
    const onFocusIn = (e: FocusEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [open, close]);

  return (
    <div ref={wrapRef} className="relative">
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={onClick}
        aria-expanded={open}
        aria-controls={open ? popId : undefined}
        aria-haspopup="dialog"
        whileTap={{ scale: 0.97 }}
        transition={SPRING.press}
        className={styles.cta}
      >
        <span aria-hidden className={`${styles.ctaFill} ${styles.ctaFillInk}`} />
        <span aria-hidden className={`${styles.ctaFill} ${styles.ctaFillPaper}`} />
        <span aria-hidden className={styles.ctaHover} />
        {CTA_LABEL}
      </motion.button>

      <AnimatePresence>
        {open && <WaitlistPopover id={popId} reduce={reduce} />}
      </AnimatePresence>
    </div>
  );
}

function WaitlistPopover({ id, reduce }: { id: string; reduce: boolean }) {
  const ground = useGround();
  const ref = useRef<HTMLDivElement>(null);

  // Move focus into the popover: the email field, or the dialog itself when
  // the visitor has already joined.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const input = ref.current?.querySelector<HTMLInputElement>("input");
      (input ?? ref.current)?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <motion.div
      ref={ref}
      id={id}
      role="dialog"
      aria-label="Join the waitlist"
      tabIndex={-1}
      data-lenis-prevent
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -6, transition: { duration: DUR_S.micro, ease: EASE.out } }}
      transition={reduce ? { duration: 0 } : SPRING.ui}
      className={`${styles.popover} ${ground === "ink" ? "on-ink" : "on-paper"}`}
      style={{ outline: "none" }}
    >
      <p className={styles.popoverLead}>Be first to try anveli when it opens.</p>
      <WaitlistField id="nav-popover" source="nav" ground={ground} initiallyOpen className="max-w-none" />
    </motion.div>
  );
}
