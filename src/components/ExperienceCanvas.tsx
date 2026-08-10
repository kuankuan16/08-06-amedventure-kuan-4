"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import * as THREE from "three";

import { clamp01, scrollTarget } from "@/lib/scroll";
import styles from "./ExperienceCanvas.module.css";

const TAU = Math.PI * 2;

const vertexShader = /* glsl */ `
  attribute vec3 aOrb;
  attribute vec3 aSpiral;
  attribute vec3 aNetwork;
  attribute float aSeed;

  uniform float uTime;
  uniform float uClock;
  uniform vec2 uPointer;
  uniform float uPointerActive;
  uniform float uPixelRatio;

  varying vec3 vColor;
  varying vec3 vPeak;
  varying float vHalo;
  varying float vAlpha;

  float ease(float a, float b, float x) {
    float t = clamp((x - a) / (b - a), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
  }

  void main() {
    float toSpiral = ease(0.42, 1.24, uClock);
    float toNetwork = ease(1.82, 2.82, uClock);
    vec3 p = mix(aOrb, aSpiral, toSpiral);
    p = mix(p, aNetwork, toNetwork);

    float pulse = sin(uTime * 0.85 + aSeed * 21.0) * 0.018;
    p += normalize(p + vec3(0.0001)) * pulse;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec4 clip = projectionMatrix * mv;
    vec2 ndc = clip.xy / max(0.001, clip.w);
    vec2 pointerDelta = ndc - uPointer;
    pointerDelta.x *= 1.2;
    float pointerDistance = length(pointerDelta);
    float pointerHalo = (1.0 - smoothstep(0.0, 0.31, pointerDistance)) * uPointerActive;
    vec2 push = normalize(pointerDelta + vec2(0.0001)) * pointerHalo * 0.22;
    p.xy += push;

    mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float phase = sin(aSeed * 31.0 + uClock * 1.8) * 0.5 + 0.5;
    float vertical = clamp(p.y * 0.28 + 0.5, 0.0, 1.0);
    // One palette per section, blended across the same clock windows the overlays gate on:
    // hero = the brand blue sampled from the logo, focus = indigo violet, portfolio = teal, team = bright orange.
    float toFocusPalette = smoothstep(0.30, 0.80, uClock);
    float toProofPalette = smoothstep(2.05, 2.80, uClock);
    float toTeamPalette = smoothstep(3.15, 3.70, uClock);
    vec3 deep = mix(mix(mix(vec3(0.0052, 0.0080, 0.0452), vec3(0.0103, 0.0086, 0.0613), toFocusPalette), vec3(0.0012, 0.0194, 0.0273), toProofPalette), vec3(0.0423, 0.0070, 0.0015), toTeamPalette);
    vec3 mid = mix(mix(mix(vec3(0.0, 0.3915, 0.6308), vec3(0.0782, 0.0666, 0.4796), toFocusPalette), vec3(0.0070, 0.5842, 0.4969), toProofPalette), vec3(1.0, 0.1946, 0.0103), toTeamPalette);
    vec3 peak = mix(mix(mix(vec3(0.2122, 0.6725, 0.8227), vec3(0.2706, 0.3613, 1.0), toFocusPalette), vec3(0.6939, 1.0, 0.9473), toProofPalette), vec3(1.0, 0.5272, 0.2543), toTeamPalette);
    vColor = mix(deep, mid, vertical);
    vColor = mix(vColor, peak, smoothstep(0.72, 1.0, vertical + phase * 0.18));
    vColor = mix(vColor, peak, pointerHalo * 0.82);
    vPeak = peak;
    vHalo = pointerHalo;
    vAlpha = 0.44 + vertical * 0.34 + phase * 0.16;
    gl_PointSize = (7.6 + phase * 2.5 + pointerHalo * 8.0) * uPixelRatio / max(1.0, -mv.z * 0.72);
    gl_PointSize = max(gl_PointSize, 1.15);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec3 vColor;
  varying vec3 vPeak;
  varying float vHalo;
  varying float vAlpha;

  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float radius = length(p);
    if (radius > 0.5) discard;
    float halo = pow(smoothstep(0.5, 0.0, radius), 2.0);
    float core = smoothstep(0.16, 0.0, radius);
    // Core highlight and pointer glow ride the section palette instead of a fixed cyan.
    vec3 coreTint = mix(vPeak, vec3(1.0), 0.4);
    vec3 color = vColor * (0.62 + halo * 0.9) + coreTint * core * 1.25;
    color += vPeak * vHalo * halo * 0.85;
    gl_FragColor = vec4(color, halo * vAlpha);
  }
`;

const backdropVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 1.0, 1.0);
  }
`;

const backdropFragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uClock;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), f.x), f.y);
  }

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= 1.45;
    float t = uTime * 0.065;
    vec2 warp = vec2(noise(uv * 1.35 + t), noise(uv * 1.65 - t + 4.1));
    float field = noise(uv * 2.15 + warp * 1.25 + vec2(t, -t));
    float wash = smoothstep(0.34, 0.92, field) * (0.72 - abs(uv.y) * 0.24);
    vec3 base = vec3(0.0006, 0.0018, 0.0070);
    // Background wash follows the same four-section palette as the point cloud.
    vec3 tint = mix(
      mix(
        mix(vec3(0.004, 0.045, 0.085), vec3(0.030, 0.020, 0.105), smoothstep(0.30, 0.80, uClock)),
        vec3(0.000, 0.095, 0.085),
        smoothstep(2.05, 2.80, uClock)
      ),
      vec3(0.105, 0.035, 0.004),
      smoothstep(3.15, 3.70, uClock)
    );
    vec3 color = base + tint * wash;
    float vignette = 1.0 - smoothstep(0.35, 1.5, length(uv));
    float alpha = mix(0.82, 1.0, smoothstep(0.42, 0.95, uClock));
    gl_FragColor = vec4(color * (0.58 + 0.42 * vignette), alpha);
  }
`;

type Tier = {
  count: number;
  dpr: number;
  pointer: boolean;
  progressLerp: number;
};

const getTier = (width: number): Tier => {
  if (width <= 640) return { count: 8000, dpr: 1.1, pointer: false, progressLerp: 0.15 };
  if (width <= 1024) return { count: 14000, dpr: 1.4, pointer: false, progressLerp: 0.11 };
  return { count: 23000, dpr: 2, pointer: true, progressLerp: 0.07 };
};

const mulberry32 = (initialSeed: number) => {
  let seed = initialSeed;
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

const buildTargets = (count: number) => {
  const orb = new Float32Array(count * 3);
  const spiral = new Float32Array(count * 3);
  const network = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const random = mulberry32(0x414d4544);
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let index = 0; index < count; index += 1) {
    const offset = index * 3;
    const y = 1 - (index / Math.max(1, count - 1)) * 2;
    const ring = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * index;
    const vascular = 1 + Math.sin(theta * 3.0 + y * 11.0) * 0.035 + (random() - 0.5) * 0.025;
    orb[offset] = Math.cos(theta) * ring * 1.22 * vascular;
    orb[offset + 1] = y * 1.22 * vascular;
    orb[offset + 2] = Math.sin(theta) * ring * 1.22 * vascular;

    const radius = Math.pow(random(), 1.62) * 4.5 + 0.08;
    const arm = index % 2;
    const spiralTheta = arm * Math.PI + radius * 2.35 + (random() - 0.5) * 0.52;
    const thickness = Math.pow(random() * 2 - 1, 3) * (0.12 + radius * 0.045);
    spiral[offset] = Math.cos(spiralTheta) * radius;
    spiral[offset + 1] = thickness;
    spiral[offset + 2] = Math.sin(spiralTheta) * radius;

    const hemisphere = index % 2 === 0 ? -1 : 1;
    const lobeTheta = random() * TAU;
    const lobePhi = Math.acos(random() * 2 - 1);
    const ridge = 1 + Math.sin(lobeTheta * 5 + lobePhi * 8) * 0.075;
    const lobeRadius = 1.05 * ridge;
    network[offset] = hemisphere * 0.58 + Math.sin(lobePhi) * Math.cos(lobeTheta) * lobeRadius * 0.68;
    network[offset + 1] = Math.cos(lobePhi) * lobeRadius * 0.93 + 0.15;
    network[offset + 2] = Math.sin(lobePhi) * Math.sin(lobeTheta) * lobeRadius * 0.72;
    if (index % 7 === 0) {
      const heartT = random() * TAU;
      const heartY = random() * 2 - 1;
      const heartRing = Math.sqrt(1 - heartY * heartY);
      network[offset] = Math.cos(heartT) * heartRing * 0.42;
      network[offset + 1] = heartY * 0.62 - 0.72;
      network[offset + 2] = Math.sin(heartT) * heartRing * 0.36;
    }
    seeds[index] = random();
  }

  return { orb, spiral, network, seeds };
};

export function ExperienceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const tier = getTier(window.innerWidth);
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = reducedMotionQuery.matches;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrame = 0;
    let lastFrame = performance.now();
    let elapsed = 0;
    let clock = scrollTarget(window.scrollY, height);
    let visible = !document.hidden;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, tier.dpr));
    renderer.setSize(width, height, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    const backdropUniforms = {
      uTime: { value: 0 },
      uClock: { value: clock },
    };
    const backdropGeometry = new THREE.PlaneGeometry(2, 2);
    const backdropMaterial = new THREE.ShaderMaterial({
      uniforms: backdropUniforms,
      vertexShader: backdropVertexShader,
      fragmentShader: backdropFragmentShader,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      toneMapped: false,
    });
    const backdrop = new THREE.Mesh(backdropGeometry, backdropMaterial);
    backdrop.frustumCulled = false;
    backdrop.renderOrder = -1;
    scene.add(backdrop);

    const targets = buildTargets(tier.count);
    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute("position", new THREE.BufferAttribute(targets.orb, 3));
    pointGeometry.setAttribute("aOrb", new THREE.BufferAttribute(targets.orb, 3));
    pointGeometry.setAttribute("aSpiral", new THREE.BufferAttribute(targets.spiral, 3));
    pointGeometry.setAttribute("aNetwork", new THREE.BufferAttribute(targets.network, 3));
    pointGeometry.setAttribute("aSeed", new THREE.BufferAttribute(targets.seeds, 1));
    pointGeometry.computeBoundingSphere();

    const pointUniforms = {
      uTime: { value: 0 },
      uClock: { value: clock },
      uPointer: { value: new THREE.Vector2(4, 4) },
      uPointerActive: { value: 0 },
      uPixelRatio: { value: renderer.getPixelRatio() },
    };
    const pointMaterial = new THREE.ShaderMaterial({
      uniforms: pointUniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(pointGeometry, pointMaterial);
    points.frustumCulled = false;
    points.renderOrder = 1;
    scene.add(points);

    const pointerTarget = new THREE.Vector2(4, 4);
    const pointer = new THREE.Vector2(4, 4);
    let pointerPresent = false;
    const lenis = new Lenis({ smoothWheel: true });

    const onPointerMove = (event: PointerEvent) => {
      if (!tier.pointer || reducedMotion) return;
      pointerTarget.set((event.clientX / width) * 2 - 1, -(event.clientY / height) * 2 + 1);
      pointerPresent = true;
    };
    const onPointerLeave = () => {
      pointerPresent = false;
      pointerTarget.set(4, 4);
    };
    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, tier.dpr));
      renderer.setSize(width, height, false);
      pointUniforms.uPixelRatio.value = renderer.getPixelRatio();
    };
    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      if (reducedMotion) {
        pointerPresent = false;
        pointer.set(4, 4);
        pointerTarget.set(4, 4);
        pointUniforms.uPointerActive.value = 0;
      }
    };

    const render = (now: number) => {
      if (!visible) return;
      animationFrame = window.requestAnimationFrame(render);
      lenis.raf(now);

      const delta = Math.min((now - lastFrame) / 1000, 0.05);
      lastFrame = now;
      if (!reducedMotion) elapsed += delta;

      const targetClock = scrollTarget(window.scrollY, height);
      const clockEase = 1 - Math.pow(1 - tier.progressLerp, delta * 60);
      clock += (targetClock - clock) * clockEase;
      if (Math.abs(targetClock - clock) < 0.00005) clock = targetClock;

      const pointerEase = 1 - Math.pow(1 - 0.11, delta * 60);
      pointer.lerp(pointerTarget, pointerEase);
      pointUniforms.uPointer.value.copy(pointer);
      const pointerGoal = pointerPresent && tier.pointer && !reducedMotion ? 1 : 0;
      pointUniforms.uPointerActive.value += (pointerGoal - pointUniforms.uPointerActive.value) * Math.min(1, delta * 5);

      const toSpiral = clamp01((clock - 0.38) / 0.92);
      const toNetwork = clamp01((clock - 1.82) / 1.0);
      const cameraZ = THREE.MathUtils.lerp(THREE.MathUtils.lerp(4.2, 11, toSpiral), 4.6, toNetwork);
      camera.position.z += (cameraZ - camera.position.z) * Math.min(1, delta * 5.2);
      points.rotation.y = elapsed * 0.11 + clock * 0.42;
      points.rotation.x = -0.08 - toSpiral * 0.72 + toNetwork * 0.58;
      points.rotation.z = Math.sin(clock * 1.3) * 0.08;

      pointUniforms.uTime.value = elapsed;
      pointUniforms.uClock.value = clock;
      backdropUniforms.uTime.value = elapsed;
      backdropUniforms.uClock.value = clock;
      renderer.render(scene, camera);
    };

    const onVisibilityChange = () => {
      visible = !document.hidden;
      if (!visible) {
        window.cancelAnimationFrame(animationFrame);
        return;
      }
      lastFrame = performance.now();
      animationFrame = window.requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotionQuery.addEventListener("change", onMotionChange);
    animationFrame = window.requestAnimationFrame(render);

    return () => {
      visible = false;
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotionQuery.removeEventListener("change", onMotionChange);
      lenis.destroy();
      scene.remove(points, backdrop);
      pointGeometry.dispose();
      pointMaterial.dispose();
      backdropGeometry.dispose();
      backdropMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
