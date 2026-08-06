import { ExperienceCanvas } from "@/components/ExperienceCanvas";
import { FocusOverlay } from "@/components/FocusOverlay";
import { HeroOverlay } from "@/components/HeroOverlay";
import { LeadershipSection } from "@/components/LeadershipSection";
import { Loader } from "@/components/Loader";
import { PitchFooter } from "@/components/PitchFooter";
import { PortfolioOverlay } from "@/components/PortfolioOverlay";
import { SiteHeader } from "@/components/SiteHeader";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <div className={styles.media} aria-hidden="true">
        <video autoPlay muted loop playsInline poster="/images/amed/hero-vascular.jpg">
          <source src="/videos/amed-hero.mp4" type="video/mp4" />
        </video>
        <div className={styles.mediaVeil} />
      </div>

      <ExperienceCanvas />
      <Loader />
      <SiteHeader />
      <HeroOverlay />
      <FocusOverlay />
      <PortfolioOverlay />

      <div className="amed-tracks" aria-hidden="true">
        <div className="amed-track" />
        <div className={`amed-track ${styles.anchorTrack}`} id="focus" />
        <div className={`amed-track ${styles.anchorTrack}`}>
          <span className={styles.portfolioAnchor} id="portfolio" />
        </div>
        <div className="amed-trailing" />
      </div>

      <div className={styles.content}>
        <LeadershipSection />
        <PitchFooter />
      </div>
    </main>
  );
}
