"use client";

/**
 * Mobile menu: a 44x44 button and a full-height sheet on the current ground.
 *
 * Sources:
 *  - React Bits "Staggered Menu" (https://reactbits.dev/components/staggered-menu,
 *    https://github.com/DavidHDev/react-bits, MIT + Commons Clause): reference
 *    for the rhythm. Its GSAP timeline lifts each big label out of a mask
 *    (yPercent 140 -> 0 with a small settling rotation, staggered) after the
 *    panel lands, then brings in the secondary items. Rebuilt in Motion per
 *    the spec: the sheet slides down (y -100% -> 0, spring.ui), the 40px links
 *    rise out of their masks with stagger.items, then the rest follows.
 *  - Kokonut UI "smooth-drawer" (https://kokonutui.com/r/smooth-drawer.json,
 *    MIT, @dorianbaffier): the fallback; we took its parent/child variants
 *    pattern (delayChildren + staggerChildren, each child y + opacity) for the
 *    Pause motion toggle and the waitlist field under the links.
 *
 * Behaviour: focus trap (the menu button and the sheet), Escape closes and
 * returns focus to the button, page scroll stops while open (Lenis stop /
 * overflow), `data-lenis-prevent` lets the sheet scroll on its own. Reduced
 * motion: the sheet appears without sliding and nothing staggers.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { PauseMotionButton } from "@/components/motion/PauseMotionButton";
import { startScroll, stopScroll } from "@/components/motion/SmoothScroll";
import { useIsMobile, useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { WaitlistField } from "@/components/waitlist/WaitlistField";
import { DUR_S, EASE, SPRING, STAGGER } from "@/lib/tokens";
import { NAV_LINKS } from "./nav-data";
import { useGround } from "./useGround";
import styles from "./nav.module.css";

const SHEET_ID = "nav-sheet";
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotionSafe();
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const setMenu = useCallback(
    (next: boolean, opts: { returnFocus?: boolean } = {}) => {
      setOpen(next);
      // Scroll is started synchronously so an anchor click inside the sheet
      // can glide to its target in the same event.
      if (next) stopScroll();
      else startScroll();
      if (!next && opts.returnFocus) buttonRef.current?.focus();
    },
    [],
  );

  // Close when leaving the mobile layout or changing page.
  const [seen, setSeen] = useState({ pathname, isMobile });
  if (seen.pathname !== pathname || seen.isMobile !== isMobile) {
    setSeen({ pathname, isMobile });
    if (open) setOpen(false);
  }
  useEffect(() => {
    // The header drops its plate while the sheet is the surface.
    buttonRef.current?.closest("header")?.toggleAttribute("data-sheet-open", open);
    if (!open) startScroll();
  }, [open]);

  // Never leave the page frozen if the nav unmounts while open.
  useEffect(() => () => startScroll(), []);

  // Escape + focus trap
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMenu(false, { returnFocus: true });
        return;
      }
      if (e.key !== "Tab" || !sheetRef.current || !buttonRef.current) return;
      const items = [buttonRef.current, ...Array.from(sheetRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))].filter(
        (el) => el.offsetParent !== null || el === buttonRef.current,
      );
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const inside = active && items.includes(active);
      if (e.shiftKey && (active === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setMenu]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={styles.menuButton}
        aria-expanded={open}
        aria-controls={SHEET_ID}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setMenu(!open)}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={open ? "close" : "open"}
            className={styles.menuIcon}
            initial={reduce ? false : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: DUR_S.micro, ease: EASE.out }}
          >
            {open ? <X size={22} weight="light" aria-hidden /> : <List size={22} weight="light" aria-hidden />}
          </motion.span>
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <Sheet
            key="sheet"
            ref={sheetRef}
            reduce={reduce}
            pathname={pathname}
            onNavigate={() => setMenu(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

const listVariants: Variants = {
  hidden: {},
  shown: { transition: { delayChildren: 0.18, staggerChildren: STAGGER.items } },
};
const linkVariants: Variants = {
  hidden: { y: "115%", rotate: 4 },
  shown: { y: "0%", rotate: 0, transition: { duration: 0.8, ease: EASE.out } },
};
const footVariants: Variants = {
  hidden: {},
  shown: { transition: { delayChildren: 0.42, staggerChildren: 0.07 } },
};
const footItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  shown: { opacity: 1, y: 0, transition: SPRING.ui },
};

function Sheet({
  ref,
  reduce,
  pathname,
  onNavigate,
}: {
  ref: React.Ref<HTMLDivElement>;
  reduce: boolean;
  pathname: string;
  onNavigate: () => void;
}) {
  const ground = useGround();
  const localRef = useRef<HTMLDivElement | null>(null);

  // Move focus to the first link once the sheet is in.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      localRef.current?.querySelector<HTMLElement>("a[href]")?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const setRefs = (el: HTMLDivElement | null) => {
    localRef.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) (ref as React.RefObject<HTMLDivElement | null>).current = el;
  };

  const initial = reduce ? false : "hidden";

  return (
    <motion.div
      ref={setRefs}
      id={SHEET_ID}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      data-lenis-prevent
      className={`${styles.sheet} ${ground === "ink" ? "on-ink" : "on-paper"}`}
      initial={reduce ? { opacity: 1 } : { y: "-100%" }}
      animate={{ y: "0%" }}
      exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { y: "-100%", transition: { duration: 0.45, ease: EASE.inOut } }}
      transition={reduce ? { duration: 0 } : SPRING.ui}
    >
      <nav aria-label="Menu">
        <motion.ul className={styles.sheetLinks} variants={listVariants} initial={initial} animate="shown">
          {NAV_LINKS.map((l) => (
            <li key={l.href} className={styles.sheetMask}>
              <motion.div variants={linkVariants} style={{ transformOrigin: "0% 100%" }}>
                <Link
                  href={l.href}
                  className={styles.sheetLink}
                  aria-current={l.href === pathname ? "page" : undefined}
                  onClick={onNavigate}
                >
                  {l.label}
                </Link>
              </motion.div>
            </li>
          ))}
        </motion.ul>
      </nav>

      <motion.div className={styles.sheetFoot} variants={footVariants} initial={initial} animate="shown">
        <motion.div variants={footItem}>
          <PauseMotionButton ground={ground} withLabel className={styles.sheetPause} />
        </motion.div>
        <motion.div variants={footItem}>
          <WaitlistField id="nav-sheet" source="nav-sheet" ground={ground} initiallyOpen focusOnOpen={false} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
