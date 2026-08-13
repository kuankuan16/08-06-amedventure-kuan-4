"use client";

import Image from "next/image";
import { type AnimationEvent, useEffect, useRef, useState } from "react";
import styles from "./CIntroLoader.module.css";

export function CIntroLoader() {
  const [removed, setRemoved] = useState(false);
  const previousOverflow = useRef("");

  useEffect(() => {
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow.current;
    };
  }, []);

  const finish = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.currentTarget !== event.target) return;
    document.body.style.overflow = previousOverflow.current;
    setRemoved(true);
  };

  if (removed) return null;

  return (
    <div
      className={styles.loader}
      role="status"
      aria-label="Loading AMED Ventures"
      onAnimationEnd={finish}
    >
      <div className={styles.logoWindow}>
        <Image
          className={styles.logo}
          src="/brand/amed-logo-white.png"
          alt="AMED Ventures"
          width={1999}
          height={452}
          priority
        />
      </div>
      <span className="sr-only">Loading AMED Ventures</span>
    </div>
  );
}
