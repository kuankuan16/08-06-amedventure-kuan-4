"use client";

import { useEffect, useRef, useState } from "react";
import { PitchModal } from "./PitchModal";
import { SiteFooter } from "./SiteFooter";
import styles from "./PitchFooter.module.css";
import { AnimatedHeading } from "./AnimatedHeading";

export function PitchFooter() {
  const [modalOpen, setModalOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = footerRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.12 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <footer className={`${styles.footer} ${visible ? styles.visible : ""}`} id="contact" ref={footerRef}>
        <div className={styles.pitch}>
          <p className={`${styles.eyebrow} amed-tag`}>The next clinical standard starts somewhere</p>
          <AnimatedHeading reveal={visible} className={`${styles.heading} amed-display`}>Building the next breakthrough in MedTech?</AnimatedHeading>
          <button className={`${styles.button} amed-button`} type="button" onClick={() => setModalOpen(true)}>Pitch Your Company</button>
        </div>
        <div className={styles.shared}>
          <SiteFooter />
        </div>
      </footer>
      <PitchModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
