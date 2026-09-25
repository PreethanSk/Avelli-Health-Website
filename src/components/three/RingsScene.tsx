"use client";

/**
 * The rings object: the 6A construction in 3D.
 *
 * Three thin ice rings (R, 0.725R, 0.4625R) and a solid glacier core (0.225R),
 * all resting on ONE tangent point at the origin, each ring tilted about the
 * vertical axis through that point. The group's origin IS the tangent point,
 * so the pointer parallax (a rotation about the vertical axis) never moves it.
 *
 * Draw calls: the core, three final rings and ONE InstancedMesh for every
 * fragment. Uniforms are written in useFrame from the shared progress store
 * (no React state per frame). The frame itself is stepped by GSAP's ticker
 * (see RingsCanvas), in the same tick as Lenis and ScrollTrigger.
 */
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BufferAttribute,
  BufferGeometry,
  InstancedBufferAttribute,
  NormalBlending,
  ShaderMaterial,
  SphereGeometry,
  Vector2,
  type Group,
  type InstancedMesh,
  type Mesh,
} from "three";
import { isMotionPaused } from "@/components/motion/motion-state";
import {
  BREATHE,
  CORE_RADIUS,
  FRAGMENT_TIERS,
  FRAMING,
  PULSE,
  RING_RADII,
  SCATTER_LENGTH,
  SCATTER_CURL,
  SCENE_COLORS,
  pulseBump,
  ringsTune,
} from "./config";
import { makeFragments } from "./fragments";
import { CORE_FRAG, CORE_VERT, FRAGMENT_VERT, ICE_FRAG, RING_VERT } from "./shaders";
import { createStageValues, deriveStage, sceneActivity, stageProgress } from "./stage-store";

const DEG = Math.PI / 180;

/**
 * A tube strip: `seg` steps along an arc (aArc 0..1) by `rad` steps around
 * the tube (aTube 0..2pi). The shaders place it; `position` only exists so
 * three has a valid attribute (culling is off for these meshes).
 */
function tubeStrip(seg: number, rad: number): BufferGeometry {
  const g = new BufferGeometry();
  const count = (seg + 1) * (rad + 1);
  const arc = new Float32Array(count);
  const tube = new Float32Array(count);
  const pos = new Float32Array(count * 3);
  let v = 0;
  for (let i = 0; i <= seg; i++) {
    for (let j = 0; j <= rad; j++) {
      arc[v] = i / seg;
      tube[v] = (j / rad) * Math.PI * 2;
      v++;
    }
  }
  const index: number[] = [];
  for (let i = 0; i < seg; i++) {
    for (let j = 0; j < rad; j++) {
      const a = i * (rad + 1) + j;
      const b = (i + 1) * (rad + 1) + j;
      index.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  g.setIndex(index);
  g.setAttribute("position", new BufferAttribute(pos, 3));
  g.setAttribute("aArc", new BufferAttribute(arc, 1));
  g.setAttribute("aTube", new BufferAttribute(tube, 1));
  return g;
}

function fragmentGeometry(count: number): BufferGeometry {
  const g = tubeStrip(14, 8);
  const frags = makeFragments(count, ringsTune.tilts);
  const n = frags.length;
  const info = new Float32Array(n * 4);
  const scatter = new Float32Array(n * 3);
  const axis = new Float32Array(n * 4);
  const bow = new Float32Array(n * 3);
  const phase = new Float32Array(n * 4);
  frags.forEach((f, i) => {
    info.set([f.ring, f.start, f.len, f.delay], i * 4);
    scatter.set(f.scatter, i * 3);
    axis.set([...f.axis, f.angle], i * 4);
    bow.set(f.bow, i * 3);
    phase.set(f.phase, i * 4);
  });
  g.setAttribute("aInfo", new InstancedBufferAttribute(info, 4));
  g.setAttribute("aScatter", new InstancedBufferAttribute(scatter, 3));
  g.setAttribute("aAxis", new InstancedBufferAttribute(axis, 4));
  g.setAttribute("aBow", new InstancedBufferAttribute(bow, 3));
  g.setAttribute("aPhase", new InstancedBufferAttribute(phase, 4));
  g.userData.count = n;
  return g;
}

function iceUniforms() {
  return {
    uIce: { value: SCENE_COLORS.ice },
    uGlacier: { value: SCENE_COLORS.glacier },
    uInk: { value: SCENE_COLORS.ink },
    uDepth: { value: SCENE_COLORS.depth },
    uBase: { value: ringsTune.base },
    uRim: { value: ringsTune.rim },
    uRimPower: { value: ringsTune.rimPower },
    uSpec: { value: ringsTune.spec },
    uCaustic: { value: ringsTune.caustic },
    uRefract: { value: ringsTune.refract },
    uLift: { value: 0 },
    uAlpha: { value: 1 },
    uRes: { value: new Vector2(1, 1) },
  };
}

function iceMaterial(vertexShader: string, extra: Record<string, { value: unknown }>) {
  return new ShaderMaterial({
    vertexShader,
    fragmentShader: ICE_FRAG,
    uniforms: { ...iceUniforms(), ...extra },
    transparent: true,
    depthWrite: false,
    premultipliedAlpha: true,
    blending: NormalBlending,
  });
}

type IceUniforms = ReturnType<typeof iceUniforms>;

function syncLook(u: IceUniforms, res: Vector2) {
  u.uBase.value = ringsTune.base;
  u.uRim.value = ringsTune.rim;
  u.uRimPower.value = ringsTune.rimPower;
  u.uSpec.value = ringsTune.spec;
  u.uCaustic.value = ringsTune.caustic;
  u.uRefract.value = ringsTune.refract;
  u.uRes.value.copy(res);
}

const smooth = (t: number) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};

export function RingsScene({ tier }: { tier: number }) {
  const outer = useRef<Group>(null);
  const frag = useRef<InstancedMesh>(null);
  const inner = useRef<Group>(null);
  const core = useRef<Mesh>(null);
  const rings = useRef<(Mesh | null)[]>([]);

  const count = FRAGMENT_TIERS[Math.min(tier, FRAGMENT_TIERS.length - 1)];
  const fragGeo = useMemo(() => fragmentGeometry(count), [count]);
  const ringGeo = useMemo(() => tubeStrip(220, 12), []);
  const coreGeo = useMemo(() => new SphereGeometry(1, 64, 40), []);

  const fragMat = useMemo(
    () =>
      iceMaterial(FRAGMENT_VERT, {
        uAccrue: { value: 0 },
        uScatter: { value: 1 },
        uTime: { value: 0 },
        uDrift: { value: ringsTune.drift },
        uRadii: { value: RING_RADII.slice() },
        uTilts: { value: ringsTune.tilts.map((d) => d * DEG) },
        uCoreR: { value: CORE_RADIUS },
        uTube: { value: ringsTune.tube },
        uLenScatter: { value: SCATTER_LENGTH },
        uCurl: { value: SCATTER_CURL },
      }),
    [],
  );
  const ringMats = useMemo(
    () =>
      RING_RADII.map((r, i) =>
        iceMaterial(RING_VERT, {
          uRadius: { value: r },
          uTilt: { value: ringsTune.tilts[i] * DEG },
          uTube: { value: ringsTune.tube },
        }),
      ),
    [],
  );
  const coreMat = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: CORE_VERT,
        fragmentShader: CORE_FRAG,
        uniforms: {
          uGlacier: { value: SCENE_COLORS.glacier },
          uIce: { value: SCENE_COLORS.ice },
          uDim: { value: SCENE_COLORS.coreDim },
          uCore: { value: 0.25 },
          uLift: { value: 0 },
        },
      }),
    [],
  );

  // Dispose GPU resources when they are replaced or the scene unmounts.
  useEffect(() => () => fragGeo.dispose(), [fragGeo]);
  useEffect(
    () => () => {
      ringGeo.dispose();
      coreGeo.dispose();
      fragMat.dispose();
      coreMat.dispose();
      ringMats.forEach((m) => m.dispose());
    },
    [ringGeo, coreGeo, fragMat, coreMat, ringMats],
  );

  // Per-frame state, outside React.
  const sim = useRef({
    values: createStageValues(),
    drift: 0, // drift clock (frozen while paused)
    breath: 0, // breathe clock (frozen while paused)
    clock: 0, // real clock (the pulse is scroll feedback, not ambient)
    rot: 0,
    pulseAt: -99,
    pulseArmed: true,
    prevRings: 0,
    res: new Vector2(1, 1),
  });

  useFrame((state, delta) => {
    const s = sim.current;
    const dt = Math.min(Math.max(delta, 0), 1 / 20);
    const v = deriveStage(s.values);
    const paused = isMotionPaused();

    s.clock += dt;
    if (!paused) {
      s.drift += dt * ringsTune.driftSpeed;
      s.breath += dt;
    }

    // Framing: R is 29% of the viewport height (at most 20% of its width),
    // the tangent point sits at 72% of the height and moves by uGroupX.
    const vp = state.viewport.getCurrentViewport(state.camera, [0, 0, 0]);
    const scale = Math.min(FRAMING.rOfHeight * vp.height, FRAMING.rOfWidth * vp.width);
    if (outer.current) {
      outer.current.position.set(v.groupX * vp.width, (0.5 - FRAMING.tangentY) * vp.height, 0);
      outer.current.scale.setScalar(scale);
    }

    // Pointer parallax about the vertical axis through the tangent point.
    const target = stageProgress.pointerX * ringsTune.parallaxDeg * DEG;
    const k = 1 - Math.pow(1 - ringsTune.parallaxLerp, dt * 60);
    s.rot += (target - s.rot) * k;
    if (inner.current) inner.current.rotation.y = s.rot;

    // The core's one pulse, as it lights (part 4, 0.74..0.90).
    if (v.rings < 0.74) s.pulseArmed = true;
    if (s.pulseArmed && s.prevRings < 0.8 && v.rings >= 0.8) {
      s.pulseAt = s.clock;
      s.pulseArmed = false;
    }
    s.prevRings = v.rings;
    const u = s.clock - s.pulseAt;
    const pulsing = u >= 0 && u < PULSE.total;
    const pc = pulsing ? pulseBump((u - PULSE.core.delay) / PULSE.core.len) : 0;

    // Breathe: the living mark's +-offsets, out of phase, staying tangent.
    const w = s.breath * BREATHE.w;
    const b = v.breathe;

    state.gl.getDrawingBufferSize(s.res);

    // Uniforms are reached through the mesh refs (never the memoised
    // materials directly), so React never sees a render value mutate.
    const fragMaterial = frag.current?.material as ShaderMaterial | undefined;
    const coreMaterial = core.current?.material as ShaderMaterial | undefined;
    if (!fragMaterial || !coreMaterial) return;

    // Fragments
    const fu = fragMaterial.uniforms;
    fu.uAccrue.value = v.accrue;
    fu.uScatter.value = v.scatter;
    fu.uTime.value = s.drift;
    fu.uDrift.value = ringsTune.drift;
    fu.uTube.value = ringsTune.tube;
    (fu.uTilts.value as number[]).forEach((_, i, arr) => (arr[i] = ringsTune.tilts[i] * DEG));
    syncLook(fu as unknown as IceUniforms, s.res);

    // Final rings: each fades in over its fragments as it closes.
    let lift = 0;
    rings.current.forEach((mesh, i) => {
      if (!mesh) return;
      const m = mesh.material as ShaderMaterial;
      const L = Math.min(1, Math.max(0, v.accrue - i));
      const p = PULSE.rings[i];
      const bump = pulsing ? pulseBump((u - p.delay) / p.len) : 0;
      lift = Math.max(lift, bump);
      const grown = CORE_RADIUS + (RING_RADII[i] - CORE_RADIUS) * smooth(L);
      const mu = m.uniforms;
      mu.uRadius.value = grown + BREATHE.amp[i] * b * Math.sin(w + BREATHE.phase[i]) + p.amp * bump;
      mu.uTilt.value = ringsTune.tilts[i] * DEG;
      mu.uTube.value = ringsTune.tube;
      mu.uAlpha.value = smooth((L - 0.86) / 0.14);
      mu.uLift.value = bump * 0.6;
      syncLook(mu as unknown as IceUniforms, s.res);
      mesh.visible = mu.uAlpha.value > 0.001;
    });

    // Core: resting on the tangent point, dim until the rings are closed.
    const coreR = CORE_RADIUS + BREATHE.coreAmp * b * Math.sin(w + BREATHE.corePhase) + PULSE.core.amp * pc;
    if (core.current) {
      core.current.scale.setScalar(coreR);
      core.current.position.set(0, coreR, 0);
    }
    coreMaterial.uniforms.uCore.value = v.core;
    coreMaterial.uniforms.uLift.value = pc;

    // Tell the driver whether frames are still needed while idle.
    sceneActivity.busy = pulsing || Math.abs(target - s.rot) > 0.0005;
  });

  return (
    <group ref={outer}>
      <group ref={inner}>
        <mesh ref={core} geometry={coreGeo} material={coreMat} renderOrder={0} />
        {ringMats.map((m, i) => (
          <mesh
            key={i}
            ref={(el) => {
              rings.current[i] = el;
            }}
            geometry={ringGeo}
            material={m}
            frustumCulled={false}
            renderOrder={1}
            visible={false}
          />
        ))}
        <instancedMesh
          ref={frag}
          key={count}
          args={[fragGeo, fragMat, fragGeo.userData.count as number]}
          frustumCulled={false}
          renderOrder={2}
        />
      </group>
    </group>
  );
}
