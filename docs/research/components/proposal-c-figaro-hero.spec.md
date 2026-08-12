# Proposal C — Figaro-informed Hero Specification

## Overview

- **Target files:** `src/app/c/page.tsx`, `src/app/c/page.module.css`
- **Reference:** `https://www.figaro-vis.jp/`
- **Interaction model:** time-driven image cross-fade and continuous marquees; click-driven image controls; pointer-driven image light response.

## Design translation

- Retain AMED's white, cool-grey, navy and logo-cyan system. Do not reproduce Figaro's black opening screen or branding.
- Translate the reference's oversized opening wordmark into AMED's real founding conviction: “The right capital and the right partnership change how people live, heal and thrive.”
- Replace the reference's wide project image with AMED's existing bright, human MedTech carousel.
- Replace its client-logo belt with existing AMED portfolio logos. No “We work with” or equivalent label appears.
- Retain the AMED CTA and investment-profile facts, but subordinate them to the large cinematic image.

## DOM structure

1. `heroFigaro` section inside the existing white hero band.
2. `heroSloganRail`: two identical groups for a seamless oversized slogan marquee.
3. `heroCinema`: wide carousel frame with four existing hero photographs, quiet image controls, small editorial note and CTA.
4. `heroPositions`: the existing “US · Asia” and “Early–Growth” facts.
5. `heroLogoRail`: two identical logo groups using selected current portfolio company logos; no heading/label.

## States and behaviours

- **Opening:** marquee and image enter with blur + translate on `var(--ease-out)`.
- **Text marquee:** continuous horizontal motion, approximately 28 seconds per cycle.
- **Image carousel:** advances every 6.5 seconds with a slow 1.6-second cross-fade and subtle 8-second image drift.
- **Pointer:** existing radial light follows the pointer over the photograph; no control scales on hover.
- **Logo rail:** continuous reverse horizontal motion, approximately 34 seconds per cycle. Individual logos shift from quiet grey to AMED navy/cyan on hover.
- **Reduced motion:** all marquees stop, entrance transforms resolve immediately, image drift and pointer transform stop; duplicate groups remain hidden from assistive technology.

## Responsive behaviour

- **Desktop (1440px):** 92vw artboard; headline is a single oversized moving line; image is approximately 2:1; metadata overlays the lower image edge; logo rail follows below.
- **Tablet (768px):** headline remains horizontal, image moves to 4:3, CTA and facts sit in a compact lower grid.
- **Mobile (390px):** headline remains a clipped marquee rather than wrapping; image is 4:5; editorial note and CTA stack below; logo belt remains horizontal and scrolls more slowly.

## Content

- Marquee slogan (verbatim client copy): “The right capital and the right partnership change how people live, heal and thrive.”
- Supporting copy (existing): “AMED Ventures is a venture and growth capital investment firm dedicated to the MedTech sector.”
- CTA (existing): “Explore our companies”.

## Assets

- Existing hero images under `public/images/amed/hero-c-*.jpg`.
- Existing portfolio logos under `public/images/logos/` sourced from `src/data/portfolio.ts`.
