# Hero Morph Field Specification

## Overview
- **Target files:** `src/app/c/HeroMorphField.tsx`, `src/app/c/page.tsx`
- **Reference:** `https://demo-amed-proposal.vercel.app/site/v3-morph-field/`
- **Adaptation:** the reference interaction is retained while its dark cosmic palette is translated into AMED's bright editorial system.

## Reference Behaviour
- The hero is a tall scroll stage with a sticky viewport-height frame.
- A particle field begins as a sphere, becomes a double helix, then disperses into a node cloud as the page moves.
- Camera depth and vertical position change with page progress.
- Pointer position eases into subtle horizontal and vertical camera parallax.
- Particle drift continues at rest, so the field never reads as a still illustration.

## AMED Adaptation
- Background: cool near-white rather than the reference navy/black radial field.
- Particles: AMED logo cyan (`#54add1`) with a deeper cyan-blue secondary tone.
- Content: approved AMED hero statement, MedTech positioning and portfolio action.
- Type: existing Lora/Mulish hierarchy and site-wide 15px uppercase action rule.
- No metrics are introduced; the existing `US · Asia` and `Early–Growth` concepts remain supporting labels only.

## Interaction
- Page scroll maps local hero progress from `0 → 1`, not total document progress.
- Morph slots: sphere `0`, helix `1`, node cloud `2`.
- Pointer input affects camera X/Y and particle rotation through eased interpolation.
- The canvas never receives pointer events and does not obstruct navigation or selection.

## Reduced Motion
- Render a single static sphere at lower opacity.
- Disable pointer response, scroll morph and the animation frame loop.

## Responsive Behaviour
- Desktop: 190svh stage, sticky full-viewport canvas, editorial content overlay.
- Tablet/mobile: shorter 150svh stage, reduced display scale and stacked support row.
