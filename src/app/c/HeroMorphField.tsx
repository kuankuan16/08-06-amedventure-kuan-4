"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const VERTEX_SHADER = `
  attribute vec3 aHelix;
  attribute vec3 aCloud;
  attribute float aSeed;
  attribute float aScale;

  uniform float uMorph;
  uniform float uTime;
  uniform float uSize;
  uniform float uDpr;

  varying float vSeed;
  varying float vFade;

  void main() {
    vec3 positionMorphed;
    if (uMorph < 1.0) {
      positionMorphed = mix(position, aHelix, smoothstep(0.0, 1.0, uMorph));
    } else {
      positionMorphed = mix(aHelix, aCloud, smoothstep(0.0, 1.0, uMorph - 1.0));
    }

    float drift = uTime * 0.18 + aSeed * 6.2831;
    positionMorphed.x += sin(drift) * 0.075;
    positionMorphed.y += cos(drift * 0.83) * 0.075;
    positionMorphed.z += sin(drift * 1.21) * 0.075;

    vec4 viewPosition = modelViewMatrix * vec4(positionMorphed, 1.0);
    gl_Position = projectionMatrix * viewPosition;

    float distanceToCamera = max(0.45, -viewPosition.z);
    gl_PointSize = clamp(uSize * aScale * uDpr / distanceToCamera, 0.7, 12.0 * uDpr);
    vFade = smoothstep(0.25, 1.6, distanceToCamera) * (1.0 - smoothstep(12.0, 22.0, distanceToCamera));
    vSeed = aSeed;
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;

  uniform vec3 uCyan;
  uniform vec3 uNavy;
  uniform float uOpacity;

  varying float vSeed;
  varying float vFade;

  void main() {
    vec2 point = gl_PointCoord - 0.5;
    float distanceFromCentre = length(point);
    if (distanceFromCentre > 0.5) discard;
    float core = pow(1.0 - smoothstep(0.0, 0.5, distanceFromCentre), 1.55);
    vec3 colour = mix(uNavy, uCyan, smoothstep(0.18, 0.9, vSeed));
    gl_FragColor = vec4(colour, core * vFade * uOpacity);
  }
`;

const PARTICLE_COUNT = 9000;

function createRandom(seed = 0x1352777) {
  let value = seed >>> 0;
  return () => {
    value = (1664525 * value + 0x3c6ef35f) >>> 0;
    return value / 0x100000000;
  };
}

function createSphere(random: () => number) {
  const points = new Float32Array(PARTICLE_COUNT * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let index = 0; index < PARTICLE_COUNT; index += 1) {
    const y = 1 - (index / (PARTICLE_COUNT - 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const angle = goldenAngle * index;
    const radius = 2.15 * (0.94 + random() * 0.1);
    points[index * 3] = Math.cos(angle) * radiusAtY * radius;
    points[index * 3 + 1] = y * radius;
    points[index * 3 + 2] = Math.sin(angle) * radiusAtY * radius;
  }
  return points;
}

function createHelix(random: () => number) {
  const points = new Float32Array(PARTICLE_COUNT * 3);
  for (let index = 0; index < PARTICLE_COUNT; index += 1) {
    const progress = index / (PARTICLE_COUNT - 1);
    const angle = progress * Math.PI * 10;
    const y = (progress - 0.5) * 7.1;
    const pair = index % 2 === 0 ? 0 : Math.PI;
    const radius = 0.9 + random() * 0.16;
    points[index * 3] = Math.cos(angle + pair) * radius;
    points[index * 3 + 1] = y;
    points[index * 3 + 2] = Math.sin(angle + pair) * radius;
  }
  return points;
}

function createCloud(random: () => number) {
  const nodes = Array.from({ length: 28 }, () => {
    const y = random() * 2 - 1;
    const angle = random() * Math.PI * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const radius = 2.2 + random() * 4.2;
    return new THREE.Vector3(
      Math.cos(angle) * radiusAtY * radius,
      y * radius,
      Math.sin(angle) * radiusAtY * radius,
    );
  });
  const points = new Float32Array(PARTICLE_COUNT * 3);
  for (let index = 0; index < PARTICLE_COUNT; index += 1) {
    const node = nodes[index % nodes.length];
    const spread = 1.05;
    points[index * 3] = node.x + (random() + random() + random() - 1.5) * spread;
    points[index * 3 + 1] = node.y + (random() + random() + random() - 1.5) * spread;
    points[index * 3 + 2] = node.z + (random() + random() + random() - 1.5) * spread;
  }
  return points;
}

function morphForProgress(progress: number) {
  if (progress < 0.18) return 0;
  if (progress < 0.5) return (progress - 0.18) / 0.32;
  if (progress < 0.63) return 1;
  return 1 + Math.min(1, (progress - 0.63) / 0.3);
}

export function HeroMorphField({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    const section = container?.closest<HTMLElement>("[data-morph-hero]");
    if (!container || !section) return;

    let disposed = false;
    let frame = 0;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      container.dataset.webglFallback = "true";
      return;
    }
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 0, 9.2);

    const random = createRandom();
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(createSphere(random), 3));
    geometry.setAttribute("aHelix", new THREE.BufferAttribute(createHelix(random), 3));
    geometry.setAttribute("aCloud", new THREE.BufferAttribute(createCloud(random), 3));

    const seeds = new Float32Array(PARTICLE_COUNT);
    const scales = new Float32Array(PARTICLE_COUNT);
    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
      seeds[index] = random();
      scales[index] = 0.5 + random() * random() * 2.6;
    }
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

    const uniforms = {
      uMorph: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: 14 },
      uDpr: { value: pixelRatio },
      uOpacity: { value: 0.72 },
      uCyan: { value: new THREE.Color("#54add1") },
      uNavy: { value: new THREE.Color("#29769a") },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
    });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const wireframeMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color("#54add1"),
      transparent: true,
      opacity: 0.08,
    });
    const wireframe = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(2.4, 2)),
      wireframeMaterial,
    );
    scene.add(wireframe);

    const pointerTarget = new THREE.Vector2();
    const pointer = new THREE.Vector2();
    let scrollTarget = 0;
    let scroll = 0;
    const clock = new THREE.Clock();

    const resize = () => {
      const bounds = container.getBoundingClientRect();
      const width = Math.max(1, bounds.width);
      const height = Math.max(1, bounds.height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const updateScroll = () => {
      const range = Math.max(1, section.offsetHeight - window.innerHeight);
      scrollTarget = Math.min(1, Math.max(0, (window.scrollY - section.offsetTop) / range));
    };
    const updatePointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const bounds = section.getBoundingClientRect();
      const localX = (event.clientX - bounds.left) / Math.max(1, bounds.width);
      const localY = (event.clientY - bounds.top) / Math.max(1, bounds.height);
      pointerTarget.set(
        (localX - 0.5) * 2,
        (localY - 0.5) * 2,
      );
    };
    const resetPointer = () => pointerTarget.set(0, 0);

    resize();
    updateScroll();
    const render = () => renderer.render(scene, camera);
    if (reducedMotion) {
      uniforms.uOpacity.value = 0.48;
      render();
    } else {
      const animate = () => {
        if (disposed) return;
        frame = window.requestAnimationFrame(animate);
        scroll += (scrollTarget - scroll) * 0.07;
        pointer.lerp(pointerTarget, 0.05);
        const time = clock.getElapsedTime();
        const morph = morphForProgress(scroll);

        uniforms.uTime.value = time;
        uniforms.uMorph.value = morph;
        uniforms.uOpacity.value = 0.72 - scroll * 0.14;
        camera.position.z = 9.2 - Math.sin(Math.min(1, scroll * 1.4) * Math.PI) * 4.1;
        camera.position.x = pointer.x * 0.48;
        camera.position.y = -scroll * 0.82 - pointer.y * 0.3;
        camera.lookAt(0, -scroll * 0.38, 0);
        particles.rotation.y = time * 0.04 + scroll * 1.4 + pointer.x * 0.12;
        particles.rotation.x = scroll * 0.34 + pointer.y * 0.08;
        wireframe.rotation.y = particles.rotation.y * 0.78;
        wireframe.rotation.x = particles.rotation.x;
        wireframeMaterial.opacity = 0.08 * (1 - Math.min(1, morph * 0.7));
        render();
      };
      window.addEventListener("scroll", updateScroll, { passive: true });
      section.addEventListener("pointermove", updatePointer, { passive: true });
      section.addEventListener("pointerleave", resetPointer);
      frame = window.requestAnimationFrame(animate);
    }
    window.addEventListener("resize", resize);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScroll);
      section.removeEventListener("pointermove", updatePointer);
      section.removeEventListener("pointerleave", resetPointer);
      window.removeEventListener("resize", resize);
      geometry.dispose();
      material.dispose();
      wireframe.geometry.dispose();
      wireframeMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [reducedMotion]);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}
