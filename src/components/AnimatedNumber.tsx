"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type AnimatedNumberProps = {
  target: number;
  prefix?: string;
  suffix?: string;
  /** Zero-pads the counted value, so a stat rendered as "05" counts as 00 → 05. */
  pad?: number;
  duration?: number;
  delay?: number;
};

/** Counts up to `target` once on mount; reduced motion renders the final value outright. */
export function AnimatedNumber({ target, prefix = "", suffix = "", pad = 0, duration = 1400, delay = 700 }: AnimatedNumberProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    let frame = 0;
    const startTimer = window.setTimeout(() => {
      const startedAt = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, delay);
    return () => {
      window.clearTimeout(startTimer);
      cancelAnimationFrame(frame);
    };
  }, [target, duration, delay, reducedMotion]);

  return <>{prefix}{String(reducedMotion ? target : value).padStart(pad, "0")}{suffix}</>;
}
