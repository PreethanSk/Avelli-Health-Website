"use client";

/**
 * The small living mark on the "New report connected" row (phone screen 1).
 * The first time the row is actually on screen (in the viewport and on the
 * visible slide: the carousel clips its hidden slides, so an observer on the
 * mark itself answers both), it plays accrue once, then the added pulse, then
 * settles still. These are the same states the app uses when a record lands.
 * Reduced motion: LivingMark renders the static symbol and ignores play().
 */
import { useEffect, useRef } from "react";
import { LivingMark, type LivingMarkHandle } from "@/components/brand/LivingMark";

export function ReportMark({ size = 24 }: { size?: number }) {
  const mark = useRef<LivingMarkHandle>(null);
  const box = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        mark.current?.play([{ mode: "sync", loops: 1 }, { mode: "added" }, { mode: "breathe", loops: 0 }]);
      },
      { threshold: 1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={box} className="block" style={{ width: size, height: size }}>
      <LivingMark ref={mark} state="static" size={size} ground="ink" optical={false} strokeWidth={5.5} />
    </span>
  );
}
