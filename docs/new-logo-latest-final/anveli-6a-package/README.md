# anveli — logo package · 6A Tangent · v1 (Sept 2026)

Four circles, one point. Every layer of a life — years, providers, records — is a different size, and all of them touch the same point: the person.

## Contents
svg/        vector symbol, optical symbol, app icons (1024), favicon
png/        lockups (horizontal + stacked, dark + light) and app icons at 512
living-mark/anveli-living-mark.html   self-contained animated mark + drop-in JS
anveli-logo.css                      colour tokens + lockup CSS

## Construction
All circles are internally tangent at one point on the vertical axis (centre y = tangent − r).
R = 40 · rings at 0.725R, 0.4625R · core 0.225R (solid) · ring stroke 0.075R.
Optical version (≤ 32px): one ring (r 38, stroke 11 on a 100 box) plus the core.

## Lockup
Symbol = 1.15 × wordmark font size, gap 0.3em, centred on the x-height.
Stacked: symbol 1.7em, gap 0.36em.
Wordmark: Geist 500, lowercase, tracking −0.035em. 600 at ≤ 16px.
Vector lockups: place svg/symbol-*.svg next to live Geist text using the ratios above
(or outline the text in Figma/Illustrator for print). PNG lockups are in png/.

## Colour
Ink #0B0C0D · Depth #14202A (glow only) · Ice #E9EEF0
Glacier #9FD8E8 — core on dark · Harbor #3E8FA8 — core on light
Paper #EEF2F4 · Reverse ink #0E1A22
Mono: rings and core in one colour (white or black), for embroidery, foil and fax.

## Clearspace & minimum size
Clearspace = core diameter × 2 on all sides.
Screen floor 16px (optical symbol, weight 600). Print floor 12px / 9mm wide.
Below that, use the symbol alone.

## Living mark
Idle · breathe      inner rings swell ±7% out of phase, always tangent. ~7s period.
Syncing · accrue    a ring is born from the core, every layer moves out one step, the oldest fades. Seamless loop, ~1.8s.
Record added · pulse   core swells, the pulse travels outward ring by ring (80ms stagger, 0.9s), then returns to idle.
Respects prefers-reduced-motion. API: AnveliMark(svgEl).set('breathe' | 'sync' | 'added').

## Don't
Centre the rings (that's a target) · rotate the mark · colour-code rings · thicken the full mark (use the optical version).
