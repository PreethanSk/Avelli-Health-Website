"use client";

/**
 * Part 7, cell 4: "Organised for you". A plain "Lab reports / 2026" folder
 * steps back (to 40%) while the same report files itself along a path:
 * Endocrine, Thyroid, Monitoring, Sept 2026, each step 150ms after the last
 * (stagger.items x 3). Reduced motion: the finished path, folder at 40%.
 */
import { ArrowElbowDownRightIcon, FolderIcon } from "@phosphor-icons/react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { ORGANISED_PATH, PLAIN_FOLDER } from "@/lib/example-data";
import { DUR_S, EASE, STAGGER } from "@/lib/tokens";

const STEP = STAGGER.items * 3; // 150ms

export function OrganisedPath() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotionSafe();
  const done = reduce || inView;
  const t = (delay: number) => ({ duration: reduce ? 0 : DUR_S.ui * 1.6, delay: reduce ? 0 : delay, ease: EASE.out });

  return (
    <div ref={ref} className="flex flex-1 flex-col justify-between gap-6">
      <motion.p
        className="flex items-center gap-2 font-mono text-[12px] text-slate"
        initial={false}
        animate={{ opacity: done ? 0.4 : 1 }}
        transition={t(0.2 + STEP * (ORGANISED_PATH.length - 1))}
      >
        <FolderIcon aria-hidden size={16} weight="regular" className="shrink-0" />
        <span>
          <span className="sr-only-soft">Before: </span>
          {PLAIN_FOLDER}
        </span>
      </motion.p>

      <ol aria-label="Filed under" className="flex flex-col gap-2.5">
        {ORGANISED_PATH.map((step, i) => (
          <motion.li
            key={step}
            className="flex items-center gap-1.5 text-[15px] leading-tight text-ink-reverse"
            style={{ paddingLeft: i === 0 ? 0 : (i - 1) * 16 }}
            initial={false}
            animate={{ opacity: done ? 1 : 0, x: done ? 0 : -6 }}
            transition={t(0.2 + STEP * i)}
          >
            {i > 0 ? (
              <ArrowElbowDownRightIcon aria-hidden size={14} weight="regular" className="shrink-0 text-harbor" />
            ) : null}
            <span className={i === ORGANISED_PATH.length - 1 ? "font-mono text-[13px] text-harbor-deep" : undefined}>
              {step}
            </span>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
