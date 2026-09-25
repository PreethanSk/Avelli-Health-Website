/**
 * Small, dependency-free chart helpers for the coded product previews.
 *
 * `naturalPath` is a port of d3-shape's `curveNatural` (ISC licence,
 * https://github.com/d3/d3-shape/blob/main/src/curve/natural.js), the curve
 * Bklit UI's line chart uses by default through @visx/curve. We don't ship
 * visx or d3, so the few lines that matter live here.
 */
export type Pt = { x: number; y: number };

function controlPoints(v: number[]): [number[], number[]] {
  const n = v.length - 1;
  const a = new Array<number>(n);
  const b = new Array<number>(n);
  const r = new Array<number>(n);
  a[0] = 0;
  b[0] = 2;
  r[0] = v[0] + 2 * v[1];
  for (let i = 1; i < n - 1; ++i) {
    a[i] = 1;
    b[i] = 4;
    r[i] = 4 * v[i] + 2 * v[i + 1];
  }
  a[n - 1] = 2;
  b[n - 1] = 7;
  r[n - 1] = 8 * v[n - 1] + v[n];
  for (let i = 1; i < n; ++i) {
    const m = a[i] / b[i - 1];
    b[i] -= m;
    r[i] -= m * r[i - 1];
  }
  a[n - 1] = r[n - 1] / b[n - 1];
  for (let i = n - 2; i >= 0; --i) a[i] = (r[i] - a[i + 1]) / b[i];
  b[n - 1] = (v[n] + a[n - 1]) / 2;
  for (let i = 0; i < n - 1; ++i) b[i] = 2 * v[i + 1] - a[i + 1];
  return [a, b];
}

/** A natural cubic spline through the points (d3 curveNatural). */
export function naturalPath(pts: Pt[]): string {
  const f = (n: number) => Math.round(n * 100) / 100;
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M${f(pts[0].x)} ${f(pts[0].y)}`;
  if (pts.length === 2) return `M${f(pts[0].x)} ${f(pts[0].y)}L${f(pts[1].x)} ${f(pts[1].y)}`;
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const [ax, bx] = controlPoints(xs);
  const [ay, by] = controlPoints(ys);
  let d = `M${f(xs[0])} ${f(ys[0])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    d += `C${f(ax[i])} ${f(ay[i])} ${f(bx[i])} ${f(by[i])} ${f(xs[i + 1])} ${f(ys[i + 1])}`;
  }
  return d;
}

/** Linear scale. */
export function scaleLinear([d0, d1]: readonly [number, number], [r0, r1]: readonly [number, number]) {
  return (v: number) => r0 + ((v - d0) / (d1 - d0 || 1)) * (r1 - r0);
}

/** Parse "YYYY-MM-DD" as a UTC timestamp (same on server and client). */
export const ts = (iso: string) => Date.parse(`${iso}T00:00:00Z`);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "2024-04-09" -> "Apr 2024" (locale-free, so SSR and client agree). */
export function monthYear(iso: string) {
  const [y, m] = iso.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
}
