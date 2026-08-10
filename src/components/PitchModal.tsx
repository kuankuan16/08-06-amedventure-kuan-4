"use client";

import { FormEvent, MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./PitchModal.module.css";
import { AnimatedHeading } from "./AnimatedHeading";

type PitchModalProps = {
  open: boolean;
  onClose: () => void;
};

export function PitchModal({ open, onClose }: PitchModalProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const close = useCallback(() => {
    setSubmitted(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => nameRef.current?.focus(), 0);
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  if (!open) return null;

  const closeFromBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) close();
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return createPortal(
    <div className={styles.backdrop} onMouseDown={closeFromBackdrop}>
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="pitch-title">
        <button className={styles.close} type="button" onClick={close} aria-label="Close pitch form">×</button>
        {submitted ? (
          <div className={styles.confirmation} role="status">
            <p className="amed-tag">Ready for official submission</p>
            <AnimatedHeading className="amed-display">Continue your conversation with AMED.</AnimatedHeading>
            <p>This landing page does not store personal or company information. Use AMED Ventures&apos; official contact page to submit your introduction.</p>
            <div className={styles.confirmationActions}>
              <a className="amed-button" href="https://www.amedventures.com/contact" target="_blank" rel="noreferrer">Open Official Contact</a>
              <button className="amed-button amed-button--ghost" type="button" onClick={close}>Close</button>
            </div>
          </div>
        ) : (
          <>
            <p className={`${styles.eyebrow} amed-tag`}>Introduce your company</p>
            <h2 className={styles.title} id="pitch-title">Pitch AMED Ventures</h2>
            <p className={styles.lede}>Tell us what you are building, the clinical need it answers and where you are in the journey.</p>
            <form className={styles.form} onSubmit={submit}>
              <label>Name<input ref={nameRef} name="name" autoComplete="name" required /></label>
              <label>Email<input name="email" type="email" autoComplete="email" required /></label>
              <label>Company<input name="company" autoComplete="organization" required /></label>
              <label>Stage<select name="stage" defaultValue="" required><option value="" disabled>Select stage</option><option>Pre-seed</option><option>Seed</option><option>Series A</option><option>Series B+</option></select></label>
              <label className={styles.thesis}>Short thesis<textarea name="thesis" rows={4} placeholder="The clinical problem, your approach and the evidence so far." required /></label>
              <button className={`${styles.submit} amed-button`} type="submit">Review &amp; Continue</button>
            </form>
          </>
        )}
      </section>
    </div>,
    document.body,
  );
}
