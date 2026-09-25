/**
 * Footer content shared by the homepage finale (part 13, FinalFooter) and the
 * footer of the secondary pages (SiteFooter). Copy from
 * docs/website/03-site-structure.md, part 13.
 */

export type FooterLink = { label: string; href: string; external?: boolean };

export const FOOTER_LINKS: readonly FooterLink[] = [
  { label: "Privacy & trust", href: "/privacy-trust" },
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Contact", href: "mailto:hello@anveli.app", external: true },
];

export const DISCLAIMER =
  "anveli helps you understand and organise your health information. It does not give medical advice or diagnoses. In an emergency, contact your local emergency services.";

export const COPYRIGHT = "© 2026 anveli.";

export const FOOTER_COPY = {
  headline: "Your health, understood.",
  support: "Be first to try anveli when it opens.",
} as const;
