"use client";

/**
 * One bento cell: paper-2, 20px radius, 32px padding, entering once with
 * Motion whileInView (30% visible) from opacity 0 and y 24 on spring.ui,
 * staggered by stagger.items. Reduced motion: shown at once.
 *
 * Layout reference: React Bits "Magic Bento" (reference only;
 * https://reactbits.dev, github.com/DavidHDev/react-bits, MIT + Commons
 * Clause). What we took: a cell as a flex column with its header on top and
 * its content filling the rest, 20px radius, overflow hidden, and an
 * asymmetric span grid. What we left out: the glow, spotlight, particles,
 * tilt and border glow.
 */
import { motion } from "motion/react";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { ExampleTag } from "@/components/ui/ExampleTag";
import { cn } from "@/lib/cn";
import { SPRING, STAGGER } from "@/lib/tokens";

type Props = {
  index: number;
  title: string;
  /** Show the "Example" label (every sample value carries one). */
  example?: boolean;
  tinted?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function BentoCell({ index, title, example = false, tinted = false, className, children }: Props) {
  const reduce = useReducedMotionSafe();
  return (
    <motion.article
      className={cn(
        "relative flex min-w-0 flex-col overflow-hidden rounded-card p-6 sm:p-8",
        tinted ? "bg-[color-mix(in_oklab,var(--color-harbor)_6%,var(--color-paper-2))]" : "bg-paper-2",
        className,
      )}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={reduce ? { duration: 0 } : { ...SPRING.ui, delay: index * STAGGER.items }}
    >
      <header className="mb-5 flex items-start justify-between gap-4">
        <h3 className="text-[17px] leading-snug font-medium text-ink-reverse">{title}</h3>
        {example ? <ExampleTag ground="paper" className="shrink-0" /> : null}
      </header>
      {children}
    </motion.article>
  );
}
