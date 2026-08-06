"use client";

import { smoothstep } from "@/lib/scroll";
import { useScrollClock } from "./useScrollClock";
import styles from "./FocusOverlay.module.css";

type FocusOverlayProps = { clock?: number };

const focuses = [
  { index: "01", title: "Cardiovascular", copy: "Restoring circulation with minimally invasive systems designed for decisive moments in care." },
  { index: "02", title: "Neurovascular", copy: "Advancing intervention and intelligent recovery across the continuum of stroke." },
  { index: "03", title: "Oncology & Embolization", copy: "Backing precise delivery and controlled occlusion where therapeutic accuracy matters most." },
  { index: "04", title: "Surgical Innovations", copy: "Equipping clinicians with instrumentation that expands what is possible in the operating room." },
];

const investors = ["Bain Capital Life Sciences", "Novo Holdings", "Cormorant", "D1 Capital"];

export function FocusOverlay({ clock: providedClock }: FocusOverlayProps) {
  const clock = useScrollClock(providedClock);
  const opacity = smoothstep(0.32, 0.52, clock) * (1 - smoothstep(1.9, 2.3, clock));
  const active = clock > 0.45 && clock < 2.05;

  return (
    <section
      className={`${styles.overlay} ${active ? styles.active : ""}`}
      style={{ opacity }}
      aria-hidden={!active}
    >
      <div className={styles.intro}>
        <p className={`${styles.eyebrow} amed-tag`}>Strategic focus</p>
        <h2 className={`${styles.heading} amed-display`}>Capital follows clinical consequence.</h2>
        <p className={`${styles.support} amed-body`}>
          Specialist conviction across medical device categories where evidence, execution and patient outcomes align.
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
        <div className={styles.investors}>
          <p className="amed-tag">Co-invested alongside Tier-1 Life Science VCs</p>
          <div className={styles.wordmarks}>
            {investors.map((investor) => <span key={investor}>{investor}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}
