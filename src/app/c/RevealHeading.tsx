"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./page.module.css";

type RevealHeadingProps = {
  as: "h1" | "h2" | "h3";
  active?: boolean;
  className?: string;
  id?: string;
  lines: readonly ReactNode[];
};

export function RevealHeading({
  as: Heading,
  active,
  className = "",
  id,
  lines,
}: RevealHeadingProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;
    if (active !== undefined) return;
    if (reducedMotion) return;
    if (!("IntersectionObserver" in window)) {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { threshold: 0.08, rootMargin: "0px 0px -6%" },
    );
    observer.observe(heading);
    return () => observer.disconnect();
  }, [active, reducedMotion]);

  const isVisible = active ?? visible;
  let wordIndex = 0;

  return (
    <Heading
      className={`${className} ${styles.kineticHeading} ${!reducedMotion ? styles.kineticHeadingReady : ""} ${isVisible || reducedMotion ? styles.kineticHeadingVisible : ""}`}
      id={id}
      ref={headingRef}
    >
      {lines.map((line, lineIndex) => {
        const words = typeof line === "string" ? line.trim().split(/\s+/) : null;
        return (
          <span className={styles.kineticLine} key={lineIndex}>
            {(words ?? [line]).map((word) => {
              const delay = wordIndex++ * 58;
              return (
                <span className={styles.kineticWordMask} key={`${String(word)}-${delay}`}>
                  <span
                    className={styles.kineticWord}
                    style={{ "--kinetic-delay": `${delay}ms` } as CSSProperties}
                  >
                    {word}
                  </span>
                </span>
              );
            })}
          </span>
        );
      })}
    </Heading>
  );
}
