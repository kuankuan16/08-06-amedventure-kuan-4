"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./SiteHeader.module.css";

const navItems = [
  { label: "Focus", href: "#focus" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Team", href: "#team" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const onHome = pathname === "/";
  const sectionHref = (href: string) => onHome ? href : `/${href}`;

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={styles.header}>
        <a className={styles.logoLink} href={onHome ? "#top" : "/"} aria-label="AMED Ventures home">
          <Image
            className={styles.logo}
            src="/brand/amed-logo-white.png"
            alt="AMED Ventures"
            width={600}
            height={178}
            priority
          />
        </a>
        <nav className={styles.desktopNav} aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.href} href={sectionHref(item.href)}>{item.label}</a>
          ))}
        </nav>
        <a className={styles.contact} href={sectionHref("#contact")}>
          <span>Contact Us</span><i aria-hidden="true" />
        </a>
        <button
          className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ""}`}
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /><span />
        </button>
      </header>

      <div
        id="mobile-navigation"
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile navigation">
          {navItems.map((item, index) => (
            <a key={item.href} href={sectionHref(item.href)} onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>
              <span>0{index + 1}</span>{item.label}
            </a>
          ))}
          <a href={sectionHref("#contact")} onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>
            <span>04</span>Contact Us
          </a>
        </nav>
        <p>Strategic capital for breakthrough medical-device founders.</p>
      </div>
    </>
  );
}
