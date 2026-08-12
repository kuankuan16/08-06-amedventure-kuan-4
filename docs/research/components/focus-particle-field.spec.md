# Focus Particle Field Specification

## Overview
- **Target file:** `src/app/c/FocusParticleField.tsx`
- **Reference:** `https://demo-amed-proposal.vercel.app/site/v5-kinetic-constellation/`
- **Interaction model:** scroll-driven morph and camera motion, continuous time-driven drift, pointer-driven rotation

## DOM Structure
- A pointer-events-none absolute wrapper fills the Investment Focus section.
- A full-viewport canvas sits inside that wrapper and is pinned while the section scrolls.
- Existing Investment Focus copy and cards remain above the canvas.

## Computed / Extracted Behaviour
- Renderer: WebGL, antialias enabled, pixel ratio capped at 1.5.
- Camera: perspective 60 degrees; desktop Z begins near 16 and moves closer as the section progresses.
- Geometry A: five segmented planes distributed along Z.
- Geometry B: an open cylinder approximately 3 units in radius and 30 units long.
- Scroll pin: section top-to-top through section bottom-to-bottom; pin spacing disabled.
- Morph: begins as the focus cards enter from the viewport bottom and completes when they reach the top.
- Camera travel: scrubbed through the entire Investment Focus section.
- Idle state: slow multi-axis rotation.
- Pointer state: field eases toward a small X/Y rotation based on normalized cursor position.
- Chapter/content reveal remains handled by the site-wide headline and card reveal system.

## AMED Customisation
- Particles use the AMED logo cyan token (`--cyan` / `#54add1`) instead of the reference grey.
- Background stays the current cool grey rather than copying the reference page.
- Existing cards, imagery and client copy are unchanged.

## Reduced Motion
- No ScrollTrigger pin, morph, camera scrub or pointer response.
- Render a single quiet static particle field.

## Responsive Behaviour
- **Desktop (1440px):** full-density field and pinned 100svh canvas.
- **Tablet (768px):** slightly reduced particle size and camera distance.
- **Mobile (390px):** same geometry at capped DPR; pointer response is disabled for coarse/touch input.
