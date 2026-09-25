"use client";

/**
 * Lenis smooth scroll, stepped by GSAP's ticker (never its own rAF loop).
 * - Not started at all under reduced motion; touch devices keep native scroll.
 * - Same-page anchor links go through scrollToTarget with the nav offset.
 * - ScrollTrigger is sorted and refreshed once fonts are ready.
 */
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";
import { ANCHOR_OFFSET, LENIS } from "@/lib/tokens";
import { prefersReducedMotion } from "./useReducedMotionSafe";

let lenis: Lenis | null = null;

export function getLenis() {
  return lenis;
}

/** Scroll to an element, selector or y position, landing below the nav. */
export function scrollToTarget(
  target: string | HTMLElement | number,
  opts: { immediate?: boolean; offset?: number } = {},
) {
  const offset = opts.offset ?? -ANCHOR_OFFSET;
  if (lenis) {
    lenis.scrollTo(target, { offset, immediate: opts.immediate, duration: opts.immediate ? 0 : 1.2 });
    return;
  }
  let y: number | null = null;
  if (typeof target === "number") y = target;
  else {
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (el) y = el.getBoundingClientRect().top + window.scrollY;
  }
  if (y !== null) window.scrollTo({ top: Math.max(0, y + offset), behavior: "auto" });
}

/** Freeze page scroll (for example while the mobile sheet is open). */
export function stopScroll() {
  lenis?.stop();
  if (!lenis) document.documentElement.style.overflow = "hidden";
}

export function startScroll() {
  lenis?.start();
  if (!lenis) document.documentElement.style.overflow = "";
}

function hashTarget(href: string): string | null {
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return null;
    if (url.pathname !== window.location.pathname) return null;
    if (!url.hash || url.hash === "#") return null;
    return decodeURIComponent(url.hash);
  } catch {
    return null;
  }
}

export function SmoothScroll() {
  useEffect(() => {
    const reduce = prefersReducedMotion();
    let tick: ((time: number) => void) | null = null;

    if (!reduce) {
      lenis = new Lenis({ ...LENIS, autoRaf: false });
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
    }

    // Same-page anchors: smooth scroll with the nav offset.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank") return;
      const hash = hashTarget(a.getAttribute("href") || "");
      if (!hash) return;
      const el = document.querySelector<HTMLElement>(hash);
      if (!el) return;
      e.preventDefault();
      scrollToTarget(el);
      history.pushState(null, "", hash);
      // Move focus for keyboard and screen-reader users without a second jump.
      if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);

    // Recalculate once real fonts are in, then honour an incoming #hash.
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (cancelled) return;
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      const hash = window.location.hash;
      if (hash && hash.length > 1) {
        const el = document.querySelector<HTMLElement>(decodeURIComponent(hash));
        if (el) requestAnimationFrame(() => scrollToTarget(el, { immediate: true }));
      }
    });

    return () => {
      cancelled = true;
      document.removeEventListener("click", onClick);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  // Client-side route change: start the new page at the top (or its #hash).
  const pathname = usePathname();
  useEffect(() => {
    if (window.location.hash) return;
    lenis?.scrollTo(0, { immediate: true, force: true });
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
