/** Minimal line icons drawn to one spec: 24×24, 1.5 stroke, round caps, currentColor. */

type IconProps = { className?: string };

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Two rings interlocking — long-term partnership. */
export function IconPartnership({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="9.5" cy="12" r="6" />
      <circle cx="14.5" cy="12" r="6" />
    </svg>
  );
}

/** A mark hit dead centre — high-conviction investing. */
export function IconConviction({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="12" cy="12" r=".9" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Lift-off from a platform — the founders we back. */
export function IconFounders({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.2v17.6M12 3.2l4.4 4.4M12 3.2 7.6 7.6" />
      <path d="M4.5 20.8h15" />
    </svg>
  );
}

/** A pulse crossing a heart — meaningful impact. */
export function IconImpact({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 20.4S4.2 15.6 4.2 9.9A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7.8 2.3c0 5.7-7.8 10.5-7.8 10.5Z" />
      <path d="M5.6 12.4h3.1l1.5-2.6 2 5 1.7-3.4h4.5" />
    </svg>
  );
}

/** Outbound link marker for the story table. */
export function IconArrowUpRight({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M8 16 16 8" />
      <path d="M9 8h7v7" />
    </svg>
  );
}

/** Email link on the profile dialog. */
export function IconMail({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m3.8 6.8 8.2 6 8.2-6" />
    </svg>
  );
}

/** LinkedIn link on the profile dialog. Drawn as a solid mark so it reads at icon size. */
export function IconLinkedIn({ className }: IconProps) {
  return (
    <svg {...base} className={className} fill="currentColor" stroke="none">
      <path d="M6.94 8.9H4.2V19.5h2.74V8.9ZM5.57 4.5a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2Z" />
      <path d="M14.9 8.7c-1.45 0-2.4.72-2.83 1.45h-.05V8.9H9.4v10.6h2.73v-5.24c0-1.38.26-2.72 1.98-2.72 1.7 0 1.72 1.58 1.72 2.81v5.15h2.73v-5.7c0-2.9-.63-4.1-3.66-4.1Z" />
    </svg>
  );
}

/** Website link on the company dialog. */
export function IconGlobe({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M3.4 12h17.2" />
      <path d="M12 3.4a13 13 0 0 1 0 17.2 13 13 0 0 1 0-17.2Z" />
    </svg>
  );
}

/** Carousel arrows. Drawn rather than typed: the ← → glyphs carry uneven side bearings and
 *  never sit optically centred inside a circular button. */
export function IconArrowLeft({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M19 12H5" />
      <path d="M11 6l-6 6 6 6" />
    </svg>
  );
}

export function IconArrowRight({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}
