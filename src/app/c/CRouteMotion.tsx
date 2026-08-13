"use client";

import type LenisType from "lenis";
import { usePathname } from "next/navigation";
import { type PropsWithChildren, useEffect, useRef } from "react";
import styles from "./CRouteMotion.module.css";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function CRouteMotion({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;

    let disposed = false;
    let lenis: LenisType | null = null;
    let frame = 0;
    let startTimer = 0;
    let currentLift = 0;
    let targetLift = 0;
    let previousLift = Number.NaN;

    const onLenisScroll = (instance: LenisType) => {
      targetLift = clamp(instance.velocity * -0.34, -8, 8);
    };

    const tick = (time: number) => {
      if (!lenis) return;
      lenis.raf(time);
      currentLift += (targetLift - currentLift) * 0.14;
      targetLift *= 0.9;
      const nextLift = Math.abs(currentLift) < 0.01 ? 0 : currentLift;
      if (Math.abs(nextLift - previousLift) > 0.01) {
        root.style.setProperty("--scroll-lift", `${nextLift.toFixed(2)}px`);
        previousLift = nextLift;
      }
      frame = requestAnimationFrame(tick);
    };

    const start = async () => {
      const { default: Lenis } = await import("lenis");
      if (disposed) return;

      lenis = new Lenis({
        lerp: 0.09,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.86,
      });
      lenis.on("scroll", onLenisScroll);
      frame = requestAnimationFrame(tick);
    };

    startTimer = window.setTimeout(() => void start(), 320);

    return () => {
      disposed = true;
      window.clearTimeout(startTimer);
      cancelAnimationFrame(frame);
      lenis?.off("scroll", onLenisScroll);
      lenis?.destroy();
      root.style.removeProperty("--scroll-lift");
    };
  }, [pathname]);

  return (
    <div className={styles.motionRoot} ref={rootRef}>
      {children}
    </div>
  );
}
