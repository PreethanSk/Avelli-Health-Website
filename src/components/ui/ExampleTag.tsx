/**
 * "Example" label. Every sample value on the site carries one
 * (docs/website/03-site-structure.md §2). Mono, uppercase, quiet.
 */
import { cn } from "@/lib/cn";
import type { Ground } from "@/lib/tokens";

export function ExampleTag({ ground = "paper", className }: { ground?: Ground; className?: string }) {
  return (
    <span
      className={cn(
        "label-mono inline-flex h-6 items-center rounded-full border px-2.5 text-[11px]",
        ground === "ink" ? "border-hairline-ink text-ice-60" : "border-hairline-paper text-slate",
        className,
      )}
    >
      Example
    </span>
  );
}
