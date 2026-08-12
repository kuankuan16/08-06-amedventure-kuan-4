"use client";

import { useEffect, useRef, useState } from "react";
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

/** Counts up to `target` the first time it scrolls into view; reduced motion renders the final
 *  value outright. Remounting it (a changed key) lets the count run again. */
export function AnimatedNumber({ target, prefix = "", suffix = "", pad = 0, duration = 1800, delay = 0 }: AnimatedNumberProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (reducedMotion || !node) return;

    let frame = 0;
    let startTimer = 0;
    const run = () => {
      startTimer = window.setTimeout(() => {
        const startedAt = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - startedAt) / duration);
          setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      }, delay);
    };

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      run();
    }, { threshold: 0.4 });
    observer.observe(node);

    return () => {
      observer.disconnect();
      window.clearTimeout(startTimer);
      cancelAnimationFrame(frame);
    };
  }, [target, duration, delay, reducedMotion]);

  return <span ref={ref}>{prefix}{String(reducedMotion ? target : value).padStart(pad, "0")}{suffix}</span>;
}
