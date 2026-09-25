"use client";

/**
 * DEV ONLY: a Leva panel for tuning the rings (open the homepage in
 * `next dev` with `?tune`). StageBackdrop imports this only inside a
 * `process.env.NODE_ENV === "development"` branch, so it never ships.
 * Values write straight into `ringsTune`; copy the ones you like back into
 * config.ts.
 */
import { Leva, useControls } from "leva";
import { markStageDirty } from "./stage-store";
import { ringsTune, type RingsTune } from "./config";

type NumKey = { [K in keyof RingsTune]: RingsTune[K] extends number ? K : never }[keyof RingsTune];

function num(key: NumKey, min: number, max: number, step: number) {
  return {
    value: ringsTune[key],
    min,
    max,
    step,
    onChange: (v: number) => {
      ringsTune[key] = v;
      markStageDirty();
    },
  };
}

export function RingsTuner() {
  useControls("Look (ice shader)", {
    base: num("base", 0, 0.4, 0.005),
    rim: num("rim", 0, 2.5, 0.01),
    rimPower: num("rimPower", 0.5, 6, 0.05),
    spec: num("spec", 0, 2, 0.01),
    caustic: num("caustic", 0, 1.5, 0.01),
    refract: num("refract", 0, 0.3, 0.005),
    tube: num("tube", 0.004, 0.03, 0.0005),
  });
  useControls("Geometry", {
    tiltOuter: {
      value: ringsTune.tilts[2],
      min: -30,
      max: 30,
      step: 0.5,
      onChange: (v: number) => {
        ringsTune.tilts[2] = v;
        markStageDirty();
      },
    },
    tiltMiddle: {
      value: ringsTune.tilts[1],
      min: -30,
      max: 30,
      step: 0.5,
      onChange: (v: number) => {
        ringsTune.tilts[1] = v;
        markStageDirty();
      },
    },
    tiltInner: {
      value: ringsTune.tilts[0],
      min: -30,
      max: 30,
      step: 0.5,
      onChange: (v: number) => {
        ringsTune.tilts[0] = v;
        markStageDirty();
      },
    },
  });
  useControls("Motion", {
    drift: num("drift", 0, 0.2, 0.005),
    driftSpeed: num("driftSpeed", 0, 4, 0.05),
    parallaxDeg: num("parallaxDeg", 0, 6, 0.1),
    parallaxLerp: num("parallaxLerp", 0.01, 0.3, 0.005),
  });
  const o = ringsTune.override;
  const set = (patch: Partial<typeof o>) => {
    Object.assign(o, patch);
    markStageDirty();
  };
  useControls("Override scroll", {
    enabled: { value: o.enabled, onChange: (v: boolean) => set({ enabled: v }) },
    accrue: { value: o.accrue, min: 0, max: 3, step: 0.001, onChange: (v: number) => set({ accrue: v }) },
    scatter: { value: o.scatter, min: 0.5, max: 2, step: 0.01, onChange: (v: number) => set({ scatter: v }) },
    core: { value: o.core, min: 0, max: 1, step: 0.01, onChange: (v: number) => set({ core: v }) },
    breathe: { value: o.breathe, min: 0, max: 1, step: 0.01, onChange: (v: number) => set({ breathe: v }) },
    groupX: { value: o.groupX, min: -0.3, max: 0.3, step: 0.005, onChange: (v: number) => set({ groupX: v }) },
  });
  return (
    <div className="pointer-events-auto">
      <Leva collapsed={false} titleBar={{ title: "rings (dev)" }} />
    </div>
  );
}
