"use client";

/**
 * The pill button. Height 44px (touch target), full pill radius.
 * On ink: ice fill, ink text. On paper: ink-reverse fill, paper text.
 * `quiet` is the outline variant (hairline border, ground-coloured text).
 * Press feedback: spring.press to scale 0.97.
 */
import Link from "next/link";
import { motion } from "motion/react";
import { forwardRef } from "react";
import { cn } from "@/lib/cn";
import { SPRING, type Ground } from "@/lib/tokens";

type Common = {
  ground?: Ground;
  quiet?: boolean;
  size?: "md" | "lg";
  className?: string;
  children: React.ReactNode;
};

type AsButton = Common & Omit<React.ComponentPropsWithoutRef<"button">, keyof Common | "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"> & { href?: undefined };
type AsLink = Common & { href: string; onClick?: React.MouseEventHandler<HTMLAnchorElement>; "aria-label"?: string };

export function pillClasses({ ground = "ink", quiet = false, size = "md" }: Pick<Common, "ground" | "quiet" | "size">) {
  return cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium select-none",
    "transition-[background-color,color,border-color,opacity] duration-150 ease-[var(--ease-out)]",
    "disabled:opacity-60",
    size === "md" ? "h-11 px-5 text-[15px]" : "h-12 px-6 text-[16px]",
    ground === "ink"
      ? quiet
        ? "border border-hairline-ink text-ice hover:border-ice-60"
        : "bg-ice text-ink hover:bg-[#d7dfe2]"
      : quiet
        ? "border border-hairline-paper text-ink-reverse hover:border-slate"
        : "bg-ink-reverse text-paper hover:bg-[#1c2b35]",
    ground === "ink" ? "on-ink" : "on-paper",
  );
}

const MotionLink = motion.create(Link);

export const PillButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, AsButton | AsLink>(function PillButton(props, ref) {
  const { ground, quiet, size, className, children } = props;
  const cls = cn(pillClasses({ ground, quiet, size }), className);
  if (props.href !== undefined) {
    const { href, onClick } = props as AsLink;
    return (
      <MotionLink
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        aria-label={(props as AsLink)["aria-label"]}
        className={cls}
        whileTap={{ scale: 0.97 }}
        transition={SPRING.press}
      >
        {children}
      </MotionLink>
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ground: _g, quiet: _q, size: _s, className: _c, children: _ch, href: _h, ...rest } = props as AsButton;
  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      {...rest}
      className={cls}
      whileTap={{ scale: 0.97 }}
      transition={SPRING.press}
    >
      {children}
    </motion.button>
  );
});
