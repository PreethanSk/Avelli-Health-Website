"use client";

/**
 * Part 5, the photo moment: a full-bleed frame whose photo settles from
 * scale 1.08 to 1 as it enters (scrubbed), and a headline that fades in once.
 *
 * Reference: Skiper UI skiper34 "Scroll images reveal 003"
 * (https://skiper-ui.com/v1/skiper34, free tier, "free to use and modify in
 * personal and commercial projects, attribution to Skiper UI required").
 * What we took: a framed image, `overflow: hidden`, whose inner image carries
 * the scroll-linked transform while the frame stays put, and the start/end
 * windows tied to the frame entering the viewport. What we changed: GSAP
 * ScrollTrigger instead of framer-motion `useScroll` (GSAP owns scroll here),
 * no rotation, no sticky stacking, one image, a scale-down only.
 *
 * Reduced motion: scale 1, no fades (nothing is created).
 */
import { useRef } from "react";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { cn } from "@/lib/cn";
import type { Photo } from "@/lib/images";
import { DUR_S, EASE, MQ } from "@/lib/tokens";

type Props = {
  photo: Photo;
  /** Put the headline on the image's sky (desktop only). Support and caption stay under the image. */
  headlineOnImage: boolean;
  headline: string;
  support: string;
  caption: React.ReactNode;
};

export function EverydayPhoto({ photo, headlineOnImage, headline, support, caption }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const frame = el.querySelector<HTMLElement>("[data-frame]");
      const img = el.querySelector<HTMLElement>("[data-photo]");
      if (!frame || !img) return;

      const mm = gsap.matchMedia();
      mm.add(MQ.motionOk, () => {
        // The photo settles as the frame travels from the bottom edge to the top.
        gsap.fromTo(
          img,
          { scale: 1.08 },
          {
            scale: 1,
            ease: EASE.scrub,
            scrollTrigger: { trigger: frame, start: "top bottom", end: "top top", scrub: 0.6 },
          },
        );

        // The copy fades in once. On the image it keys off the section
        // (spec: top 60%); under the image it keys off the copy itself so the
        // fade happens where the reader actually is.
        const blocks = gsap.utils.toArray<HTMLElement>("[data-copy]", el).filter((b) => b.offsetParent !== null);
        blocks.forEach((block) => {
          const onImage = block.dataset.copy === "on-image";
          gsap.from(block, {
            autoAlpha: 0,
            y: 16,
            duration: DUR_S.reveal,
            ease: EASE.gsapOut,
            scrollTrigger: onImage
              ? { trigger: el, start: "top 60%", once: true }
              : { trigger: block, start: "top 85%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [headlineOnImage] },
  );

  return (
    <div ref={root}>
      <div
        data-frame
        className="relative w-full overflow-hidden bg-paper-2 aspect-[4/5] md:aspect-auto md:h-[min(100vh,56.25vw)]"
      >
        <picture>
          {photo.mobile ? (
            <source
              media="(max-width: 767.98px)"
              srcSet={photo.mobile.srcSet ?? photo.mobile.src}
              sizes={photo.mobile.sizes}
              width={photo.mobile.width}
              height={photo.mobile.height}
            />
          ) : null}
          <img
            data-photo
            src={photo.desktop.src}
            srcSet={photo.desktop.srcSet}
            sizes={photo.desktop.sizes}
            width={photo.desktop.width}
            height={photo.desktop.height}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover will-change-transform"
          />
        </picture>

        {headlineOnImage ? (
          <div className="absolute inset-x-0 top-20 hidden md:block">
            <div className="container-site grid-site">
              <div data-copy="on-image" className="col-span-6">
                <Headline text={headline} />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="container-site">
        <div className="grid-site gap-y-10 pt-6">
          <p className="col-span-12 font-mono text-[12px] leading-[1.5] tracking-[0.04em] text-slate md:col-span-4 md:col-start-9 md:text-right">
            {caption}
          </p>
          <div
            data-copy="below"
            className="col-span-12 md:col-span-8 md:row-start-1 md:pt-4 lg:col-span-7"
          >
            {/* With the headline on the photo (desktop), only the support sits here. */}
            <Headline text={headline} className={cn("mb-6", headlineOnImage && "md:hidden")} />
            <p className="max-w-[44ch] text-lead text-slate">{support}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Headline({ text, className }: { text: string; className?: string }) {
  return <h2 className={cn("max-w-[17ch] text-h2 text-ink-reverse", className)}>{text}</h2>;
}
