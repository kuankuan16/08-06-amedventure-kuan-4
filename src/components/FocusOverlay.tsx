"use client";

import { smoothstep } from "@/lib/scroll";
import { useScrollClock } from "./useScrollClock";
import { AnimatedHeading } from "./AnimatedHeading";
import styles from "./FocusOverlay.module.css";

type FocusOverlayProps = { clock?: number };

const focuses = [
  { index: "01", title: "Long-Term Partnership", copy: "We stay with founders across the whole growth journey, from first clinical evidence through global scale." },
  { index: "02", title: "High-Conviction Investing", copy: "Fewer, deeper positions in medical technology where the clinical case and the team both convince us." },
  { index: "03", title: "Exceptional Entrepreneurs", copy: "Strategic guidance, industry expertise and operational support for the people building the category." },
  { index: "04", title: "Meaningful Impact", copy: "Companies whose work changes how people live, heal and thrive — every company we back represents lives that will be touched." },
];

export function FocusOverlay({ clock: providedClock }: FocusOverlayProps) {
  const clock = useScrollClock(providedClock);
  const opacity = smoothstep(0.32, 0.52, clock) * (1 - smoothstep(1.9, 2.3, clock));
  const active = clock > 0.45 && clock < 2.05;

  return (
    <section
      className={`${styles.overlay} ${active ? styles.active : ""}`}
      style={{ opacity }}
      aria-hidden={!active}
      inert={!active}
    >
      <div className={styles.intro}>
        <p className={`${styles.eyebrow} amed-tag`}>Investment philosophy</p>
        <AnimatedHeading reveal={active} lines={["Capital follows clinical", "consequence."]} className={`${styles.heading} amed-display`}>Capital follows clinical consequence.</AnimatedHeading>
        <p className={`${styles.support} amed-body`}>
          An ecosystem approach to MedTech — from medical devices to contract manufacturing — where industry partnership turns promising innovation into lasting growth.
        </p>
      </div>

      <div className={styles.lower}>
        <div className={styles.grid}>
          {focuses.map((focus) => (
            <article className={styles.focus} key={focus.index}>
              <span className={`${styles.index} amed-tag`}>[ {focus.index} ]</span>
              <h3>{focus.title}</h3>
              <p>{focus.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
