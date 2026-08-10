"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./LeadershipSection.module.css";
import { AnimatedHeading } from "./AnimatedHeading";

const highlights = [
  ["Silicon Valley Network", "A San Francisco Bay Area vantage point on the entrepreneurs, clinicians and capital shaping the next generation of care."],
  ["FDA & Regulatory Expertise", "Operational perspective that keeps clinical evidence, product strategy and the regulatory path moving together."],
  ["Asian Supply Chain Bridge", "Cross-border fluency connecting medical technology with manufacturing, strategic and market partners across Asia."],
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
            AMED brings investment, business-development and operating experience from public companies and startups, providing founders and portfolio companies with value beyond capital.
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
