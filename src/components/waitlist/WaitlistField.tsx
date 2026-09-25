"use client";

/**
 * The waitlist field: the same component in the hero, the nav (sheet and
 * popover), the footer and /privacy-trust. Spec: docs/website/03-site-structure.md §4.
 *
 * States: idle pill -> open field (shared layoutId, spring.ui) -> submitting
 * (living mark looping accrue, aria-busy) -> error (announced, 4px shake) or
 * success ("You're on the list.", mark plays added) -> optional follow-up.
 *
 * Sources: skiper106 "Smooth caret input" (the caret that glides to the
 * insertion point, rebuilt here on Motion) and Watermelon "floating-input"
 * (label behaviour reference; our label always stays visible above).
 */
import Link from "next/link";
import { AnimatePresence, motion, useAnimationControls, useSpring } from "motion/react";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { LivingMark } from "@/components/brand/LivingMark";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { cn } from "@/lib/cn";
import { DUR_S, EASE, SPRING, STAGGER, type Ground } from "@/lib/tokens";
import {
  registerWaitlistField,
  setWaitlistFieldVisible,
  submitInterest,
  submitWaitlist,
  useWaitlistJoined,
} from "./waitlist-client";

type Status = "idle" | "open" | "submitting" | "error" | "success";

const INTERESTS = ["Records", "Trends", "Doctor visits", "Insurance", "Family"] as const;

export type WaitlistFieldProps = {
  /** Registration id; "hero" lets the nav CTA open this field. */
  id?: string;
  ground?: Ground;
  /** Sent with the signup so we know where people joined. */
  source?: string;
  /** Start open (footer, popover, sheet). */
  initiallyOpen?: boolean;
  /** Focus the input when it opens from a click (default true). */
  focusOnOpen?: boolean;
  size?: "md" | "lg";
  className?: string;
  onStatusChange?: (status: Status) => void;
};

export function WaitlistField({
  id,
  ground = "ink",
  source,
  initiallyOpen = false,
  focusOnOpen = true,
  size = "lg",
  className,
  onStatusChange,
}: WaitlistFieldProps) {
  const reactId = useId();
  const fieldId = `wl-${id ?? reactId}`;
  const joined = useWaitlistJoined();
  const reduce = useReducedMotionSafe();

  const [status, setStatus] = useState<Status>(initiallyOpen ? "open" : "idle");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [interest, setInterest] = useState<string | null>(null);
  const [justJoined, setJustJoined] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldFocus = useRef(false);
  const shake = useAnimationControls();

  const ink = ground === "ink";

  const open = useCallback(() => {
    shouldFocus.current = focusOnOpen;
    setStatus((s) => (s === "idle" ? "open" : s));
    if (status !== "idle") inputRef.current?.focus();
  }, [focusOnOpen, status]);

  useEffect(() => onStatusChange?.(status), [status, onStatusChange]);

  // Focus the input once it has mounted after opening.
  useEffect(() => {
    if (status === "open" && shouldFocus.current) {
      shouldFocus.current = false;
      inputRef.current?.focus();
    }
  }, [status]);

  // Let the nav open this field while it is on screen.
  useEffect(() => {
    if (!id) return;
    const unregister = registerWaitlistField(id, open);
    const el = rootRef.current;
    if (!el) return unregister;
    const io = new IntersectionObserver(([e]) => setWaitlistFieldVisible(id, e.isIntersecting), {
      threshold: 0.6,
    });
    io.observe(el);
    return () => {
      io.disconnect();
      unregister();
    };
  }, [id, open]);

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (status === "submitting") return;
    setError(null);
    setStatus("submitting");
    const result = await submitWaitlist(email, source ?? id ?? "site");
    if (result.ok) {
      setJustJoined(true);
      setStatus("success");
      return;
    }
    setError(result.reason === "invalid" ? "That email doesn't look right." : "Couldn't reach us. Try again?");
    setStatus("error");
    requestAnimationFrame(() => inputRef.current?.focus());
    if (!reduce) shake.start({ x: [0, -4, 4, -3, 3, 0], transition: { duration: 0.36, ease: "easeOut" } });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape" && email.trim() === "" && !initiallyOpen) {
      e.preventDefault();
      setError(null);
      setStatus("idle");
    }
  };

  const pickInterest = (value: string) => {
    if (interest) return;
    setInterest(value);
    void submitInterest(value);
  };

  const layoutTransition = reduce ? { duration: 0 } : SPRING.ui;
  const errorId = `${fieldId}-error`;
  const consentId = `${fieldId}-consent`;
  const showSuccess = status === "success" || (joined && status !== "submitting");

  return (
    <div
      ref={rootRef}
      className={cn("relative w-full max-w-[480px]", ink ? "on-ink" : "on-paper", className)}
      aria-busy={status === "submitting" || undefined}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {showSuccess ? (
          <motion.div
            key="success"
            layoutId={fieldId}
            transition={layoutTransition}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-5"
          >
            <p
              role="status"
              aria-live="polite"
              className={cn("flex items-center gap-3 text-[19px] font-medium", ink ? "text-ice" : "text-ink-reverse")}
            >
              <LivingMark
                size={20}
                optical={false}
                strokeWidth={5}
                ground={ground}
                state={justJoined ? "added" : "static"}
                className="shrink-0"
              />
              You&rsquo;re on the list.
            </p>

            {justJoined && (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DUR_S.ui, ease: EASE.out, delay: reduce ? 0 : 0.6 }}
              >
                {interest ? (
                  <p role="status" className={cn("text-small", ink ? "text-ice-60" : "text-slate")}>
                    Thanks. That helps us decide what to build first.
                  </p>
                ) : (
                  <fieldset>
                    <legend className={cn("mb-3 text-small", ink ? "text-ice-60" : "text-slate")}>
                      What would you use first? <span className="opacity-80">Optional.</span>
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {INTERESTS.map((label, i) => (
                        <motion.button
                          key={label}
                          type="button"
                          onClick={() => pickInterest(label)}
                          initial={reduce ? false : { opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ ...SPRING.ui, delay: reduce ? 0 : 0.7 + i * STAGGER.items }}
                          whileTap={{ scale: 0.97 }}
                          className={cn(
                            "h-11 rounded-full border px-4 text-[14px] transition-colors duration-150",
                            ink
                              ? "border-hairline-ink text-ice hover:border-ice-60 hover:bg-ink-2"
                              : "border-hairline-paper text-ink-reverse hover:border-slate hover:bg-paper-2",
                          )}
                        >
                          {label}
                        </motion.button>
                      ))}
                    </div>
                  </fieldset>
                )}
              </motion.div>
            )}
          </motion.div>
        ) : status === "idle" ? (
          <motion.button
            key="idle"
            type="button"
            layoutId={fieldId}
            transition={layoutTransition}
            onClick={open}
            whileTap={{ scale: 0.97 }}
            style={{ borderRadius: 9999 }}
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap font-medium",
              size === "lg" ? "h-12 px-6 text-[16px]" : "h-11 px-5 text-[15px]",
              ink ? "bg-ice text-ink hover:bg-[#d7dfe2]" : "bg-ink-reverse text-paper hover:bg-[#1c2b35]",
              "transition-colors duration-150",
            )}
          >
            <motion.span layout="position">Join the waitlist</motion.span>
          </motion.button>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex w-full flex-col gap-2.5"
          >
            <motion.label
              htmlFor={`${fieldId}-input`}
              initial={reduce || initiallyOpen ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DUR_S.ui, ease: EASE.out, delay: 0.08 }}
              className={cn("label-mono", ink ? "text-ice-60" : "text-slate")}
            >
              Email
            </motion.label>

            <motion.div animate={shake} className="w-full">
              <motion.div
                layoutId={fieldId}
                transition={layoutTransition}
                style={{ borderRadius: 9999 }}
                className={cn(
                  "relative flex h-14 w-full items-center gap-2 border pl-5 pr-1.5",
                  "transition-colors duration-150",
                  // The input hides its own outline; the whole pill carries the focus ring.
                  "has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-3 has-[input:focus-visible]:outline-solid has-[input:focus-visible]:outline-[var(--focus-ring)]",
                  ink
                    ? "border-hairline-ink bg-ink-2 focus-within:border-ice-60"
                    : "border-hairline-paper bg-paper-2 focus-within:border-slate",
                  status === "error" && (ink ? "border-amber-ink/70" : "border-amber-paper/70"),
                )}
              >
                <CaretInput
                  ref={inputRef}
                  id={`${fieldId}-input`}
                  value={email}
                  onChange={setEmail}
                  onKeyDown={onKeyDown}
                  readOnly={status === "submitting"}
                  ground={ground}
                  describedBy={cn(status === "error" && errorId, consentId) || undefined}
                  invalid={status === "error"}
                />
                <motion.button
                  type="submit"
                  disabled={status === "submitting"}
                  whileTap={{ scale: 0.97 }}
                  transition={SPRING.press}
                  className={cn(
                    "relative inline-flex h-11 shrink-0 items-center justify-center rounded-full px-5 text-[15px] font-medium whitespace-nowrap",
                    "transition-colors duration-150",
                    ink ? "bg-ice text-ink hover:bg-[#d7dfe2]" : "bg-ink-reverse text-paper hover:bg-[#1c2b35]",
                  )}
                >
                  <span className={cn(status === "submitting" && "invisible")}>Join the waitlist</span>
                  {status === "submitting" && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <LivingMark
                        size={20}
                        optical={false}
                        strokeWidth={5}
                        ground={ink ? "paper" : "ink"}
                        state="sync"
                      />
                      <span className="sr-only">Joining…</span>
                    </span>
                  )}
                </motion.button>
              </motion.div>
            </motion.div>

            <div aria-live="polite" className="min-h-0">
              <AnimatePresence initial={false}>
                {status === "error" && error && (
                  <motion.p
                    id={errorId}
                    key={error}
                    initial={reduce ? false : { opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: DUR_S.ui, ease: EASE.out }}
                    className={cn("pl-5 text-small", ink ? "text-ice" : "text-ink-reverse")}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <motion.p
              id={consentId}
              initial={reduce || initiallyOpen ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: DUR_S.ui, delay: 0.12 }}
              className={cn("pl-5 text-[13px] leading-snug", ink ? "text-ice-60" : "text-slate")}
            >
              We&rsquo;ll only email you about anveli.{" "}
              <Link
                href="/privacy"
                className={cn("link-inline", ink ? "text-ice-60 hover:text-ice" : "text-harbor-deep hover:text-ink-reverse")}
              >
                Privacy policy
              </Link>
            </motion.p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * CaretInput: an email input whose caret glides to the insertion point
 * (skiper106 pattern). The native caret is hidden only while the custom one
 * is active; under reduced motion the native caret is used.
 * ------------------------------------------------------------------------- */

type CaretInputProps = {
  id: string;
  value: string;
  onChange: (v: string) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  readOnly?: boolean;
  ground: Ground;
  describedBy?: string;
  invalid?: boolean;
  ref?: React.Ref<HTMLInputElement>;
};

function CaretInput({ id, value, onChange, onKeyDown, readOnly, ground, describedBy, invalid, ref }: CaretInputProps) {
  const reduce = useReducedMotionSafe();
  const localRef = useRef<HTMLInputElement | null>(null);
  const mirrorRef = useRef<HTMLSpanElement>(null);
  const [focused, setFocused] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);
  const x = useSpring(0, { stiffness: 700, damping: 45, mass: 0.6 });
  const ink = ground === "ink";

  const setRefs = (el: HTMLInputElement | null) => {
    localRef.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) (ref as React.RefObject<HTMLInputElement | null>).current = el;
  };

  const measure = useCallback(() => {
    const input = localRef.current;
    const mirror = mirrorRef.current;
    if (!input || !mirror) return;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    setHasSelection(end !== start);
    mirror.textContent = input.value.slice(0, start);
    const pos = mirror.offsetWidth - input.scrollLeft;
    x.set(Math.max(0, Math.min(pos, input.clientWidth)));
  }, [x]);

  useLayoutEffect(() => {
    measure();
  }, [value, measure]);

  const custom = !reduce && focused && !hasSelection && !readOnly;

  return (
    <div className="relative min-w-0 flex-1">
      <input
        ref={setRefs}
        id={id}
        type="email"
        name="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        required
        placeholder="you@example.com"
        value={value}
        readOnly={readOnly}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onKeyUp={measure}
        onSelect={measure}
        onClick={measure}
        onScroll={measure}
        onFocus={() => {
          setFocused(true);
          requestAnimationFrame(measure);
        }}
        onBlur={() => setFocused(false)}
        className={cn(
          "h-11 w-full min-w-0 bg-transparent text-[16px] outline-none",
          "focus-visible:outline-none",
          ink ? "text-ice placeholder:text-ice-60/70" : "text-ink-reverse placeholder:text-slate/70",
          custom && "caret-transparent",
        )}
        style={{ outline: "none" }}
      />
      {/* Hidden mirror used to measure text width up to the caret */}
      <span
        ref={mirrorRef}
        aria-hidden
        className="pointer-events-none invisible absolute top-0 left-0 whitespace-pre text-[16px]"
      />
      {custom && (
        <motion.span
          aria-hidden
          className={cn(
            "caret-blink pointer-events-none absolute top-1/2 left-0 h-5 w-[2px] -translate-y-1/2 rounded-full",
            ink ? "bg-glacier" : "bg-harbor",
          )}
          style={{ x }}
        />
      )}
    </div>
  );
}
