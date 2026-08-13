"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./FixedFilmHero.module.css";

const slideDuration = 4_500;
const crossfadeDuration = 680;

type FilmSlide = {
  id: string;
  index: string;
  label: string;
  navLabel: string;
  headline: readonly string[];
  body: string;
  video: string | null;
  poster: string;
};

const slides: readonly FilmSlide[] = [
  {
    id: "partnership",
    index: "01",
    label: "Long-term partnership",
    navLabel: "Partnership",
    headline: ["Long-term", "partnership."],
    body: "We stay with founders for the long run, from first clinical evidence through global scale.",
    video: "/videos/v7-fixed-film/web/01-partnership.mp4",
    poster: "/images/amed/hero-investment-01-partnership.jpg",
  },
  {
    id: "conviction",
    index: "02",
    label: "High-conviction investing",
    navLabel: "Conviction",
    headline: ["High-conviction", "investing."],
    body: "Fewer, deeper positions in medical technology where the clinical case and team convince us.",
    video: "/videos/v7-fixed-film/web/02-conviction.mp4",
    poster: "/images/amed/hero-investment-02-conviction.jpg",
  },
  {
    id: "entrepreneurs",
    index: "03",
    label: "Exceptional entrepreneurs",
    navLabel: "Founders",
    headline: ["Exceptional", "entrepreneurs."],
    body: "Strategic guidance, deep industry expertise and hands-on support for the teams building it.",
    video: "/videos/v7-fixed-film/web/03-founders.mp4",
    poster: "/images/amed/hero-investment-03-entrepreneurs.jpg",
  },
  {
    id: "impact",
    index: "04",
    label: "Meaningful impact",
    navLabel: "Impact",
    headline: ["Meaningful", "impact."],
    body: "What we build is finally measured in outcomes for the patients on the other end of it.",
    video: "/videos/v7-fixed-film/web/04-impact.mp4",
    poster: "/images/amed/hero-investment-04-impact.jpg",
  },
];

export function FixedFilmHero() {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const previousIndexRef = useRef<number | null>(null);
  const cycleStartRef = useRef(0);
  const pausedRef = useRef(false);
  const cycleProgressRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cycleProgress, setCycleProgress] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    let frame = 0;
    cycleStartRef.current = performance.now();

    const tick = (now: number) => {
      if (pausedRef.current) {
        cycleStartRef.current = now - slideDuration * cycleProgressRef.current;
      } else {
        const nextProgress = (now - cycleStartRef.current) / slideDuration;
        if (nextProgress >= 1) {
          cycleStartRef.current = now;
          cycleProgressRef.current = 0;
          setCycleProgress(0);
          setActiveIndex((current) => (current + 1) % slides.length);
        } else {
          cycleProgressRef.current = nextProgress;
          setCycleProgress(nextProgress);
        }
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion]);

  useEffect(() => {
    const outgoingIndex = previousIndexRef.current;
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === activeIndex && !reducedMotion) {
        video.currentTime = 0;
        void video.play().catch(() => undefined);
      } else if (index !== outgoingIndex) {
        video.pause();
      }
    });
    previousIndexRef.current = activeIndex;

    if (outgoingIndex === null || outgoingIndex === activeIndex) return;
    const pauseOutgoing = window.setTimeout(() => {
      videoRefs.current[outgoingIndex]?.pause();
    }, crossfadeDuration);
    return () => window.clearTimeout(pauseOutgoing);
  }, [activeIndex, reducedMotion]);

  const selectSlide = useCallback((index: number) => {
    cycleStartRef.current = performance.now();
    cycleProgressRef.current = 0;
    setCycleProgress(0);
    setActiveIndex(index);
  }, []);

  const scrollPastHero = useCallback(() => {
    const nextSection = document.getElementById("investment-focus");
    if (!nextSection) return;
    nextSection.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [reducedMotion]);

  const activeSlide = slides[activeIndex];

  return (
    <section
      className={styles.hero}
      ref={sectionRef}
      aria-label="AMED Ventures"
      data-motion-static
    >
      <div className={styles.stickyFrame}>
        <div className={styles.film} aria-hidden="true">
          {slides.map((slide, index) => (
            <div
              className={styles.videoLayer}
              key={slide.id}
              style={{ opacity: index === activeIndex ? 1 : 0 }}
            >
              {slide.video ? (
                <video
                  className={styles.video}
                  ref={(video) => {
                    videoRefs.current[index] = video;
                  }}
                  src={slide.video}
                  poster={slide.poster}
                  muted
                  playsInline
                  preload="auto"
                  style={{
                    transform:
                      index === activeIndex && !reducedMotion
                        ? "scale(1.06)"
                        : "scale(1)",
                  }}
                >
                  Your browser does not support background video.
                </video>
              ) : (
                <Image
                  className={`${styles.video} ${styles.partnershipImage}`}
                  src={slide.poster}
                  alt=""
                  fill
                  sizes="100vw"
                  style={{
                    transform:
                      index === activeIndex && !reducedMotion
                        ? "scale(1.045)"
                        : "scale(1)",
                  }}
                />
              )}
            </div>
          ))}
          <div className={styles.brightGrade} />
          <div className={styles.readabilityWash} />
        </div>

        <div className={styles.contentFrame}>
          <div className={styles.copy} key={activeSlide.id} aria-live="polite">
            <p className={styles.eyebrow}>
              <span>{activeSlide.index}</span>
              <i aria-hidden="true" />
              <span>{activeSlide.label}</span>
            </p>
            <h1>
              {activeSlide.headline.map((line, index) => (
                <span className={styles.lineMask} key={line}>
                  <span style={{ animationDelay: `${index * 110 + 60}ms` }}>
                    {line}
                  </span>
                </span>
              ))}
            </h1>
            <p className={styles.body}>{activeSlide.body}</p>
          </div>

          <div className={styles.navigation}>
            <ol>
              {slides.map((slide, index) => {
                const isActive = index === activeIndex;
                return (
                  <li key={slide.id}>
                    <button
                      type="button"
                      aria-label={`Show ${slide.label}`}
                      aria-current={isActive ? "true" : undefined}
                      onClick={() => selectSlide(index)}
                      onPointerEnter={() => {
                        pausedRef.current = true;
                      }}
                      onPointerLeave={() => {
                        pausedRef.current = false;
                      }}
                    >
                      <span className={styles.progressTrack}>
                        <span
                          style={{
                            opacity: index < activeIndex ? 0.38 : 1,
                            width: isActive
                              ? `${cycleProgress * 100}%`
                              : index < activeIndex
                                ? "100%"
                                : "0%",
                          }}
                        />
                      </span>
                      <span className={styles.navLabel}>
                        <span>{slide.index}</span>
                        <span>{slide.navLabel}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <button
            className={styles.scrollCue}
            type="button"
            aria-label="Continue to AMED investment focus"
            onClick={scrollPastHero}
          >
            <span className={styles.scrollCueCircle}>
              <svg viewBox="0 0 20 20" focusable="false">
                <path d="M10 2.5v13M7.25 12.75 10 15.5l2.75-2.75" />
              </svg>
            </span>
            <span>Scroll</span>
          </button>
        </div>

      </div>
    </section>
  );
}
