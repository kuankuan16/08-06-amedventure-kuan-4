"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SectionAccent } from "@/components/SectionAccent";
import styles from "./page.module.css";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { ScrollCue } from "@/components/ScrollCue";
import { AnimatedNumber } from "@/components/AnimatedNumber";

type Filter = "All" | "Cardiovascular" | "Neurovascular" | "Embolization" | "Surgical" | "Digital Health";

type Company = {
  name: string;
  description: string;
  focus: Exclude<Filter, "All">[];
  href: string;
  status?: string;
  /** Official logo fetched from the company's own site by scripts/fetch-company-logos.mjs. */
  logo?: string;
};

const filters: Filter[] = ["All", "Cardiovascular", "Neurovascular", "Embolization", "Surgical", "Digital Health"];

const companies: Company[] = [
  { name: "Imperative Care", description: "Connected technologies advancing stroke intervention, vascular care and recovery.", focus: ["Neurovascular", "Cardiovascular"], href: "https://imperativecare.com/", logo: "/images/logos/imperative-care.svg" },
  { name: "Supira Medical", description: "A low-profile, high-flow percutaneous ventricular assist device for high-risk PCI and cardiogenic shock.", focus: ["Cardiovascular"], href: "https://supiramedical.com/", logo: "/images/logos/supira-medical.svg" },
  { name: "Instylla", description: "Resorbable hydrogel embolics engineered for interventional oncology and peripheral hemostasis.", focus: ["Embolization"], href: "https://instylla.com/", logo: "/images/logos/instylla.svg" },
  { name: "Kandu", description: "An integrated stroke-recovery platform combining BCI rehabilitation with personalized telehealth.", focus: ["Neurovascular", "Digital Health"], href: "https://kandu.com/", logo: "/images/logos/kandu.svg" },
  { name: "Tioga Medical", description: "A transcatheter mitral valve replacement system designed to treat more patients with mitral regurgitation.", focus: ["Cardiovascular"], href: "https://tiogacardiovascular.com/", logo: "/images/logos/tioga-medical.png" },
  { name: "Adona Medical", description: "Interatrial shunting and remote bi-atrial pressure monitoring for advanced heart failure.", focus: ["Cardiovascular", "Digital Health"], href: "https://adonamed.com/", logo: "/images/logos/adona-medical.png" },
  { name: "Truvic Medical", description: "Peripheral thrombectomy innovation now operating as Imperative Care Vascular.", focus: ["Cardiovascular"], href: "https://imperativecare.com/", status: "Acquired by Imperative Care", logo: "/images/logos/truvic-medical.png" },
  { name: "Atia Vision", description: "A modular, shape-changing intraocular lens intended to restore a full functional range of vision.", focus: ["Surgical"], href: "https://atiavision.com/", logo: "/images/logos/atia-vision.svg" },
  { name: "Tulavi Therapeutics", description: "A fully absorbable hydrogel platform designed to support peripheral nerve healing.", focus: ["Surgical"], href: "https://tulavi.com/", logo: "/images/logos/tulavi-therapeutics.svg" },
  { name: "Rejoni", description: "Hydrogel-based solutions created to preserve uterine health and reduce post-surgical adhesions.", focus: ["Surgical"], href: "https://rejoni.com/", logo: "/images/logos/rejoni.png" },
  { name: "Neurolutions", description: "The FDA-cleared IpsiHand brain-computer interface for at-home upper-extremity stroke rehabilitation.", focus: ["Neurovascular", "Digital Health"], href: "https://www.neurolutions.com/", status: "Merged into Kandu", logo: "/images/logos/neurolutions.png" },
  { name: "NuVera Medical", description: "Advanced intracardiac ultrasound imaging technology for complex cardiac procedures.", focus: ["Cardiovascular"], href: "https://www.prnewswire.com/news-releases/shifamed-announces-successful-acquisition-of-nuvera-medical-the-sixth-company-to-exit-associated-with-the-innovation-hub-301385956.html", status: "Acquired by Biosense Webster", logo: "/images/logos/nuvera-medical.png" },
  { name: "Ostial Corporation", description: "Dual-balloon angioplasty systems designed for precise aorto-ostial stent apposition.", focus: ["Cardiovascular"], href: "https://ostialflash.com/", logo: "/images/logos/ostial-corporation.png" },
  { name: "Akura Medical", description: "The Katana thrombectomy platform for efficient treatment of venous thromboembolism.", focus: ["Cardiovascular"], href: "https://www.akuramedical.com/", logo: "/images/logos/akura-medical.svg" },
  { name: "Sealonix", description: "Next-generation biomaterial sealant patches for rapid hemostasis in surgery.", focus: ["Surgical"], href: "https://sealonix.com/", logo: "/images/logos/sealonix.png" },
];

export default function CompaniesPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const gridRef = useRef<HTMLDivElement>(null);
  const visibleCompanies = useMemo(
    () => filter === "All" ? companies : companies.filter((company) => company.focus.includes(filter)),
    [filter],
  );

  useEffect(() => {
    const root = gridRef.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-company-card]"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add(styles.visible);
      });
    }, { threshold: 0.08 });
    cards.forEach((card, index) => {
      card.style.transitionDelay = `${Math.min(index % 3, 2) * 70}ms`;
      observer.observe(card);
    });
    return () => observer.disconnect();
  }, [visibleCompanies]);

  return (
    <main className={styles.page}>
      <SectionAccent section="companies" />
      <SiteHeader />
      <ScrollCue
        href="#all-companies"
        label="Scroll to all companies"
        hideAfter="closing"
      />

      <section className={styles.hero}>
        <Image className={styles.heroImage} src="/images/amed/companies-hero-light.jpg" alt="" fill priority sizes="100vw" />
        <div className={styles.heroVeil} />
        <p className={`${styles.kicker} amed-tag`}>[ Selected investments ]</p>
        <AnimatedHeading as="h1" lines={["Built beside the", "breakthroughs."]} className={`${styles.title} amed-display`}>Built beside the breakthroughs.</AnimatedHeading>
        <div className={styles.heroAside}>
          <p>AMED partners with medical technology companies translating difficult clinical problems into precise, scalable systems of care.</p>
          <a href="#all-companies">Explore the portfolio <span aria-hidden>↓</span></a>
        </div>
        <div className={styles.heroStats}>
          <div><strong><AnimatedNumber target={15} pad={2} delay={900} /></strong><span>Selected investments</span></div>
          <div><strong><AnimatedNumber target={5} pad={2} delay={1050} /></strong><span>Investment themes</span></div>
          <div><strong>US ↔ ASIA</strong><span>Cross-border perspective</span></div>
        </div>
      </section>

      <section className={styles.portfolio} id="all-companies">
        <div className={styles.portfolioHead}>
          <div>
            <p className={`${styles.sectionIndex} amed-tag`}>[ 02 ] Portfolio field</p>
            <h2>Selected companies</h2>
          </div>
          <p>From structural heart and stroke intervention to surgical biomaterials and connected recovery.</p>
        </div>

        <div className={styles.filters} role="toolbar" aria-label="Filter companies by focus">
          {filters.map((item) => (
            <button
              type="button"
              className={filter === item ? styles.filterActive : ""}
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
              key={item}
            >
              {item}
            </button>
          ))}
        </div>

        <div className={styles.grid} ref={gridRef} aria-live="polite">
          {visibleCompanies.map((company) => {
            return (
              <a data-company-card className={styles.company} href={company.href} target="_blank" rel="noreferrer" key={company.name}>
                <div className={styles.companyTop}>
                  {company.logo
                    ? <Image className={styles.logo} src={company.logo} alt={`${company.name} logo`} width={240} height={72} />
                    : <span className={styles.wordmark}>{company.name}</span>}
                  {company.status && <span className={styles.status}>{company.status}</span>}
                </div>
                <h3>{company.name}</h3>
                <p>{company.description}</p>
                <div className={styles.companyBottom}>
                  <span>{company.focus.join(" · ")}</span>
                  <span aria-hidden>↗</span>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      <section className={styles.closing} id="closing">
        <p className="amed-tag">[ The next company ]</p>
        <AnimatedHeading lines={["Building the next", "clinical standard?"]} className="amed-display">Building the next clinical standard?</AnimatedHeading>
        <div className={styles.closingActions}>
          <Link className="amed-button" href="/#contact">Pitch Your Company</Link>
          <Link className="amed-button amed-button--ghost" href="/">Back to AMED</Link>
        </div>
      </section>

      <footer className={styles.footer}>
        <SiteFooter />
      </footer>
    </main>
  );
}
