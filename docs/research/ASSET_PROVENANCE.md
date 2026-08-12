# Asset Provenance

Generated on 2026-08-06 through Higgsfield CLI.

## Photography

- Model: `gpt_image_2`
- Quality: `low`
- Resolution: `2k`
- 16:9 masters: 2688×1520
- 4:3 masters: 2336×1744
- Prompts and exact CLI parameters are retained in `scripts/generate-amed-media.mjs`.

Files:

- `public/images/amed/hero-vascular.png` / `.jpg`
- `public/images/amed/focus-cardiovascular.png` / `.jpg`
- `public/images/amed/focus-neurovascular.png` / `.jpg`
- `public/images/amed/focus-oncology.png` / `.jpg`
- `public/images/amed/focus-surgical.png` / `.jpg`
- `public/images/amed/leadership-founders.png` / `.jpg`
- `public/images/amed/companies-hero-light.png` / `.jpg` — added 2026-08-07 via the Higgsfield
  MCP (`gpt_image_2`, 16:9, 1k, quality low) as the high-key banner for `/companies`; prompt is
  kept in `scripts/generate-companies-hero.mjs`.

## Motion

- `public/videos/amed-hero.mp4`
- Model: Higgsfield `kling3_0`
- Source: newly generated `hero-vascular.png`
- 16:9, 5 seconds, standard mode, sound off.

## Concept C hero photography

Generated on 2026-08-12 with Codex's built-in image-generation tool for the human-centred
Concept C hero. The three wide documentary-style scenes show founders, clinicians and
engineers working around real prototypes; no client-provided identities or branded devices
were used. Final JPEG assets:

- `public/images/amed/hero-c-01.jpg`
- `public/images/amed/hero-c-02.jpg`
- `public/images/amed/hero-c-03.jpg`

## Brand

- `public/brand/amed-logo-light.png`
- `public/brand/amed-logo-dark.png`

These are client-approved AMED lockups recovered from the supplied AMED project materials; they were not regenerated.
