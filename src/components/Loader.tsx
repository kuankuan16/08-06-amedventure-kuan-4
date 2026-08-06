"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Loader.module.css";

const STAR_COUNT = 120;
const ANGLE = -0.32;
const MIN_DURATION_MS = 900;
const HOLD_AT_FULL_MS = 260;
const INTRO_DELAY_MS = 90;
const EXIT_MS = 900;
const EXIT_INTENSITY = 2.6;

type Star = {
  x: number;
  y: number;
  z: number;
  color: readonly [number, number, number];
};

const palette = [
  [64, 222, 236],
  [118, 239, 255],
  [89, 91, 210],
] as const;

export function Loader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intensityRef = useRef(0);
  const [percent, setPercent] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let pixelRatio = Math.min(window.devicePixelRatio, 2);
    let stars: Star[] = [];
    let frame = 0;
    const startedAt = performance.now();
    let previousAt = startedAt;
    let exitStartedAt = 0;
    let introTimer = 0;
    let removeTimer = 0;

    const spawn = (initial: boolean): Star => ({
      x: Math.random() * (width + height * Math.abs(Math.sin(ANGLE))) - height * Math.abs(Math.sin(ANGLE)) * .5,
      y: initial ? Math.random() * height : -Math.random() * height * .4 - 40,
      z: Math.random(),
      color: palette[Math.floor(Math.random() * palette.length)] ?? palette[0],
    });

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      pixelRatio = Math.min(window.devicePixelRatio, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.fillStyle = "#000";
      context.fillRect(0, 0, width, height);
      stars = Array.from({ length: STAR_COUNT }, () => spawn(true));
    };

    const beginExit = (now: number) => {
      exitStartedAt = now;
      setExiting(true);
      introTimer = window.setTimeout(() => {
        document.documentElement.dataset.amedIntro = "ready";
        window.dispatchEvent(new Event("amed:intro"));
      }, INTRO_DELAY_MS);
      removeTimer = window.setTimeout(() => {
        cancelAnimationFrame(frame);
        window.removeEventListener("resize", resize);
        setRemoved(true);
      }, EXIT_MS);
    };

    const drawStars = (delta: number) => {
      const boost = intensityRef.current;
      const dx = Math.sin(ANGLE);
      const dy = Math.cos(ANGLE);
      context.globalCompositeOperation = "source-over";
      context.fillStyle = `rgba(0,0,0,${.34 - Math.min(boost, 2) * .1})`;
      context.fillRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";
      stars.forEach((star, index) => {
        const depth = .25 + star.z * .75;
        const speed = (140 + depth * 620) * (.55 + boost * 1.35);
        const step = speed * delta;
        const previousX = star.x;
        const previousY = star.y;
        star.x += dx * step;
        star.y += dy * step;
        const trailLength = step * (1.1 + boost * 1.6);
        const tailX = previousX - dx * trailLength;
        const tailY = previousY - dy * trailLength;
        const alpha = (.1 + depth * .5) * Math.min(1, .35 + boost);
        const [red, green, blue] = star.color;
        const hot = .3;
        const headRed = Math.round(red + (255 - red) * hot);
        const headGreen = Math.round(green + (255 - green) * hot);
        const headBlue = Math.round(blue + (255 - blue) * hot);
        const gradient = context.createLinearGradient(tailX, tailY, star.x, star.y);
        gradient.addColorStop(0, `rgba(${red},${green},${blue},0)`);
        gradient.addColorStop(1, `rgba(${headRed},${headGreen},${headBlue},${alpha})`);
        context.strokeStyle = gradient;
        context.lineWidth = .5 + depth * 1.4;
        context.lineCap = "round";
        context.beginPath();
        context.moveTo(tailX, tailY);
        context.lineTo(star.x, star.y);
        context.stroke();
        if (star.y - trailLength > height || star.x < -height || star.x > width + height) {
          stars[index] = spawn(false);
        }
      });
    };

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const nextPercent = Math.min(100, Math.floor(elapsed / MIN_DURATION_MS * 100));
      setPercent((current) => current === nextPercent ? current : nextPercent);
      if (!exitStartedAt && elapsed >= MIN_DURATION_MS + HOLD_AT_FULL_MS) beginExit(now);
      intensityRef.current = exitStartedAt
        ? 1 + Math.min(1, (now - exitStartedAt) / EXIT_MS) * EXIT_INTENSITY
        : nextPercent / 100;
      const delta = Math.min((now - previousAt) / 1000, .05);
      previousAt = now;
      if (!reducedMotion) drawStars(delta);
      frame = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(introTimer);
      window.clearTimeout(removeTimer);
      window.removeEventListener("resize", resize);
    };
  }, []);

  if (removed) return null;

  return (
    <div className={`${styles.loader} ${exiting ? styles.exiting : ""}`} aria-label={`Loading ${percent}%`}>
      <canvas className={styles.canvas} ref={canvasRef} aria-hidden="true" />
      <div className={styles.identity}>
        <span>AMED</span><span>MEDTECH CAPITAL</span>
      </div>
      <div className={styles.progressArea}>
        <div className={styles.progressRow}>
          <span>INITIALIZING CLINICAL INTELLIGENCE</span>
          <span className={styles.counter}>{String(percent).padStart(3, "0")}<i>%</i></span>
        </div>
        <div className={styles.track}><span data-progress={percent} ref={(element) => {
          if (element) element.style.width = `${percent}%`;
        }} /></div>
      </div>
    </div>
  );
}
