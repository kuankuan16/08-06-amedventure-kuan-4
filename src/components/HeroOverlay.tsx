"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { clamp01, scrollTarget } from "@/lib/scroll";
import { AnimatedNumber } from "./AnimatedNumber";
import styles from "./HeroOverlay.module.css";

type Metric =
  | { target: number; prefix: string; suffix: string; label: string }
  | { text: string; label: string };

const metrics: readonly Metric[] = [
  { target: 100, prefix: "$", suffix: "M+", label: "Capital Deployed" },
  { target: 12, prefix: "", suffix: "+", label: "MedTech Portfolio Companies" },
  { target: 5, prefix: "", suffix: "+", label: "FDA Breakthroughs / Clearances" },
  { text: "US & Asia", label: "Cross-Border Network" },
] as const;

const headline = "Funding MedTech Innovations that Matter.";
const subheadline = "Strategic Capital & Global Expertise for Breakthrough Medical Device Founders.";

function splitHeadline(): ReactNode {
  return ["Funding MedTech", "Innovations that", "Matter."].map((line, index) => (
    <span className={styles.letterWord} key={line}>
      <span data-reveal-line style={{ transitionDelay: `${100 + index * 90}ms` }}>{line}</span>
    </span>
  ));
}

function splitWords(text: string): ReactNode {
  return text.split(" ").map((word, index) => (
    <span className={styles.wordMask} data-reveal-word key={`${word}-${index}`}>
      <span>{word}</span>
    </span>
  ));
}

function AnimatedMetric({ metric }: { metric: Metric }) {
  if ("text" in metric) return <strong>{metric.text}</strong>;
  return <strong><AnimatedNumber target={metric.target} prefix={metric.prefix} suffix={metric.suffix} /></strong>;
}

function scheduleReveal(root: HTMLElement, baseDelay: number) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.querySelectorAll<HTMLElement>("[data-reveal-line]").forEach((item, index) => {
    item.style.transitionDelay = reducedMotion ? "0ms" : `${baseDelay + index * 90}ms`;
  });
  root.querySelectorAll<HTMLElement>("[data-reveal-word]").forEach((item, index) => {
    item.style.transitionDelay = reducedMotion ? "0ms" : `${baseDelay + 300 + index * 42}ms`;
    const inner = item.firstElementChild;
    if (inner instanceof HTMLElement) inner.style.transitionDelay = item.style.transitionDelay;
  });
  root.classList.add(styles.revealed);
}

export function HeroOverlay() {
  const rootRef = useRef<HTMLElement>(null);
  const revealedRef = useRef(false);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    let frame = 0;
    const updateOpacity = () => {
      frame = 0;
      const clock = scrollTarget(window.scrollY, window.innerHeight);
      setOpacity(1 - clamp01((clock - .08) / .2));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateOpacity);
    };
    updateOpacity();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (revealedRef.current || !rootRef.current) return;
    revealedRef.current = true;
    scheduleReveal(rootRef.current, 100);
  }, []);

  const interactive = opacity > .05;

  return (
    <section
      id="top"
      className={`${styles.hero} ${interactive ? styles.interactive : ""} amed-overlay`}
      aria-label="AMED Ventures introduction"
      aria-hidden={!interactive}
      inert={!interactive}
      ref={(element) => {
        rootRef.current = element;
        if (element) element.style.opacity = String(opacity);
      }}
    >
      <h1 className={`${styles.title} amed-display`}>
        <span className="sr-only">{headline}</span>
        <span className={styles.letterLine} aria-hidden="true">{splitHeadline()}</span>
      </h1>

      <div className={styles.message}>
        <p className={`${styles.subheadline} amed-body`}>
          <span className="sr-only">{subheadline}</span>
          <span className={styles.wordLine} aria-hidden="true">{splitWords(subheadline)}</span>
        </p>
        <div className={styles.actions} data-unit-reveal>
          <a className="amed-button" href="#portfolio">Explore Portfolio</a>
        </div>
      </div>

      <div className={styles.metrics} aria-label="AMED Ventures key metrics">
        {metrics.map((metric) => (
          <div className={styles.metric} data-unit-reveal key={metric.label}>
            <AnimatedMetric metric={metric} /><span>{metric.label}</span>
          </div>
        ))}
      </div>

    </section>
  );
}
