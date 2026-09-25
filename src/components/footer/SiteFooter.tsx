/**
 * Footer for the secondary pages: /privacy-trust, /privacy and /terms (paper)
 * and the 404 page (ink). A quiet close: the small horizontal lockup, the
 * links row, the disclaimer and the copyright. The homepage uses the full
 * finale instead (sections/FinalFooter.tsx); both read footer-data.ts.
 */
import Link from "next/link";
import { Lockup } from "@/components/brand/Lockup";
import { cn } from "@/lib/cn";
import type { Ground } from "@/lib/tokens";
import { FooterLinks, FooterNote } from "./FooterLegal";

export function SiteFooter({ ground = "paper" }: { ground?: Ground }) {
  const ink = ground === "ink";
  return (
    <footer className={cn("relative z-[1] pt-24 lg:pt-32", ink ? "on-ink" : "on-paper")}>
      <div className="container-site">
        <div
          className={cn(
            "grid grid-cols-1 gap-8 border-t pt-10 pb-12 md:grid-cols-12 md:gap-6 md:pt-12 md:pb-16",
            ink ? "border-hairline-ink" : "border-hairline-paper",
          )}
        >
          <div className="md:col-span-4">
            <Link href="/" aria-label="anveli home" className="-ml-1 inline-flex min-h-11 items-center rounded-full px-1">
              <Lockup ground={ground} fontSize={20} />
            </Link>
          </div>
          <div className="flex flex-col gap-6 md:col-span-8">
            <FooterLinks ground={ground} className="-my-2" />
            <FooterNote ground={ground} />
          </div>
        </div>
      </div>
    </footer>
  );
}
