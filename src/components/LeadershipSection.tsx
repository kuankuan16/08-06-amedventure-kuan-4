"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./LeadershipSection.module.css";
import { AnimatedHeading } from "./AnimatedHeading";

/** Names and roles as supplied in AMED's website brief. Biographies are on the team page. */
const highlights = [
  ["Managing Partners", "Michael Wang, Chairman & Managing Partner. William Tai and Joe Liu, Managing Partners."],
  ["Venture Advisors", "Dr. TJ Liu, Dr. Kuan Chen and Fred Shen advise across clinical, technical and commercial questions."],
  ["Investment Team", "Michelle Tsai, Jeremy Tseng, CFA, Bin Chou, Ph.D. and Jonathan Feng, spanning interventional technologies, MedTech CDMO, diagnostics and AI in healthcare."],
] as const;

export function LeadershipSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.12 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.wrapper} id="team" ref={sectionRef}>
      <div className={`${styles.card} ${visible ? styles.visible : ""}`}>
        <div className={styles.copy}>
          <p className={`${styles.eyebrow} amed-tag`}>Partnership in practice</p>
          <AnimatedHeading reveal={visible} lines={["Led by seasoned", "MedTech", "entrepreneurs &", "global investors."]} className={`${styles.heading} amed-display`}>Led by seasoned MedTech entrepreneurs &amp; global investors.</AnimatedHeading>
          <p className={`${styles.body} amed-body`}>
            Our team brings decades of combined experience across investment, business development and operational management, from large public companies to early-stage startups. We believe that with the right support, today&apos;s pioneering idea becomes tomorrow&apos;s global impact.
          </p>
        </div>

        <figure className={`${styles.figure} ${visible ? styles.figureVisible : ""}`}>
          <Image
            src="/images/amed/leadership-founders.jpg"
            alt="MedTech founders in conversation in a luminous clinical setting"
            fill
            sizes="(max-width: 1024px) calc(100vw - 6rem), 39vw"
          />
        </figure>

        <div className={styles.highlights}>
          {highlights.map(([title, description], index) => (
            <article className={styles.highlight} key={title}>
              <span className="amed-tag">[ 0{index + 1} ]</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
