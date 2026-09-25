"use client";

/**
 * GSAP setup: plugins are registered once here and every scroll leaf imports
 * gsap from this module (never straight from "gsap"), so registration and
 * the anveli eases are guaranteed.
 *
 * GSAP is free for commercial use under the GSAP standard licence.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { EASE } from "@/lib/tokens";

let registered = false;

function register() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin, CustomEase);
  CustomEase.create(EASE.gsapOut, "0.16,1,0.3,1");
  CustomEase.create(EASE.gsapInOut, "0.65,0,0.35,1");
  gsap.defaults({ ease: EASE.gsapOut });
  // Lenis supplies smoothing; ScrollTrigger must not lag-smooth on top of it.
  gsap.ticker.lagSmoothing(0);
  ScrollTrigger.config({ ignoreMobileResize: true });
  // Development only: lets automated QA tick GSAP when the page has no
  // animation frames (a hidden preview). Never present in production builds.
  if (process.env.NODE_ENV === "development") {
    (window as unknown as { __anveliGsap?: object }).__anveliGsap = { gsap, ScrollTrigger };
  }
  registered = true;
}

register();

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin, CustomEase, useGSAP };
