"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./LeadershipSection.module.css";

const highlights = [
  ["Silicon Valley Network", "Direct access to the builders, clinicians and capital shaping the next generation of care."],
  ["FDA & Regulatory Expertise", "Practical guidance that keeps evidence, product strategy and the regulatory path moving together."],
  ["Asian Supply Chain Bridge", "Cross-border fluency that connects ambitious medical technology with trusted manufacturing and market partners."],
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
          <h2 className={`${styles.heading} amed-display`}>
            Led by seasoned MedTech entrepreneurs &amp; global investors.
          </h2>
          <p className={`${styles.body} amed-body`}>
            We work beside founders from the first clinical signal through regulatory strategy and cross-border scale—bringing an operator&apos;s discipline to every inflection point.
          </p>
        </div>

        <figure className={`${styles.figure} ${visible ? styles.figureVisible : ""}`}>
          <Image
            src="/images/amed/leadership-founders-v2.jpg"
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
