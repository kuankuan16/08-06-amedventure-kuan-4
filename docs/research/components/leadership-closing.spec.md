# LeadershipClosing Specification

## Overview
- Targets: `LeadershipSection.tsx`, `PitchFooter.tsx`, `PitchModal.tsx`
- Interaction: intersection reveal + modal click.

## Leadership card
- Width 96.667vw, perspective 1400px; opaque white; black ink; bottom transform origin.
- Display title 80px/72px top-left; generated 16:9 founder image on right with top→bottom mask.
- Three highlights: Silicon Valley Network; FDA & Regulatory Expertise; Asian Supply Chain Bridge.
- Supporting copy frames AMED as an operator-minded partner from early evidence through global scale.

## Pitch/footer
- Transparent on shader. Large centered line: Building the next breakthrough in MedTech?
- White Pitch Your Company button with cyan hover, no scale.
- Footer carries AMED lockup, Portfolio/Focus/Team/Contact links and San Francisco Bay Area · US & Asia.

## Modal
- Fixed dark overlay; compact white form with Name, Email, Company, Stage, short thesis textarea.
- Escape/backdrop close; submit preventDefault and show confirmation state.

