# Version C — V3 Contact Invitation Specification

## Overview
- **Target:** `src/app/c/page.tsx` and `src/app/c/page.module.css`
- **Source:** `http://localhost:3002/v3#contact`
- **Source implementation:** `/Users/kuan/Documents/Codex/08-05-amedventure-kuan-3/src/components/ClosingSections.tsx`
- **Interaction model:** scroll-driven heading reveal with hover-driven button fill; two time-driven ambient background washes.

## DOM Structure
- Full-width `section` with two blurred, absolutely positioned glow discs.
- Centered `1480px` maximum-width inner column.
- Eyebrow followed by a masked, word-by-word serif heading and a 3px growing rule.
- Twelve-column lower grid: seven columns for invitation copy and CTA; five columns for Email and Offices.
- CTA navigates to the standalone Version C Contact page.

## Computed Design Values

### Section
- min-height: `76svh`
- display: flex
- position: relative
- overflow: hidden
- background: `#03111f`
- foreground: `#f7f3ea`

### Inner
- width: 100%
- max-width: `1480px`
- desktop padding: `64px 48px 115.2px`
- mobile padding: `48px 20px 76.8px`
- display: flex; flex-direction: column; justify-content: center

### Heading
- margin-top: `28px`
- max-width: `1152px`
- family: project serif display face
- size: `clamp(52px, 7vw, 104px)`
- line-height: `.98`
- letter-spacing: `-.025em`
- weight: 400
- each word is masked independently with `.24em` lower breathing room

### Lower grid
- margin-top: `48px`
- desktop: 12 equal columns, `32px` gap; copy spans 7, contact list spans 5
- mobile: one column, `40px` gap
- contact list becomes two columns from 640px

### CTA
- height: `64px`
- padding-inline: `36px`
- gap: `40px`
- fully rounded border, `70%` cream
- fill starts at `scaleY(0)` from bottom and reaches `scaleY(1)` in `600ms cubic-bezier(.22,1,.36,1)`
- customization required by client: fill uses the AMED logo light blue instead of V3 chartreuse

## States & Behaviors

### Heading entrance
- IntersectionObserver threshold: `.1`
- root margin: `0 0 -15% 0`
- section replays whenever it re-enters the viewport
- word start: `translateY(110%) rotate(7deg)`, opacity 0, blur 10px
- word end: neutral transform, opacity 1, blur 0
- transform duration: `1100ms`; opacity/filter: `800ms`; easing: `cubic-bezier(.16,1,.3,1)`
- stagger: `85ms` per word
- rule starts after final word plus `200ms`, grows from left over `1200ms`

### Ambient washes
- upper-right cyan glow: 19-second alternating drift
- lower-left accent glow: 23-second alternating drift
- both use large blur radii and low opacity

### Reduced motion
- words and rule render in final state
- ambient washes and CTA transitions are disabled

## Text Content
- Eyebrow: `Pitch us`
- Heading: `Building something that belongs in a hospital?`
- Body: `We read everything. If you are early, technical and serious about the clinical bar, we would like to hear from you.`
- CTA: `Send us your deck`
- Address order remains client-mandated: Taipei first, then San Francisco Bay Area.

## Responsive Behavior
- **Desktop 1440px:** centered 12-column lower grid and full `7vw` heading.
- **Tablet 768px:** same 12-column lower grid, reduced outer padding.
- **Mobile 390px:** single-column lower grid; contact definitions stack below CTA; button remains 64px tall.
