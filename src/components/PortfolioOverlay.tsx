"use client";

import { smoothstep } from "@/lib/scroll";
import { useScrollClock } from "./useScrollClock";
import styles from "./PortfolioOverlay.module.css";

type PortfolioOverlayProps = { clock?: number };

const companies = [
  ["Imperative Care", "Ischemic stroke & vascular intervention systems."],
  ["Supira Medical", "Next-gen percutaneous ventricular assist device (pVAD)."],
  ["Instylla", "Hydrogel embolics for oncology & hemorrhage control."],
  ["Kandu Health", "BCI-enabled digital stroke recovery platform."],
] as const;

export function PortfolioOverlay({ clock: providedClock }: PortfolioOverlayProps) {
  const clock = useScrollClock(providedClock);
  const opacity = smoothstep(2.2, 2.65, clock) * (1 - smoothstep(3.6, 4.1, clock));
  const active = clock > 2.55 && clock < 3.7;

  return (
    <section className={`${styles.overlay} ${active ? styles.active : ""}`} style={{ opacity }} aria-hidden={!active}>
      <h2 className={`${styles.primary} amed-display`}>Proof, not promise.</h2>
      <p className={`${styles.secondary} amed-display`}>Built beside the breakthroughs.</p>
      <div className={styles.portfolios}>
        {companies.map(([name, description], index) => (
          <article className={styles.card} key={name}>
            <span className="amed-tag">[ 0{index + 1} ]</span>
            <h3>{name}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>
      <a className={styles.cta} href="#portfolio">View All Companies <span aria-hidden>→</span></a>
    </section>
  );
}
