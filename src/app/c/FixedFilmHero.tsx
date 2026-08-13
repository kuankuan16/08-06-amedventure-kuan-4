"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./FixedFilmHero.module.css";

const slideDuration = 8_200;

const slides = [
  {
    id: "healthcare",
    index: "01",
    label: "Healthcare",
    headline: ["Capital that reaches", "the bedside."],
    body: "We back the medical technologies that change what a clinician can actually do — on an ordinary Tuesday morning, in a real hospital.",
    video: "/videos/v7-fixed-film/01-healthcare.mp4",
    poster: "/videos/v7-fixed-film/poster-01.jpg",
  },
  {
    id: "therapeutics",
    index: "02",
    label: "Therapeutics",
    headline: ["From molecule", "to medicine."],
    body: "Discovery is slow, expensive and unforgiving. We fund the teams with the rigour — and the patience — to carry a candidate all the way through.",
    video: "/videos/v7-fixed-film/02-drug-discovery.mp4",
    poster: "/videos/v7-fixed-film/poster-02.jpg",
  },
  {
    id: "intelligence",
    index: "03",
    label: "Applied AI",
    headline: ["Intelligence, applied", "to biology."],
    body: "Models that read the scan, design the molecule, and flag the patient who is about to deteriorate. Built to be used in practice, not demonstrated on stage.",
    video: "/videos/v7-fixed-film/03-ai-innovation.mp4",
    poster: "/videos/v7-fixed-film/poster-03.jpg",
  },
  {
    id: "impact",
    index: "04",
    label: "Partnership",
    headline: ["Patient capital.", "Human partnership."],
    body: "Behind every breakthrough is a team carrying uncertainty for years. We bring patient capital, operating perspective, and a partnership that stays close when the work gets difficult.",
    video: null,
    poster: "/videos/v7-fixed-film/04-partnership.png",
  },
] as const;

export function FixedFilmHero() {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const handoffCopyRef = useRef<HTMLDivElement>(null);
  const handoffTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const cycleStartRef = useRef(0);
  const pausedRef = useRef(false);
  const cycleProgressRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cycleProgress, setCycleProgress] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

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
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === activeIndex && !reducedMotion) {
        video.currentTime = 0;
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    });
  }, [activeIndex, reducedMotion]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      setScrollProgress(Math.min(1, Math.max(0, -rect.top / travel)));
    };
    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const selectSlide = useCallback((index: number) => {
    cycleStartRef.current = performance.now();
    cycleProgressRef.current = 0;
    setCycleProgress(0);
    setActiveIndex(index);
  }, []);

  const activeSlide = slides[activeIndex];
  const frameOpacity = reducedMotion ? 1 : 1 - scrollProgress;
  const contentOpacity = reducedMotion
    ? 1
    : 1 - Math.min(1, scrollProgress * 1.55);
  const handoffProgress = reducedMotion
    ? 0
    : Math.min(1, Math.max(0, (scrollProgress - 0.34) / 0.2));

  useLayoutEffect(() => {
    const copy = handoffCopyRef.current;
    if (!copy || reducedMotion) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ paused: true });

      timeline
        .fromTo(
          `.${styles.handoffEyebrow}`,
          { autoAlpha: 0, y: 22, letterSpacing: "0.32em" },
          {
            autoAlpha: 1,
            y: 0,
            letterSpacing: "0.16em",
            duration: 0.3,
            ease: "power3.out",
          },
        )
        .fromTo(
          `.${styles.handoffLine} > span`,
          { autoAlpha: 0, yPercent: 112, rotateX: -18, filter: "blur(12px)" },
          {
            autoAlpha: 1,
            yPercent: 0,
            rotateX: 0,
            filter: "blur(0px)",
            duration: 0.58,
            stagger: 0.075,
            ease: "power4.out",
          },
          0.06,
        )
        .fromTo(
          `.${styles.handoffBody}`,
          { autoAlpha: 0, y: 34, filter: "blur(8px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.36,
            ease: "power3.out",
          },
          0.48,
        );

      handoffTimelineRef.current = timeline;
    }, copy);

    return () => {
      handoffTimelineRef.current = null;
      context.revert();
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    handoffTimelineRef.current?.progress(handoffProgress);
  }, [handoffProgress, reducedMotion]);

  return (
    <section className={styles.hero} ref={sectionRef} aria-label="AMED Ventures">
      <div className={styles.stickyFrame}>
        <div
          className={styles.film}
          aria-hidden="true"
          style={{
            opacity: frameOpacity,
            transform: reducedMotion
              ? "none"
              : `scale(${1 - 0.035 * scrollProgress})`,
          }}
        >
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
                  preload={index === 0 ? "auto" : "metadata"}
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

        <div
          className={styles.contentFrame}
          style={{
            opacity: contentOpacity,
            transform: reducedMotion
              ? "none"
              : `translate3d(0, ${-60 * scrollProgress}px, 0)`,
          }}
        >
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

          <span className={styles.scrollCue} aria-hidden="true">
            <span className={styles.scrollCueCircle}>
              <svg viewBox="0 0 20 20" focusable="false">
                <path d="M10 2.5v13M7.25 12.75 10 15.5l2.75-2.75" />
              </svg>
            </span>
            <span>Scroll</span>
          </span>

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
                        <span>{slide.label}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <div
          className={styles.handoff}
          aria-hidden={handoffProgress < 0.05}
          style={{ opacity: handoffProgress }}
        >
          <div className={styles.handoffCopy} ref={handoffCopyRef}>
            <p className={styles.handoffEyebrow}>
              A standard worth building toward
            </p>
            <h2>
              <span className={styles.handoffLine}>
                <span>Breakthroughs matter</span>
              </span>
              <span className={styles.handoffLine}>
                <span>when patients feel</span>
              </span>
              <span className={styles.handoffLine}>
                <span>the difference.</span>
              </span>
            </h2>
            <p className={styles.handoffBody}>
              We invest in the long work between a promising idea and trusted
              care — where evidence, execution and endurance turn possibility
              into practice.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
