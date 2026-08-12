"use client";

import Link from "next/link";
import { smoothstep } from "@/lib/scroll";
import { useScrollClock } from "./useScrollClock";
import { AnimatedHeading } from "./AnimatedHeading";
import styles from "./PortfolioOverlay.module.css";

type PortfolioOverlayProps = { clock?: number };

const companies = [
  {
    name: "Imperative Care",
    description: "An end-to-end stroke and vascular platform across the continuum of neurovascular disease.",
    href: "https://imperativecare.com/",
  },
  {
    name: "Supira Medical",
    description: "A next-generation 10F percutaneous ventricular assist device for high-risk PCI.",
    href: "https://supiramedical.com/",
  },
  {
    name: "Instylla",
    description: "The Embrace Hydrogel Embolic System for interventional oncology and peripheral hemostasis.",
    href: "https://instylla.com/",
  },
  {
    name: "Kandu",
    description: "The IpsiHand brain-computer interface with AI-supported remote care for stroke recovery.",
    href: "https://kandu.com/",
  },
] as const;

export function PortfolioOverlay({ clock: providedClock }: PortfolioOverlayProps) {
  const clock = useScrollClock(providedClock);
  const opacity = smoothstep(2.2, 2.65, clock) * (1 - smoothstep(3.6, 4.1, clock));
  const active = clock > 2.55 && clock < 3.7;

  return (
    <section className={`${styles.overlay} ${active ? styles.active : ""}`} style={{ opacity }} aria-hidden={!active} inert={!active}>
      <AnimatedHeading reveal={active} as="h2" lines={["Proof, not", "promise."]} className={`${styles.primary} amed-display`}>Proof, not promise.</AnimatedHeading>
      <p className={`${styles.secondary} amed-body`}>
        A selection of the MedTech companies AMED backs — from first clinical evidence through commercial scale.
      </p>
      <div className={styles.portfolios}>
        {companies.map(({ name, description, href }, index) => (
          <a className={styles.card} href={href} target="_blank" rel="noreferrer" key={name} aria-label={`Visit ${name}`}>
            <span className="amed-tag">[ 0{index + 1} ]</span>
            <h3>{name}</h3>
            <p>{description}</p>
          </a>
        ))}
      </div>
      <Link className={styles.cta} href="/companies">View All Companies <span aria-hidden>→</span></Link>
    </section>
  );
}
