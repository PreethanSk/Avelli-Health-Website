"use client";

/**
 * Part 7, cell 1: an example marker over about four years against the
 * person's own usual range. The latest value is still inside the lab's range
 * and outside theirs, so it is marked in amber (the data-state colour).
 *
 * Source: Bklit UI "Line chart" (Use; https://ui.bklit.com, registry
 * https://ui.bklit.com/r/line-chart.json, repo github.com/bklit/bklit-ui,
 * MIT). Bklit renders with @visx/shape + @visx/curve, which we don't ship, so
 * its look is reimplemented here in plain SVG. What we took: the natural
 * curve (d3 curveNatural, see chart-utils), the 2.5px round-capped series
 * stroke with a faded leading edge (Bklit `fadeEdges`), a left-to-right reveal
 * on enter, the terminal marker at the last point, horizontal grid lines,
 * muted axis labels, and nearest-point pointer tracking with a highlight and
 * tooltip. What we changed: our tokens (harbor line, a harbor 12% "usual
 * range" band, amber-paper for the out-of-range point, slate mono axes), a
 * Motion pathLength draw (1200ms, ease.out) that runs once, no loading
 * states, no loops, and a ring highlight that is tangent to the point.
 */
import { motion, useInView } from "motion/react";
import { useId, useMemo, useRef } from "react";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { BASELINE_MARKER } from "@/lib/example-data";
import { DUR, DUR_S, EASE } from "@/lib/tokens";
import { HighlightRing, HighlightTooltip } from "./ChartHighlight";
import { monthYear, naturalPath, scaleLinear, ts } from "./chart-utils";
import { useElementSize } from "./useElementSize";
import { useHighlight } from "./highlight-context";

const M = { top: 20, right: 20, bottom: 30, left: 34 };
const Y_DOMAIN = [26, 58] as const;
const Y_TICKS = [30, 40, 50];
const POINT_R = 4.5;

export const baselinePointId = (i: number) => `vitd-${i}`;

export function BaselineChart({ className }: { className?: string }) {
  const [wrapRef, { width, height }] = useElementSize<HTMLDivElement>({ width: 640, height: 260 });
  const inView = useInView(wrapRef, { once: true, amount: 0.5 });
  const reduce = useReducedMotionSafe();
  const { activeId, setHover } = useHighlight();
  const gradId = `bl-fade-${useId().replace(/:/g, "")}`;
  const svgRef = useRef<SVGSVGElement>(null);

  const data = BASELINE_MARKER.points;
  const [lo, hi] = BASELINE_MARKER.usualRange;
  const labMin = BASELINE_MARKER.labRange[0];

  const geo = useMemo(() => {
    const t0 = ts(data[0].date);
    const t1 = ts(data[data.length - 1].date);
    const x = scaleLinear([t0, t1], [M.left, width - M.right]);
    const y = scaleLinear(Y_DOMAIN, [height - M.bottom, M.top]);
    const pts = data.map((d) => ({ x: x(ts(d.date)), y: y(d.value) }));
    const years = [2023, 2024, 2025, 2026].map((yr) => ({ yr, x: x(ts(`${yr}-01-01`)) }));
    return { x, y, pts, years, path: naturalPath(pts) };
  }, [data, width, height]);

  const last = data.length - 1;
  const lastPt = geo.pts[last];
  const activeIndex = data.findIndex((_, i) => baselinePointId(i) === activeId);
  const shown = reduce || inView;
  const after = reduce ? 0 : DUR_S.settle; // band + point fade in once the line is drawn

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const box = svgRef.current?.getBoundingClientRect();
    if (!box) return;
    const px = e.clientX - box.left;
    let best = 0;
    geo.pts.forEach((p, i) => {
      if (Math.abs(p.x - px) < Math.abs(geo.pts[best].x - px)) best = i;
    });
    const id = baselinePointId(best);
    if (id !== activeId) setHover(id);
  };

  return (
    <div ref={wrapRef} className={className} style={{ position: "relative" }}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="absolute inset-0 overflow-visible"
        role="img"
        aria-label={`Example chart: ${BASELINE_MARKER.name} over four years. Your usual range is ${lo} to ${hi} ${BASELINE_MARKER.unit}. The latest result, ${data[last].value}, is below it but still inside the lab's range, which starts at ${labMin}.`}
        onPointerMove={onPointerMove}
        onPointerLeave={() => setHover(null)}
      >
        <defs>
          {/* Bklit fadeEdges: the series fades in from the left edge */}
          <linearGradient id={gradId} gradientUnits="userSpaceOnUse" x1={M.left} x2={width - M.right} y1={0} y2={0}>
            <stop offset="0" stopColor="var(--color-harbor)" stopOpacity={0} />
            <stop offset="0.08" stopColor="var(--color-harbor)" stopOpacity={1} />
            <stop offset="1" stopColor="var(--color-harbor)" stopOpacity={1} />
          </linearGradient>
        </defs>

        {/* Grid and axes */}
        <g aria-hidden>
          {Y_TICKS.map((v) => (
            <g key={v}>
              <line
                x1={M.left}
                x2={width - M.right}
                y1={geo.y(v)}
                y2={geo.y(v)}
                className="stroke-hairline-paper"
                strokeWidth={1}
                strokeDasharray={v === labMin ? "3 4" : undefined}
              />
              <text
                x={M.left - 10}
                y={geo.y(v)}
                dy="0.32em"
                textAnchor="end"
                className="fill-slate font-mono text-[11px]"
              >
                {v}
              </text>
            </g>
          ))}
          {geo.years.map(({ yr, x }) => (
            <text key={yr} x={x} y={height - 8} textAnchor="middle" className="fill-slate font-mono text-[11px]">
              {yr}
            </text>
          ))}
        </g>

        {/* "Your usual range" band, fades in after the line */}
        <motion.g
          aria-hidden
          initial={false}
          animate={{ opacity: shown ? 1 : 0 }}
          transition={{ duration: DUR_S.ui * 2, delay: after, ease: EASE.out }}
        >
          <rect
            x={M.left}
            width={Math.max(0, width - M.left - M.right)}
            y={geo.y(hi)}
            height={geo.y(lo) - geo.y(hi)}
            className="fill-harbor"
            fillOpacity={0.12}
          />
          <text
            x={M.left + 10}
            y={geo.y(hi) + 16}
            className="fill-slate font-mono text-[10.5px] uppercase tracking-[0.12em]"
          >
            Your usual range
          </text>
          <text
            x={width - M.right}
            y={geo.y(labMin) - 8}
            textAnchor="end"
            className="fill-slate font-mono text-[10.5px] uppercase tracking-[0.12em]"
          >
            Lab range from {labMin}
          </text>
        </motion.g>

        {/* The series: drawn once, left to right */}
        <motion.path
          aria-hidden
          d={geo.path}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: shown ? 1 : 0 }}
          transition={{ duration: reduce ? 0 : DUR.settle / 1000, ease: EASE.out }}
        />

        {/* The latest point: outside your range, marked in amber */}
        <motion.g
          aria-hidden
          initial={false}
          animate={{ opacity: shown ? 1 : 0 }}
          transition={{ duration: DUR_S.ui * 2, delay: after, ease: EASE.out }}
        >
          <circle
            cx={lastPt.x}
            cy={lastPt.y}
            r={POINT_R}
            className="fill-amber-paper stroke-paper-2"
            strokeWidth={2}
          />
          <text
            x={lastPt.x - 12}
            y={lastPt.y + 4}
            dy="0.32em"
            textAnchor="end"
            className="fill-ink-reverse font-mono text-[11px]"
          >
            {data[last].value}
          </text>
        </motion.g>

        {activeIndex >= 0 ? (
          <HighlightRing x={geo.pts[activeIndex].x} y={geo.pts[activeIndex].y} pointR={POINT_R} show />
        ) : null}
      </svg>

      {activeIndex >= 0 ? (
        <HighlightTooltip
          x={geo.pts[activeIndex].x}
          y={geo.pts[activeIndex].y}
          pointR={POINT_R}
          containerWidth={width}
          show
        >
          {data[activeIndex].value} {BASELINE_MARKER.unit} · {monthYear(data[activeIndex].date)}
        </HighlightTooltip>
      ) : null}

      {/* The same data for screen readers */}
      <table className="sr-only-soft">
        <caption>Example: {BASELINE_MARKER.name} results</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Value ({BASELINE_MARKER.unit})</th>
            <th scope="col">Source</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.date}>
              <td>{monthYear(d.date)}</td>
              <td>{d.value}</td>
              <td>{d.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
