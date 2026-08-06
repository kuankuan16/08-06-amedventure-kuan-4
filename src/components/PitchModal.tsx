"use client";

import { FormEvent, MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./PitchModal.module.css";

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
            <p className="amed-tag">Submission received</p>
            <h2 className="amed-display">Thank you for building what matters.</h2>
            <p>We&apos;ve recorded your introduction locally for this prototype. AMED&apos;s investment team would normally follow up from here.</p>
            <button className="amed-button" type="button" onClick={close}>Close</button>
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
              <button className={`${styles.submit} amed-button`} type="submit">Send introduction</button>
            </form>
          </>
        )}
      </section>
    </div>,
    document.body,
  );
}
