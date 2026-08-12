"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { IconArrowLeft, IconArrowRight, IconMail } from "@/components/icons";
import { BackToTop, CFooter, CHeader } from "../components";
import {
  portraitAlignment,
  roster,
  stepRoster,
  team,
  teamEmail,
} from "../content";
import styles from "../page.module.css";
import { PageWord } from "../PageWord";

export default function TeamPage() {
  const [personIndex, setPersonIndex] = useState<number | null>(null);
  const person = personIndex === null ? null : roster[personIndex];
  useEffect(() => {
    if (personIndex === null) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPersonIndex(null);
      if (event.key === "ArrowLeft")
        setPersonIndex((current) => stepRoster(current, -1));
      if (event.key === "ArrowRight")
        setPersonIndex((current) => stepRoster(current, 1));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [personIndex]);

  return (
    <div className={styles.page} id="top">
      <CHeader />
      <BackToTop />
      <main className={`${styles.team} ${styles.standaloneTeam}`}>
        <PageWord>TEAM</PageWord>
        <div className={styles.section}>
          <div className={styles.pageIntro}>
            <p className={styles.tag}>Team</p>
            <h1 className={styles.display}>
              Decades of building,
              <br />
              investing and operating.
            </h1>
            <p className={styles.lede}>
              Our team brings decades of combined experience across investment,
              business development, and operational management, from large
              public companies to early-stage startups.
            </p>
          </div>
          <div className={styles.teamRows}>
            {team.map(([group, members]) => (
              <div className={styles.teamRow} key={group}>
                <div className={styles.teamRowHead}>
                  <h3>
                    {group.split(" ").map((word) => (
                      <span key={word}>{word}</span>
                    ))}
                  </h3>
                </div>
                <ul className={styles.teamPeople}>
                  {members.map(([name, role, , portrait]) => (
                    <li key={name}>
                      <button
                        type="button"
                        className={styles.person}
                        onClick={() =>
                          setPersonIndex(
                            roster.findIndex((entry) => entry.name === name),
                          )
                        }
                        aria-haspopup="dialog"
                        aria-label={`${name} — open profile`}
                      >
                        <figure>
                          <Image
                            className={`${styles.personPhoto} ${portraitAlignment[name] ?? ""}`}
                            src={portrait}
                            alt=""
                            width={900}
                            height={900}
                          />
                        </figure>
                        <span className={styles.personName}>{name}</span>
                        {role ? (
                          <span className={styles.personRole}>{role}</span>
                        ) : null}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>
      {person && (
        <div
          className={styles.dialogBackdrop}
          onClick={(event) => {
            if (event.target === event.currentTarget) setPersonIndex(null);
          }}
        >
          <div
            className={`${styles.dialog} ${styles.personDialog}`}
            role="dialog"
            aria-modal="true"
            aria-label={person.name}
          >
            <div className={styles.personDialogTools}>
              <button
                type="button"
                className={styles.dialogClose}
                onClick={() => setPersonIndex(null)}
                autoFocus
                aria-label="Close"
              >
                ×
              </button>
              <button
                type="button"
                onClick={() =>
                  setPersonIndex((current) => stepRoster(current, -1))
                }
                aria-label="Previous profile"
              >
                <IconArrowLeft />
              </button>
              <button
                type="button"
                onClick={() =>
                  setPersonIndex((current) => stepRoster(current, 1))
                }
                aria-label="Next profile"
              >
                <IconArrowRight />
              </button>
            </div>
            <div className={styles.personDialogMain}>
              <figure className={styles.personDialogPhoto}>
                <Image
                  className={portraitAlignment[person.name]}
                  src={person.portrait}
                  alt=""
                  width={900}
                  height={900}
                />
              </figure>
              <div>
                <h3 className={styles.personDialogName}>{person.name}</h3>
                <p
                  className={`${styles.personDialogRole} ${person.role ? "" : styles.pendingOnGreen}`}
                >
                  {person.role || "Title to be supplied by AMED"}
                </p>
                {person.bio ? (
                  person.bio.split("\n\n").map((paragraph) => (
                    <p
                      className={styles.personDialogBio}
                      key={paragraph.slice(0, 24)}
                    >
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p
                    className={`${styles.personDialogBio} ${styles.pendingOnGreen}`}
                  >
                    Biography to be supplied by AMED
                  </p>
                )}
                <div className={styles.personDialogFoot}>
                  <a
                    href={`mailto:${teamEmail}`}
                    aria-label={`Email ${person.name} at ${teamEmail}`}
                  >
                    <IconMail />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <CFooter />
    </div>
  );
}
