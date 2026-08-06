"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { clamp01, scrollTarget } from "@/lib/scroll";
import styles from "./HeroOverlay.module.css";

const metrics = [
  ["$100M+", "Capital Deployed"],
  ["12+", "MedTech Portfolio Companies"],
  ["5+", "FDA Breakthroughs / Clearances"],
  ["US & Asia", "Cross-Border Network"],
] as const;

const headline = "Funding MedTech Innovations that Matter.";
const subheadline = "Strategic Capital & Global Expertise for Breakthrough Medical Device Founders.";

function splitLetters(text: string): ReactNode {
  return text.split(" ").map((word, wordIndex) => (
    <span className={styles.letterWord} key={`${word}-${wordIndex}`}>
      {[...word].map((letter, index) => (
        <span data-reveal-letter key={`${letter}-${index}`}>{letter}</span>
      ))}
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

function scheduleReveal(root: HTMLElement, baseDelay: number) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.querySelectorAll<HTMLElement>("[data-reveal-letter]").forEach((item, index) => {
    item.style.transitionDelay = reducedMotion ? "0ms" : `${baseDelay + index * 26}ms`;
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
    const reveal = () => {
      if (revealedRef.current || !rootRef.current) return;
      revealedRef.current = true;
      scheduleReveal(rootRef.current, 200);
    };
    window.addEventListener("amed:intro", reveal);
    if (document.documentElement.dataset.amedIntro === "ready") reveal();
    return () => window.removeEventListener("amed:intro", reveal);
  }, []);

  return (
    <section
      id="top"
      className={`${styles.hero} amed-overlay`}
      aria-label="AMED Ventures introduction"
      ref={(element) => {
        rootRef.current = element;
        if (element) element.style.opacity = String(opacity);
      }}
    >
      <h1 className={`${styles.title} amed-display`}>
        <span className="sr-only">{headline}</span>
        <span className={styles.letterLine} aria-hidden="true">{splitLetters(headline)}</span>
      </h1>

      <div className={styles.message}>
        <p className={`${styles.subheadline} amed-body`}>
          <span className="sr-only">{subheadline}</span>
          <span className={styles.wordLine} aria-hidden="true">{splitWords(subheadline)}</span>
        </p>
        <div className={styles.actions} data-unit-reveal>
          <a className="amed-button" href="#portfolio">Explore Portfolio</a>
          <a className="amed-button amed-button--ghost" href="#contact">Contact Us</a>
        </div>
      </div>

      <div className={styles.metrics} aria-label="AMED Ventures key metrics">
        {metrics.map(([value, label]) => (
          <div className={styles.metric} data-unit-reveal key={label}>
            <strong>{value}</strong><span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
