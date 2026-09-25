/**
 * The footer's links row, disclaimer and copyright. Shared by the homepage
 * finale (FinalFooter) and the secondary pages (SiteFooter).
 *
 * Link hover: Fancy Components "Underline Animation"
 * (https://www.fancycomponents.dev/docs/components/text/underline-animation,
 * MIT, Daniel Petho). Fancy draws the line by animating its width in Motion;
 * here it is the shared `link-underline` utility in globals.css (the same
 * left-to-right draw on hover and keyboard focus, dur.ui, ease.out). The
 * underline lives on the inner span so each link keeps a 44px hit area.
 */
import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Ground } from "@/lib/tokens";
import { COPYRIGHT, DISCLAIMER, FOOTER_LINKS } from "./footer-data";

export function FooterLinks({ ground, className }: { ground: Ground; className?: string }) {
  const ink = ground === "ink";
  const linkCls = cn(
    "group inline-flex min-h-11 items-center text-[15px] leading-none transition-colors duration-150 ease-[var(--ease-out)]",
    ink ? "text-ice-60 hover:text-ice focus-visible:text-ice" : "text-slate hover:text-ink-reverse focus-visible:text-ink-reverse",
  );
  const lineCls = "link-underline group-hover:bg-[length:100%_1px] group-focus-visible:bg-[length:100%_1px]";

  return (
    <nav aria-label="Footer" className={className}>
      <ul className="flex flex-wrap items-center gap-x-7 gap-y-0">
        {FOOTER_LINKS.map((l) => (
          <li key={l.href}>
            {l.external ? (
              <a href={l.href} className={linkCls}>
                <span className={lineCls}>{l.label}</span>
              </a>
            ) : (
              <Link href={l.href} className={linkCls}>
                <span className={lineCls}>{l.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function FooterNote({ ground, className }: { ground: Ground; className?: string }) {
  const ink = ground === "ink";
  return (
    <div className={cn("flex flex-col gap-3 text-small", ink ? "text-ice-60" : "text-slate", className)}>
      <p className="max-w-[60ch]">{DISCLAIMER}</p>
      <p>{COPYRIGHT}</p>
    </div>
  );
}
