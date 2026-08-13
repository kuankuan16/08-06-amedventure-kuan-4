"use client";

import Image from "next/image";
import Link from "next/link";
import { IconArrowRight, IconArrowUpRight } from "@/components/icons";
import { BackToTop, CFooter, CHeader } from "../components";
import styles from "../page.module.css";
import { AboutMarkFigure } from "./AboutMarkFigure";
import { PageWord } from "../PageWord";
import { RevealHeading } from "../RevealHeading";
import { useReveals } from "../useReveals";

const pillars = [
  {
    title: ["Long-term", "partnership"],
    copy: "We stay with founders for the long run, from first clinical evidence through global scale.",
  },
  {
    title: ["High-conviction", "investing"],
    copy: "Fewer, deeper positions in medical technology where the clinical case and team convince us.",
  },
  {
    title: ["Exceptional", "entrepreneurs"],
    copy: "Strategic guidance, deep industry expertise and hands-on support for the teams building it.",
  },
  {
    title: ["Meaningful", "impact"],
    copy: "What we build is finally measured in outcomes for the patients on the other end of it.",
  },
] as const;

export default function AboutPage() {
  const pageRef = useReveals<HTMLDivElement>(styles.revealVisible);

  return (
    <div className={styles.page} ref={pageRef} id="top">
      <CHeader />
      <BackToTop />
      <main className={`${styles.about} ${styles.aboutPage}`}>
        <PageWord>ABOUT</PageWord>
        <section className={styles.section}>
          <div className={`${styles.aboutInner} ${styles.aboutPageHero}`}>
            <div data-reveal className={styles.reveal}>
              <p className={styles.tag}>Founding conviction</p>
              <blockquote
                className={`${styles.quote} ${styles.lineReveal}`}
                data-reveal
              >
                <span>
                  <span>The right capital and</span>
                </span>
                <span>
                  <span>the right partnership</span>
                </span>
                <span>
                  <span>change how people live,</span>
                </span>
                <span>
                  <span>heal and thrive.</span>
                </span>
              </blockquote>
              <hr className={styles.quoteRule} />
              <p className={styles.quoteBy}>
                AMED Ventures<span>Founding conviction</span>
              </p>
            </div>
            <AboutMarkFigure />
          </div>
          <section
            className={styles.aboutV2}
            aria-labelledby="about-v2-heading"
          >
            <div className={styles.aboutV2Intro}>
              <RevealHeading
                as="h2"
                id="about-v2-heading"
                lines={[
                  "Built for the founders",
                  "building what medicine",
                  "becomes.",
                ]}
              />
              <p data-reveal className={styles.reveal}>
                AMED Ventures is a dedicated MedTech venture firm investing
                across the United States and Taiwan. We pair operating
                experience with clinical judgment and manufacturing depth, so a
                device can cross the long distance between first sketch and
                standard of care.
              </p>
            </div>
          </section>
          <div className={styles.pillars}>
            {pillars.map(({ title, copy }, index) => (
              <article
                className={styles.pillar}
                data-hover-object="feature"
                data-reveal
                key={title.join(" ")}
              >
                <div className={styles.pillarMeta}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <IconArrowUpRight aria-hidden />
                </div>
                <h3>
                  {title.map((line) => (
                    <span key={line}>
                      <span>{line}</span>
                    </span>
                  ))}
                </h3>
                <p>
                  <span>
                    <span>{copy}</span>
                  </span>
                </p>
              </article>
            ))}
          </div>
          <div
            data-reveal
            data-hover-object="media"
            className={`${styles.aboutV2Feature} ${styles.reveal}`}
          >
            <div className={styles.aboutV2Copy}>
              <RevealHeading
                as="h3"
                lines={["Decades of building,", "investing and operating."]}
              />
              <p>
                Our partners and advisors span device engineering, clinical
                practice and global manufacturing — operators across the whole
                MedTech value chain.
              </p>
              <Link className={styles.aboutV2Button} href="/c/team">
                <span>Meet the team</span>
                <IconArrowRight />
              </Link>
            </div>
            <figure className={styles.aboutV2Image}>
              <Image
                src="/images/amed/about-expertise-team.jpg"
                alt="AMED operators collaborating on a medical device prototype"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              <svg
                viewBox="0 0 200 800"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d="M0 0 H62 C130 120 20 260 88 400 C150 530 30 640 70 800 H0 Z" />
              </svg>
            </figure>
          </div>
        </section>
      </main>
      <CFooter />
    </div>
  );
}
