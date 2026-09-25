"use client";

/**
 * Part 7, cell 2: "Sourced, always". An observation traced to the three
 * reports it came from. The three LDL results sit on a small chart of their
 * own (the baseline chart in cell 1 is a different marker, so pointing the
 * chips at it would be dishonest). Hovering or focusing a source chip
 * highlights its point through the shared highlight context: a ring tangent
 * to the point and a tooltip. A click or tap pins the highlight (touch
 * screens have no hover). Chips are real buttons.
 *
 * Chart styling follows BaselineChart (Bklit UI line chart look, MIT).
 */
import { FileTextIcon } from "@phosphor-icons/react";
import { motion, useInView } from "motion/react";
import { useMemo } from "react";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { cn } from "@/lib/cn";
import { SOURCED_OBSERVATION } from "@/lib/example-data";
import { DUR_S, EASE } from "@/lib/tokens";
import { HighlightRing, HighlightTooltip } from "./ChartHighlight";
import { scaleLinear } from "./chart-utils";
import { useElementSize } from "./useElementSize";
import { useHighlight } from "./highlight-context";

const POINT_R = 4.5;
const M = { top: 34, right: 24, bottom: 14, left: 24 };

export function SourceChips() {
  const { sources, unit, marker } = SOURCED_OBSERVATION;
  const { activeId, pinnedId, setHover, togglePin } = useHighlight();

  return (
    <div className="flex flex-1 flex-col">
      <LdlMiniChart />
      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Sources">
        {sources.map((s) => {
          const on = activeId === s.id;
          return (
            <li key={s.id}>
              <button
                type="button"
                aria-pressed={pinnedId === s.id}
                onPointerEnter={() => setHover(s.id)}
                onPointerLeave={() => setHover(null)}
                onFocus={() => setHover(s.id)}
                onBlur={() => setHover(null)}
                onClick={() => togglePin(s.id)}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-full border bg-paper py-2 pr-4 pl-3 text-[14px] leading-none text-ink-reverse",
                  "transition-[border-color,background-color] duration-150 ease-[var(--ease-out)]",
                  on ? "border-harbor" : "border-hairline-paper hover:border-slate",
                )}
              >
                <FileTextIcon aria-hidden weight="regular" size={16} className="shrink-0 text-slate" />
                <span>{s.lab}</span>
                <span className="font-mono text-[12px] text-slate">{s.date}</span>
                <span className="sr-only-soft">
                  , {marker} {s.value} {unit}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function LdlMiniChart() {
  const { sources, unit, marker } = SOURCED_OBSERVATION;
  const { activeId } = useHighlight();
  const [ref, { width, height }] = useElementSize<HTMLDivElement>({ width: 460, height: 150 });
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotionSafe();
  const shown = reduce || inView;

  const pts = useMemo(() => {
    const values = sources.map((s) => s.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const pad = (max - min) * 0.35;
    const x = scaleLinear([0, sources.length - 1], [M.left, width - M.right]);
    const y = scaleLinear([min - pad, max + pad], [height - M.bottom, M.top]);
    return sources.map((s, i) => ({ x: x(i), y: y(s.value) }));
  }, [sources, width, height]);

  const d = pts.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join("");
  const active = sources.findIndex((s) => s.id === activeId);

  return (
    <div ref={ref} className="relative min-h-[150px] flex-1">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="absolute inset-0 overflow-visible"
        role="img"
        aria-label={`Example chart: ${marker} across three reports, ${sources.map((s) => `${s.value} in ${s.date}`).join(", ")} ${unit}.`}
      >
        <line
          x1={0}
          x2={width}
          y1={height - 0.5}
          y2={height - 0.5}
          className="stroke-hairline-paper"
          strokeWidth={1}
          aria-hidden
        />
        <motion.path
          aria-hidden
          d={d}
          fill="none"
          className="stroke-harbor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: shown ? 1 : 0 }}
          transition={{ duration: reduce ? 0 : DUR_S.reveal, ease: EASE.out }}
        />
        {pts.map((p, i) => (
          <motion.g
            key={sources[i].id}
            aria-hidden
            initial={false}
            animate={{ opacity: shown ? 1 : 0 }}
            transition={{ duration: DUR_S.ui, delay: reduce ? 0 : 0.25 + i * 0.2, ease: EASE.out }}
          >
            <circle cx={p.x} cy={p.y} r={POINT_R} className="fill-harbor stroke-paper-2" strokeWidth={2} />
            <text
              x={p.x}
              y={p.y - 16}
              textAnchor={i === 0 ? "start" : i === pts.length - 1 ? "end" : "middle"}
              className={cn("font-mono text-[12px]", active === i ? "fill-transparent" : "fill-ink-reverse")}
            >
              {sources[i].value}
            </text>
          </motion.g>
        ))}
        {active >= 0 ? <HighlightRing x={pts[active].x} y={pts[active].y} pointR={POINT_R} show /> : null}
      </svg>
      {active >= 0 ? (
        <HighlightTooltip x={pts[active].x} y={pts[active].y} pointR={POINT_R} containerWidth={width} show>
          {sources[active].value} {unit} · {sources[active].lab}
        </HighlightTooltip>
      ) : null}
    </div>
  );
}
