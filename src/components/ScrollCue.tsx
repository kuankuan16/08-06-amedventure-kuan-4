"use client";

import { useEffect, useState } from "react";
import styles from "./ScrollCue.module.css";

type ScrollCueStep = { href: string; label: string; anchor?: string };
/** `hideAfter` is the id of the section past which the cue retires (the footer). */
type ScrollCueProps = ScrollCueStep & { steps?: ScrollCueStep[]; hideAfter?: string };

export function ScrollCue({ href, label, steps, hideAfter }: ScrollCueProps) {
  const [activeStep, setActiveStep] = useState<ScrollCueStep>({ href, label });
  const [retired, setRetired] = useState(false);

  // The cue retires as soon as the closing section is on screen — it has nothing left to point at.
  useEffect(() => {
    if (!hideAfter) return;
    const end = document.getElementById(hideAfter);
    if (!end) return;
    const observer = new IntersectionObserver(([entry]) => setRetired(entry.isIntersecting));
    observer.observe(end);
    return () => observer.disconnect();
  }, [hideAfter]);

  useEffect(() => {
    if (!steps?.length) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const threshold = window.innerHeight * 0.42;
      let next = steps[0];
      steps.forEach((step) => {
        const anchor = step.anchor ? document.getElementById(step.anchor) : null;
        if (anchor && anchor.getBoundingClientRect().top <= threshold) next = step;
      });
      setActiveStep((current) => current.href === next.href ? current : next);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [steps]);

  if (retired) return null;

  return (
    <a className={styles.cue} href={activeStep.href} aria-label={activeStep.label}>
      <span aria-hidden="true">↓</span>
    </a>
  );
}
