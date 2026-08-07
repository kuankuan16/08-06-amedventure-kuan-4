"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PitchModal } from "./PitchModal";
import styles from "./PitchFooter.module.css";

const footerLinks = [
  ["Focus", "#focus"],
  ["Portfolio", "#portfolio"],
  ["Team", "#team"],
  ["Contact", "https://www.amedventures.com/contact"],
] as const;

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
          <h2 className={`${styles.heading} amed-display`}>Building the next breakthrough in MedTech?</h2>
          <button className={`${styles.button} amed-button`} type="button" onClick={() => setModalOpen(true)}>Pitch Your Company</button>
        </div>
        <div className={styles.rule} />
        <div className={styles.bottom}>
          <div className={styles.identity}>
            <Image src="/brand/amed-logo-white.png" alt="AMED Ventures" width={320} height={120} />
            <p className="amed-tag">San Francisco Bay Area · US &amp; Asia</p>
          </div>
          <nav className={styles.nav} aria-label="Footer navigation">
            {footerLinks.map(([label, href]) => (
              <a href={href} key={label} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>{label}</a>
            ))}
          </nav>
          <p className={styles.copyright}>© {new Date().getFullYear()} AMED Ventures. Investing in health that moves forward.</p>
        </div>
      </footer>
      <PitchModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
