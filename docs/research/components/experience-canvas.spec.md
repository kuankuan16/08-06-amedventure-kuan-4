# ExperienceCanvas Specification

## Overview
- Target: `src/components/ExperienceCanvas.tsx`
- Interaction: scroll + pointer + time driven.

## Structure
- Fixed `<canvas aria-hidden>` at inset 0, z-index 0, pointer-events none.
- Three.js r185-compatible scene using Points and additive shaders.
- Background domain-warp wash plus one point set morphing among orb, spiral flow, and paired-organ network targets.

## Visual
- Scene background `#020615`; vignette near black.
- 23k desktop points; cyan/ice/indigo color by vertical position and phase.
- Bloom-like halo in fragment shader; no expensive postprocessing on mobile.
- Camera z eases 4.2→11→4.6; point cloud tips and rotates through transitions.

## Behavior
- Shared clock exactly follows three 200lvh tracks plus bottom reading.
- Pointer ray direction disturbs nearby orb points and produces cyan halo.
- Device tiers: 23k / 14k / 8k points; DPR 2 / 1.4 / 1.1.
- Reduced motion freezes elapsed time and disables pointer response.

