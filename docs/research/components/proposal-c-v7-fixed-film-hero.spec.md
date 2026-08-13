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
- active progress fill: AMED cyan; width driven from `0% → 100%` over `6000ms`
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
- **Duration per slide:** `6000ms`
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

## Text Content — AMED investment philosophy

### 01 — Long-term partnership
- Headline: `Long-term` / `partnership.`
- Body: `We stay with founders for the long run, from first clinical evidence through global scale.`

### 02 — High-conviction investing
- Headline: `High-conviction` / `investing.`
- Body: `Fewer, deeper positions in medical technology where the clinical case and team convince us.`

### 03 — Exceptional entrepreneurs
- Headline: `Exceptional` / `entrepreneurs.`
- Body: `Strategic guidance, deep industry expertise and hands-on support for the teams building it.`

### 04 — Meaningful impact
- Headline: `Meaningful` / `impact.`
- Body: `What we build is finally measured in outcomes for the patients on the other end of it.`

The sequence follows the four Investment Philosophy points supplied in the client brief. Slide 01 uses the former partnership visual from slide 04; slide 04 uses the former bedside visual from slide 01.

## Handoff Copy
- Eyebrow: `A standard worth building toward`
- Headline: `Breakthroughs matter` / `when patients feel` / `the difference.`
- Body: `We invest in the long work between a promising idea and trusted care — where evidence, execution and endurance turn possibility into practice.`

## Assets

All four stills were generated through Higgsfield CLI with GPT Image 2,
`quality: low`, `resolution: 2k`, and 16:9 framing. Each Higgsfield video was
then generated from its matching still so the cast, lighting, and composition
remain continuous.

- `public/images/amed/hero-investment-01-partnership.jpg`
- `public/videos/v7-fixed-film/01-partnership.mp4`
- `public/images/amed/hero-investment-02-conviction.jpg`
- `public/videos/v7-fixed-film/02-conviction.mp4`
- `public/images/amed/hero-investment-03-entrepreneurs.jpg`
- `public/videos/v7-fixed-film/03-founders.mp4`
- `public/images/amed/hero-investment-04-impact.jpg`
- `public/videos/v7-fixed-film/04-impact.mp4`

## Responsive Behavior
- **Desktop (1440px):** bottom-left editorial copy; four horizontal navigation items; desktop scroll cue.
- **Tablet (768px):** same bottom composition with smaller type; navigation may wrap into two columns if needed.
- **Mobile (390px):** 24px side padding; headline floor `2.6rem`; four controls in a 2×2 grid; scroll cue hidden.
- **Breakpoint:** Proposal C's existing two-regime breakpoint at `1023.98px`; mobile refinement at `640px`.
