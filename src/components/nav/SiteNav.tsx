"use client";

/**
 * Part 1. Navigation (docs/website/03-site-structure.md, part 1).
 *
 * Rendered once in the root layout for every page. The lockup on the left;
 * on desktop three text links, the Pause motion button and the CTA pill on
 * the right, on one line; on mobile the menu button. 72px tall (64px on
 * mobile), transparent at the top, with a plate (ground at 72% + progressive
 * blur) once the page has scrolled 24px (`data-scrolled`, toggled by a
 * ScrollTrigger, never a scroll listener or React state).
 *
 * The ink / paper variants follow <html data-ground> through CSS only
 * (nav.module.css), so the ground changes never re-render the nav.
 */
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { ScrollTrigger, useGSAP } from "@/components/motion/gsap";
import { PauseMotionButton } from "@/components/motion/PauseMotionButton";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { MotionLink } from "./MotionLink";
import { MobileMenu } from "./MobileMenu";
import { NavCta } from "./NavCta";
import { NavLockup } from "./NavLockup";
import { NavPlate } from "./NavPlate";
import { NAV_LINKS } from "./nav-data";
import { TextRoll } from "./TextRoll";
import styles from "./nav.module.css";

const PLATE_AT = 24; // px of scroll before the plate appears

export function SiteNav() {
  const pathname = usePathname();
  const home = pathname === "/";
  const reduce = useReducedMotionSafe();
  const headerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const header = headerRef.current;
      if (!header) return;
      ScrollTrigger.create({
        start: PLATE_AT,
        end: "max",
        onToggle: (self) => header.toggleAttribute("data-scrolled", self.isActive),
        onRefresh: (self) => header.toggleAttribute("data-scrolled", self.isActive),
      });
    },
    { scope: headerRef },
  );

  return (
    <header ref={headerRef} className={styles.header}>
      <NavPlate />
      <div className={`container-site ${styles.bar}`}>
        <NavLockup home={home} />

        <div className="ml-auto hidden items-center gap-2 md:flex lg:gap-3">
          <nav aria-label="Main">
            <ul className={styles.links}>
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <MotionLink
                    href={l.href}
                    className={styles.link}
                    aria-current={l.href === pathname ? "page" : undefined}
                    initial="rest"
                    animate="rest"
                    whileHover="roll"
                    whileFocus="roll"
                  >
                    <TextRoll reduce={reduce}>{l.label}</TextRoll>
                  </MotionLink>
                </li>
              ))}
            </ul>
          </nav>
          <PauseMotionButton className={styles.iconButton} />
          <NavCta home={home} />
        </div>

        <div className="ml-auto flex items-center md:hidden">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
