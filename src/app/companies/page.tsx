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
import { portfolioNews } from "@/data/portfolio-news";
import { companies, exited, filters, type Filter } from "@/data/portfolio";

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
          <p>Every company we back represents lives that will be touched. AMED takes an ecosystem approach to MedTech, from medical devices through contract manufacturing.</p>
          <a href="#all-companies">Explore the portfolio <span aria-hidden>↓</span></a>
        </div>
        <div className={styles.heroStats}>
          <div><strong><AnimatedNumber target={16} pad={2} delay={900} /></strong><span>Active investments</span></div>
          <div><strong><AnimatedNumber target={4} pad={2} delay={1050} /></strong><span>Realized investments</span></div>
          <div><strong><AnimatedNumber target={8} pad={2} delay={1200} /></strong><span>Investment focus areas</span></div>
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
                  <span className={styles.status}>{company.location} · {company.founded}</span>
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

        <div className={styles.exited}>
          <p className={`${styles.sectionIndex} amed-tag`}>[ 03 ] Realized</p>
          <ul>
            {exited.map(({ name }) => <li key={name}>{name}</li>)}
          </ul>
        </div>
      </section>

      <section className={styles.news}>
        <div className={styles.newsHead}>
          <p className={`${styles.kicker} ${styles.newsIndex} amed-tag`}>[ 04 ] Portfolio news</p>
          <h2 className="amed-display">Milestones in the field.</h2>
        </div>
        <ul className={styles.newsList}>
          {portfolioNews.map((item) => (
            <li key={item.url}>
              <a href={item.url} target="_blank" rel="noreferrer">
                <span className={styles.newsCompany}>{item.company}</span>
                <span className={styles.newsTitle}>{item.title}</span>
                <span className={styles.newsSource}>{item.source} <span aria-hidden>↗</span></span>
              </a>
            </li>
          ))}
        </ul>
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
