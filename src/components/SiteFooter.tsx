"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./SiteFooter.module.css";

const footerLinks = [
  ["Focus", "#focus"],
  ["Portfolio", "#portfolio"],
  ["Companies", "/companies"],
  ["Team", "#team"],
  ["Contact", "https://www.amedventures.com/contact"],
] as const;

/** The site's only footer: hairline, AMED lockup, location and copyright, section links. */
export function SiteFooter() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const external = (href: string) => href.startsWith("http");
  const route = (href: string) => href.startsWith("/");
  const sectionHref = (href: string) => external(href) || route(href) || onHome ? href : `/${href}`;

  return (
    <div className={styles.shell}>
      <div className={styles.rule} />
      <div className={styles.bottom}>
        <div className={styles.identity}>
          <Link className={styles.lockup} href="/" aria-label="AMED Ventures home">
            <Image src="/brand/amed-logo-white.png" alt="AMED Ventures" width={320} height={120} />
          </Link>
          <div className={styles.identityMeta}>
            <p className="amed-tag">San Francisco Bay Area · US &amp; Asia</p>
            <p className={styles.copyright}>© {new Date().getFullYear()} AMED Ventures. Investing in health that moves forward.</p>
          </div>
        </div>
        <nav className={styles.nav} aria-label="Footer navigation">
          {footerLinks.map(([label, href]) => route(href) ? (
            <Link href={href} key={label}>{label}</Link>
          ) : (
            <a
              href={sectionHref(href)}
              key={label}
              target={external(href) ? "_blank" : undefined}
              rel={external(href) ? "noreferrer" : undefined}
            >{label}</a>
          ))}
        </nav>
      </div>
    </div>
  );
}
