"use client";

import { smoothstep } from "@/lib/scroll";
import { useScrollClock } from "./useScrollClock";
import styles from "./PortfolioOverlay.module.css";

type PortfolioOverlayProps = { clock?: number };

const companies = [
  {
    name: "Imperative Care",
    description: "Connected stroke and vascular-intervention technologies spanning treatment and recovery.",
    href: "https://imperativecare.com/",
  },
  {
    name: "Supira Medical",
    description: "A low-profile, high-flow pVAD for high-risk PCI and cardiogenic shock.",
    href: "https://supiramedical.com/",
  },
  {
    name: "Instylla",
    description: "Resorbable hydrogel embolics for interventional oncology and peripheral hemostasis.",
    href: "https://instylla.com/",
  },
  {
    name: "Kandu Health",
    description: "Integrated BCI rehabilitation and personalized telehealth for stroke recovery.",
    href: "https://kanduhealth.com/",
  },
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
        {companies.map(({ name, description, href }, index) => (
          <a className={styles.card} href={href} target="_blank" rel="noreferrer" key={name} aria-label={`Visit ${name}`}>
            <span className="amed-tag">[ 0{index + 1} ]</span>
            <h3>{name}</h3>
            <p>{description}</p>
          </a>
        ))}
      </div>
      <a className={styles.cta} href="/companies">View All Companies <span aria-hidden>→</span></a>
    </section>
  );
}
