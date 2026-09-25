/** Nav links (docs/website/03-site-structure.md §1 and part 1). */
export type NavLink = { label: string; href: string };

export const NAV_LINKS: readonly NavLink[] = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Privacy", href: "/privacy-trust" },
];

export const CTA_LABEL = "Join the waitlist";

/** sessionStorage key: the nav signature pulse plays once per session. */
export const SIGNATURE_KEY = "anveli:nav-signature";

/** The hero dispatches this on window when its headline reveal finishes. */
export const HERO_REVEALED_EVENT = "anveli:hero-revealed";
