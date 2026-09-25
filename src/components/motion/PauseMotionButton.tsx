"use client";

/**
 * Pause motion: one global toggle for every ambient loop (hero breathe,
 * marquee, living marks). 44px target. The nav uses the icon-only version;
 * the marquee shows it with a text label.
 */
import { Pause, Play } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import type { Ground } from "@/lib/tokens";
import { toggleMotionPaused, useMotionPaused } from "./motion-state";

export function PauseMotionButton({
  ground = "ink",
  withLabel = false,
  className,
}: {
  ground?: Ground;
  withLabel?: boolean;
  className?: string;
}) {
  const paused = useMotionPaused();
  const label = paused ? "Play motion" : "Pause motion";
  const Icon = paused ? Play : Pause;

  return (
    <button
      type="button"
      onClick={toggleMotionPaused}
      aria-label={withLabel ? undefined : label}
      aria-pressed={paused}
      title={withLabel ? undefined : label}
      className={cn(
        "inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full",
        "transition-colors duration-150 ease-[var(--ease-out)]",
        withLabel ? "px-4 text-[14px]" : "w-11",
        ground === "ink"
          ? "on-ink text-ice-60 hover:text-ice hover:bg-ink-2"
          : "on-paper text-slate hover:text-ink-reverse hover:bg-paper-2",
        className,
      )}
    >
      <Icon size={18} weight="regular" aria-hidden />
      {withLabel && <span>{label}</span>}
    </button>
  );
}
