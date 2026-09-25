"use client";

/**
 * Waitlist client. The site is a static export, so signups POST from the
 * browser to a third-party form endpoint (Formspree or Loops; the choice is an
 * open decision in docs/website/04-build-plan.md §10).
 *
 * Configure with NEXT_PUBLIC_WAITLIST_ENDPOINT, e.g.
 *   https://formspree.io/f/<form-id>
 * The body is JSON: { email, source } for signups and { email, interest } for
 * the optional follow-up. Until an endpoint is set, submissions are simulated
 * (a short delay, then success) and a console warning says so.
 */
import { useSyncExternalStore } from "react";

export const WAITLIST_ENDPOINT = process.env.NEXT_PUBLIC_WAITLIST_ENDPOINT ?? "";

export type SubmitResult = { ok: true } | { ok: false; reason: "invalid" | "network" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const isValidEmail = (email: string) => EMAIL_RE.test(email.trim());

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function post(body: Record<string, string>): Promise<boolean> {
  if (!WAITLIST_ENDPOINT) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[waitlist] NEXT_PUBLIC_WAITLIST_ENDPOINT is not set. Simulating success.", body);
    }
    await sleep(1400);
    return true;
  }
  try {
    const res = await fetch(WAITLIST_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function submitWaitlist(email: string, source: string): Promise<SubmitResult> {
  if (!isValidEmail(email)) return { ok: false, reason: "invalid" };
  if (typeof navigator !== "undefined" && navigator.onLine === false) return { ok: false, reason: "network" };
  const ok = await post({ email: email.trim(), source });
  if (!ok) return { ok: false, reason: "network" };
  setJoined(email.trim());
  return { ok: true };
}

export async function submitInterest(interest: string): Promise<boolean> {
  return post({ email: joinedEmail() ?? "", interest });
}

/* ---- "already joined" memory (localStorage, a convenience only) ---- */

const JOINED_KEY = "anveli:waitlist-joined";
const joinedListeners = new Set<() => void>();
let joinedCache: string | null | undefined;

function joinedEmail(): string | null {
  if (joinedCache !== undefined) return joinedCache;
  try {
    joinedCache = window.localStorage.getItem(JOINED_KEY);
  } catch {
    joinedCache = null;
  }
  return joinedCache;
}

function setJoined(email: string) {
  joinedCache = email;
  try {
    window.localStorage.setItem(JOINED_KEY, email);
  } catch {
    /* storage unavailable: remembered for this page only */
  }
  joinedListeners.forEach((l) => l());
}

export function useWaitlistJoined(): boolean {
  return useSyncExternalStore(
    (cb) => {
      joinedListeners.add(cb);
      return () => joinedListeners.delete(cb);
    },
    () => joinedEmail() !== null,
    () => false,
  );
}

/* ---- Open requests: the nav CTA opens the hero field when it is in view ---- */

type OpenListener = () => void;
const openListeners = new Map<string, OpenListener>();
const visibleFields = new Set<string>();

/** A field registers itself so the nav can open it (e.g. id "hero"). */
export function registerWaitlistField(id: string, open: OpenListener) {
  openListeners.set(id, open);
  return () => {
    openListeners.delete(id);
    visibleFields.delete(id);
  };
}

export function setWaitlistFieldVisible(id: string, visible: boolean) {
  if (visible) visibleFields.add(id);
  else visibleFields.delete(id);
}

/**
 * Ask the visible field with this id to open. Returns false if it is not in
 * view, so the caller can show its own popover instead.
 */
export function requestOpenWaitlist(id = "hero"): boolean {
  if (!visibleFields.has(id)) return false;
  const open = openListeners.get(id);
  if (!open) return false;
  open();
  return true;
}
