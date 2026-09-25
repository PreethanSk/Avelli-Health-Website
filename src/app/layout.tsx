import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Grain } from "@/components/ground/GroundLayer";
import { SiteNav } from "@/components/nav/SiteNav";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const DESCRIPTION =
  "One living health history for your records, wearables, doctor visits and insurance. Private by default. Join the waitlist.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "anveli · Your health, understood.",
    template: "%s · anveli",
  },
  description: DESCRIPTION,
  applicationName: "anveli",
  openGraph: {
    type: "website",
    siteName: "anveli",
    title: "anveli · Your health, understood.",
    description: DESCRIPTION,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "anveli · Your health, understood.",
    description: DESCRIPTION,
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0B0C0D",
  colorScheme: "dark light",
};

/**
 * Runs before first paint: marks JS as available (so line reveals can hide
 * their text until masked) and restores the visitor's "Pause motion" choice.
 */
const BOOT = `(function(){var d=document.documentElement;d.setAttribute("data-js","");d.setAttribute("data-ground",/^\\/(privacy-trust|privacy|terms)(\\.html|\\/)?$/.test(location.pathname)?"paper":"ink");try{if(sessionStorage.getItem("anveli:motion-paused")==="1")d.setAttribute("data-motion","paused")}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${geist.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only-soft focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] focus:rounded-full focus:bg-ice focus:px-5 focus:py-3 focus:text-ink"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <SiteNav />
        {children}
        <Grain />
      </body>
    </html>
  );
}
