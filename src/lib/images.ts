/**
 * Every photo on the site, in one place: source URL, intrinsic dimensions
 * (so the markup reserves space and CLS stays at 0) and alt text.
 *
 * Until the real photography exists (shot list: docs/website/03-site-structure.md
 * §7), an entry points at a seeded picsum placeholder at the right aspect
 * ratio (`placeholder: true`). Image A is a licensed Unsplash photo. To ship a real photo, replace `src` (and the dimensions if they
 * differ) on one line; nothing else in the components changes.
 *
 * Alt text describes the intended shot, not the placeholder.
 */

export type PhotoSource = {
  src: string;
  width: number;
  height: number;
  /** Optional responsive candidates ("url 1200w, ..."). */
  srcSet?: string;
  sizes?: string;
};

export type Photo = {
  /** Shot-list id from 03-site-structure.md §7. */
  id: "A" | "B" | "C" | "D" | "E";
  /** Desktop / default crop. */
  desktop: PhotoSource;
  /** Optional art-directed crop for < 768px. */
  mobile?: PhotoSource;
  alt: string;
  /** Photographer credit and licence, when the photo is not our own. */
  credit?: string;
  /** True while the entry still points at a placeholder. */
  placeholder: boolean;
};

/**
 * An imgix-served Unsplash photo cropped to an aspect ratio around a focal
 * point, with a width-based srcset.
 */
function unsplash(
  base: string,
  { w, h, fx, fy, widths }: { w: number; h: number; fx: number; fy: number; widths: number[] },
): PhotoSource {
  const url = (width: number) => {
    const height = Math.round((width * h) / w);
    return `${base}?w=${width}&h=${height}&fit=crop&crop=focalpoint&fp-x=${fx}&fp-y=${fy}&auto=format&q=80`;
  };
  return {
    src: url(w),
    width: w,
    height: h,
    srcSet: widths.map((width) => `${url(width)} ${width}w`).join(", "),
    sizes: "100vw",
  };
}

const EVERYDAY_BASE = "https://images.unsplash.com/photo-1723406227992-e18cec6c7e90";

const picsum = (id: string, w: number, h: number): PhotoSource => ({
  src: `https://picsum.photos/seed/anveli-${id}/${w}/${h}`,
  width: w,
  height: h,
});

export const IMAGES = {
  /** Image A, part 5 (Everyday life): full-bleed, 16:9 desktop, 4:5 mobile crop. */
  everyday: {
    id: "A",
    desktop: unsplash(EVERYDAY_BASE, { w: 2400, h: 1350, fx: 0.5, fy: 0.55, widths: [1200, 1800, 2400] }),
    mobile: unsplash(EVERYDAY_BASE, { w: 1080, h: 1350, fx: 0.5, fy: 0.6, widths: [720, 1080] }),
    alt: "A woman holds a tree pose on a misty shoreline at dawn, pale sky and water around her.",
    // Photo: Jaspinder Singh, Rishikesh (https://unsplash.com/photos/9HllvSZfcpQ). Unsplash License.
    credit: "Jaspinder Singh on Unsplash (Unsplash License)",
    placeholder: false,
  },
  /** Image B, part 9 backdrop and OG. */
  kitchen: {
    id: "B",
    desktop: picsum("b", 2400, 1600),
    alt: "A father and his young daughter at a bright kitchen table in the morning, his phone face down beside him.",
    placeholder: true,
  },
  /** Image C, /privacy-trust. */
  hands: {
    id: "C",
    desktop: picsum("c", 1600, 2000),
    alt: "Close view of hands holding a phone against a linen shirt in a quiet, bright room.",
    placeholder: true,
  },
  /** Image D, part 10 (optional). */
  family: {
    id: "D",
    desktop: picsum("d", 2000, 1500),
    alt: "A woman in her forties sitting beside her elderly father at home, sorting papers together in afternoon light.",
    placeholder: true,
  },
  /** Image E, part 8 (optional). */
  consultation: {
    id: "E",
    desktop: picsum("e", 2000, 1500),
    alt: "A calm consultation in a bright clinic, seen over the patient's shoulder, the doctor softly out of focus.",
    placeholder: true,
  },
} as const satisfies Record<string, Photo>;
