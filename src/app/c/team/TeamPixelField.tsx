"use client";

import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { aboutPixelsLottie } from "../about/aboutPixelsLottie";
import styles from "../page.module.css";

export function TeamPixelField() {
  const lottieRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const container = lottieRef.current;
    if (!container) return;
    let animation: AnimationItem | null = null;
    let disposed = false;
    let frame = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const render = () => {
      currentX += (targetX - currentX) * 0.065;
      currentY += (targetY - currentY) * 0.065;
      container.style.transform = `translate3d(${currentX * -20}px, ${currentY * 17}px, 0) rotate(${currentY * -1.2}deg)`;
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
      if (!frame) frame = window.requestAnimationFrame(render);
    };
    const move = (event: PointerEvent) => {
      targetX = event.clientX / window.innerWidth - 0.5;
      targetY = event.clientY / window.innerHeight - 0.5;
      requestRender();
    };

    if (!reducedMotion) {
      window.addEventListener("pointermove", move, { passive: true });
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
          preserveAspectRatio: "xMidYMid slice",
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
        if (!animation) return;
        animation.setLoop(true);
        animation.playSegments([45, 240], true);
      };
      animation.addEventListener("DOMLoaded", start);
      animation.addEventListener("complete", continueLoop);
    });

    return () => {
      disposed = true;
      window.removeEventListener("pointermove", move);
      if (frame) window.cancelAnimationFrame(frame);
      animation?.destroy();
    };
  }, [reducedMotion]);

  return (
    <span className={styles.teamPageLottiePixels} aria-hidden="true">
      <span ref={lottieRef} className={styles.teamPageLottieCanvas} />
      <i className={styles.teamPixelUpperA} />
      <i className={styles.teamPixelUpperB} />
      <i className={styles.teamPixelUpperC} />
      <i className={styles.teamPixelAccent} />
      <i className={styles.teamPixelMidLarge} />
      <i className={styles.teamPixelRightA} />
      <i className={styles.teamPixelRightB} />
    </span>
  );
}
