/**
 * The anveli lockup: the 6A symbol next to (or above) a live Geist wordmark.
 * Ratios from the logo package (anveli-logo.css):
 *  - horizontal: symbol 1.15em, gap 0.3em, centred on the x-height
 *  - stacked:    symbol 1.7em,  gap 0.36em
 *  - wordmark Geist 500, lowercase, tracking -0.035em; 600 at 16px and below
 * The symbol switches to its optical version when it renders at 32px or less.
 */
import { cn } from "@/lib/cn";
import { MARK, type Ground } from "@/lib/tokens";
import { MarkSymbol } from "./MarkSymbol";

export type LockupProps = {
  ground?: Ground;
  variant?: "horizontal" | "stacked";
  /** Wordmark font size in px. Omit to inherit (then pass `optical` yourself). */
  fontSize?: number;
  optical?: boolean;
  className?: string;
  /** Replace the static symbol (e.g. with a LivingMark sized 1.15em). */
  symbol?: React.ReactNode;
};

export function Lockup({ ground = "ink", variant = "horizontal", fontSize, optical, className, symbol }: LockupProps) {
  const stacked = variant === "stacked";
  const symbolEm = stacked ? 1.7 : 1.15;
  const symbolPx = fontSize ? fontSize * symbolEm : undefined;
  const useOptical = optical ?? (symbolPx !== undefined && symbolPx <= MARK.opticalMaxPx);
  const small = fontSize !== undefined && fontSize <= 16;

  return (
    <span
      className={cn(
        "inline-flex items-center leading-none lowercase select-none",
        stacked ? "flex-col gap-[0.36em]" : "flex-row gap-[0.3em]",
        ground === "ink" ? "text-ice" : "text-ink-reverse",
        className,
      )}
      style={{
        fontSize,
        fontWeight: small ? 600 : 500,
        letterSpacing: small ? "-0.03em" : "-0.035em",
      }}
    >
      <span className="block shrink-0" style={{ width: `${symbolEm}em`, height: `${symbolEm}em` }}>
        {symbol ?? <MarkSymbol ground={ground} optical={useOptical} className="h-full w-full" />}
      </span>
      <span className="block translate-y-[-0.04em]" translate="no">
        anveli
      </span>
    </span>
  );
}
