# Proposal C — V7 Fixed Film Hero Specification

## Overview
- **Target files:** `src/app/c/FixedFilmHero.tsx`, `src/app/c/FixedFilmHero.module.css`
- **Reference URL:** `https://demo-amed-proposal.vercel.app/site/v7-fixed-film/`
- **Desktop screenshot:** `docs/design-references/demo-amed-v7/hero-desktop.png`
- **Mobile screenshot:** `docs/design-references/demo-amed-v7/hero-mobile.png`
- **Interaction model:** time-driven carousel + direct-click navigation + scroll-driven exit
- **Customization requested:** preserve the V7 film, copy, composition and timing; retain its deep cinematic blue-black grade, then add a branded editorial handoff before the light AMED content begins.

## DOM Structure
1. `section` with 168 viewport heights of scroll runway.
2. A viewport-height sticky frame at `top: 0`.
3. Four absolutely stacked `<video>` layers.
4. A deep navy film-grade overlay and a left/bottom readability wash.
5. A bottom-aligned content frame:
   - eyebrow: slide number, rule, category
   - two-line serif headline
   - supporting paragraph
   - top-ruled, four-item progress navigation
   - vertical scroll cue on desktop
6. A scroll-driven dark handoff statement that moves upward with the Hero while the following light Investment Focus section pushes directly into view.

## Computed Styles — Reference at 1440px

### Scroll runway and fixed frame
- runway height: `190dvh`
- frame position: reference uses `fixed inset: 0`; implementation may use `sticky top: 0` inside the same 190dvh runway to keep the effect scoped to the home page
- frame background: deep AMED navy-black (`#061321`)
- media sizing: `width: 100%`, `height: 100%`, `object-fit: cover`
- active video transform: `scale(1.06)`
- inactive video transform: `scale(1)`
- Ken Burns transition: `transform 9s cubic-bezier(0.16, 1, 0.3, 1)`
- crossfade: `opacity 1400ms cubic-bezier(0.65, 0, 0.35, 1)`

### Content frame
- max width: `1600px`
- desktop horizontal padding: `64px`
- desktop bottom padding: `80px`
- container layout: column, `gap: 40px`
- content max width: `54rem`
- text frame: bottom aligned

### Eyebrow
- bottom margin: `28px`
- layout: flex, center aligned, `gap: 16px`
- divider width: `40px`, height `1px`
- number/category font: uppercase Mulish, `12–13px`, tracked
- entry animation: rise `22px → 0`, opacity `0 → 1`, `900ms cubic-bezier(0.16, 1, 0.3, 1)`

### Heading
- reference family: Archivo; Proposal C adaptation: established `--serif` display family
- reference size: `clamp(2.6rem, 6.4vw, 6.2rem)`
- Proposal C desktop cap: `clamp(3rem, 6vw, 5.8rem)`
- line height: `0.96–1`
- each authored line is masked with `overflow: hidden`
- line reveal: `translateY(105%) → 0`, `1150ms cubic-bezier(0.16, 1, 0.3, 1)`, `110ms` stagger

### Support copy
- top margin: `28px`
- max width: `36rem`
- font: Mulish, `15.2px`; Proposal C body floor remains `18px` where the existing system requires it
- line height: `1.6`
- colour: dark ink at approximately 70% on the bright film wash

### Progress navigation
- top border: `1px`
- top padding: `24px`
- desktop layout: four equal flex items, max width `48rem`, gap `32px`
- item rule: full width, `1px`
- active progress fill: AMED cyan; width driven from `0% → 100%` over `8200ms`
- item label top margin: `12px`
- click selects a slide and resets the timer
- pointer hover pauses the timer without changing slide

### Scroll exit
- scroll progress: `clamp(scrollY / (1.15 * innerHeight), 0, 1)` in the reference
- media opacity: `1 - 0.85 * progress`
- media scale: `1 - 0.04 * progress`
- content opacity: `1 - min(1, 1.55 * progress)`
- content translate: `0 → -60px`
- customized hand-off: after the film copy exits, `Breakthroughs matter when patients feel the difference.` rises over a solid blue-black field. The dark field then moves upward with the Hero as the following section pushes in from below.

## States and Behaviors

### Automatic cycle
- **Trigger:** `requestAnimationFrame`
- **Duration per slide:** `8200ms`
- **Transition:** video crossfade `1400ms`; headline is remounted by slide id and repeats its mask reveal.

### Direct selection
- **Trigger:** click on any of the four progress items
- **Result:** active index changes immediately; progress resets to zero; active video restarts from `currentTime = 0`.

### Hover pause
- **Trigger:** pointer enters a progress item
- **Result:** the current progress freezes; pointer leave resumes from the frozen progress.

### Reduced motion
- no automatic cycling
- no Ken Burns scale
- no translated/blurred entry
- the first frame remains readable, and direct slide controls still work

## Text Content — Verbatim from V7

### 01 — Healthcare
- Headline: `Capital that reaches` / `the bedside.`
- Body: `We back the medical technologies that change what a clinician can actually do — on an ordinary Tuesday morning, in a real hospital.`

### 02 — Therapeutics
- Headline: `From molecule` / `to medicine.`
- Body: `Discovery is slow, expensive and unforgiving. We fund the teams with the rigour — and the patience — to carry a candidate all the way through.`

### 03 — Applied AI
- Headline: `Intelligence, applied` / `to biology.`
- Body: `Models that read the scan, design the molecule, and flag the patient who is about to deteriorate. Built to be used in practice, not demonstrated on stage.`

### 04 — In Practice
- Headline: `Proven where` / `it matters.`
- Body: `Nothing counts until it works in a real operating room, on a real patient, at real scale. That is the only result we underwrite.`

These four short hero narratives do not duplicate the About page's institutional overview or its long-term partnership paragraphs.

## Handoff Copy
- Eyebrow: `A standard worth building toward`
- Headline: `Breakthroughs matter` / `when patients feel` / `the difference.`
- Body: `We invest in the long work between a promising idea and trusted care — where evidence, execution and endurance turn possibility into practice.`

## Assets
- `public/videos/v7-fixed-film/01-healthcare.mp4`
- `public/videos/v7-fixed-film/02-drug-discovery.mp4`
- `public/videos/v7-fixed-film/03-ai-innovation.mp4`
- `public/videos/v7-fixed-film/04-applied-impact.mp4`
- matching `poster-01.jpg` through `poster-04.jpg`

## Responsive Behavior
- **Desktop (1440px):** bottom-left editorial copy; four horizontal navigation items; desktop scroll cue.
- **Tablet (768px):** same bottom composition with smaller type; navigation may wrap into two columns if needed.
- **Mobile (390px):** 24px side padding; headline floor `2.6rem`; four controls in a 2×2 grid; scroll cue hidden.
- **Breakpoint:** Proposal C's existing two-regime breakpoint at `1023.98px`; mobile refinement at `640px`.
