/**
 * The broken arcs: a deterministic layout shared by the WebGL scene (one
 * InstancedMesh, attributes built from this) and the SVG fallback renders
 * (which project the same poses), so both show the same object.
 *
 * Each fragment belongs to one ring (innermost first) and one slot of its
 * circumference. The slots of a ring tile the whole circle (with a hair of
 * overlap), so a closed ring has no gaps before its final torus fades in.
 *
 * Angles: theta = 0 is the shared tangent point (the bottom); a point on a
 * ring of radius r is (r sin(theta), r - r cos(theta), 0), so every ring rests
 * on the origin. The ring is then tilted about the vertical axis.
 *
 * Motion reference: ThreeUI "Predictive Arc" (arcs that travel along curved
 * paths). Studied, nothing copied.
 */
import { FRAGMENT_SEED, OBJECT_CENTRE, RING_RADII, SCATTER_CURL, SCATTER_LENGTH } from "./config";

export type Vec3 = [number, number, number];

export type Fragment = {
  ring: 0 | 1 | 2;
  /** Start angle and angular length (radians, from the tangent point). */
  start: number;
  len: number;
  /** 0..0.3 of the ring's window: pieces near the tangent point land first. */
  delay: number;
  /** Midpoint of the scattered pose (R units, tangent point at origin). */
  scatter: Vec3;
  /** Scattered orientation: rotation about `axis` by `angle` (radians). */
  axis: Vec3;
  angle: number;
  /** Sideways bow of the flight path (so pieces arc in, not slide). */
  bow: Vec3;
  /** Random phases for drift and wobble. */
  phase: [number, number, number, number];
};

/** Small, fast, deterministic PRNG (mulberry32). */
function prng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TAU = Math.PI * 2;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function arcPoint(r: number, th: number): Vec3 {
  return [r * Math.sin(th), r - r * Math.cos(th), 0];
}

export function rotY(v: Vec3, a: number): Vec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c];
}

/** Rodrigues rotation of v about unit axis k by angle a. */
export function rotAxis(v: Vec3, k: Vec3, a: number): Vec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const d = k[0] * v[0] + k[1] * v[1] + k[2] * v[2];
  const cx = k[1] * v[2] - k[2] * v[1];
  const cy = k[2] * v[0] - k[0] * v[2];
  const cz = k[0] * v[1] - k[1] * v[0];
  return [
    v[0] * c + cx * s + k[0] * d * (1 - c),
    v[1] * c + cy * s + k[1] * d * (1 - c),
    v[2] * c + cz * s + k[2] * d * (1 - c),
  ];
}

function normalize(v: Vec3): Vec3 {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function randomUnit(rnd: () => number): Vec3 {
  const u = rnd() * 2 - 1;
  const t = rnd() * TAU;
  const s = Math.sqrt(1 - u * u);
  return [s * Math.cos(t), s * Math.sin(t), u];
}

/** Where loose fragments may float (R units): around the object, mostly in depth. */
const SCATTER_BOX = { x: [-1.95, 2.1], y: [-0.2, 1.98], z: [-1.5, 0.75] } as const;

/**
 * Build `total` fragments, split across the rings by circumference
 * (0.4625 : 0.725 : 1), so every piece is roughly the same length.
 */
export function makeFragments(total: number, tiltsDeg: readonly number[], seed = FRAGMENT_SEED): Fragment[] {
  const rnd = prng(seed);
  const sum = RING_RADII[0] + RING_RADII[1] + RING_RADII[2];
  const counts = RING_RADII.map((r) => Math.max(6, Math.round((total * r) / sum)));
  const out: Fragment[] = [];

  RING_RADII.forEach((r, i) => {
    const n = counts[i];
    const slot = TAU / n;
    const offset = rnd() * slot;
    const cuts = Array.from({ length: n }, (_, k) => offset + k * slot + (rnd() - 0.5) * 0.5 * slot);
    const tilt = (tiltsDeg[i] * Math.PI) / 180;

    for (let k = 0; k < n; k++) {
      const start = cuts[k];
      const end = k === n - 1 ? cuts[0] + TAU : cuts[k + 1];
      const len = end - start + 0.008; // a hair of overlap: no seams when closed
      const mid = start + len / 2;
      const wrapped = Math.atan2(Math.sin(mid), Math.cos(mid)); // 0 at the tangent point
      const delay = 0.3 * clamp(0.72 * (Math.abs(wrapped) / Math.PI) + 0.28 * rnd(), 0, 1);

      // The loose cloud: each piece floats out in the direction it faces from
      // its ring's centre (so its flight home reads as radial), inside an
      // ellipsoid around the object. The space under the core stays clear, and
      // the lower left (where the hero headline sits) stays quiet.
      const m = rotY(arcPoint(r, mid), tilt);
      let phi = Math.atan2(m[1] - r, m[0]) + (rnd() - 0.5) * 0.9;
      const fromDown = Math.atan2(Math.sin(phi + Math.PI / 2), Math.cos(phi + Math.PI / 2));
      if (Math.abs(fromDown) < 0.8) phi = -Math.PI / 2 + Math.sign(fromDown || 1) * (0.8 + Math.abs(fromDown) * 0.45);
      const rho = (0.56 + 0.5 * rnd()) * (0.82 + 0.18 * r);
      let sx = Math.cos(phi) * 1.85 * rho + (rnd() - 0.5) * 0.3;
      let sy = OBJECT_CENTRE[1] + Math.sin(phi) * 1.18 * rho + (rnd() - 0.5) * 0.3;
      let sz = SCATTER_BOX.z[0] + rnd() * (SCATTER_BOX.z[1] - SCATTER_BOX.z[0]);
      if (sx < -1.2 && sy < 1.15) {
        sy = 1.25 + rnd() * 1.05;
        sx *= 0.8;
      }
      sx = clamp(sx, SCATTER_BOX.x[0], SCATTER_BOX.x[1]);
      sy = clamp(sy, SCATTER_BOX.y[0], SCATTER_BOX.y[1]);
      sz = clamp(sz, SCATTER_BOX.z[0], SCATTER_BOX.z[1]);
      const scatter: Vec3 = [sx, sy, sz];

      const travel: Vec3 = [m[0] - sx, m[1] - sy, m[2] - sz];
      const dist = Math.hypot(travel[0], travel[1], travel[2]);
      const side = normalize(cross(normalize(travel), randomUnit(rnd)));
      const bowAmt = dist * (0.14 + rnd() * 0.16);
      const bow: Vec3 = [side[0] * bowAmt, side[1] * bowAmt, side[2] * bowAmt];

      // Tumble mostly in the picture plane (axis near the view direction, a
      // little out-of-plane tilt for depth), so loose pieces show their curve
      // instead of turning edge-on into straight sticks.
      const axis = normalize([(rnd() - 0.5) * 0.7, (rnd() - 0.5) * 0.7, 1]);
      const angle = (0.5 + rnd() * 2.6) * (rnd() < 0.5 ? -1 : 1);

      out.push({
        ring: i as 0 | 1 | 2,
        start,
        len,
        delay,
        scatter,
        axis,
        angle,
        bow,
        phase: [rnd(), rnd(), rnd(), rnd()],
      });
    }
  });

  return out;
}

/**
 * CPU mirror of the fragment vertex shader's scattered pose (centre line
 * only), used by the SVG renders. `time` is the drift clock (0 for renders).
 */
export function fragmentCentreline(
  f: Fragment,
  opts: { tiltsDeg: readonly number[]; scatter?: number; time?: number; drift?: number; samples?: number },
): Vec3[] {
  const { tiltsDeg, scatter = 1, time = 0, drift = 0.065, samples = 14 } = opts;
  // Scattered pieces curl on a tighter radius (same world length), as in the shader.
  const r = RING_RADII[f.ring] * SCATTER_CURL;
  const tilt = (tiltsDeg[f.ring] * Math.PI) / 180;
  const mid = f.start + f.len / 2;
  const m0 = arcPoint(r, mid);
  const wob = Math.sin(time * 0.21 + f.phase[0] * TAU) * 0.35;
  const c = OBJECT_CENTRE;
  const S: Vec3 = [
    c[0] + (f.scatter[0] - c[0]) * scatter + Math.sin(time * 0.23 + f.phase[1] * TAU) * drift,
    c[1] + (f.scatter[1] - c[1]) * scatter + Math.sin(time * 0.19 + f.phase[2] * TAU) * drift,
    c[2] + (f.scatter[2] - c[2]) * scatter + Math.sin(time * 0.17 + f.phase[3] * TAU) * drift,
  ];
  const pts: Vec3[] = [];
  const len = (f.len * SCATTER_LENGTH) / SCATTER_CURL;
  for (let i = 0; i <= samples; i++) {
    const th = mid + (i / samples - 0.5) * len;
    const p = arcPoint(r, th);
    let local: Vec3 = [p[0] - m0[0], p[1] - m0[1], p[2] - m0[2]];
    local = rotY(local, tilt);
    local = rotAxis(local, f.axis, f.angle + wob);
    pts.push([S[0] + local[0], S[1] + local[1], S[2] + local[2]]);
  }
  return pts;
}
