"use client";

import { useMemo, useSyncExternalStore } from "react";
import { MQ } from "@/lib/tokens";

function subscribe(query: string) {
  return (cb: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", cb);
    return () => mql.removeEventListener("change", cb);
  };
}

const subscribeReduce = subscribe(MQ.reduce);
const getReduce = () => window.matchMedia(MQ.reduce).matches;

/**
 * True when the visitor prefers reduced motion. Server render and the first
 * client render return false, then it updates; components that must not
 * flash motion should also guard with CSS or gsap.matchMedia.
 */
export function useReducedMotionSafe(): boolean {
  return useSyncExternalStore(subscribeReduce, getReduce, () => false);
}

/** Generic media-query hook (SSR-safe; server snapshot is `serverDefault`). */
export function useMediaQuery(query: string, serverDefault = false): boolean {
  const sub = useMemo(() => subscribe(query), [query]);
  return useSyncExternalStore(
    sub,
    () => window.matchMedia(query).matches,
    () => serverDefault,
  );
}

/** True below the 768px breakpoint. */
export function useIsMobile(): boolean {
  return useMediaQuery(MQ.mobile, false);
}

/** Non-hook check for use inside effects and tickers. */
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia(MQ.reduce).matches;
}
