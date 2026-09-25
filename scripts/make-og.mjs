// Generates the static share image: src/app/opengraph-image.png (and the
// identical twitter-image.png), 1200x630.
//
// Run from the project root:  node scripts/make-og.mjs
//
// Composition (docs/website/03-site-structure.md §8): ink ground with the one
// depth radial glow, the full mark large on the right (ice rings, glacier
// core, geometry from MARK in src/lib/tokens.ts), and the horizontal lockup
// with the motto on the left.
//
// - The mark is drawn as vector SVG from MARK, so it can never drift.
// - The wordmark is lifted from the package lockup (public/brand/
//   lockup-horizontal-dark.png, Geist 500) as an alpha mask and recoloured, so
//   the letterforms are the real ones. The lockup's own symbol is redrawn as
//   vector at the package ratios.
// - The motto is set in Geist Regular (the copy Next bundles with next/og) by
//   the next/og renderer, then composited here with sharp.
// - The glow is computed per pixel with a half-step dither so the very subtle
//   ink -> depth gradient does not band. No grain is baked in.

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { ImageResponse } from "next/dist/compiled/@vercel/og/index.node.js";
import { COLOR, MARK, tangentCy } from "../src/lib/tokens.ts";

const ROOT = process.cwd();
const W = 1200;
const H = 630;
const OUT = [path.join(ROOT, "src/app/opengraph-image.png"), path.join(ROOT, "src/app/twitter-image.png")];

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

/* ---- Layout ------------------------------------------------------------ */

// The large mark: a 100-unit box scaled to BIG px, tangent point at TANGENT_Y.
const BIG = 468;
const MARK_CX = 858;
const TANGENT_Y = 552;
const unit = BIG / MARK.box;
const bigLeft = MARK_CX - MARK.cx * unit;
const bigTop = TANGENT_Y - MARK.tangentY * unit;

// The lockup, scaled from the package PNG (3168 x 894) by K.
const K = 0.215;
const LOCKUP_X = 88; // left edge of the symbol's outer ring
const LOCKUP_Y = 276; // top edge of the symbol's outer ring
// Measured in the package PNG: the symbol's outer ring (incl. stroke) spans
// x 1059..1322, y 315..578; the wordmark spans x 1444..2124, y 347..546.
const PNG_RING_X = 1059;
const PNG_RING_Y = 315;
const PNG_RING_W = 1322 - 1059 + 1;
const WORD_CROP = { left: 1424, top: 327, width: 720, height: 240 };
const map = (px, py) => [LOCKUP_X + (px - PNG_RING_X) * K, LOCKUP_Y + (py - PNG_RING_Y) * K];

/* ---- 1. Ground: ink with the depth glow (dithered) ---------------------- */

// Same shape as the site's depth-glow utility: an ellipse 120% x 100% of the
// frame, anchored at the bottom, depth at the centre fading to ink by 62%.
// Here it is centred under the mark instead of the frame.
function ground() {
  const ink = hex(COLOR.ink);
  const depth = hex(COLOR.depth);
  const rx = W * 1.2;
  const ry = H * 1.0;
  const buf = Buffer.alloc(W * H * 3);
  let seed = 20260925;
  const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const d = Math.hypot((x - MARK_CX) / rx, (y - H) / ry);
      const t = Math.min(1, d / 0.62);
      const i = (y * W + x) * 3;
      for (let c = 0; c < 3; c++) {
        const v = depth[c] + (ink[c] - depth[c]) * t;
        buf[i + c] = Math.max(0, Math.min(255, Math.round(v + rnd() - 0.5)));
      }
    }
  }
  return sharp(buf, { raw: { width: W, height: H, channels: 3 } }).png().toBuffer();
}

/* ---- 2. The marks (vector) ---------------------------------------------- */

function symbolSvg({ x, y, size, ring, core }) {
  const s = size / MARK.box;
  const rings = MARK.rings
    .map((r) => `<circle cx="${MARK.cx}" cy="${tangentCy(r)}" r="${r}" />`)
    .join("");
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <g fill="none" stroke="${ring}" stroke-width="${MARK.stroke}">${rings}</g>
    <circle cx="${MARK.cx}" cy="${tangentCy(MARK.core)}" r="${MARK.core}" fill="${core}" />
  </g>`;
}

function marksLayer() {
  // Lockup symbol: its outer ring (incl. stroke) must span PNG_RING_W * K px.
  const ringSpanUnits = MARK.R * 2 + MARK.stroke; // 83
  const smallSize = ((PNG_RING_W * K) / ringSpanUnits) * MARK.box;
  const smallUnit = smallSize / MARK.box;
  const smallLeft = LOCKUP_X - (MARK.cx - MARK.R - MARK.stroke / 2) * smallUnit;
  const smallTop = LOCKUP_Y - (MARK.tangentY - 2 * MARK.R - MARK.stroke / 2) * smallUnit;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${symbolSvg({ x: bigLeft, y: bigTop, size: BIG, ring: COLOR.ice, core: COLOR.glacier })}
    ${symbolSvg({ x: smallLeft, y: smallTop, size: smallSize, ring: COLOR.ice, core: COLOR.glacier })}
  </svg>`;
  return Buffer.from(svg);
}

/* ---- 3. The wordmark (alpha from the package PNG) ------------------------ */

async function wordmark() {
  const src = path.join(ROOT, "public/brand/lockup-horizontal-dark.png");
  const { data, info } = await sharp(src).extract(WORD_CROP).raw().toBuffer({ resolveWithObject: true });
  const ice = hex(COLOR.ice);
  const out = Buffer.alloc(info.width * info.height * 4);
  // Text is ice (G 238) over the PNG's own glow (G 13 to 21, varying by row).
  // Each row's background is read from the empty margins either side of the
  // wordmark (the crop has 16px clear on each side), so the mask carries no
  // trace of the source gradient.
  const { width: cw, height: ch, channels } = info;
  const MARGIN = 14;
  for (let y = 0; y < ch; y++) {
    let sum = 0;
    let max = 0;
    for (let x = 0; x < MARGIN; x++) {
      for (const xx of [x, cw - 1 - x]) {
        const g = data[(y * cw + xx) * channels + 1];
        sum += g;
        max = Math.max(max, g);
      }
    }
    const bg = Math.max(sum / (MARGIN * 2), max - 1) + 1;
    for (let x = 0; x < cw; x++) {
      const i = (y * cw + x) * channels;
      const o = (y * cw + x) * 4;
      const a = Math.max(0, Math.min(1, (data[i + 1] - bg) / (ice[1] - bg)));
      out[o] = ice[0];
      out[o + 1] = ice[1];
      out[o + 2] = ice[2];
      out[o + 3] = Math.round(a * 255);
    }
  }
  const w = Math.round(info.width * K);
  const h = Math.round(info.height * K);
  const input = await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .resize(w, h, { kernel: "lanczos3" })
    .png()
    .toBuffer();
  const [left, top] = map(WORD_CROP.left, WORD_CROP.top);
  return { input, left: Math.round(left), top: Math.round(top) };
}

/* ---- 4. The motto (Geist Regular via next/og) ---------------------------- */

async function motto() {
  const font = fs.readFileSync(path.join(ROOT, "node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf"));
  const el = {
    type: "div",
    props: {
      style: {
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "flex-start",
        color: COLOR.ice60,
        fontFamily: "Geist",
        fontSize: 32,
        letterSpacing: "-0.015em",
        lineHeight: 1.2,
      },
      children: "Your health, understood.",
    },
  };
  const res = new ImageResponse(el, {
    width: 520,
    height: 48,
    fonts: [{ name: "Geist", data: font, weight: 400, style: "normal" }],
  });
  const input = Buffer.from(await res.arrayBuffer());
  // Sit under the wordmark, left-aligned with the symbol's outer ring.
  const [, wordBottom] = map(0, 546);
  return { input, left: LOCKUP_X, top: Math.round(wordBottom + 40) };
}

/* ---- Compose ------------------------------------------------------------- */

const base = await ground();
const word = await wordmark();
const line = await motto();

const png = await sharp(base)
  .composite([{ input: marksLayer(), left: 0, top: 0 }, word, line])
  .png({ compressionLevel: 9 })
  .toBuffer();

for (const file of OUT) {
  fs.writeFileSync(file, png);
  console.log("wrote", path.relative(ROOT, file), `${(png.length / 1024).toFixed(0)} KB`);
}
