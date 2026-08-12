"use client";

import { type FormEvent, useState } from "react";
import { filters } from "@/data/portfolio";
import { BackToTop, CFooter, CHeader } from "../components";
import {
  countryCodes,
  fundingStages,
  taipeiAddress,
  teamEmail,
  usOffice,
} from "../content";
import styles from "../page.module.css";
import { PageWord } from "../PageWord";
import { RevealHeading } from "../RevealHeading";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };
  return (
    <div className={styles.page} id="top">
      <CHeader />
      <BackToTop />
      <main className={styles.contactPage}>
        <PageWord tone="dark">CONTACT</PageWord>
        <div className={styles.section}>
          <div className={styles.contactPageIntro}>
            <p className={styles.tag}>Contact</p>
            <RevealHeading
              as="h1"
              className={styles.display}
              lines={["Tell us what you are building."]}
            />
            <dl className={styles.contactPoints}>
              <div>
                <dt>Offices</dt>
                <dd>
                  {taipeiAddress}
                  <br />
                  {usOffice}
                </dd>
              </div>
              <div>
                <dt>Industry</dt>
                <dd>MedTech venture capital · Healthcare innovation</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${teamEmail}`}>{teamEmail}</a>
                </dd>
              </div>
            </dl>
          </div>
          <form className={styles.form} onSubmit={submit}>
            <p className={styles.formLabel}>Pitch your company</p>
            <label>
              Name
              <input name="name" autoComplete="name" required />
            </label>
            <label>
              Company
              <input name="company" autoComplete="organization" required />
            </label>
            <label>
              Email
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label>
              Phone
              <span className={styles.phoneRow}>
                <select
                  name="countryCode"
                  defaultValue="+886"
                  aria-label="Country calling code"
                >
                  {countryCodes.map((code) => (
                    <option key={code}>{code}</option>
                  ))}
                </select>
                <input
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  required
                />
              </span>
            </label>
            <label>
              Website or deck
              <input
                name="link"
                type="url"
                inputMode="url"
                placeholder="https://"
              />
            </label>
            <label>
              Headquarters
              <input
                name="location"
                autoComplete="address-level2"
                placeholder="City, country"
              />
            </label>
            <label>
              Focus area
              <select name="focus" defaultValue="">
                <option value="" disabled>
                  Select one
                </option>
                {filters
                  .filter((item) => item !== "All")
                  .map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                <option>Other</option>
              </select>
            </label>
            <label>
              Stage
              <select name="stage" defaultValue="">
                <option value="" disabled>
                  Select one
                </option>
                {fundingStages.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className={styles.wide}>
              What are you building, and what does this round unlock?
              <textarea name="message" rows={4} required />
            </label>
            <div className={styles.formFoot}>
              <button
                className={`${styles.pill} ${styles.pillSolid}`}
                type="submit"
              >
                Send introduction
              </button>
              {sent ? (
                <p className={styles.sent} role="status">
                  Thank you — this proposal build does not store submissions
                  yet. Connect a form endpoint before launch.
                </p>
              ) : null}
            </div>
          </form>
        </div>
      </main>
      <CFooter />
    </div>
  );
}
