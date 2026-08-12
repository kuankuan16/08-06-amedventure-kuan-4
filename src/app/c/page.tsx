"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowUpRight,
} from "@/components/icons";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { newsTypes, portfolioNews, type NewsType } from "@/data/portfolio-news";
import { companies } from "@/data/portfolio";
import { BackToTop, CFooter, CHeader } from "./components";
import { taipeiAddress, teamEmail, usOffice } from "./content";
import { FocusArtwork, type FocusArtworkKind } from "./FocusArtwork";
import styles from "./page.module.css";

const heroSlides = [
  {
    src: "/images/amed/hero-c-lounge.jpg",
    alt: "MedTech founders and investors in a warm, naturally lit conversation",
  },
  {
    src: "/images/amed/hero-c-whiteboard.jpg",
    alt: "A founder and investor working through a healthcare product roadmap",
  },
  {
    src: "/images/amed/hero-c-walk.jpg",
    alt: "Colleagues walking and talking through a bright venture office",
  },
  {
    src: "/images/amed/hero-c-boardroom.jpg",
    alt: "An investment team reviewing a MedTech company together",
  },
] as const;

const heroPortfolioLogos = companies
  .filter((company) => company.logo)
  .slice(0, 14);

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
          <h2 id="investment-focus-heading">
            Innovation with the potential to improve patient outcomes.
          </h2>
        </div>
        <div className={styles.focusApproach}>
          <p>
            AMED Ventures invests primarily in medical technology and healthcare
            companies developing innovative solutions with the potential to
            improve patient outcomes and healthcare delivery.
          </p>
          <p>
            AMED Ventures takes a high-conviction, long-term investment
            approach, partnering closely with founders by providing strategic
            guidance, industry expertise, operational support, and access to a
            global network throughout each company&apos;s growth journey.
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
                className={selected ? styles.focusCardSelected : ""}
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
          <p>Areas may include</p>
          <ul>
            {focusAreas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

const STORIES_PER_PAGE = 5;

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

function useReveal<T extends HTMLElement>(
  visibleClass: string,
  refreshKey = "initial",
) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const targets = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(visibleClass);
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08, rootMargin: "0px 0px -6%" },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [refreshKey, visibleClass]);
  return ref;
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
  const reducedMotion = usePrefersReducedMotion();
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroPointer, setHeroPointer] = useState({
    x: 50,
    y: 50,
    tiltX: 0,
    tiltY: 0,
  });
  const [newsFilter, setNewsFilter] = useState<NewsType | "All">("All");
  const [newsPage, setNewsPage] = useState(0);
  const pageRef = useReveal<HTMLDivElement>(
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

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(
      () => setHeroSlide((current) => (current + 1) % heroSlides.length),
      6500,
    );
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  const moveHero = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(1, (event.clientX - bounds.left) / bounds.width),
    );
    const y = Math.max(
      0,
      Math.min(1, (event.clientY - bounds.top) / bounds.height),
    );
    setHeroPointer({
      x: x * 100,
      y: y * 100,
      tiltX: (0.5 - y) * 1.8,
      tiltY: (x - 0.5) * 2.4,
    });
  };
  const resetHero = () => setHeroPointer({ x: 50, y: 50, tiltX: 0, tiltY: 0 });
  const stepHero = (direction: 1 | -1) =>
    setHeroSlide(
      (current) =>
        (current + direction + heroSlides.length) % heroSlides.length,
    );

  return (
    <div className={styles.page} ref={pageRef} id="top">
      <CHeader />
      <BackToTop />
      <main className={styles.pageBody}>
        <section className={`${styles.heroBand} ${styles.heroHuman}`}>
          <div className={`${styles.section} ${styles.heroFigaro}`}>
            <div
              className={styles.heroSloganRail}
              aria-label="The right capital and the right partnership change how people live, heal and thrive."
            >
              {[0, 1].map((group) => (
                <div
                  className={styles.heroSloganGroup}
                  aria-hidden={group === 1}
                  key={group}
                >
                  <span>
                    The right capital and the right <em>partnership</em> change
                    how people live, heal and thrive.
                  </span>
                  <i aria-hidden="true" />
                </div>
              ))}
            </div>
            <div className={styles.heroCinema}>
              <div
                className={styles.heroV3Frame}
                onPointerMove={moveHero}
                onPointerLeave={resetHero}
                style={
                  {
                    "--hero-pointer-x": `${heroPointer.x}%`,
                    "--hero-pointer-y": `${heroPointer.y}%`,
                    transform: `perspective(80vw) rotateX(${heroPointer.tiltX}deg) rotateY(${heroPointer.tiltY}deg)`,
                  } as CSSProperties
                }
              >
                {heroSlides.map((slide, index) => (
                  <Image
                    className={`${styles.heroV3Slide} ${index === heroSlide ? styles.heroV3SlideActive : ""}`}
                    src={slide.src}
                    alt={index === heroSlide ? slide.alt : ""}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 640px) 100vw, 92vw"
                    key={slide.src}
                  />
                ))}
                <div className={styles.heroCinemaCopy}>
                  <p>
                    AMED Ventures is a venture and growth capital investment
                    firm dedicated to the MedTech sector.
                  </p>
                  <Link className={styles.heroCta} href="/c/companies">
                    Explore our companies <IconArrowRight />
                  </Link>
                </div>
                <div
                  className={styles.heroV3Controls}
                  role="group"
                  aria-label="Choose a hero image"
                >
                  <button
                    className={styles.heroV3Arrow}
                    type="button"
                    onClick={() => stepHero(-1)}
                    aria-label="Previous image"
                  >
                    <IconArrowLeft />
                  </button>
                  <div className={styles.heroV3Dots}>
                    {heroSlides.map((slide, index) => (
                      <button
                        type="button"
                        key={slide.src}
                        onClick={() => setHeroSlide(index)}
                        aria-label={`Show image ${index + 1}`}
                        aria-current={index === heroSlide}
                      >
                        <span />
                      </button>
                    ))}
                  </div>
                  <button
                    className={styles.heroV3Arrow}
                    type="button"
                    onClick={() => stepHero(1)}
                    aria-label="Next image"
                  >
                    <IconArrowRight />
                  </button>
                </div>
              </div>
            </div>
            <div
              className={styles.heroPositions}
              aria-label="Investment profile"
            >
              <div className={styles.heroPosition}>
                <strong>US · Asia</strong>
                <span>Investment footprint</span>
              </div>
              <div className={styles.heroPosition}>
                <strong>Early–Growth</strong>
                <span>Stage focus</span>
              </div>
            </div>
            <div
              className={styles.heroLogoRail}
              aria-label="AMED Ventures portfolio companies"
            >
              {[0, 1].map((group) => (
                <div
                  className={styles.heroLogoGroup}
                  aria-hidden={group === 1}
                  key={group}
                >
                  {heroPortfolioLogos.map((company) => (
                    <span
                      className={styles.heroLogoItem}
                      key={`${group}-${company.name}`}
                    >
                      <Image
                        src={company.logo!}
                        alt={group === 0 ? company.name : ""}
                        width={210}
                        height={72}
                        sizes="12vw"
                      />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

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
                <tr className={styles.storyRow} data-reveal key={item.url}>
                  <td className={styles.storyTitleCell}>
                    <div className={styles.storyTitleInner}>
                      <a href={item.url} target="_blank" rel="noreferrer">
                        {item.title}
                      </a>
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
                  <dd>
                    {taipeiAddress}
                    <br />
                    {usOffice}
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
