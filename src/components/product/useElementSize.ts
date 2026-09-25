"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The size of an element, from a ResizeObserver. Starts at `fallback` so the
 * server renders a sensible chart; the parent reserves the space, so there is
 * no layout shift when the real size arrives.
 */
export function useElementSize<T extends HTMLElement>(fallback: { width: number; height: number }) {
  const ref = useRef<T>(null);
  const [size, setSize] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((s) =>
        Math.abs(s.width - width) < 0.5 && Math.abs(s.height - height) < 0.5
          ? s
          : { width: Math.max(1, width), height: Math.max(1, height) },
      );
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}
