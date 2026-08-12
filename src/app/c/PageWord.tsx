"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./page.module.css";

type PageWordProps = {
  children: string;
  tone?: "light" | "dark";
};

export function PageWord({ children, tone = "light" }: PageWordProps) {
  const wordRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [stage, setStage] = useState(reducedMotion ? 2 : 0);

  useEffect(() => {
    if (reducedMotion) return;
    const word = wordRef.current;
    if (!word) return;
    const timers: number[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        setStage(1);
        timers.push(window.setTimeout(() => setStage(2), 150));
      },
      { threshold: 0.1 },
    );
    observer.observe(word);
    return () => {
      observer.disconnect();
      timers.forEach(window.clearTimeout);
    };
  }, [reducedMotion]);

  return (
    <div
      className={`${styles.pageWordStage} ${tone === "dark" ? styles.pageWordStageDark : ""}`}
      ref={wordRef}
      aria-hidden="true"
    >
      <p
        className={`${styles.pageWord} ${stage > 0 ? styles.pageWordIn : ""} ${stage > 1 ? styles.pageWordSet : ""}`}
      >
        {children}
      </p>
    </div>
  );
}
