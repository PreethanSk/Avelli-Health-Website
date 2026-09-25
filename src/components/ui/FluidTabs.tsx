"use client";

/**
 * FluidTabs: a tablist with a pill that slides behind the active tab.
 *
 * Source: Watermelon UI `fluid-tabs`, https://ui.watermelon.sh/r/fluid-tabs.json
 *   (free registry). Taken: the structure (a rounded track holding buttons, the
 *   active one rendering an absolutely positioned pill with a shared `layoutId`
 *   so Motion slides it between tabs) and the label sitting above the pill.
 * Keyboard model cross-checked against Kokonut UI `smooth-tab`
 *   (https://kokonutui.com/r/smooth-tab.json, MIT): role="tablist" / "tab",
 *   aria-selected, aria-controls, per-tab key handling.
 *
 * Changed for anveli: react-icons removed (labels only), the gradient pill and the
 * blur flicker on the active label are dropped (no gradients, only transform and
 * opacity animate), the pill spring is SPRING.ui, colours come from our tokens
 * (a raised hairline-ink pill under ice text on ink; a paper pill under ink-reverse
 * text on paper, so the label never flashes against the track mid-slide), every
 * tab is 44px tall, and there is a full roving-tabindex keyboard model: Left/Right
 * move and select (wrapping), Home/End jump. Reduced motion: the pill jumps.
 */
import { motion } from "motion/react";
import { useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import { SPRING, type Ground } from "@/lib/tokens";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";

export type FluidTab = { id: string; label: string };

export function fluidTabId(prefix: string, id: string) {
  return `${prefix}-tab-${id}`;
}

export function FluidTabs({
  tabs,
  value,
  onChange,
  idPrefix,
  panelId,
  label,
  ground = "ink",
  className,
}: {
  tabs: FluidTab[];
  value: string;
  onChange: (id: string) => void;
  /** Prefix for tab ids (tab id = `${idPrefix}-tab-${id}`). */
  idPrefix: string;
  /** Id of the tabpanel the tabs control. */
  panelId: string;
  /** Accessible name of the tablist. */
  label: string;
  ground?: Ground;
  className?: string;
}) {
  const reduce = useReducedMotionSafe();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onInk = ground === "ink";

  const select = (i: number) => {
    const n = tabs.length;
    const next = ((i % n) + n) % n;
    onChange(tabs[next].id);
    refs.current[next]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const keys: Record<string, () => void> = {
      ArrowRight: () => select(i + 1),
      ArrowLeft: () => select(i - 1),
      Home: () => select(0),
      End: () => select(tabs.length - 1),
    };
    const run = keys[e.key];
    if (run) {
      e.preventDefault();
      run();
    }
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      aria-orientation="horizontal"
      className={cn(
        "relative flex w-full items-center gap-0.5 rounded-full border p-1 sm:inline-flex sm:w-auto",
        onInk ? "on-ink border-hairline-ink bg-ink-2" : "on-paper border-hairline-paper bg-paper-2",
        className,
      )}
    >
      {tabs.map((tab, i) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            id={fluidTabId(idPrefix, tab.id)}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={panelId}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "relative h-11 flex-1 rounded-full px-1.5 text-[14px] font-medium whitespace-nowrap sm:flex-none sm:px-5 sm:text-[15px]",
              "transition-colors duration-[250ms] ease-[var(--ease-out)]",
              active
                ? onInk
                  ? "text-ice"
                  : "text-ink-reverse"
                : onInk
                  ? "text-ice-60 hover:text-ice"
                  : "text-slate hover:text-ink-reverse",
            )}
          >
            {active && (
              <motion.span
                layoutId={`${idPrefix}-pill`}
                transition={reduce ? { duration: 0 } : SPRING.ui}
                className={cn(
                  "absolute inset-0 rounded-full border",
                  onInk
                    ? "border-ice/10 bg-hairline-ink"
                    : "border-hairline-paper bg-paper shadow-[0_1px_2px_rgba(14,26,34,0.08)]",
                )}
                aria-hidden
              />
            )}
            <span className="relative z-[1]">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
