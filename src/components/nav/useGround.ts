"use client";

/**
 * The current page ground as React state, read from <html data-ground>.
 * Only for components that must pass `ground` as a prop (the waitlist field
 * and the Pause motion toggle inside the nav popover and mobile sheet). The
 * nav chrome itself switches through CSS and never re-renders for this.
 */
import { useSyncExternalStore } from "react";
import type { Ground } from "@/lib/tokens";

function read(): Ground {
  return document.documentElement.getAttribute("data-ground") === "paper" ? "paper" : "ink";
}

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-ground"] });
  return () => mo.disconnect();
}

export function useGround(serverDefault: Ground = "ink"): Ground {
  return useSyncExternalStore(subscribe, read, () => serverDefault);
}
