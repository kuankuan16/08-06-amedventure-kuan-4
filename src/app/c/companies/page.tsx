"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { FilterMenu } from "@/components/FilterMenu";
import { IconGlobe } from "@/components/icons";
import {
  filters,
  portfolio,
  regions,
  regionsOf,
  sortOptions,
  statuses,
  type Filter,
  type PortfolioEntry,
  type Region,
  type SortOption,
  type Status,
} from "@/data/portfolio";
import { BackToTop, CFooter, CHeader } from "../components";
import styles from "../page.module.css";
import { PageWord } from "../PageWord";

const PAGE_SIZE = 30;
const ALL = "All";
const menuClasses = {
  root: styles.menu,
  trigger: styles.menuTrigger,
  triggerOpen: styles.menuTriggerOpen,
  count: styles.menuCount,
  panel: styles.menuPanel,
  option: styles.menuOption,
  optionSelected: styles.menuOptionSelected,
};

export default function CompaniesPage() {
  const [focusAreas, setFocusAreas] = useState<Filter[]>([]);
  const [regionFilter, setRegionFilter] = useState<Region[]>([]);
  const [statusFilter, setStatusFilter] = useState<Status[]>([]);
  const [sort, setSort] = useState<SortOption>("Recent");
  const [shown, setShown] = useState(PAGE_SIZE);
  const [active, setActive] = useState<PortfolioEntry | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const toggle =
    <T extends string>(setter: (update: (current: T[]) => T[]) => void) =>
    (value: string) => {
      setter((current) =>
        value === ALL
          ? []
          : current.includes(value as T)
            ? current.filter((item) => item !== value)
            : [...current, value as T],
      );
      setShown(PAGE_SIZE);
    };
  const withAll = (options: readonly string[]) => [ALL, ...options];
  const selectionOf = (values: readonly string[]) =>
    values.length > 0 ? values : [ALL];
  const visibleCompanies = useMemo(() => {
    const matched = portfolio.filter(
      (company) =>
        (focusAreas.length === 0 ||
          company.focus.some((area) => focusAreas.includes(area))) &&
        (regionFilter.length === 0 ||
          regionsOf(company.location).some((region) =>
            regionFilter.includes(region),
          )) &&
        (statusFilter.length === 0 || statusFilter.includes(company.status)),
    );
    return [...matched].sort((a, b) =>
      sort === "Alphabetical"
        ? a.name.localeCompare(b.name)
        : Number(b.founded || 0) - Number(a.founded || 0) ||
          a.name.localeCompare(b.name),
    );
  }, [focusAreas, regionFilter, statusFilter, sort]);
  const shownCompanies = visibleCompanies.slice(0, shown);
  const activeFilters = [...focusAreas, ...regionFilter, ...statusFilter];
  const clearFilters = () => {
    setFocusAreas([]);
    setRegionFilter([]);
    setStatusFilter([]);
    setShown(PAGE_SIZE);
  };

  useEffect(() => {
    if (!active) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  useEffect(() => {
    const root = gridRef.current;
    if (!root) return;
    const targets = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.cardVisible);
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [shownCompanies]);

  return (
    <div className={styles.page} id="top">
      <CHeader />
      <BackToTop />
      <main className={styles.companiesPage}>
        <PageWord>COMPANIES</PageWord>
        <div className={`${styles.section} ${styles.standaloneSection}`}>
          <div className={styles.pageIntro}>
            <p className={styles.tag}>Companies</p>
            <h1 className={styles.display}>
              Every company we back represents
              <br />
              lives that will be touched.
            </h1>
            <p className={styles.lede}>
              AMED Ventures invests in medical technology and healthcare
              companies across cardiovascular, neurovascular, surgical, vision,
              diagnostics and manufacturing—backing teams in Taiwan and the
              United States developing solutions with the potential to improve
              patient outcomes and healthcare delivery.
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
              <FilterMenu
                label="Region"
                options={withAll(regions)}
                selected={selectionOf(regionFilter)}
                onSelect={toggle<Region>(setRegionFilter)}
                defaultOption={ALL}
                classes={menuClasses}
              />
              <FilterMenu
                label="Status"
                options={withAll(statuses)}
                selected={selectionOf(statusFilter)}
                onSelect={toggle<Status>(setStatusFilter)}
                defaultOption={ALL}
                classes={menuClasses}
              />
            </div>
            <FilterMenu
              label="Sort"
              options={sortOptions}
              selected={[sort]}
              onSelect={(value) => {
                setSort(value as SortOption);
                setShown(PAGE_SIZE);
              }}
              single
              classes={menuClasses}
            />
          </div>
          <div className={styles.resultBar}>
            <p className={styles.resultCount} aria-live="polite">
              {activeFilters.length > 0
                ? `Showing ${shownCompanies.length} of ${visibleCompanies.length} companies`
                : "Companies"}
            </p>
            {activeFilters.length > 0 && (
              <div className={styles.chips}>
                {activeFilters.map((item) => (
                  <button
                    type="button"
                    key={item}
                    className={styles.chip}
                    onClick={() => {
                      setFocusAreas((current) =>
                        current.filter((value) => value !== item),
                      );
                      setRegionFilter((current) =>
                        current.filter((value) => value !== item),
                      );
                      setStatusFilter((current) =>
                        current.filter((value) => value !== item),
                      );
                      setShown(PAGE_SIZE);
                    }}
                  >
                    {item}
                    <span aria-hidden>×</span>
                  </button>
                ))}
                <button
                  type="button"
                  className={styles.clearAll}
                  onClick={clearFilters}
                >
                  Clear all
                </button>
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
                <span className={styles.tile}>
                  <span className={styles.cardChrome} aria-hidden="true">
                    <span
                      className={`${styles.cardFacts} ${company.status === "Realized" ? styles.cardFactsRealized : ""}`}
                    >
                      <span>
                        {company.status === "Realized"
                          ? ""
                          : company.location || company.status}
                      </span>
                      <span>
                        {company.founded
                          ? `Founded ${company.founded}`
                          : company.status}
                      </span>
                    </span>
                  </span>
                  <span className={styles.cardRest}>
                    {company.logo ? (
                      <Image
                        className={`${styles.logoMark} ${styles.cardLogo}`}
                        src={company.logo}
                        alt=""
                        width={240}
                        height={72}
                      />
                    ) : (
                      <span className={styles.tileName}>{company.name}</span>
                    )}
                  </span>
                  <span className={styles.cardInfo} aria-hidden="true">
                    <strong className={styles.cardName}>{company.name}</strong>
                    <span className={styles.cardDescription}>
                      {company.description ||
                        "A realized AMED Ventures investment."}
                    </span>
                  </span>
                </span>
              </button>
            ))}
          </div>
          {shownCompanies.length === 0 && (
            <p className={styles.empty}>
              No companies match those filters yet.{" "}
              <button
                type="button"
                className={styles.clearAll}
                onClick={clearFilters}
              >
                Clear all
              </button>
            </p>
          )}
          {shown < visibleCompanies.length && (
            <div className={styles.loadMore}>
              <button
                type="button"
                className={styles.load}
                onClick={() => setShown((current) => current + PAGE_SIZE)}
              >
                Load more
              </button>
              <button
                type="button"
                className={styles.loadAll}
                onClick={() => setShown(visibleCompanies.length)}
              >
                Load all
              </button>
            </div>
          )}
        </div>
      </main>
      {active && (
        <div
          className={styles.dialogBackdrop}
          onClick={(event) => {
            if (event.target === event.currentTarget) setActive(null);
          }}
        >
          <div
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-label={active.name}
          >
            <button
              type="button"
              className={styles.dialogClose}
              onClick={() => setActive(null)}
              autoFocus
              aria-label="Close"
            >
              ×
            </button>
            <ul className={styles.dialogTags}>
              {(active.focus.length > 0
                ? active.focus
                : ["Realized investment"]
              ).map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
            <div className={styles.dialogHead}>
              {active.logo ? (
                <Image
                  className={`${styles.logoMark} ${styles.dialogLogo}`}
                  src={active.logo}
                  alt={`${active.name} logo`}
                  width={240}
                  height={72}
                />
              ) : (
                <span className={styles.dialogWordmark}>{active.name}</span>
              )}
              {active.href && (
                <a
                  className={styles.dialogGlobe}
                  href={active.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Visit the ${active.name} website`}
                >
                  <IconGlobe />
                </a>
              )}
            </div>
            <div className={styles.dialogBlock}>
              <p className={styles.dialogLabel}>
                Company profile<span aria-hidden>｜</span>
                <strong>{active.name}</strong>
              </p>
              <p className={styles.dialogCopy}>
                {active.description ||
                  "A realized investment. AMED has not published further detail on this company."}
              </p>
            </div>
            <div className={styles.dialogBlock}>
              <p className={styles.dialogLabel}>Details</p>
              <ul className={styles.dialogFacts}>
                <li>
                  <strong>Status</strong>
                  <span aria-hidden>｜</span>
                  {active.status}
                </li>
                {active.location && (
                  <li>
                    <strong>Based</strong>
                    <span aria-hidden>｜</span>
                    {active.location}
                  </li>
                )}
                {active.founded && (
                  <li>
                    <strong>Founded</strong>
                    <span aria-hidden>｜</span>
                    {active.founded}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
      <CFooter />
    </div>
  );
}
