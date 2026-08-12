"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IconArrowRight } from "@/components/icons";
import styles from "./page.module.css";
import { taipeiAddress, usOffice } from "./content";

const links = [
  ["About", "/c/about"],
  ["Portfolio", "/c/companies"],
  ["Team", "/c/team"],
] as const;

export function CHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}
      >
        <Link
          className={styles.brand}
          href="/c"
          aria-label="AMED Ventures home"
        >
          <Image
            src="/brand/amed-logo-light.png"
            alt="AMED Ventures"
            width={320}
            height={120}
            priority
          />
        </Link>
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
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <a
      className={`${styles.backToTop} ${visible ? styles.backToTopVisible : ""}`}
      href="#top"
      aria-label="Back to top"
      inert={!visible}
    >
      <IconArrowRight />
    </a>
  );
}

export function CFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <Link
          className={styles.footerLogo}
          href="/c"
          aria-label="AMED Ventures home"
        >
          <Image
            src="/brand/amed-logo-light.png"
            alt="AMED Ventures"
            width={320}
            height={120}
          />
        </Link>
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
              <Link href="/c/companies">Portfolio</Link>
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
            <span>Taipei</span>
            <address>{taipeiAddress}</address>
          </div>
          <div className={styles.footerOffice}>
            <span>San Francisco</span>
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
