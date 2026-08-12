"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const COUNT = 6200;

function createPlaneField() {
  const positions = new Float32Array(COUNT * 3);
  for (let index = 0; index < COUNT; index += 1) {
    positions[index * 3] = (Math.random() - 0.5) * 15;
    positions[index * 3 + 1] = (Math.random() - 0.5) * 13;
    positions[index * 3 + 2] = -4 + (index % 5) * 2;
  }
  return positions;
}

function createCylinderField() {
  const positions = new Float32Array(COUNT * 3);
  for (let index = 0; index < COUNT; index += 1) {
    const progress = index / COUNT;
    const angle = progress * Math.PI * 34;
    const radius = 2.7 + Math.sin(index * 0.17) * 0.32;
    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = (progress - 0.5) * 25;
    positions[index * 3 + 2] = Math.sin(angle) * radius;
  }
  return positions;
}

const VERTEX = `
  attribute vec3 aTarget;
  attribute float aSeed;
  uniform float uMorph;
  uniform float uTime;
  uniform float uTurbulence;
  uniform float uDpr;
  varying float vAlpha;
  void main() {
    vec3 pos = mix(position, aTarget, smoothstep(0.0, 1.0, uMorph));
    float drift = uTime * 0.13 + aSeed * 6.2831;
    pos += vec3(sin(drift), cos(drift * 0.87), sin(drift * 1.14)) * (0.06 + uTurbulence * 0.22);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp((2.8 + aSeed * 4.0) * uDpr / max(0.7, -mv.z), 0.65, 5.5 * uDpr);
    vAlpha = 0.18 + aSeed * 0.42;
  }
`;

const FRAGMENT = `
  precision mediump float;
  varying float vAlpha;
  void main() {
    vec2 point = gl_PointCoord - 0.5;
    float distanceFromCentre = length(point);
    if (distanceFromCentre > 0.5) discard;
    float alpha = (1.0 - smoothstep(0.1, 0.5, distanceFromCentre)) * vAlpha;
    gl_FragColor = vec4(0.329, 0.678, 0.82, alpha);
  }
`;

export function FocusParticleField({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    const section = container?.closest<HTMLElement>("section");
    if (!container || !section) return;

    gsap.registerPlugin(ScrollTrigger);
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      container.dataset.webglFallback = "true";
      return;
    }
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.set(0, 0, 16);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(createPlaneField(), 3));
    geometry.setAttribute("aTarget", new THREE.BufferAttribute(createCylinderField(), 3));
    const seeds = new Float32Array(COUNT);
    for (let index = 0; index < COUNT; index += 1) seeds[index] = Math.random();
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    const uniforms = {
      uMorph: { value: reducedMotion ? 0.28 : 0 },
      uTime: { value: 0 },
      uTurbulence: { value: 0 },
      uDpr: { value: pixelRatio },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms,
      transparent: true,
      depthWrite: false,
    });
    const points = new THREE.Points(geometry, material);
    points.rotation.z = -0.2;
    scene.add(points);

    const pointerTarget = new THREE.Vector2();
    const pointer = new THREE.Vector2();
    const clock = new THREE.Clock();
    let frame = 0;
    const resize = () => {
      const bounds = container.getBoundingClientRect();
      const width = Math.max(1, bounds.width);
      const height = Math.max(1, bounds.height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const movePointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const bounds = section.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
      pointerTarget.set(
        ((event.clientX - bounds.left) / Math.max(1, bounds.width) - 0.5) * 2,
        ((event.clientY - bounds.top) / Math.max(1, bounds.height) - 0.5) * 2,
      );
    };
    const resetPointer = () => pointerTarget.set(0, 0);
    resize();
    window.addEventListener("resize", resize);

    const triggers: ScrollTrigger[] = [];
    if (!reducedMotion) {
      section.addEventListener("pointermove", movePointer, { passive: true });
      section.addEventListener("pointerleave", resetPointer);
      triggers.push(
        ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.9,
          onUpdate: ({ progress }) => {
            uniforms.uMorph.value = progress;
            uniforms.uTurbulence.value = Math.sin(progress * Math.PI);
            camera.position.z = 16 - progress * 4.6;
            camera.position.y = -progress * 2.2;
          },
        }),
      );
    }

    const render = () => {
      pointer.lerp(pointerTarget, 0.045);
      uniforms.uTime.value = clock.getElapsedTime();
      points.rotation.y += 0.0007;
      points.rotation.x += (pointer.y * 0.06 - points.rotation.x) * 0.035;
      points.rotation.z += (-0.2 + pointer.x * 0.06 - points.rotation.z) * 0.035;
      renderer.render(scene, camera);
      if (!reducedMotion) frame = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      section.removeEventListener("pointermove", movePointer);
      section.removeEventListener("pointerleave", resetPointer);
      triggers.forEach((trigger) => trigger.kill());
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [reducedMotion]);

  return <div ref={containerRef} className={className} aria-hidden="true" />;
}
