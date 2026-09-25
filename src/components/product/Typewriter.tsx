"use client";

/**
 * Types a string once, a character at a time.
 *
 * Source: Fancy Components "Typewriter" (Use;
 * https://www.fancycomponents.dev/docs/components/text/typewriter, registry
 * https://www.fancycomponents.dev/r/typewriter.json, repo
 * github.com/danielpetho/fancy, MIT). What we took: the setTimeout-driven
 * character loop with an initial delay, `speed` per character, the `as`
 * prop, a Motion cursor and `hideCursorOnType`-style cursor handling.
 * What we changed: one string, no deleting and no looping (it types once,
 * then calls `onDone`); `play` lets the parent start it in view (the parent
 * remounts it with a new `key` to replay); the cursor is a thin harbor bar
 * that blinks only while typing, so nothing keeps moving after it finishes;
 * the typed text is aria-hidden and the full string is given to screen
 * readers at once.
 * Fallback reference: Kokonut UI "type-writer" (MIT, @dorianbaffier,
 * https://kokonutui.com/r/type-writer.json). We borrowed its ref pattern
 * (callbacks held in a ref) so a new `onDone` never restarts the loop.
 */
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Props = {
  text: string;
  as?: "span" | "p" | "div";
  /** ms per character. */
  speed?: number;
  initialDelay?: number;
  /** Start typing when true. */
  play: boolean;
  /** Show the finished text immediately (reduced motion). */
  instant?: boolean;
  onDone?: () => void;
  className?: string;
};

export function Typewriter({
  text,
  as: Tag = "span",
  speed = 35,
  initialDelay = 200,
  play,
  instant = false,
  onDone,
  className,
}: Props) {
  const [count, setCount] = useState(0);
  const doneRef = useRef(onDone);
  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (!play || instant) return;
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      i += 1;
      setCount(i);
      if (i < text.length) timer = setTimeout(tick, speed);
      else doneRef.current?.();
    };
    timer = setTimeout(tick, initialDelay);
    return () => clearTimeout(timer);
  }, [play, instant, text, speed, initialDelay]);

  const shown = instant ? text.length : count;
  const typing = play && !instant && shown < text.length;

  // A narrow union keeps JSX props typed (R3F widens IntrinsicElements).
  const T = Tag as "span";
  return (
    <T className={cn("whitespace-pre-wrap", className)}>
      <span className="sr-only-soft">{text}</span>
      <span aria-hidden>{text.slice(0, shown)}</span>
      {typing ? (
        <motion.span
          aria-hidden
          className="ml-px inline-block h-[1.1em] w-[1.5px] translate-y-[0.18em] bg-harbor"
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
        />
      ) : null}
    </T>
  );
}
