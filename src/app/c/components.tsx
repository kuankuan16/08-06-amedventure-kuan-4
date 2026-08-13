"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent, useState, useSyncExternalStore } from "react";
import { IconArrowRight } from "@/components/icons";
import styles from "./page.module.css";
import { usOffice } from "./content";

const links = [
  ["About", "/c/about"],
  ["Portfolio", "/c/portfolio"],
  ["Team", "/c/team"],
] as const;

const scrollSubscribers = new Set<() => void>();
let scrollSnapshot = false;

const updateScrollSnapshot = () => {
  const next = window.scrollY > 12;
  if (next === scrollSnapshot) return;
  scrollSnapshot = next;
  scrollSubscribers.forEach((subscriber) => subscriber());
};

const subscribeToScroll = (subscriber: () => void) => {
  scrollSubscribers.add(subscriber);
  if (scrollSubscribers.size === 1) {
    scrollSnapshot = window.scrollY > 12;
    window.addEventListener("scroll", updateScrollSnapshot, { passive: true });
  }
  return () => {
    scrollSubscribers.delete(subscriber);
    if (scrollSubscribers.size === 0) {
      window.removeEventListener("scroll", updateScrollSnapshot);
    }
  };
};

const getScrollSnapshot = () => scrollSnapshot;
const getServerScrollSnapshot = () => false;

function useScrolled() {
  return useSyncExternalStore(
    subscribeToScroll,
    getScrollSnapshot,
    getServerScrollSnapshot,
  );
}

function HomeLogo({
  className,
  priority = false,
}: {
  className: string;
  priority?: boolean;
}) {
  const pathname = usePathname();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/c") return;

    event.preventDefault();
    window.history.replaceState(null, "", "/c");
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  return (
    <Link
      className={className}
      data-hover-object="brand"
      href="/c"
      aria-label="AMED Ventures home"
      onClick={handleClick}
    >
      <Image
        src="/brand/amed-logo-light.png"
        alt="AMED Ventures"
        width={320}
        height={120}
        priority={priority}
      />
    </Link>
  );
}

export function CHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrolled();

  return (
    <>
      <header
        className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}
      >
        <HomeLogo className={styles.brand} priority />
        <nav className={styles.nav} aria-label="Primary navigation">
          {links.map(([label, href]) => (
            <Link
              href={href}
              key={label}
              aria-current={pathname === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <button
          className={`${styles.mobileMenuButton} ${menuOpen ? styles.mobileMenuButtonOpen : ""}`}
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="c-mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
        <Link
          className={`${styles.pill} ${styles.pillOutline} ${styles.headerCta}`}
          href="/c/contact"
        >
          Contact
        </Link>
      </header>
      <nav
        className={`${styles.mobileNav} ${menuOpen ? styles.mobileNavOpen : ""}`}
        id="c-mobile-navigation"
        aria-label="Mobile navigation"
        inert={!menuOpen}
      >
        {links.map(([label, href]) => (
          <Link href={href} key={label} onClick={() => setMenuOpen(false)}>
            {label}
          </Link>
        ))}
        <Link href="/c/contact" onClick={() => setMenuOpen(false)}>
          Contact
        </Link>
      </nav>
    </>
  );
}

export function BackToTop() {
  const visible = useScrolled();

  const scrollToTop = () => {
    window.history.replaceState(null, "", window.location.pathname);
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  return (
    <button
      type="button"
      className={`${styles.backToTop} ${visible ? styles.backToTopVisible : ""}`}
      aria-label="Back to top"
      inert={!visible}
      onClick={scrollToTop}
    >
      <IconArrowRight />
    </button>
  );
}

export function CFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <HomeLogo className={styles.footerLogo} />
        <nav
          className={`${styles.footerGroup} ${styles.footerNav}`}
          aria-label="Footer navigation"
        >
          <ul>
            <li>
              <Link href="/c">Home</Link>
            </li>
            <li>
              <Link href="/c/about">About</Link>
            </li>
            <li>
              <Link href="/c/portfolio">Portfolio</Link>
            </li>
            <li>
              <Link href="/c#news">Story</Link>
            </li>
            <li>
              <Link href="/c/team">Team</Link>
            </li>
            <li>
              <Link href="/c/contact">Contact</Link>
            </li>
          </ul>
        </nav>
        <div className={styles.footerIdentity}>
          <div className={styles.footerOffice}>
            <span>Taiwan</span>
            <address>
              3F.-1, No. 3, Dunhua S. Rd., Songshan Dist.,
              <br className={styles.footerMobileBreak} />
              Taipei City 105, Taiwan (R.O.C.)
            </address>
          </div>
          <div className={styles.footerOffice}>
            <span>United States</span>
            <address>{usOffice}</address>
          </div>
        </div>
      </div>
      <div className={styles.footerBase}>
        <span>© {new Date().getFullYear()} AMED Ventures</span>
        <span>Healthcare venture capital</span>
      </div>
    </footer>
  );
}
