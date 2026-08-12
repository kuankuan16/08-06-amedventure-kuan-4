import Image from "next/image";
import Link from "next/link";
import styles from "./portal.module.css";

const versions = [
  {
    index: "01",
    eyebrow: "Concept A · Immersive",
    title: "Particle Experience",
    description: "A cinematic, scroll-driven experience built around an interactive three.js canvas and fixed editorial overlays.",
    href: "/a",
    image: "/images/portal/version-a.png",
    theme: "dark",
  },
  {
    index: "02",
    eyebrow: "Concept B · Editorial",
    title: "Editorial System",
    description: "A content-led, highly responsive presentation with portfolio, philosophy, team, stories and contact in one flow.",
    href: "/b",
    image: "/images/portal/version-b.png",
    theme: "light",
  },
] as const;

export default function VersionPortal() {
  return (
    <main className={styles.portal}>
      <header className={styles.header}>
        <Image className={styles.logo} src="/brand/amed-logo-light.png" alt="AMED Ventures" width={600} height={178} priority />
        <div className={styles.headerMeta}>
          <span>Website concepts</span>
          <span>Project portal</span>
        </div>
      </header>

      <section className={styles.intro}>
        <p className={styles.kicker}><span aria-hidden />AMED Ventures</p>
        <h1>Select a direction<br />to preview.</h1>
        <p className={styles.lede}>Two complete website approaches, kept side by side for review. Each preview opens in a new tab so this portal stays available.</p>
      </section>

      <section className={styles.versionGrid} aria-label="Website concepts">
        {versions.map((version) => (
          <Link
            className={`${styles.versionCard} ${styles[version.theme]}`}
            href={version.href}
            target="_blank"
            rel="noreferrer"
            key={version.href}
          >
            <div className={styles.preview}>
              <Image src={version.image} alt={`Preview of ${version.title}`} fill sizes="(max-width: 900px) 100vw, 50vw" loading="eager" />
              <span className={styles.openIcon} aria-hidden>↗</span>
            </div>
            <div className={styles.cardMeta}>
              <div className={styles.cardLabel}>
                <span>{version.index}</span>
                <span>{version.eyebrow}</span>
              </div>
              <h2>{version.title}</h2>
              <p>{version.description}</p>
              <span className={styles.openText}>Open preview <span aria-hidden>↗</span></span>
            </div>
          </Link>
        ))}
      </section>

      <footer className={styles.footer}>
        <span>AMED Ventures · Design review</span>
        <span>Updated August 2026</span>
      </footer>
    </main>
  );
}
