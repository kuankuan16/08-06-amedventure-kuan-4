import { ExperienceCanvas } from "@/components/ExperienceCanvas";
import { FocusOverlay } from "@/components/FocusOverlay";
import { HeroOverlay } from "@/components/HeroOverlay";
import { LeadershipSection } from "@/components/LeadershipSection";
import { PitchFooter } from "@/components/PitchFooter";
import { PortfolioOverlay } from "@/components/PortfolioOverlay";
import { SiteHeader } from "@/components/SiteHeader";
import { ScrollCue } from "@/components/ScrollCue";
import { SectionAccent } from "@/components/SectionAccent";
import styles from "../page.module.css";

export default function ExperienceHome() {
  return (
    <main className={styles.page}>
      <div className={styles.media} aria-hidden="true">
        <div className={styles.mediaVeil} />
      </div>

      <ExperienceCanvas />
      <SectionAccent />
      <SiteHeader />
      <ScrollCue
        href="#focus"
        label="Scroll to investment focus"
        steps={[
          { href: "#focus", label: "Scroll to investment focus" },
          { href: "#portfolio", label: "Scroll to portfolio", anchor: "focus" },
          { href: "#team", label: "Scroll to team", anchor: "portfolio" },
          { href: "#contact", label: "Scroll to contact", anchor: "team" },
        ]}
        hideAfter="contact"
      />
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
