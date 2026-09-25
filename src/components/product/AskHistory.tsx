"use client";

/**
 * Part 7, cell 3: "Ask your history". When the cell is half in view the
 * search field types the question once (35ms a character), then the answer
 * and its source fade in (dur.ui). "Replay" runs it again. Reduced motion:
 * the question, answer and source are simply there.
 */
import { ArrowCounterClockwiseIcon, FileTextIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { ASK_HISTORY } from "@/lib/example-data";
import { DUR_S, EASE } from "@/lib/tokens";
import { Typewriter } from "./Typewriter";

export function AskHistory() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotionSafe();
  const [run, setRun] = useState(0);
  const [answered, setAnswered] = useState(false);
  const showAnswer = reduce || answered;

  return (
    <div ref={ref} className="flex flex-1 flex-col">
      <div
        role="search"
        aria-label="Example question"
        className="flex h-12 items-center gap-3 rounded-full border border-hairline-paper bg-paper px-4 text-[15px] text-ink-reverse"
      >
        <MagnifyingGlassIcon aria-hidden size={18} weight="regular" className="shrink-0 text-slate" />
        <Typewriter
          key={run}
          text={ASK_HISTORY.question}
          speed={35}
          play={inView}
          instant={reduce}
          onDone={() => setAnswered(true)}
          className="block min-w-0 truncate whitespace-nowrap"
        />
      </div>

      <motion.div
        className="mt-5"
        initial={false}
        animate={{ opacity: showAnswer ? 1 : 0, y: showAnswer ? 0 : 6 }}
        transition={{ duration: reduce ? 0 : DUR_S.ui, ease: EASE.out }}
        aria-live="polite"
      >
        {showAnswer ? (
          <>
            <p className="text-[16px] leading-[1.5] text-ink-reverse">{ASK_HISTORY.answer}</p>
            <p className="mt-3 inline-flex max-w-full items-center gap-2 rounded-full border border-hairline-paper bg-paper py-1.5 pr-3 pl-2.5 font-mono text-[11.5px] leading-tight text-slate">
              <FileTextIcon aria-hidden size={14} weight="regular" className="shrink-0" />
              <span className="sr-only-soft">Source: </span>
              <span className="min-w-0">{ASK_HISTORY.source}</span>
            </p>
          </>
        ) : (
          // Reserve the answer's space so the cell never jumps.
          <div aria-hidden className="h-[88px]" />
        )}
      </motion.div>

      <div className="mt-auto flex justify-end pt-3">
        <button
          type="button"
          onClick={() => {
            setAnswered(false);
            setRun((r) => r + 1);
          }}
          disabled={reduce}
          className="-mr-2 -mb-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-[14px] text-harbor-deep transition-opacity duration-150 hover:opacity-80 disabled:hidden"
        >
          <ArrowCounterClockwiseIcon aria-hidden size={14} weight="regular" />
          Replay
        </button>
      </div>
    </div>
  );
}
