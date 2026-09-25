"use client";

/**
 * CardSwipe: a controlled, drag-to-snap carousel on Motion.
 *
 * Source: Skiper UI, skiper48 "Card swipe carousel" (Carousel_002),
 *   https://skiper-ui.com/v1/skiper48 (registry: https://skiper-ui.com/r/skiper48.json).
 *   Licence: free for personal and commercial use, attribution to Skiper UI required
 *   on the free tier (this comment is the attribution). Author @gurvinder-singh02.
 *   Taken: the card-swipe behaviour (grab cursor, no loop, optional prev/next and
 *   pagination, autoplay off), and the "cards" feel of neighbours receding.
 * Fallback source whose mechanics this is built on: Watermelon UI `card-swipe`,
 *   https://ui.watermelon.sh/r/card-swipe.json (free registry). Taken: the Motion
 *   drag model (one x motion value, drag="x" with constraints, a 50px drag buffer and
 *   a 500px/s velocity threshold to change slide, per-card transforms derived from x
 *   with useTransform) and the clickable pagination.
 *
 * Changed for anveli: skiper48 runs on Swiper (not a dependency here), so the engine
 * is Motion only. Snap uses SPRING.ui. The neighbour effect is a quiet scale/opacity
 * (no rotateY), 44px Phosphor prev/next buttons, pagination dots are real buttons
 * named "Screen N of M", arrow keys work when the viewport has focus, and there is
 * NO autoplay. Reduced motion: no drag and no sliding; a horizontal swipe (pan)
 * still changes the slide, which swaps in place.
 */
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
  type PanInfo,
} from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { SPRING, type Ground } from "@/lib/tokens";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";

const DRAG_BUFFER = 50;
const VELOCITY_THRESHOLD = 500;
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

type CardSwipeProps = {
  slides: ReactNode[];
  index: number;
  onIndexChange: (i: number) => void;
  /** Accessible name of the carousel viewport. */
  label: string;
  /** Accessible name of each slide, e.g. "Screen 1 of 3: Today". */
  slideLabel: (i: number) => string;
  className?: string;
  /** Id of the viewport (for aria-controls on external controls). */
  id?: string;
};

export function CardSwipe({ slides, index, onIndexChange, label, slideLabel, className, id }: CardSwipeProps) {
  const reduce = useReducedMotionSafe();
  const viewport = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const x = useMotionValue(0);
  const count = slides.length;
  const clamp = (i: number) => Math.max(0, Math.min(count - 1, i));

  // Measure the slide width (the viewport is exactly one slide wide).
  useIsoLayoutEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Snap to the active slide. Width changes (resize) jump; index changes spring.
  const lastWidth = useRef(0);
  useEffect(() => {
    if (!width) return;
    const target = -index * width;
    if (reduce || lastWidth.current !== width) {
      lastWidth.current = width;
      x.set(target);
      return;
    }
    const controls = animate(x, target, SPRING.ui);
    return () => controls.stop();
  }, [index, width, reduce, x]);

  const settle = (offset: number, velocity: number) => {
    let next = index;
    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) next = clamp(index + 1);
    else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) next = clamp(index - 1);
    if (next !== index) onIndexChange(next);
    else animate(x, -index * width, SPRING.ui);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      onIndexChange(clamp(index + 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      onIndexChange(clamp(index - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      onIndexChange(0);
    } else if (e.key === "End") {
      e.preventDefault();
      onIndexChange(count - 1);
    }
  };

  return (
    <div
      ref={viewport}
      id={id}
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={cn("relative overflow-hidden focus-visible:outline-offset-[-4px]", className)}
    >
      <motion.div
        className={cn("flex h-full", !reduce && "cursor-grab active:cursor-grabbing")}
        style={{ x, touchAction: "pan-y" }}
        drag={reduce ? false : "x"}
        dragConstraints={{ left: -(count - 1) * width, right: 0 }}
        dragElastic={0.12}
        dragMomentum={false}
        onDragEnd={(_: unknown, info: PanInfo) => settle(info.offset.x, info.velocity.x)}
        onPanEnd={
          reduce
            ? (_: unknown, info: PanInfo) => {
                if (info.offset.x < -DRAG_BUFFER) onIndexChange(clamp(index + 1));
                else if (info.offset.x > DRAG_BUFFER) onIndexChange(clamp(index - 1));
              }
            : undefined
        }
      >
        {slides.map((slide, i) => (
          <Slide key={i} i={i} x={x} width={width} active={i === index} reduce={reduce} label={slideLabel(i)}>
            {slide}
          </Slide>
        ))}
      </motion.div>
    </div>
  );
}

function Slide({
  i,
  x,
  width,
  active,
  reduce,
  label,
  children,
}: {
  i: number;
  x: MotionValue<number>;
  width: number;
  active: boolean;
  reduce: boolean;
  label: string;
  children: ReactNode;
}) {
  // Neighbours recede a little as they leave (skiper48's card feel, quieter).
  const w = width || 1;
  const range = [-(i + 1) * w, -i * w, -(i - 1) * w];
  const scale = useTransform(x, range, [0.94, 1, 0.94]);
  const opacity = useTransform(x, range, [0.5, 1, 0.5]);
  return (
    <motion.div
      role="group"
      aria-roledescription="slide"
      aria-label={label}
      aria-hidden={!active}
      inert={!active}
      className="h-full w-full shrink-0 select-none"
      style={reduce ? undefined : { scale, opacity }}
    >
      {children}
    </motion.div>
  );
}

/** Previous / next buttons (44px) and pagination dots, for a CardSwipe. */
export function CardSwipeControls({
  count,
  index,
  onIndexChange,
  controls,
  dotLabel,
  ground = "paper",
  className,
}: {
  count: number;
  index: number;
  onIndexChange: (i: number) => void;
  /** Id of the CardSwipe viewport. */
  controls: string;
  dotLabel: (i: number) => string;
  ground?: Ground;
  className?: string;
}) {
  const reduce = useReducedMotionSafe();
  const onPaper = ground === "paper";
  const btn = cn(
    "grid size-11 place-items-center rounded-full border transition-[border-color,opacity] duration-150 ease-[var(--ease-out)]",
    "aria-disabled:cursor-default aria-disabled:opacity-35",
    onPaper
      ? "border-hairline-paper text-ink-reverse hover:aria-[disabled=false]:border-slate"
      : "border-hairline-ink text-ice hover:aria-[disabled=false]:border-ice-60",
  );
  return (
    <div className={cn("flex items-center gap-1", onPaper ? "on-paper" : "on-ink", className)}>
      <button
        type="button"
        className={btn}
        aria-controls={controls}
        aria-label="Previous screen"
        aria-disabled={index === 0}
        onClick={() => onIndexChange(Math.max(0, index - 1))}
      >
        <CaretLeftIcon size={18} weight="regular" aria-hidden />
      </button>
      <div className="flex items-center">
        {Array.from({ length: count }, (_, i) => {
          const current = i === index;
          return (
            <button
              key={i}
              type="button"
              aria-controls={controls}
              aria-label={dotLabel(i)}
              aria-current={current ? "true" : undefined}
              onClick={() => onIndexChange(i)}
              className="group relative grid h-11 w-11 place-items-center"
            >
              <span
                className={cn(
                  "block size-2 rounded-full transition-opacity duration-150",
                  onPaper ? "bg-hairline-paper group-hover:bg-slate" : "bg-hairline-ink group-hover:bg-ice-60",
                )}
              />
              {current && (
                <motion.span
                  layoutId={`${controls}-dot`}
                  transition={reduce ? { duration: 0 } : SPRING.ui}
                  className={cn(
                    "absolute inset-0 m-auto size-2 rounded-full",
                    onPaper ? "bg-harbor" : "bg-glacier",
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className={btn}
        aria-controls={controls}
        aria-label="Next screen"
        aria-disabled={index === count - 1}
        onClick={() => onIndexChange(Math.min(count - 1, index + 1))}
      >
        <CaretRightIcon size={18} weight="regular" aria-hidden />
      </button>
    </div>
  );
}
