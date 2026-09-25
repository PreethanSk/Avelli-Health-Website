/**
 * GLSL for the rings stage. Three materials share one look:
 *  - fragments: one InstancedMesh; every broken arc is built in the vertex
 *    shader from (ring, start angle, arc length) and flown from its scattered
 *    pose to its place on a ring that is born at the core and grows outward;
 *  - final rings: the same tube, full circle, radius as a uniform (so the tube
 *    keeps its thickness while the ring breathes and pulses);
 *  - core: a solid glacier sphere with a soft emissive lift (no bloom).
 *
 * The ice look is a cheap custom shader (the default in 04-build-plan §4):
 * a low-opacity ice body, a strong fresnel rim, a key-light highlight, a faint
 * caustic on the far wall of the tube and a refraction-like offset of the DOM
 * depth glow behind the transparent canvas (evaluated analytically, because
 * the glow is CSS, not WebGL). Material references: liquid-glass-js (separate
 * edge / rim / base layers, MIT) and React Bits Fluid Glass (drei transmission
 * setup). Studied; nothing copied.
 *
 * Colours arrive as raw sRGB triplets and are written straight out
 * (the canvas is created `flat` + `linear`: no tone mapping, no conversion).
 * Output is premultiplied alpha for the transparent canvas.
 */

const COMMON = /* glsl */ `
  #define PI 3.141592653589793
  #define TAU 6.283185307179586

  // A point on a ring of radius r resting on the tangent point (the origin).
  vec3 arcPoint(float r, float th) {
    return vec3(r * sin(th), r - r * cos(th), 0.0);
  }

  // Rotation about the vertical axis through the tangent point.
  vec3 rotY(vec3 v, float a) {
    float c = cos(a);
    float s = sin(a);
    return vec3(v.x * c + v.z * s, v.y, -v.x * s + v.z * c);
  }

  // Rodrigues rotation about a unit axis.
  vec3 rotAxis(vec3 v, vec3 k, float a) {
    float c = cos(a);
    float s = sin(a);
    return v * c + cross(k, v) * s + k * dot(k, v) * (1.0 - c);
  }

  float pick3(vec3 v, float i) {
    return i < 0.5 ? v.x : (i < 1.5 ? v.y : v.z);
  }
`;

export const FRAGMENT_VERT = /* glsl */ `
  ${COMMON}
  uniform float uAccrue;   // 0..3, rings closed so far (innermost first)
  uniform float uScatter;  // spread of the loose pieces (1 = rest)
  uniform float uTime;     // drift clock (frozen while motion is paused)
  uniform float uDrift;    // drift amplitude (R units)
  uniform vec3 uRadii;     // final radii, innermost first
  uniform vec3 uTilts;     // tilt about the vertical axis (radians)
  uniform float uCoreR;    // rings are born at the core's size
  uniform float uTube;     // tube radius (R units)
  uniform float uLenScatter; // loose pieces are longer; exact slot when landed
  uniform float uCurl;       // loose pieces curl tighter (fraction of r); 1 when landed

  attribute float aArc;    // 0..1 along the piece
  attribute float aTube;   // angle around the tube
  attribute vec4 aInfo;    // ring, start angle, arc length, delay
  attribute vec3 aScatter; // scattered midpoint
  attribute vec4 aAxis;    // scattered orientation: axis xyz, angle w
  attribute vec3 aBow;     // sideways bow of the flight path
  attribute vec4 aPhase;   // wobble + drift phases

  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying float vAlpha;

  void main() {
    float ring = aInfo.x;
    // This ring's own progress, and this piece's arrival within it.
    float L = clamp(uAccrue - ring, 0.0, 1.0);
    float e = smoothstep(aInfo.w, aInfo.w + 0.7, L);
    float ep = 1.0 - pow(1.0 - e, 3.0); // decelerating landing

    float rFinal = pick3(uRadii, ring);
    float tilt = pick3(uTilts, ring);
    // The ring is born at the core and grows outward as it closes.
    float rTarget = mix(uCoreR, rFinal, smoothstep(0.0, 1.0, L));
    float r = mix(rFinal, rTarget, ep);

    float thMid = aInfo.y + 0.5 * aInfo.z;
    float len = aInfo.z * mix(uLenScatter, 1.0, ep);
    // Curl: same world length on a tighter radius, so loose pieces read as
    // broken arcs; they relax onto the ring's own curvature as they land.
    float rc = r * mix(uCurl, 1.0, ep);
    float th = thMid + (aArc - 0.5) * len * (r / rc);
    vec3 radial = vec3(sin(th), -cos(th), 0.0);
    vec3 tubeN = cos(aTube) * radial + sin(aTube) * vec3(0.0, 0.0, 1.0);

    // The piece around its own midpoint, tilted like its ring.
    vec3 local = arcPoint(rc, th) - arcPoint(rc, thMid) + uTube * tubeN;
    local = rotY(local, tilt);
    vec3 n = rotY(tubeN, tilt);

    // Scattered: tumbled about its midpoint, with a slow wobble.
    float wob = sin(uTime * 0.21 + aPhase.x * TAU) * 0.35;
    float ang = (aAxis.w + wob) * (1.0 - ep);
    local = rotAxis(local, aAxis.xyz, ang);
    n = rotAxis(n, aAxis.xyz, ang);

    vec3 centre = vec3(0.0, 1.0, 0.0);
    vec3 drift = vec3(
      sin(uTime * 0.23 + aPhase.y * TAU),
      sin(uTime * 0.19 + aPhase.z * TAU),
      sin(uTime * 0.17 + aPhase.w * TAU)
    ) * uDrift;
    vec3 S = centre + (aScatter - centre) * uScatter + drift;
    vec3 M = rotY(arcPoint(rTarget, thMid), tilt);

    // Fly along a bowed path (not a straight slide) to the ring.
    vec3 pos = mix(S, M, ep) + aBow * sin(PI * ep) + local;

    // Far pieces are fainter; a closed ring's pieces fade as its torus fades in.
    float depth = mix(0.3 + 0.7 * smoothstep(-1.5, 0.75, S.z), 1.0, ep);
    float handoff = 1.0 - smoothstep(0.9, 1.0, L);
    vAlpha = depth * handoff;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vViewPos = mv.xyz;
    vNormal = normalize(normalMatrix * n);
    gl_Position = projectionMatrix * mv;
    // Fully faded pieces cost nothing: push them out of the clip volume.
    if (vAlpha < 0.002) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
  }
`;

export const RING_VERT = /* glsl */ `
  ${COMMON}
  uniform float uRadius;
  uniform float uTilt;
  uniform float uTube;

  attribute float aArc;
  attribute float aTube;

  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying float vAlpha;

  void main() {
    float th = aArc * TAU;
    vec3 radial = vec3(sin(th), -cos(th), 0.0);
    vec3 tubeN = cos(aTube) * radial + sin(aTube) * vec3(0.0, 0.0, 1.0);
    vec3 p = rotY(arcPoint(uRadius, th) + uTube * tubeN, uTilt);
    vec3 n = rotY(tubeN, uTilt);
    vAlpha = 1.0;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vViewPos = mv.xyz;
    vNormal = normalize(normalMatrix * n);
    gl_Position = projectionMatrix * mv;
  }
`;

export const ICE_FRAG = /* glsl */ `
  uniform vec3 uIce;
  uniform vec3 uGlacier;
  uniform vec3 uInk;
  uniform vec3 uDepth;
  uniform float uBase;       // ice body opacity
  uniform float uRim;        // fresnel rim strength
  uniform float uRimPower;
  uniform float uSpec;       // key-light highlight
  uniform float uCaustic;    // light focused on the far wall of the tube
  uniform float uRefract;    // screen-space offset of the glow seen through the glass
  uniform float uLift;       // extra light (the pulse)
  uniform float uAlpha;      // material fade (final rings)
  uniform vec2 uRes;         // drawing buffer size

  varying vec3 vNormal;
  varying vec3 vViewPos;
  varying float vAlpha;

  // The DOM depth glow behind the canvas, as CSS draws it:
  // radial-gradient(120% 100% at 50% 100%, depth 0%, ink 62%).
  vec3 depthGlow(vec2 uv) {
    vec2 d = vec2((uv.x - 0.5) / 1.2, uv.y);
    return mix(uDepth, uInk, clamp(length(d) / 0.62, 0.0, 1.0));
  }

  void main() {
    float k = vAlpha * uAlpha;
    if (k < 0.002) discard;

    vec3 N = normalize(vNormal);
    if (!gl_FrontFacing) N = -N;
    vec3 V = normalize(-vViewPos);
    float ndv = clamp(dot(N, V), 0.0, 1.0);

    // One cool key light, top left, in view space.
    vec3 Lk = normalize(vec3(-0.55, 0.78, 0.42));
    vec3 H = normalize(Lk + V);

    float fres = pow(1.0 - ndv, uRimPower);
    float spec = pow(max(dot(N, H), 0.0), 72.0);
    float wrap = 0.55 + 0.45 * max(dot(N, Lk), 0.0);
    // A glass cylinder focuses light onto the wall facing away from it.
    vec3 Lc = normalize(vec3(-Lk.xy, 0.35));
    float caustic = pow(max(dot(N, Lc), 0.0), 7.0) * (1.0 - fres);

    vec2 uv = gl_FragCoord.xy / uRes;
    vec3 seen = depthGlow(uv - N.xy * uRefract) * 1.4;

    float body = uBase * 3.0;
    vec3 rimCol = mix(uIce, uGlacier, 0.22) * wrap;
    vec3 col = seen * body
      + uIce * uBase
      + rimCol * fres * uRim
      + uIce * spec * uSpec
      + uGlacier * caustic * uCaustic;
    col *= 1.0 + uLift;
    float a = clamp(body + uBase + fres * uRim * 0.9 + spec * uSpec + caustic * uCaustic * 0.6, 0.0, 1.0);

    gl_FragColor = vec4(min(col, vec3(a)) * k, a * k);
  }
`;

export const CORE_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPos;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewPos = mv.xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mv;
  }
`;

export const CORE_FRAG = /* glsl */ `
  uniform vec3 uGlacier;
  uniform vec3 uIce;
  uniform vec3 uDim;
  uniform float uCore;   // 0.25 dim .. 1 lit
  uniform float uLift;   // the pulse

  varying vec3 vNormal;
  varying vec3 vViewPos;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(-vViewPos);
    vec3 Lk = normalize(vec3(-0.55, 0.78, 0.42));
    float ndv = clamp(dot(N, V), 0.0, 1.0);
    float wrap = 0.5 + 0.5 * dot(N, Lk);

    vec3 base = mix(uDim, uGlacier, uCore);
    vec3 col = base * (0.4 + 0.6 * wrap);
    // Soft emissive lift, centre weighted: it reads as lit from within.
    col += uGlacier * uCore * 0.24 * pow(ndv, 1.5);
    // A small sheen from the key light.
    col += uIce * pow(max(dot(N, normalize(Lk + V)), 0.0), 48.0) * (0.2 + 0.3 * uCore);
    // The edge catches the glacier light (luminous, never neon).
    col += mix(uDim, uGlacier, 0.6) * pow(1.0 - ndv, 3.0) * (0.1 + 0.28 * uCore);
    col *= 1.0 + uLift * 0.35;
    gl_FragColor = vec4(min(col, vec3(1.0)), 1.0);
  }
`;
