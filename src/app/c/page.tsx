"use client";

import Link from "next/link";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import {
  IconArrowRight,
  IconArrowUpRight,
} from "@/components/icons";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { newsTypes, portfolioNews, type NewsType } from "@/data/portfolio-news";
import { BackToTop, CFooter, CHeader } from "./components";
import { taipeiOffice, teamEmail, usOffice } from "./content";
import { FocusArtwork, type FocusArtworkKind } from "./FocusArtwork";
import { FixedFilmHero } from "./FixedFilmHero";
import { RevealHeading } from "./RevealHeading";
import { useReveals } from "./useReveals";
import styles from "./page.module.css";

const featuredFocusAreas: {
  number: string;
  title: readonly [string, string];
  description: string;
  artwork: FocusArtworkKind;
}[] = [
  {
    number: "01",
    title: ["Neurovascular", "Technologies"],
    description:
      "Stroke and neurovascular platforms across the continuum of care",
    artwork: "neurovascular",
  },
  {
    number: "02",
    title: ["Cardiovascular", "Technologies"],
    description:
      "Structural heart, circulatory support and vascular intervention",
    artwork: "cardiovascular",
  },
  {
    number: "03",
    title: ["Surgical", "Technologies"],
    description: "Biomaterials, implants and devices for the operating room",
    artwork: "surgical",
  },
  {
    number: "04",
    title: ["Digital", "Health"],
    description:
      "Software and connected care that extends treatment beyond the hospital",
    artwork: "intelligence",
  },
];

const focusAreas = [
  "Medical Devices",
  "Digital Health",
  "Cardiovascular Technologies",
  "Neurovascular Technologies",
  "Vision Care",
  "Diagnostics",
  "Surgical Technologies",
  "Healthcare Platforms",
];

function InvestmentFocus() {
  const [selectedArea, setSelectedArea] = useState<number | null>(null);
  return (
    <section
      className={styles.investmentFocus}
      id="investment-focus"
      aria-labelledby="investment-focus-heading"
    >
      <div className={styles.focusInner}>
        <div className={styles.focusHeading}>
          <p className={styles.focusEyebrow}>AMED Ventures</p>
          <RevealHeading
            as="h2"
            id="investment-focus-heading"
            lines={[
              "Backing the technologies",
              "that move care forward.",
            ]}
          />
        </div>
        <div className={styles.focusApproach}>
          <p>
            From cardiovascular and neurovascular platforms to surgical,
            vision and connected care, we look for ideas with a clear clinical
            purpose.
          </p>
          <p>
            Across Asia and the United States, we support teams turning
            technical insight into solutions that can earn trust in real care
            settings.
          </p>
        </div>
        <div
          className={styles.focusCards}
          aria-label="AMED Ventures investment focus areas"
        >
          {featuredFocusAreas.map((area, index) => {
            const selected = selectedArea === index;
            return (
              <article
                key={area.title.join(" ")}
                data-hover-object="feature"
                data-reveal
                className={`${styles.progressiveItem} ${selected ? styles.focusCardSelected : ""}`}
                style={
                  {
                    "--progressive-delay": `${index * 90}ms`,
                  } as CSSProperties
                }
                onMouseEnter={() => setSelectedArea(index)}
                onMouseLeave={() => setSelectedArea(null)}
              >
                <span className={styles.focusCardIndex}>
                  <span>{area.number}</span>
                  <i aria-hidden="true" />
                </span>
                <FocusArtwork artwork={area.artwork} />
                <span className={styles.focusCardCopy}>
                  <strong>
                    {area.title.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </strong>
                  <span>{area.description}</span>
                </span>
              </article>
            );
          })}
        </div>
        <div className={styles.focusAreas}>
          <p className={styles.progressiveItem} data-reveal>
            Areas may include
          </p>
          <ul>
            {focusAreas.map((area, index) => (
              <li
                className={styles.progressiveItem}
                data-hover-object="chip"
                data-reveal
                key={area}
                style={
                  {
                    "--progressive-delay": `${index * 65}ms`,
                  } as CSSProperties
                }
              >
                {area}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

const STORIES_PER_PAGE = 10;

const sortedPortfolioNews = [...portfolioNews].sort((a, b) => {
  if (a.date && b.date) return b.date.localeCompare(a.date);
  if (a.date) return -1;
  if (b.date) return 1;
  return a.company.localeCompare(b.company);
});

function formatStoryDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function KineticPitchHeading({ text }: { text: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [visible, setVisible] = useState(false);
  const words = text.split(" ");

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading || reducedMotion) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(Boolean(entry?.isIntersecting)),
      { rootMargin: "0px 0px -15% 0px", threshold: 0.1 },
    );
    observer.observe(heading);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const shown = visible || reducedMotion;
  return (
    <h2 ref={headingRef} className={styles.pitchKineticHeading}>
      <span className={styles.pitchWords}>
        {words.map((word, index) => (
          <span className={styles.pitchWordMask} key={`${word}-${index}`}>
            <span
              style={{
                transform: shown
                  ? "translateY(0) rotate(0deg)"
                  : "translateY(110%) rotate(7deg)",
                opacity: shown ? 1 : 0,
                filter: shown ? "blur(0px)" : "blur(10px)",
                transitionDelay: `${index * 85}ms`,
              }}
            >
              {word}
            </span>
          </span>
        ))}
      </span>
      <span
        className={styles.pitchHeadingRule}
        aria-hidden="true"
        style={{
          transform: shown ? "scaleX(1)" : "scaleX(0)",
          transitionDelay: `${words.length * 85 + 200}ms`,
        }}
      />
    </h2>
  );
}

export default function ProposalC() {
  const [newsFilter, setNewsFilter] = useState<NewsType | "All">("All");
  const [newsPage, setNewsPage] = useState(0);
  const pageRef = useReveals<HTMLDivElement>(
    styles.revealVisible,
    `${newsFilter}-${newsPage}`,
  );
  const filteredNews =
    newsFilter === "All"
      ? sortedPortfolioNews
      : sortedPortfolioNews.filter((item) => item.type === newsFilter);
  const newsPages = Math.max(
    1,
    Math.ceil(filteredNews.length / STORIES_PER_PAGE),
  );
  const page = Math.min(newsPage, newsPages - 1);
  const visibleNews = filteredNews.slice(
    page * STORIES_PER_PAGE,
    (page + 1) * STORIES_PER_PAGE,
  );
  return (
    <div
      className={`${styles.page} ${styles.homePage}`}
      ref={pageRef}
      id="top"
    >
      <CHeader />
      <BackToTop />
      <main className={styles.pageBody}>
        <FixedFilmHero />

        <InvestmentFocus />

        <section
          className={`${styles.section} ${styles.sectionTail}`}
          id="news"
        >
          <div data-reveal className={styles.reveal}>
            <p className={styles.tag}>Story</p>
            <h2
              className={`${styles.display} ${styles.lineReveal}`}
              data-reveal
            >
              <span>
                <span>Milestones from the</span>
              </span>
              <span>
                <span>companies we back.</span>
              </span>
            </h2>
          </div>
          <div
            className={styles.storyFilter}
            role="toolbar"
            aria-label="Filter stories by milestone"
          >
            {["All", ...newsTypes].map((item) => (
              <button
                type="button"
                key={item}
                className={newsFilter === item ? styles.storyFilterActive : ""}
                aria-pressed={newsFilter === item}
                onClick={() => {
                  setNewsFilter(item as NewsType | "All");
                  setNewsPage(0);
                }}
              >
                {item}
              </button>
            ))}
          </div>
          <table className={styles.storyTable}>
            <thead>
              <tr>
                <th scope="col">Story</th>
                <th scope="col">Milestone</th>
                <th scope="col">Company</th>
                <th scope="col">
                  <span className="sr-only">Open the story</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleNews.map((item) => (
                <tr
                  className={styles.storyRow}
                  data-hover-object="row"
                  data-reveal
                  key={item.url}
                >
                  <td className={styles.storyTitleCell}>
                    <div className={styles.storyTitleInner}>
                      <a
                        className={styles.storyRowLink}
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Read ${item.title}`}
                      >
                        <span className="sr-only">{item.title}</span>
                      </a>
                      <span className={styles.storyTitleText} aria-hidden="true">
                        {item.title}
                      </span>
                      <span className={styles.storySource}>{item.source}</span>
                    </div>
                  </td>
                  <td className={styles.storyMetaCell}>
                    <span
                      className={`${styles.storyType} ${styles[`storyType${item.type}`]}`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className={styles.storyCompanyCell}>
                    {item.company}
                    {item.date && (
                      <time dateTime={item.date}>
                        {formatStoryDate(item.date)}
                      </time>
                    )}
                  </td>
                  <td className={styles.storyLinkCell} aria-hidden>
                    <IconArrowUpRight />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <nav className={styles.storyPager} aria-label="Story pages">
            <p>
              Page {page + 1} of {newsPages}
            </p>
            <div>
              <button
                type="button"
                onClick={() => setNewsPage(page - 1)}
                disabled={page === 0}
              >
                Previous
              </button>
              {Array.from({ length: newsPages }, (_, index) => (
                <button
                  type="button"
                  key={index}
                  className={index === page ? styles.storyPageActive : ""}
                  aria-current={index === page ? "page" : undefined}
                  aria-label={`Page ${index + 1}`}
                  onClick={() => setNewsPage(index)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setNewsPage(page + 1)}
                disabled={page === newsPages - 1}
              >
                Next
              </button>
            </div>
          </nav>
        </section>

        <section className={styles.pitchUs}>
          <div className={styles.pitchGlowA} aria-hidden />
          <div className={styles.pitchGlowB} aria-hidden />
          <div className={styles.pitchInner}>
            <p className={styles.pitchEyebrow}>Pitch us</p>
            <KineticPitchHeading text="Building something that belongs in a hospital?" />
            <div className={styles.pitchGrid}>
              <div>
                <p>
                  We read everything. If you are early, technical and serious
                  about the clinical bar, we would like to hear from you.
                </p>
                <Link className={styles.pitchButton} href="/c/contact">
                  Send us your deck <IconArrowRight />
                </Link>
              </div>
              <dl>
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${teamEmail}`}>{teamEmail}</a>
                  </dd>
                </div>
                <div>
                  <dt>Offices</dt>
                  <dd className={styles.officeLocations}>
                    <span>{taipeiOffice}</span>
                    <span>{usOffice}</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      </main>
      <CFooter />
    </div>
  );
}
