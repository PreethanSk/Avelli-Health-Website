"use client";

/**
 * The one global motion state ("Pause motion"). Ambient loops (the hero
 * breathe, the marquee, every living mark) read it. It is an external store
 * so GSAP tickers and WebGL frames can read it without React re-renders,
 * and it is mirrored as data-motion="paused" on <html> for CSS.
 * The choice is remembered for the session (sessionStorage, best effort).
 */
import { useSyncExternalStore } from "react";

const KEY = "anveli:motion-paused";
type Listener = () => void;

let paused = false;
let hydrated = false;
const listeners = new Set<Listener>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    paused = window.sessionStorage.getItem(KEY) === "1";
  } catch {
    paused = false;
  }
  applyAttribute();
}

function applyAttribute() {
  if (typeof document === "undefined") return;
  if (paused) document.documentElement.setAttribute("data-motion", "paused");
  else document.documentElement.removeAttribute("data-motion");
}

export function isMotionPaused(): boolean {
  hydrate();
  return paused;
}

export function setMotionPaused(next: boolean) {
  hydrate();
  if (next === paused) return;
  paused = next;
  try {
    window.sessionStorage.setItem(KEY, next ? "1" : "0");
  } catch {
    /* storage can be unavailable; the state still works for this page */
  }
  applyAttribute();
  listeners.forEach((l) => l());
}

export function toggleMotionPaused() {
  setMotionPaused(!isMotionPaused());
}

export function subscribeMotionPaused(listener: Listener) {
  hydrate();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** React hook: true while the visitor has paused ambient motion. */
export function useMotionPaused(): boolean {
  return useSyncExternalStore(subscribeMotionPaused, isMotionPaused, () => false);
}
