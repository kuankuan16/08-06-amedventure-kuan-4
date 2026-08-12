"use client";

import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { aboutPixelsLottie } from "./aboutPixelsLottie";
import styles from "../page.module.css";

export function AboutMarkFigure() {
  const lottieRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const container = lottieRef.current;
    if (!container) return;
    let animation: AnimationItem | null = null;
    let disposed = false;
    let frame = 0;
    let entranceComplete = false;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const render = () => {
      currentX += (targetX - currentX) * 0.075;
      currentY += (targetY - currentY) * 0.075;
      container.style.transform = `translate3d(${currentX * 26}px, ${currentY * 20}px, 0) rotate(${currentX * 1.4}deg)`;
      if (
        Math.abs(targetX - currentX) > 0.001 ||
        Math.abs(targetY - currentY) > 0.001
      ) {
        frame = window.requestAnimationFrame(render);
      } else {
        frame = 0;
      }
    };
    const requestRender = () => {
      if (entranceComplete && !frame)
        frame = window.requestAnimationFrame(render);
    };
    const move = (event: PointerEvent) => {
      targetX = event.clientX / window.innerWidth - 0.5;
      targetY = event.clientY / window.innerHeight - 0.5;
      requestRender();
    };
    const reset = () => {
      targetX = 0;
      targetY = 0;
      requestRender();
    };

    if (!reducedMotion) {
      window.addEventListener("pointermove", move, { passive: true });
      document.documentElement.addEventListener("mouseleave", reset);
    }

    void import("lottie-web").then(({ default: lottie }) => {
      if (disposed) return;
      animation = lottie.loadAnimation({
        container,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData: aboutPixelsLottie,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid meet",
          progressiveLoad: true,
          hideOnTransparent: true,
        },
      });
      const start = () => {
        if (!animation) return;
        if (reducedMotion) {
          animation.goToAndStop(45, true);
          return;
        }
        animation.playSegments([0, 45], true);
      };
      const continueLoop = () => {
        if (!animation || entranceComplete) return;
        entranceComplete = true;
        animation.setLoop(true);
        animation.playSegments([45, 240], true);
        requestRender();
      };
      animation.addEventListener("DOMLoaded", start);
      animation.addEventListener("complete", continueLoop);
    });

    return () => {
      disposed = true;
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", reset);
      if (frame) window.cancelAnimationFrame(frame);
      animation?.destroy();
    };
  }, [reducedMotion]);

  return (
    <figure className={styles.quoteFigure} data-reveal>
      <svg
        viewBox="0 0 420 680"
        role="img"
        aria-label="A founder and clinical partner examining a transparent heart prototype together"
      >
        <defs>
          <clipPath id="amedClinicalLensAboutPage">
            <rect x="45" y="10" width="330" height="660" rx="165" />
          </clipPath>
        </defs>
        <image
          href="/images/amed/about-hands-medtech.jpg"
          x="-34"
          y="-52"
          width="462"
          height="748"
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#amedClinicalLensAboutPage)"
        />
      </svg>
      <span
        ref={lottieRef}
        className={styles.quoteLottiePixels}
        aria-hidden="true"
      />
    </figure>
  );
}
