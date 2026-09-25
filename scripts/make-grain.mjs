// Generates the site grain tile (public/brand/grain.webp): a static, seamless,
// monochrome noise tile. Run once with `node scripts/make-grain.mjs public/brand/grain.webp`.

import sharp from "sharp";
const S = 256, buf = Buffer.alloc(S * S);
// Seeded PRNG so the tile is reproducible
let s = 1337; const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
for (let i = 0; i < S * S; i++) {
  // Approximate gaussian (sum of 3 uniforms) centred on mid grey: soft film grain
  const g = (rnd() + rnd() + rnd()) / 3;
  buf[i] = Math.max(0, Math.min(255, Math.round(128 + (g - 0.5) * 2.4 * 128)));
}
await sharp(buf, { raw: { width: S, height: S, channels: 1 } })
  .webp({ quality: 30, effort: 6, smartSubsample: false })
  .toFile(process.argv[2]);
