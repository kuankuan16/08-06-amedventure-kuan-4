# HeaderHero Specification

## Overview
- Targets: `SiteHeader.tsx`, `Loader.tsx`, `HeroOverlay.tsx`
- Screenshot: `docs/design-references/vesper-reference-desktop.png`
- Interaction: fixed + time-driven intro + hover/click.

## Computed reference values
- Header desktop: 713×51px at 1440; top 10px; background rgba(0,0,0,.8); white/10% border; 999px radius.
- Hero h1: 80px/72px, weight 300, width 603px, top 130px, left 24px.
- Buttons: 51px high; white block, black ink; hover cyan; no scale.

## Content
- Headline: Funding MedTech Innovations that Matter.
- Subhead: Strategic Capital & Global Expertise for Breakthrough Medical Device Founders.
- Metrics: $100M+, 12+, 5+, US & Asia with supplied labels.
- CTA: Explore Portfolio; Contact Us.

## Responsive
- Under 1024: header width calc(100%-3rem), links hidden, burger shown.
- Hero stack padding 6.5rem 1.5rem 2rem; h1 clamp 3rem–4rem; metrics 2 columns, one column under 520.

