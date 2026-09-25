"use client";

/**
 * The nav lockup: symbol + live Geist wordmark, a link named "anveli home".
 *
 * Greenstack move (homepage, motion allowed): ONE element starts 96px from the
 * top at a 56px wordmark with the full symbol (40px on mobile, optical) and a
 * ScrollTrigger on the document (start 0, end 240px, scrub) moves it into the
 * nav slot with scale + translate only. The full symbol crossfades to the
 * optical one at 60% of the scrub (both stay in the DOM; opacity only).
 * Elsewhere, and under reduced motion, CSS docks it at nav size from the
 * start (nav.module.css), so nothing jumps on hydration.
 *
 * Signature: 400ms after the hero headline reveal finishes (window event
 * "anveli:hero-revealed", fallback ~1.4s after load), the nav symbol plays the
 * living mark's "added" pulse once per session.
 *
 * Engines: GSAP owns the link's transform and the two symbol wrappers'
 * opacity; the LivingMark owns only its own circles.
 */
import Link from "next/link";
import { useEffect, useRef } from "react";
import { LivingMark, type LivingMarkHandle } from "@/components/brand/LivingMark";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { isMotionPaused } from "@/components/motion/motion-state";
import { scrollToTarget } from "@/components/motion/SmoothScroll";
import { prefersReducedMotion } from "@/components/motion/useReducedMotionSafe";
import { MQ } from "@/lib/tokens";
import { HERO_REVEALED_EVENT, SIGNATURE_KEY } from "./nav-data";
import styles from "./nav.module.css";

const NAV_FONT = { desktop: 22, mobile: 20 } as const;
const TRAVEL_END = 240; // px of scroll
const SWAP_AT = 0.6; // full -> optical symbol, as a fraction of the scrub
const SIGNATURE_DELAY = 400; // ms after the hero reveal
const SIGNATURE_FALLBACK = 1400; // ms after load

export function NavLockup({ home }: { home: boolean }) {
  const travel = home;
  const linkRef = useRef<HTMLAnchorElement>(null);
  const fullRef = useRef<HTMLSpanElement>(null);
  const opticalRef = useRef<HTMLSpanElement>(null);
  const fullMark = useRef<LivingMarkHandle>(null);
  const opticalMark = useRef<LivingMarkHandle>(null);

  useGSAP(
    () => {
      const el = linkRef.current;
      if (!travel || !el) return;
      const mm = gsap.matchMedia();

      mm.add({ desktop: MQ.desktop, motionOk: MQ.motionOk }, (ctx) => {
        const { desktop, motionOk } = ctx.conditions as { desktop: boolean; motionOk: boolean };
        if (!motionOk) return;
        const navFont = desktop ? NAV_FONT.desktop : NAV_FONT.mobile;

        // The docked pose, from the element's own CSS (so resizes stay exact).
        const docked = () => {
          const cs = getComputedStyle(el);
          const fs = parseFloat(cs.fontSize);
          const p = parseFloat(cs.paddingTop);
          const top = parseFloat(cs.top);
          const navH = el.closest("header")?.clientHeight ?? (desktop ? 72 : 64);
          const s = navFont / fs;
          const h = 1.15 * fs; // the symbol box sets the lockup height
          return { s, x: p * (1 - s), y: navH / 2 - (h * s) / 2 - p * s - top };
        };

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { start: 0, end: TRAVEL_END, scrub: true, invalidateOnRefresh: true },
        });
        tl.fromTo(
          el,
          { x: 0, y: 0, scale: 1, "--lk-cur": 1 },
          {
            x: () => docked().x,
            y: () => docked().y,
            scale: () => docked().s,
            "--lk-cur": () => docked().s,
            duration: 1,
          },
          0,
        );
        if (desktop && fullRef.current && opticalRef.current) {
          tl.fromTo(fullRef.current, { opacity: 1 }, { opacity: 0, duration: 0.1 }, SWAP_AT - 0.05);
          tl.fromTo(opticalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.1 }, SWAP_AT - 0.05);
        }
      });

      return () => mm.revert();
    },
    { dependencies: [travel], revertOnUpdate: true },
  );

  // The signature pulse, once per session.
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(SIGNATURE_KEY)) return;
    } catch {
      /* storage unavailable: play once for this page */
    }
    let played = false;
    let delayTimer: ReturnType<typeof setTimeout> | undefined;
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;

    const play = () => {
      if (played) return;
      played = true;
      clearTimeout(delayTimer);
      clearTimeout(fallbackTimer);
      try {
        window.sessionStorage.setItem(SIGNATURE_KEY, "1");
      } catch {
        /* ignore */
      }
      if (prefersReducedMotion() || isMotionPaused()) return;
      // "added" rides on the idle state; then settle straight back to rest.
      for (const mark of [fullMark.current, opticalMark.current]) {
        mark?.play([{ mode: "added" }, { mode: "breathe", loops: 0 }]);
      }
    };

    const onHeroRevealed = () => {
      clearTimeout(fallbackTimer);
      delayTimer = setTimeout(play, SIGNATURE_DELAY);
    };
    const startFallback = () => {
      fallbackTimer = setTimeout(play, SIGNATURE_FALLBACK);
    };

    window.addEventListener(HERO_REVEALED_EVENT, onHeroRevealed, { once: true });
    if (document.readyState === "complete") startFallback();
    else window.addEventListener("load", startFallback, { once: true });

    return () => {
      window.removeEventListener(HERO_REVEALED_EVENT, onHeroRevealed);
      window.removeEventListener("load", startFallback);
      clearTimeout(delayTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Already home: glide back to the top instead of a no-op navigation.
    if (!home || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    scrollToTarget(0, { offset: 0 });
  };

  return (
    <Link
      ref={linkRef}
      href="/"
      aria-label="anveli home"
      onClick={onClick}
      className={styles.lockup}
      data-travel={travel || undefined}
    >
      <span className={styles.lockupInner}>
        <span className={styles.symbol}>
          {travel && (
            <span ref={fullRef} className={`${styles.symbolLayer} ${styles.full}`}>
              <LivingMark ref={fullMark} state="static" optical={false} />
            </span>
          )}
          <span ref={opticalRef} className={`${styles.symbolLayer} ${styles.optical}`}>
            <LivingMark ref={opticalMark} state="static" optical />
          </span>
        </span>
        <span className={styles.word}>anveli</span>
      </span>
    </Link>
  );
}
