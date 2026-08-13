"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
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
    if (active !== undefined) return;
    const heading = headingRef.current;
    if (!heading || reducedMotion) return;
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

  return (
    <Heading
      className={`${className} ${styles.lineReveal} ${isVisible || reducedMotion ? styles.revealVisible : ""}`}
      id={id}
      ref={headingRef}
    >
      {lines.map((line, index) => (
        <span key={index}>
          <span>{line}</span>
        </span>
      ))}
    </Heading>
  );
}
