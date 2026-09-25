/**
 * The phone: a CSS frame about 340x700 (radius 48px, 10px ink bezel) holding
 * the app's dark UI. The status bar and the home indicator belong to the
 * device, so they stay put while the screens swipe underneath.
 * docs/website/03-site-structure.md, part 9.
 */
import { cn } from "@/lib/cn";
import { StatusBar } from "./screen-kit";

export function PhoneFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative mx-auto aspect-[340/700] w-full max-w-[340px] rounded-[48px] border-[10px] border-ink bg-ink",
        "shadow-[0_2px_4px_rgba(14,26,34,0.08),0_24px_48px_-16px_rgba(14,26,34,0.28),0_60px_100px_-40px_rgba(14,26,34,0.35)]",
        className,
      )}
    >
      {/* Hardware keys: two volume keys left, one side key right */}
      <span aria-hidden className="absolute -left-[13px] top-[118px] h-[30px] w-[3px] rounded-l-[2px] bg-ink" />
      <span aria-hidden className="absolute -left-[13px] top-[160px] h-[54px] w-[3px] rounded-l-[2px] bg-ink" />
      <span aria-hidden className="absolute -left-[13px] top-[224px] h-[54px] w-[3px] rounded-l-[2px] bg-ink" />
      <span aria-hidden className="absolute -right-[13px] top-[182px] h-[88px] w-[3px] rounded-r-[2px] bg-ink" />

      <div className="relative h-full w-full overflow-hidden rounded-[38px] bg-ink text-ice shadow-[inset_0_0_0_1px_rgba(233,238,240,0.06)]">
        {children}
        <StatusBar />
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-2 left-1/2 z-[2] h-1 w-[108px] -translate-x-1/2 rounded-full bg-ice/45"
        />
      </div>
    </div>
  );
}
