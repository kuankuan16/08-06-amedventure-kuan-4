"use client";

import { type FormEvent, useEffect, useState } from "react";
import { filters } from "@/data/portfolio";
import { BackToTop, CFooter, CHeader } from "../components";
import {
  countryCodes,
  fundingStages,
  taipeiOffice,
  teamEmail,
  usOffice,
} from "../content";
import styles from "../page.module.css";
import { RevealHeading } from "../RevealHeading";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [headingsVisible, setHeadingsVisible] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setHeadingsVisible(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };
  return (
    <div className={styles.page} id="top">
      <CHeader />
      <BackToTop />
      <main className={styles.contactPage}>
        <div className={styles.section}>
          <div className={styles.contactPageIntro}>
            <RevealHeading
              as="h1"
              active={headingsVisible}
              className={styles.display}
              lines={["Tell us what you are building."]}
            />
            <dl className={styles.contactPoints}>
              <div>
                <dt>Offices</dt>
                <dd className={styles.officeLocations}>
                  <span>{taipeiOffice}</span>
                  <span>{usOffice}</span>
                </dd>
              </div>
              <div>
                <dt>Industry</dt>
                <dd className={styles.industryLines}>
                  <span>MedTech venture capital</span>
                  <span>Healthcare innovation</span>
                </dd>
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
            <RevealHeading
              as="h2"
              active={headingsVisible}
              className={styles.formLabel}
              lines={["Pitch your company"]}
            />
            <label data-hover-object="field">
              Name
              <input name="name" autoComplete="name" required />
            </label>
            <label data-hover-object="field">
              Company
              <input name="company" autoComplete="organization" required />
            </label>
            <label data-hover-object="field">
              Email
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label data-hover-object="field">
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
            <label data-hover-object="field">
              Website or deck
              <input
                name="link"
                type="url"
                inputMode="url"
                placeholder="https://"
              />
            </label>
            <label data-hover-object="field">
              Headquarters
              <input
                name="location"
                autoComplete="address-level2"
                placeholder="City, country"
              />
            </label>
            <label data-hover-object="field">
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
            <label data-hover-object="field">
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
            <label className={styles.wide} data-hover-object="field">
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
