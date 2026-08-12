"use client";

import { type ReactNode, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { IconArrowLeft, IconArrowRight } from "./icons";

export type HeroSlide = { src: string; alt: string; headline: ReactNode };

type HeroCarouselProps = {
  slides: HeroSlide[];
  /** Class names from the host page, so the carousel carries that proposal's styling. */
  classes: {
    root: string;
    headline: string;
    frame: string;
    slide: string;
    slideActive: string;
    controls: string;
    arrow: string;
    dots: string;
    dot: string;
    dotActive: string;
  };
  interval?: number;
};

/** Cross-fading hero carousel. Advances on its own unless the visitor prefers reduced motion,
 *  and pauses whenever a pointer or keyboard focus is inside the frame. */
export function HeroCarousel({ slides, classes, interval = 6000 }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const count = slides.length;

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  useEffect(() => {
    if (reducedMotion || paused || count < 2) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % count), interval);
    return () => window.clearInterval(timer);
  }, [reducedMotion, paused, count, interval]);

  return (
    <div
      className={classes.root}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      role="group"
      aria-roledescription="carousel"
      aria-label="AMED Ventures in practice"
    >
      {/* Keyed on the index so the headline remounts and replays its fade with each slide. */}
      <h1 className={classes.headline} key={index}>{slides[index]?.headline}</h1>

      <div className={classes.frame}>
        {slides.map((slide, slideIndex) => (
          <Image
            key={slide.src}
            className={`${classes.slide} ${slideIndex === index ? classes.slideActive : ""}`}
            src={slide.src}
            alt={slide.alt}
            width={1344}
            height={752}
            priority={slideIndex === 0}
            aria-hidden={slideIndex !== index}
          />
        ))}
      </div>

      <div className={classes.controls}>
        <button className={classes.arrow} type="button" onClick={() => go(index - 1)} aria-label="Previous slide"><IconArrowLeft /></button>
        <div className={classes.dots}>
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.src}
              className={`${classes.dot} ${slideIndex === index ? classes.dotActive : ""}`}
              type="button"
              onClick={() => setIndex(slideIndex)}
              aria-label={`Show slide ${slideIndex + 1} of ${count}`}
              aria-current={slideIndex === index}
            />
          ))}
        </div>
        <button className={classes.arrow} type="button" onClick={() => go(index + 1)} aria-label="Next slide"><IconArrowRight /></button>
      </div>

      <p className="sr-only" aria-live="polite">{`Slide ${index + 1} of ${count}: ${slides[index]?.alt ?? ""}`}</p>
    </div>
  );
}
