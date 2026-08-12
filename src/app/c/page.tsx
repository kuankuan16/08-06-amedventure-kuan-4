"use client";

import { type FormEvent, type MouseEvent as ReactMouseEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { IconArrowLeft, IconArrowRight, IconArrowUpRight, IconGlobe, IconLinkedIn, IconMail } from "@/components/icons";
import { FilterMenu } from "@/components/FilterMenu";
import { filters, portfolio, regions, regionsOf, sortOptions, statuses, type Filter, type PortfolioEntry, type Region, type SortOption, type Status } from "@/data/portfolio";
import { newsTypes, portfolioNews, type NewsType } from "@/data/portfolio-news";
import styles from "./page.module.css";

/* Four columns on the band, divided by dotted rules. Titles are broken by hand so every
   column carries exactly two lines. */
const pillars = [
  { title: ["Long-term", "partnership"], copy: "We stay with founders for the long run, from first clinical evidence through global scale." },
  { title: ["High-conviction", "investing"], copy: "Fewer, deeper positions in medical technology where the clinical case and team convince us." },
  { title: ["Exceptional", "entrepreneurs"], copy: "Strategic guidance, deep industry expertise and hands-on support for the teams building it." },
  { title: ["Meaningful", "impact"], copy: "What we build is finally measured in outcomes for the patients on the other end of it." },
] as const;

/* One address for the whole team until AMED supplies individual ones — set it here and every
   profile card picks it up. Give a person their own address by adding a third entry to their row. */
const teamEmail = "info@amedventures.com";
const teamPortraitFallback = "/images/amed/team-placeholder-02.jpg";
/* Same idea for LinkedIn — point this at AMED's company page, or give a person their own. */
const teamLinkedIn = "https://www.linkedin.com/";

/* Roster and biographies as published on AMED's own build — names, titles and text are theirs. */
const team = [
  ["Managing Partners", [
    ["Michael Wang", "Chairman, Managing Partner", "", "/images/team-client/michael-wang-unified.png"],
    ["William Tai", "Managing Partner", "", "/images/team-client/william-tai-unified.png"],
    ["Joe Liu", "Managing Partner", "", "/images/team-client/joe-liu-unified.png"],
  ]],
  ["Venture Advisors", [
    ["Dr. TJ Liu", "Venture Advisor", "", "/images/team-client/tj-liu-unified.png"],
    ["Dr. Kuan Chen", "Venture Advisor", "", teamPortraitFallback],
    ["Fred Shen", "Venture Advisor", "", "/images/team-client/fred-shen-unified.png"],
  ]],
  ["Investment Team", [
    ["Michelle Tsai", "Senior Investment Manager", "Michelle Tsai is a Senior Investment Manager at AMED Ventures, evaluating opportunities across interventional technologies and the growing intersection of hardware and AI in healthcare. She focuses on first-in-class innovations with strong clinical differentiation and has contributed to investments that attracted global medtech strategics and sovereign fund participation.\n\nPrior to joining AMED, she spent nearly a decade at Zuellig Pharma, a leading healthcare solutions provider in Asia. There, she grew a client base spanning global MNCs and biotech firms, doubling regional revenue through consistent double-digit annual growth.\n\nShe holds an M.S. in Biomedical Engineering from National Taiwan University, a B.S. in Mechanical Engineering from National Chung Hsing University, and a PMP certification — an engineering foundation that complements her commercial acumen in assessing medtech opportunities.", "/images/team-client/michelle-tsai-unified.png"],
    ["Jeremy Tseng, CFA", "Senior Investment Manager", "At AMED Ventures, Jeremy evaluates investment and M&A opportunities across the medical device and MedTech CDMO sectors, and leads post-investment management for a portfolio of companies with a combined market valuation exceeding $2 billion.\n\nPrior to AMED, he drove M&A evaluation and strategic partnerships at Catcher Technology (TWSE: 2474), supporting the company's initiatives across the MedTech, semiconductor, and aerospace industries. Earlier, at Deloitte Financial Advisory, he advised on cross-border M&A and deal structuring.\n\nJeremy holds an M.S. in Finance from the University of Illinois Urbana-Champaign and a B.B.A. in Finance from National Chengchi University, and is a CFA Charterholder.", "/images/team-client/jeremy-tseng-unified.png"],
    ["Bin Chou, Ph.D.", "Investment Manager", "Bin is an engineer-turned-investor, focusing on healthcare innovations including AI diagnostics, next-generation testing platforms, medical devices, and frontier biotech.\n\nHe holds a Ph.D. in Mechanical Engineering from National Taiwan University and an M.S. in Molecular Medicine from National Cheng Kung University, combining engineering and life-science expertise in technical diligence.\n\nBefore investing, Bin spent over 15 years in diagnostics and medical devices, holding senior R&D and executive roles across POCT, IVD development, manufacturing, and global regulatory approvals including FDA, NMPA, and CE.", "/images/team-client/bin-chou-unified.png"],
    ["Jonathan Feng", "Investment Manager", "Jonathan is an Investment Manager at AMED Ventures, evaluating MedTech investments across cardiovascular, orthopedics, urology, nerve repair, and other therapeutic areas. He focuses on clinically differentiated technologies addressing meaningful unmet needs and improving standards of care.\n\nPrior to AMED, Jonathan worked in corporate banking and later founded and scaled a consumer healthcare business, bringing experience across financial analysis, commercialization, and business growth.\n\nHe holds an MBA in healthcare from University College London and a B.S. in Biochemical Science and Technology from National Taiwan University.", "/images/team-client/jonathan-feng-unified.png"],
  ]],
  ["Portfolio Strategy & Operations", [
    ["Hank Huang", "Finance & Portfolio Management Manager", "", "/images/team-client/hank-huang-unified.png"],
    ["Michelle Wang", "", "", teamPortraitFallback],
  ]],
] as const;

/** How many company cards the index opens with, and how many each "Load more" adds. */
const PAGE_SIZE = 30;

/** Stories per page in the milestone table. */
const STORIES_PER_PAGE = 10;

/** The default entry in each filter menu: no narrowing applied. */
const ALL = "All";

/** One flat roster, in the order the wall renders it, so the profile dialog can step through it. */
const roster = team.flatMap(([group, members]) =>
  members.map(([name, role, bio, portrait]) => ({ name, role, bio, portrait, group })));

/* Each source portrait has a slightly different camera distance. These shared classes align
   the eye line and chin line in both the team wall and the profile dialog. */
const portraitAlignment: Record<string, string> = {
  "Michael Wang": styles.portraitMichael,
  "William Tai": styles.portraitWilliam,
  "Joe Liu": styles.portraitJoe,
  "Dr. TJ Liu": styles.portraitTj,
  "Fred Shen": styles.portraitFred,
  "Michelle Tsai": styles.portraitMichelleTsai,
  "Jeremy Tseng, CFA": styles.portraitJeremy,
  "Bin Chou, Ph.D.": styles.portraitBin,
  "Jonathan Feng": styles.portraitJonathan,
  "Hank Huang": styles.portraitHank,
};

/** Arrow keys and the profile dialog's own controls walk the roster, wrapping at both ends. */
const step = (current: number | null, direction: 1 | -1) =>
  current === null ? current : (current + direction + roster.length) % roster.length;

/** Publisher dates as "12 Feb 2026" — short, unambiguous either side of the Pacific. */
function formatStoryDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

/** Class wiring for the companies toolbar menus, so FilterMenu carries proposal B's styling. */
const menuClasses = {
  root: styles.menu,
  trigger: styles.menuTrigger,
  triggerOpen: styles.menuTriggerOpen,
  count: styles.menuCount,
  panel: styles.menuPanel,
  option: styles.menuOption,
  optionSelected: styles.menuOptionSelected,
};

/* Philosophy keeps the brief's four facts, with a short editorial heading for each. */
const firmHighlights = [
  {
    title: ["Focused by", "design"],
    copy: "A venture capital firm dedicated to MedTech and healthcare.",
  },
  {
    title: ["Built across", "markets"],
    copy: "A global investment portfolio spanning North America and Asia.",
  },
  {
    title: ["Investing", "across stages"],
    copy: "Active investments from early-stage through growth-stage companies.",
  },
  {
    title: ["Beyond", "capital"],
    copy: "A long-term investment partner providing strategic support.",
  },
] as const;

/* What a MedTech fund needs to triage an inbound pitch. */
const fundingStages = ["Pre-seed", "Seed", "Series A", "Series B", "Series C or later", "Not raising yet"] as const;

const countryCodes = ["+1", "+886", "+81", "+82", "+86", "+852", "+65", "+44", "+61", "+49"] as const;

/** Adds a class once the element scrolls into view; used for the section and card reveals. */
function useReveal<T extends HTMLElement>(visibleClass: string, deps: unknown[] = []) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const targets = root.dataset.revealRoot === "self" ? [root] : Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add(visibleClass);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -6%" });
    targets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

export default function ProposalC() {
  const [sent, setSent] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* Companies index: three multi-select filter menus, a sort menu and progressive loading,
     the same controls the reference index offers, over the data AMED has actually supplied. */
  const [focusAreas, setFocusAreas] = useState<Filter[]>([]);
  const [regionFilter, setRegionFilter] = useState<Region[]>([]);
  const [statusFilter, setStatusFilter] = useState<Status[]>([]);
  const [sort, setSort] = useState<SortOption>("Recent");
  const [shown, setShown] = useState(PAGE_SIZE);

  /* Every control resets the page window, so a narrower filter never leaves a stale "load more".
     "All" is the resting state of each menu: choosing it clears that group's selections. */
  const toggle = <T extends string>(setter: (update: (current: T[]) => T[]) => void) => (value: string) => {
    setter((current) => value === ALL
      ? []
      : current.includes(value as T) ? current.filter((item) => item !== value) : [...current, value as T]);
    setShown(PAGE_SIZE);
  };

  const withAll = (options: readonly string[]) => [ALL, ...options];
  const selectionOf = (values: readonly string[]) => values.length > 0 ? values : [ALL];

  const visibleCompanies = useMemo(() => {
    const matched = portfolio.filter((company) =>
      (focusAreas.length === 0 || company.focus.some((area) => focusAreas.includes(area)))
      && (regionFilter.length === 0 || regionsOf(company.location).some((region) => regionFilter.includes(region)))
      && (statusFilter.length === 0 || statusFilter.includes(company.status)));

    return [...matched].sort((a, b) => sort === "Alphabetical"
      ? a.name.localeCompare(b.name)
      : (Number(b.founded || 0) - Number(a.founded || 0)) || a.name.localeCompare(b.name));
  }, [focusAreas, regionFilter, statusFilter, sort]);

  const activeFilters = [...focusAreas, ...regionFilter, ...statusFilter];
  const shownCompanies = visibleCompanies.slice(0, shown);

  const [active, setActive] = useState<PortfolioEntry | null>(null);
  const [personIndex, setPersonIndex] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const person = personIndex === null ? null : roster[personIndex];
  const headerRef = useRef<HTMLElement>(null);
  const tailRef = useRef<HTMLDivElement>(null);
  const [newsFilter, setNewsFilter] = useState<NewsType | "All">("All");
  const [newsPage, setNewsPage] = useState(0);
  const filteredNews = useMemo(
    () => newsFilter === "All" ? portfolioNews : portfolioNews.filter((item) => item.type === newsFilter),
    [newsFilter],
  );
  const newsPages = Math.max(1, Math.ceil(filteredNews.length / STORIES_PER_PAGE));
  const page = Math.min(newsPage, newsPages - 1);
  const visibleNews = filteredNews.slice(page * STORIES_PER_PAGE, (page + 1) * STORIES_PER_PAGE);

  const [statsRun, setStatsRun] = useState(0);

  const clearFilters = () => {
    setFocusAreas([]);
    setRegionFilter([]);
    setStatusFilter([]);
    setShown(PAGE_SIZE);
  };

  const pageRef = useReveal<HTMLDivElement>(styles.revealVisible);
  const gridRef = useReveal<HTMLDivElement>(styles.cardVisible, [shownCompanies]);

  useEffect(() => {
    if (!active && personIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(null);
        setPersonIndex(null);
        return;
      }
      if (personIndex === null) return;
      if (event.key === "ArrowLeft") setPersonIndex((current) => step(current, -1));
      if (event.key === "ArrowRight") setPersonIndex((current) => step(current, 1));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [active, person, personIndex]);

  /* Contact enters as one continuous beat: the word starts first, then the content follows
     immediately without a hold or requiring another scroll gesture. */
  const reducedMotion = usePrefersReducedMotion();
  const [tailStage, setTailStage] = useState(0);
  const stage = reducedMotion ? 3 : tailStage;
  useEffect(() => {
    const tail = tailRef.current;
    if (!tail || reducedMotion) return;

    const timers: number[] = [];
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      setTailStage(1);
      timers.push(window.setTimeout(() => setTailStage(2), 140));
      timers.push(window.setTimeout(() => setTailStage(3), 280));
    }, { threshold: 0.25 });
    observer.observe(tail);

    return () => {
      observer.disconnect();
      timers.forEach(window.clearTimeout);
    };
  }, [reducedMotion]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  /* Ease-out cubic: the page leaves at speed and coasts to a stop. Any wheel or touch input
     hands control straight back to the visitor. */
  const glideTo = (y: number) => {
    const from = window.scrollY;
    const to = Math.max(0, Math.min(y, document.body.scrollHeight - window.innerHeight));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo(0, to);
      return;
    }

    const distance = to - from;
    const duration = Math.min(900, Math.max(420, Math.abs(distance) * 0.42));
    const started = performance.now();
    let cancelled = false;
    const stop = () => { cancelled = true; };
    window.addEventListener("wheel", stop, { passive: true, once: true });
    window.addEventListener("touchstart", stop, { passive: true, once: true });

    const step = (now: number) => {
      if (cancelled) return;
      const progress = Math.min(1, (now - started) / duration);
      window.scrollTo(0, from + distance * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) requestAnimationFrame(step);
      else { window.removeEventListener("wheel", stop); window.removeEventListener("touchstart", stop); }
    };
    requestAnimationFrame(step);
  };

  const scrollToTop = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    glideTo(0);
    setStatsRun((run) => run + 1);
    window.history.replaceState(null, "", "/c");
  };

  /* In-page links glide to their section and coast to a stop: an ease-out curve, so the page
     leaves at speed and decelerates rather than easing in at both ends. Any wheel or touch
     input hands control straight back to the visitor. */
  const jumpToSection = (event: ReactMouseEvent<HTMLDivElement>) => {
    const link = (event.target as HTMLElement).closest?.("a[href^='#']") as HTMLAnchorElement | null;
    if (!link) return;
    const id = link.getAttribute("href")?.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;

    event.preventDefault();
    const offset = headerRef.current?.offsetHeight ?? 0;
    glideTo(target.getBoundingClientRect().top + window.scrollY - offset);
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <div className={styles.page} ref={pageRef} onClick={jumpToSection}>
      {/* Main content and the closing contact area share one continuous document flow. */}
      <div className={styles.pageBody}>
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`} ref={headerRef}>
        {/* Already on this page, so the lockup glides back to the top rather than reloading it. */}
        <Link className={styles.brand} href="/c" aria-label="AMED Ventures home" onClick={scrollToTop}>
          <Image src="/brand/amed-logo-light.png" alt="AMED Ventures" width={320} height={120} />
        </Link>
        <nav className={styles.nav} aria-label="Primary navigation">
          <a href="#approach">About</a>
          <a href="#philosophy">Philosophy</a>
          <a href="#portfolio">Companies</a>
          <a href="#team">Team</a>
          <a href="#news">Story</a>
        </nav>
        <button
          className={`${styles.mobileMenuButton} ${menuOpen ? styles.mobileMenuButtonOpen : ""}`}
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
        <a className={`${styles.pill} ${styles.pillOutline} ${styles.headerCta}`} href="#contact" onClick={() => setMenuOpen(false)}>Contact Us</a>
      </header>

      <nav
        className={`${styles.mobileNav} ${menuOpen ? styles.mobileNavOpen : ""}`}
        id="mobile-navigation"
        aria-label="Mobile navigation"
        inert={!menuOpen}
      >
        <a href="#approach" onClick={() => setMenuOpen(false)}>About</a>
        <a href="#philosophy" onClick={() => setMenuOpen(false)}>Philosophy</a>
        <a href="#portfolio" onClick={() => setMenuOpen(false)}>Companies</a>
        <a href="#team" onClick={() => setMenuOpen(false)}>Team</a>
        <a href="#news" onClick={() => setMenuOpen(false)}>Story</a>
      </nav>

      <a
        className={`${styles.backToTop} ${scrolled ? styles.backToTopVisible : ""}`}
        href="#top"
        onClick={scrollToTop}
        aria-label="Back to top"
        inert={!scrolled}
      >
        <IconArrowRight />
      </a>

      <section className={`${styles.heroBand} ${styles.heroHuman}`}>
        <div className={`${styles.section} ${styles.hero} ${styles.heroEditorial}`}>
          <div className={styles.heroEditorialLabel}>
            <span>AMED Ventures</span>
            <span>MedTech · US ↔ Taiwan</span>
          </div>

          <div className={styles.heroEditorialCopy}>
            <h1 aria-label="The right capital and the right partnership change how people live, heal and thrive.">
              <span><span>The right capital</span></span>
              <span><span>and the right</span></span>
              <span><span><em>partnership</em> change</span></span>
              <span><span>how people live,</span></span>
              <span><span>heal and thrive.</span></span>
            </h1>
            <div className={styles.heroEditorialNote}>
              <span aria-hidden>↘</span>
              <p>We stay with founders for the long run, from first clinical evidence through global scale.</p>
            </div>
          </div>

          <figure className={styles.heroEditorialPortrait}>
            <Image
              src="/images/amed/hero-c-editorial-v2.jpg"
              alt="A medical-device founder and clinician carefully reviewing a prototype together"
              width={972}
              height={1619}
              priority
            />
            <figcaption>
              <span>People behind progress</span>
              <span>Built together</span>
            </figcaption>
          </figure>

          <figure className={styles.heroEditorialDetail} aria-hidden="true">
            <Image src="/images/amed/hero-c-01.jpg" alt="" width={1983} height={793} />
          </figure>

          <div className={styles.heroEditorialIndex} aria-label="AMED investment approach">
            <div><span>01</span><strong>People</strong></div>
            <div><span>02</span><strong>Evidence</strong></div>
            <div><span>03</span><strong>Scale</strong></div>
          </div>

          {/* The counters are keyed on the run counter: clicking the lockup remounts them so they
              count up again, while the cards themselves keep their revealed state. */}
          <div className={styles.stats}>
            <div className={styles.stat}><strong><AnimatedNumber key={statsRun} target={16} pad={2} delay={240} /></strong><span>Active companies</span></div>
            <div className={styles.stat}><strong><AnimatedNumber key={statsRun} target={4} pad={2} delay={380} /></strong><span>Realized investments</span></div>
            <div className={styles.stat}><strong><AnimatedNumber key={statsRun} target={8} pad={2} delay={520} /></strong><span>Investment focus areas</span></div>
            <div className={styles.stat}><strong><AnimatedNumber key={statsRun} target={2} pad={2} delay={660} /></strong><span>Home markets: US &amp; Taiwan</span></div>
          </div>
        </div>
      </section>

      <section className={styles.about} id="approach">
        <div className={styles.section}>
          <div className={styles.aboutInner}>
            <div data-reveal className={styles.reveal}>
              <p className={styles.tag}>About</p>
              <blockquote className={`${styles.quote} ${styles.lineReveal}`} data-reveal>
                <span><span>The right capital and the right partnership</span></span>
                <span><span>change how people live, heal and thrive.</span></span>
              </blockquote>
              <hr className={styles.quoteRule} />
              <p className={styles.quoteBy}>AMED Ventures<span>Founding conviction</span></p>

            </div>

            {/* The portrait is masked into a quotation mark, so the section reads as a statement. */}
            <figure className={styles.quoteFigure} data-reveal>
              <svg viewBox="0 0 420 680" role="img" aria-label="Open hands mid-conversation across a table">
                <defs>
                  <clipPath id="amedQuoteMark">
                    <path d="M0 0 H420 V420 A260 260 0 0 1 160 680 H75.2 V551.6 H173.4 C204.5 550.6 236.1 514 236.1 483.7 V412.7 H0 Z" />
                  </clipPath>
                </defs>
                {/* Nudged up and to the right, and scaled a touch, so the open palm carries the frame. */}
                <image
                  href="/images/amed/about-hands.jpg"
                  x="-34" y="-52" width="462" height="748"
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#amedQuoteMark)"
                />
              </svg>
            </figure>
          </div>

          <div className={styles.pillars}>
            {pillars.map(({ title, copy }) => (
              <article className={styles.pillar} data-reveal key={title.join(" ")}>
                <h3>{title.map((line) => <span key={line}><span>{line}</span></span>)}</h3>
                <p><span><span>{copy}</span></span></p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div id="philosophy" className={styles.philosophyAnchor} aria-hidden="true" />

      {/* Philosophy pairs the firm's four defining traits with its founding conviction. */}
      <section className={styles.firm}>
        <div className={styles.section}>
          <div className={styles.firmInner}>
            <article className={`${styles.firmStatement} ${styles.reveal}`} data-reveal>
              <div>
                <p className={`${styles.tag} ${styles.firmBadge}`}>Philosophy</p>
                <h2 className={styles.lineReveal} data-reveal>
                  <span><span>The right capital and the</span></span>
                  <span><span>right partnership change how</span></span>
                  <span><span>people live, heal and thrive.</span></span>
                </h2>
                <p className={styles.firmBody}>
                  <span><span>
                    We take an ecosystem approach to seeking value-added investments in MedTech, from medical devices
                    to medical device contract manufacturing. By facilitating industry partnerships and value chain
                    collaboration, we serve as a trusted partner to our portfolio companies, transforming promising
                    innovation into lasting growth.
                  </span></span>
                </p>
              </div>
            </article>

            <article className={`${styles.firmEvidence} ${styles.reveal}`} data-reveal>
              <ol className={styles.highlights}>
              {firmHighlights.map((item, index) => (
                  <li className={styles.philosophyItem} data-reveal key={item.title.join(" ")}>
                    <span className={styles.highlightIndex}>{String(index + 1).padStart(2, "0")}</span>
                    <h3 className={styles.lineReveal} data-reveal>
                      {item.title.map((line) => <span key={line}><span>{line}</span></span>)}
                    </h3>
                    <p><span><span>{item.copy}</span></span></p>
                  </li>
              ))}
              </ol>
            </article>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionTail}`} id="portfolio">
        <div data-reveal className={styles.reveal}>
          <p className={styles.tag}>Companies</p>
          <h2 className={`${styles.display} ${styles.lineReveal}`} data-reveal><span><span>Every company we back represents</span></span><span><span>lives that will be touched.</span></span></h2>
          <p className={styles.lede}>
            We invest across cardiovascular, neurovascular, surgical, vision, diagnostics and
            manufacturing — backing teams in the United States and Taiwan.
          </p>
          <p className={styles.approach}>
            AMED Ventures invests primarily in medical technology and healthcare companies developing innovative
            solutions with the potential to improve patient outcomes and healthcare delivery. We take a
            high-conviction, long-term approach, partnering closely with founders by providing strategic guidance,
            industry expertise, operational support, and access to a global network throughout each company&rsquo;s
            growth journey.
          </p>

        </div>

        <div className={styles.toolbar}>
          <div className={styles.menus}>
            <FilterMenu
              label="Focus area"
              options={withAll(filters.filter((item) => item !== ALL))}
              selected={selectionOf(focusAreas)}
              onSelect={toggle<Filter>(setFocusAreas)}
              defaultOption={ALL}
              classes={menuClasses}
            />
            <FilterMenu label="Region" options={withAll(regions)} selected={selectionOf(regionFilter)} onSelect={toggle<Region>(setRegionFilter)} defaultOption={ALL} classes={menuClasses} />
            <FilterMenu label="Status" options={withAll(statuses)} selected={selectionOf(statusFilter)} onSelect={toggle<Status>(setStatusFilter)} defaultOption={ALL} classes={menuClasses} />
          </div>
          <FilterMenu label="Sort" options={sortOptions} selected={[sort]} onSelect={(value) => { setSort(value as SortOption); setShown(PAGE_SIZE); }} single classes={menuClasses} />
        </div>

        <div className={styles.resultBar}>
          <p className={styles.resultCount} aria-live="polite">
            Showing {shownCompanies.length} of {visibleCompanies.length} companies
          </p>
          {activeFilters.length > 0 && (
            <div className={styles.chips}>
              {activeFilters.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={styles.chip}
                  onClick={() => {
                    setFocusAreas((current) => current.filter((value) => value !== item));
                    setRegionFilter((current) => current.filter((value) => value !== item));
                    setStatusFilter((current) => current.filter((value) => value !== item));
                    setShown(PAGE_SIZE);
                  }}
                >{item}<span aria-hidden>×</span><span className="sr-only">Remove filter</span></button>
              ))}
              <button type="button" className={styles.clearAll} onClick={clearFilters}>Clear all</button>
            </div>
          )}
        </div>

        <div className={styles.grid} ref={gridRef}>
          {shownCompanies.map((company) => (
            <button
              type="button"
              className={styles.card}
              data-reveal
              key={company.name}
              onClick={() => setActive(company)}
              aria-haspopup="dialog"
              aria-label={`${company.name} — open details`}
            >
              {/* Logos sit centred and greyscale on the tile, coming to full colour on hover —
                  the same treatment the companies index on proposal A uses. */}
              <span className={styles.tile}>
                {company.logo
                  ? <Image className={`${styles.logoMark} ${styles.cardLogo}`} src={company.logo} alt="" width={240} height={72} />
                  : <span className={styles.tileName}>{company.name}</span>}
                {company.status === "Realized" && <span className={styles.badge}>Realized</span>}
              </span>
            </button>
          ))}
        </div>

        {shownCompanies.length === 0 && (
          <p className={styles.empty}>No companies match those filters yet. <button type="button" className={styles.clearAll} onClick={clearFilters}>Clear all</button></p>
        )}

        {shown < visibleCompanies.length && (
          <div className={styles.loadMore}>
            <button type="button" className={styles.load} onClick={() => setShown((current) => current + PAGE_SIZE)}>Load more</button>
            <button type="button" className={styles.loadAll} onClick={() => setShown(visibleCompanies.length)}>Load all</button>
          </div>
        )}
      </section>

      {active && (
        <div className={styles.dialogBackdrop} onClick={(event) => { if (event.target === event.currentTarget) setActive(null); }}>
          <div className={styles.dialog} role="dialog" aria-modal="true" aria-label={active.name}>
            <button type="button" className={styles.dialogClose} onClick={() => setActive(null)} autoFocus aria-label="Close">×</button>

            {/* Static markers, not filters: they describe this company, so they are not links. */}
            <ul className={styles.dialogTags}>
              {(active.focus.length > 0 ? active.focus : ["Realized investment"]).map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>

            <div className={styles.dialogHead}>
              {active.logo
                ? <Image className={`${styles.logoMark} ${styles.dialogLogo}`} src={active.logo} alt={`${active.name} logo`} width={240} height={72} />
                : <span className={styles.dialogWordmark}>{active.name}</span>}
              {active.href && (
                <a className={styles.dialogGlobe} href={active.href} target="_blank" rel="noreferrer" aria-label={`Visit the ${active.name} website`}>
                  <IconGlobe />
                </a>
              )}
            </div>

            <div className={styles.dialogBlock}>
              <p className={styles.dialogLabel}>Company profile<span aria-hidden>｜</span><strong>{active.name}</strong></p>
              <p className={styles.dialogCopy}>
                {active.description || "A realized investment. AMED has not published further detail on this company."}
              </p>
            </div>

            <div className={styles.dialogBlock}>
              <p className={styles.dialogLabel}>Details</p>
              <ul className={styles.dialogFacts}>
                <li><strong>Status</strong><span aria-hidden>｜</span>{active.status}</li>
                {active.location && <li><strong>Based</strong><span aria-hidden>｜</span>{active.location}</li>}
                {active.founded && <li><strong>Founded</strong><span aria-hidden>｜</span>{active.founded}</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      {person && (
        <div className={styles.dialogBackdrop} onClick={(event) => { if (event.target === event.currentTarget) setPersonIndex(null); }}>
          <div className={`${styles.dialog} ${styles.personDialog}`} role="dialog" aria-modal="true" aria-label={person.name}>
            {/* Close, then previous and next, stacked in the corner. */}
            <div className={styles.personDialogTools}>
              <button type="button" className={styles.dialogClose} onClick={() => setPersonIndex(null)} autoFocus aria-label="Close">×</button>
              <button type="button" onClick={() => setPersonIndex((current) => step(current, -1))} aria-label="Previous profile"><IconArrowLeft /></button>
              <button type="button" onClick={() => setPersonIndex((current) => step(current, 1))} aria-label="Next profile"><IconArrowRight /></button>
            </div>

            <div className={styles.personDialogMain}>
              <figure className={styles.personDialogPhoto}>
                <Image className={portraitAlignment[person.name]} src={person.portrait} alt="" width={900} height={900} />
              </figure>

              <div>
                <h3 className={styles.personDialogName}>{person.name}</h3>
                <p className={`${styles.personDialogRole} ${person.role ? "" : styles.pendingOnGreen}`}>{person.role || "Title to be supplied by AMED"}</p>
                {person.bio
                  ? person.bio.split("\n\n").map((paragraph) => <p className={styles.personDialogBio} key={paragraph.slice(0, 24)}>{paragraph}</p>)
                  : <p className={`${styles.personDialogBio} ${styles.pendingOnGreen}`}>Biography to be supplied by AMED</p>}
                <div className={styles.personDialogFoot}>
                  <a href={`mailto:${teamEmail}`} aria-label={`Email ${person.name} at ${teamEmail}`} title={teamEmail}><IconMail /></a>
                  <a href={teamLinkedIn} target="_blank" rel="noreferrer" aria-label={`${person.name} on LinkedIn`}><IconLinkedIn /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className={styles.team} id="team">
        <div className={styles.section}>
          <div data-reveal className={styles.reveal}>
            <p className={styles.tag}>Team</p>
            <h2 className={`${styles.display} ${styles.lineReveal}`} data-reveal><span><span>Decades of building,</span></span><span><span>investing and operating.</span></span></h2>
            <p className={styles.lede}>
              Our team brings decades of combined experience across investment, business development, and
              operational management, from large public companies to early-stage startups. We believe that with
              the right support, today&rsquo;s pioneering idea becomes tomorrow&rsquo;s global impact.
            </p>
          </div>
          <div className={styles.teamRows}>
            {team.map(([group, members]) => (
              <div className={`${styles.teamRow} ${styles.reveal}`} data-reveal key={group}>
                <div className={styles.teamRowHead}>
                  {/* Broken by hand so all three labels sit on exactly two lines. */}
                  <h3>{group.split(" ").map((word) => <span key={word}>{word}</span>)}</h3>
                </div>
                <ul className={styles.teamPeople}>
                  {members.map(([name, role, , portrait]) => {
                    return (
                      <li key={name}>
                        <button
                          type="button"
                          className={styles.person}
                          onClick={() => setPersonIndex(roster.findIndex((entry) => entry.name === name))}
                          aria-haspopup="dialog"
                          aria-label={`${name} — open profile`}
                        >
                          <figure>
                            <Image className={`${styles.personPhoto} ${portraitAlignment[name] ?? ""}`} src={portrait} alt="" width={900} height={900} />
                          </figure>
                          <span className={styles.personName}>{name}</span>
                          {role ? <span className={styles.personRole}>{role}</span> : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionTail}`} id="news">
        <div data-reveal className={styles.reveal}>
          <p className={styles.tag}>Story</p>
          <h2 className={`${styles.display} ${styles.lineReveal}`} data-reveal><span><span>Milestones from the</span></span><span><span>companies we back.</span></span></h2>
        </div>
        <div className={styles.storyFilter} role="toolbar" aria-label="Filter stories by milestone">
          {["All", ...newsTypes].map((item) => (
            <button
              type="button"
              key={item}
              className={newsFilter === item ? styles.storyFilterActive : ""}
              aria-pressed={newsFilter === item}
              onClick={() => { setNewsFilter(item as NewsType | "All"); setNewsPage(0); }}
            >{item}</button>
          ))}
        </div>

        <table className={styles.storyTable}>
          <thead>
            <tr>
              <th scope="col">Story</th>
              <th scope="col">Company</th>
              <th scope="col"><span className="sr-only">Open the story</span></th>
            </tr>
          </thead>
          <tbody>
            {visibleNews.map((item) => (
              <tr key={item.url}>
                <td className={styles.storyTitleCell}>
                  <a href={item.url} target="_blank" rel="noreferrer">{item.title}</a>
                  <span className={styles.storyTags}>
                    <span className={`${styles.storyType} ${styles[`storyType${item.type}`]}`}>{item.type}</span>
                    <span className={styles.storySource}>{item.source}</span>
                  </span>
                </td>
                <td className={styles.storyCompanyCell}>
                  {item.company}
                  {item.date && <time dateTime={item.date}>{formatStoryDate(item.date)}</time>}
                </td>
                <td className={styles.storyLinkCell} aria-hidden><IconArrowUpRight /></td>
              </tr>
            ))}
          </tbody>
        </table>

        {newsPages > 1 && (
          <div className={styles.storyPager}>
            <p>Page {page + 1} of {newsPages}</p>
            <div>
              <button type="button" onClick={() => setNewsPage(page - 1)} disabled={page === 0}>Previous</button>
              {Array.from({ length: newsPages }, (_, index) => (
                <button
                  type="button"
                  key={index}
                  className={index === page ? styles.storyPageActive : ""}
                  aria-current={index === page ? "page" : undefined}
                  onClick={() => setNewsPage(index)}
                >{index + 1}</button>
              ))}
              <button type="button" onClick={() => setNewsPage(page + 1)} disabled={page === newsPages - 1}>Next</button>
            </div>
          </div>
        )}

      </section>



      </div>

      <div className={styles.tail} ref={tailRef} id="contact">
        <div className={styles.contactStage}>
          <p className={`${styles.contactMark} ${stage > 0 ? styles.markIn : ""} ${stage > 1 ? styles.markUp : ""}`} aria-hidden>CONTACT</p>
        </div>

      <section className={`${styles.contact} ${stage > 2 ? styles.contactIn : ""}`}>
        <div className={styles.section}>
          <div data-reveal className={styles.reveal}>
            <h2 className={`${styles.display} ${styles.lineReveal}`} data-reveal><span><span>Tell us what</span></span><span><span>you are building.</span></span></h2>
            <dl className={styles.contactPoints}>
              <div><dt>Offices</dt><dd>San Francisco Bay Area, USA · Taipei, Taiwan</dd></div>
              <div><dt>Industry</dt><dd>MedTech venture capital · Healthcare innovation</dd></div>
              <div><dt>Email</dt><dd><a href={`mailto:${teamEmail}`}>{teamEmail}</a></dd></div>
              <div><dt>Address</dt><dd className={styles.pending}>Street address to be supplied by AMED</dd></div>
            </dl>
          </div>

          <form className={styles.form} onSubmit={submit}>
            <p className={styles.formLabel}>Pitch your company</p>

            <label>Name<input name="name" autoComplete="name" required /></label>
            <label>Company<input name="company" autoComplete="organization" required /></label>
            <label>Email<input name="email" type="email" autoComplete="email" required /></label>
            <label>Phone
              <span className={styles.phoneRow}>
                <select name="countryCode" defaultValue="+1" aria-label="Country calling code">
                  {countryCodes.map((code) => <option key={code}>{code}</option>)}
                </select>
                <input name="phone" type="tel" inputMode="tel" autoComplete="tel-national" required />
              </span>
            </label>
            <label>Website or deck<input name="link" type="url" inputMode="url" placeholder="https://" /></label>
            <label>Headquarters<input name="location" autoComplete="address-level2" placeholder="City, country" /></label>
            <label>Focus area
              <select name="focus" defaultValue="">
                <option value="" disabled>Select one</option>
                {filters.filter((item) => item !== ALL).map((item) => <option key={item}>{item}</option>)}
                <option>Other</option>
              </select>
            </label>
            <label>Stage
              <select name="stage" defaultValue="">
                <option value="" disabled>Select one</option>
                {fundingStages.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>

            <label className={styles.wide}>What are you building, and what does this round unlock?
              <textarea name="message" rows={4} required />
            </label>

            <div className={styles.formFoot}>
              <button className={`${styles.pill} ${styles.pillSolid}`} type="submit">Send introduction</button>
              {sent ? <p className={styles.sent} role="status">Thank you — this proposal build does not store submissions yet. Connect a form endpoint before launch.</p> : null}
            </div>
          </form>
        </div>
      </section>

        <footer className={styles.footer}>

        <div className={styles.footerInner}>
          <nav className={styles.footerGroup} aria-label="Footer navigation">
            <ul>
              <li><a href="#approach">About</a></li>
              <li><a href="#philosophy">Philosophy</a></li>
              <li><a href="#portfolio">Companies</a></li>
            </ul>
          </nav>
          <nav className={styles.footerGroup} aria-label="More">
            <ul>
              <li><a href="#team">Team</a></li>
              <li><a href="#news">Story</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </nav>
          <div className={styles.footerIdentity}>
            <Image src="/brand/amed-logo-white.png" alt="AMED Ventures" width={320} height={120} />
            <p>San Francisco Bay Area · Taipei<br />© {new Date().getFullYear()} AMED Ventures.</p>
          </div>
        </div>
        </footer>
      </div>
    </div>
  );
}
