import type { MetadataRoute } from "next";

// Static export: metadata route handlers must be marked static to be
// prerendered to out/sitemap.xml (node_modules/next/dist/docs/01-app/02-guides/static-exports.md).
export const dynamic = "force-static";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/**
 * Only the pages meant to be found. /privacy and /terms are placeholders that
 * need legal review, so they are noindex and stay out of the sitemap until
 * the real text lands (then add them here and drop their robots metadata).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/privacy-trust`, lastModified, changeFrequency: "monthly", priority: 0.8 },
  ];
}
