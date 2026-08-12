"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { type MouseEvent, useEffect, useState } from "react";
import { sectionFromClock } from "./SectionAccent";
import { useScrollClock } from "./useScrollClock";
import styles from "./SiteHeader.module.css";

/** `accent` names the section palette each link carries — fixed, not the section you are in. */
const navItems = [
  { label: "Focus", href: "#focus", accent: "focus" },
  { label: "Portfolio", href: "#portfolio", accent: "portfolio" },
  { label: "Team", href: "#team", accent: "team" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const onExperience = pathname === "/a";
  const sectionHref = (href: string) => onExperience ? href : `/a${href}`;
  // Scrolling into a section lights its link in that section's own colour.
  const clock = useScrollClock(onExperience ? undefined : 0);
  const activeAccent = onExperience ? sectionFromClock(clock) : null;

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!onExperience || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.location.assign("/a");
  };

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
        <a className={styles.logoLink} href={onExperience ? "#top" : "/a"} onClick={handleLogoClick} aria-label="AMED Ventures home">
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
            <a className={activeAccent === item.accent ? styles.activeNav : ""} data-accent={item.accent} key={item.href} href={sectionHref(item.href)}>{item.label}</a>
          ))}
        </nav>
        <a className={styles.contact} href={sectionHref("#contact")}>
          <span>Contact Us</span>
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
        inert={!menuOpen}
      >
        <nav aria-label="Mobile navigation">
          {navItems.map((item, index) => (
            <a className={activeAccent === item.accent ? styles.activeNav : ""} data-accent={item.accent} key={item.href} href={sectionHref(item.href)} onClick={closeMenu}>
              <span>0{index + 1}</span>{item.label}
            </a>
          ))}
          <a href={sectionHref("#contact")} onClick={closeMenu}>
            <span>04</span>Contact Us
          </a>
        </nav>
        <p>Strategic capital for breakthrough medical-device founders.</p>
      </div>
    </>
  );
}
