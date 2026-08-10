"use client";

import { useEffect } from "react";
import { useScrollClock } from "./useScrollClock";

export type SectionName = "hero" | "focus" | "portfolio" | "team" | "companies";

/** Clock windows match the overlay gates in FocusOverlay / PortfolioOverlay. */
export const sectionFromClock = (clock: number): SectionName =>
  clock < 0.4 ? "hero" : clock < 2.2 ? "focus" : clock < 3.3 ? "portfolio" : "team";

/**
 * Publishes the current section on <html data-amed-section>, which globals.css maps to
 * --section-accent / --section-accent-hot. Pass `section` for routes with a fixed accent.
 */
export function SectionAccent({ section }: { section?: SectionName }) {
  const clock = useScrollClock(section ? 0 : undefined);
  const active = section ?? sectionFromClock(clock);

  useEffect(() => {
    document.documentElement.dataset.amedSection = active;
    return () => { delete document.documentElement.dataset.amedSection; };
  }, [active]);

  return null;
}
