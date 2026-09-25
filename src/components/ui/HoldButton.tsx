"use client";

/**
 * HoldButton: press and hold to confirm.
 *
 * Source: React Bits "Hold Button" (HoldButton-TS-TW), https://reactbits.dev
 *   (registry: https://reactbits.dev/r/HoldButton-TS-TW.json, repo
 *   https://github.com/DavidHDev/react-bits). Licence: MIT + Commons Clause
 *   (use in a product is fine; components are not resold).
 *   Taken: the whole interaction model. Phases idle / holding / done; the fill runs
 *   linearly for the hold time and eases back on an early release; pointer capture
 *   with a 10px drift pad (sliding off cancels); Space/Enter hold (key repeat
 *   ignored) and Escape to cancel; window blur and tab hide cancel a hold; the
 *   context menu is suppressed for long-press; a visually hidden "Press and hold"
 *   hint wired with aria-describedby; the pointer press scale of 0.97; the label
 *   swap to a done label with an icon.
 * Fallback cross-checked: Kokonut UI `hold-button` (https://kokonutui.com/r/hold-button.json,
 *   MIT): a Motion-driven linear fill that stops and reverses on release.
 *
 * Changed for anveli: Motion drives the progress (one motion value), the fill is a
 * glacier layer animated with scaleX 0 -> 1 (transform only; the source animates a
 * clip-path wave and a glow, both dropped), the release reverses over dur.ui with
 * ease.out, no auto reset (the parent shows a Reset action and calls reset()),
 * Phosphor icons, our pill shape (ice pill, ink text, 48px tall). Reduced motion:
 * the fill fades in over the hold instead of growing (as the source does).
 */
import { animate, motion, useMotionValue, type AnimationPlaybackControls } from "motion/react";
import {
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type Ref,
} from "react";
import { cn } from "@/lib/cn";
import { DUR, DUR_S, EASE, SPRING } from "@/lib/tokens";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";

const HIT_PAD = 10;

export type HoldButtonHandle = {
  /** Back to idle (the fill eases out). Focuses the button unless focus is false. */
  reset: (opts?: { focus?: boolean }) => void;
};

type Phase = "idle" | "holding" | "done";
type Input = "pointer" | "key" | null;

export function HoldButton({
  children,
  doneLabel,
  holdTime = 1200,
  hint,
  onHold,
  className,
  ref,
}: {
  children: ReactNode;
  doneLabel: ReactNode;
  /** Hold duration in ms. */
  holdTime?: number;
  /** Screen-reader hint. Defaults to "Press and hold for N seconds to confirm". */
  hint?: string;
  onHold?: () => void;
  className?: string;
  ref?: Ref<HoldButtonHandle>;
}) {
  const reduce = useReducedMotionSafe();
  const [phase, setPhase] = useState<Phase>("idle");
  const [input, setInput] = useState<Input>(null);
  const phaseRef = useRef<Phase>("idle");
  const inputRef = useRef<Input>(null);
  const button = useRef<HTMLButtonElement>(null);
  const gesture = useRef<{ pointerId: number | null; rect: DOMRect | null }>({ pointerId: null, rect: null });
  const anim = useRef<AnimationPlaybackControls | null>(null);
  const progress = useMotionValue(0);
  const hintId = useId();
  const onHoldRef = useRef(onHold);
  useEffect(() => {
    onHoldRef.current = onHold;
  }, [onHold]);

  const go = (next: Phase, kind: Input = null) => {
    phaseRef.current = next;
    inputRef.current = kind;
    setPhase(next);
    setInput(kind);
  };

  const begin = (kind: Input) => {
    if (phaseRef.current !== "idle") return false;
    go("holding", kind);
    anim.current?.stop();
    // Constant rate: the remaining part of the fill takes the remaining hold time.
    const remaining = (1 - progress.get()) * holdTime;
    anim.current = animate(progress, 1, {
      duration: remaining / 1000,
      ease: "linear", // the user's hold is the easing
      onComplete: () => {
        if (phaseRef.current !== "holding") return;
        go("done");
        onHoldRef.current?.();
      },
    });
    return true;
  };

  const release = () => {
    if (phaseRef.current !== "holding") return;
    go("idle");
    anim.current?.stop();
    anim.current = animate(progress, 0, { duration: DUR_S.ui, ease: EASE.out });
  };
  const releaseRef = useRef(release);
  useEffect(() => {
    releaseRef.current = release;
  });

  useImperativeHandle(
    ref,
    () => ({
      reset(opts) {
        anim.current?.stop();
        go("idle");
        anim.current = animate(progress, 0, { duration: DUR_S.ui, ease: EASE.out });
        if (opts?.focus !== false) button.current?.focus();
      },
    }),
    [progress],
  );

  // A hold is cancelled if the window loses focus or the tab is hidden.
  useEffect(() => {
    if (phase !== "holding") return;
    const cancel = () => releaseRef.current();
    const onVisibility = () => {
      if (document.hidden) cancel();
    };
    window.addEventListener("blur", cancel);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("blur", cancel);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [phase]);

  useEffect(() => () => anim.current?.stop(), []);

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0 || !e.isPrimary || gesture.current.pointerId !== null) return;
    if (!begin("pointer")) return;
    gesture.current = { pointerId: e.pointerId, rect: e.currentTarget.getBoundingClientRect() };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* capture is best effort */
    }
  };

  const endPointer = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.pointerId !== gesture.current.pointerId) return;
    gesture.current = { pointerId: null, rect: null };
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
    release();
  };

  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const r = gesture.current.rect;
    if (e.pointerId !== gesture.current.pointerId || !r) return;
    const out =
      e.clientX < r.left - HIT_PAD ||
      e.clientX > r.right + HIT_PAD ||
      e.clientY < r.top - HIT_PAD ||
      e.clientY > r.bottom + HIT_PAD;
    if (out) endPointer(e);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Escape") {
      if (inputRef.current === "key") release();
      return;
    }
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (!e.repeat) begin("key");
    }
  };

  const onKeyUp = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (inputRef.current === "key") release();
    }
  };

  const done = phase === "done";
  const seconds = Math.round(holdTime / 100) / 10;

  return (
    <motion.button
      ref={button}
      type="button"
      data-phase={phase}
      aria-describedby={hintId}
      aria-disabled={done || undefined}
      animate={{ scale: phase === "holding" && input === "pointer" && !reduce ? 0.97 : 1 }}
      transition={SPRING.press}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      onLostPointerCapture={endPointer}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onContextMenu={(e) => e.preventDefault()}
      className={cn(
        "on-ink relative isolate inline-grid h-12 min-w-[176px] touch-manipulation place-items-center overflow-hidden rounded-full bg-ice px-7",
        "text-[16px] font-medium text-ink select-none [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none]",
        done && "cursor-default",
        className,
      )}
    >
      <motion.span
        aria-hidden
        className="absolute inset-0 origin-left bg-glacier"
        style={reduce ? { opacity: progress } : { scaleX: progress }}
      />
      <span className="relative z-[1] grid place-items-center">
        <Label show={!done}>{children}</Label>
        <Label show={done}>{doneLabel}</Label>
      </span>
      <span id={hintId} className="sr-only-soft">
        {hint ?? `Press and hold for ${seconds} seconds to confirm`}
      </span>
    </motion.button>
  );
}

function Label({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <motion.span
      aria-hidden={!show}
      className="inline-flex items-center gap-2 whitespace-nowrap [grid-area:1/1]"
      initial={false}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: DUR.ui / 1000, ease: EASE.out }}
    >
      {children}
    </motion.span>
  );
}
