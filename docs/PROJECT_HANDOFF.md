# AMED Ventures — Project Handoff

Knowledge transfer from the Codex agent that built this site to any agent taking over.
Last verified: 2026-08-07 (commit `33f0286` + uncommitted working tree).

## 1. What this repository actually is

The repo was created from the **AI Website Cloner Template** (`ai-website-cloner-template`),
but the template is only scaffolding. The real deliverable is a **multi-concept marketing
site for AMED Ventures**, a MedTech venture fund, collected through a project portal.

Consequence: `README.md`, `CHANGELOG.md`, `package.json` metadata and the generic parts of
`AGENTS.md` still describe the *template*, not this site. Do not treat them as a description
of the current product. `CHANGELOG.md` is not maintained for AMED work — the site history
lives in git commits only, and those commit bodies are empty, so **this document plus
`docs/research/` is the only written record of design intent**.

Two source languages were merged:

- **Vesper** (`docs/design-references/vesper-reference-*.png`) — the motion/layout language
  that was reverse-engineered: fixed glass header pill, 80px/72px light display type,
  square-cornered controls, blur-and-rise reveals.
- **AMED** (`docs/design-references/amed-source-*.png`, `index.html` at repo root is the
  scraped original) — the brand, copy and content.

`docs/research/DESIGN_TOKENS.md` records that merge; it is the authority for tokens.

## 2. Routes and component map

| Route | Entry | Notes |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | Design-review portal with thumbnail cards linking all available versions. |
| `/a` | `src/app/a/page.tsx` | The scroll experience. Fixed overlays over one WebGL canvas. |
| `/b` | `src/app/b/page.tsx` | Editorial concept with portfolio, team, stories and contact in one flow. |
| `/companies` | `src/app/companies/page.tsx` | Standalone dark portfolio index with filters. Has its own layout + CSS module and does *not* use the canvas. |

Concept A (`/a`) composition (order matters — z-index and clock windows depend on it):

```
ExperienceCanvas   fixed <canvas>, z-0, three.js points, reads the scroll clock
SiteHeader         fixed glass pill + mobile fullscreen menu
ScrollCue          fixed bottom-right circular next-section affordance  [WIP, untracked]
HeroOverlay        fixed overlay, clock 0 → ~0.28
FocusOverlay       fixed overlay, clock ~0.32 → 2.3
PortfolioOverlay   fixed overlay, clock ~2.55 → 3.7
LeadershipSection  in-flow opaque white card, IntersectionObserver reveal
PitchFooter        in-flow, transparent over the canvas; owns PitchModal
```

`Loader.tsx` / `Loader.module.css` still exist but are **no longer mounted** (removed from
`page.tsx` in the working tree). It dispatched the `amed:intro` window event that
`HeroOverlay` used to wait for; the hero now reveals on mount instead. Nothing listens for
`amed:intro` anymore.

## 3. The scroll clock — the core architecture

Everything on `/a` is driven by one scalar in `src/lib/scroll.ts`:

```ts
scrollTarget(scrollY, viewportHeight) → 0 … 4
```

Three `.amed-track` spacers of `200lvh` plus a `100lvh` trailing region produce four ramps
(`p1..p4`) that are summed. Overlays subscribe via `useScrollClock()` (rAF-throttled scroll
listener) and gate their own opacity with `smoothstep(a, b, clock)`.

Rules that follow from this design, and that Codex held to:

- **Never** add a scroll listener inside an overlay. Take the clock.
- Overlay windows must not overlap, or two overlays paint at once. If you retime one
  section, retime its neighbours and update `docs/research/BEHAVIORS.md`.
- Overlays are `position: fixed; pointer-events: none` (`.amed-overlay`); interactive
  children re-enable pointer events only while their window is active.
- Changing a track's height changes every clock window downstream.
- Overlays accept an optional `clock` prop purely so they can be driven deterministically
  in isolation; production passes nothing.

Lenis smooth scroll is a dependency and is described in `BEHAVIORS.md`, but it is **not
currently wired up** in the tree — the clock reads `window.scrollY` directly.

## 4. Styling conventions (these override the template's generic rules)

The template's `AGENTS.md` says "Tailwind utility classes, no inline styles". **That is not
how this site is built.** Actual conventions:

- **CSS Modules per component**, one `.module.css` beside each `.tsx`. Declarations are
  written as dense single-line rules — match that formatting.
- Tailwind v4 is imported in `globals.css` and shadcn's `cn()` exists in `src/lib/utils.ts`,
  but **zero Tailwind utility classes appear in any component**. Do not introduce them; it
  would fragment the styling model.
- Global primitives live in `globals.css`: `.amed-display`, `.amed-tag`, `.amed-body`,
  `.amed-button` (+ `--ghost`), `.amed-glass`, `.amed-overlay`, `.amed-track`, `.sr-only`,
  and the reveal helpers `.amed-heading-reveal` / `.amed-heading-line`.
- Design tokens are **CSS custom properties on `:root`** (`--navy-950`, `--cyan`,
  `--cyan-hot`, `--ink`, `--line-dark`, `--ease-out`, …) — not Tailwind theme tokens.
- **Desktop is an artboard**: sizes are `vw`-based against a 1440px reference
  (`1.667vw` = 24px gutter, `96.667vw` = inset card). Below `1023.98px` a media block
  switches the same component to real `rem`/`clamp()` pixels. Every component follows this
  two-regime pattern; keep it.
- Inline `style` is used deliberately and only for computed animation values
  (`opacity` from the clock, `transitionDelay` stagger). That is fine; static styling is not.
- **Per-section accent system** (added 2026-08-07): each section owns a primary colour.
  `globals.css` defines `--accent-<section>` / `--accent-<section>-hot` pairs (hero cyan,
  focus indigo-violet, portfolio teal, team amber, companies coral).
  `<SectionAccent>` writes `data-amed-section` on `<html>` — clock-driven on `/a`, fixed via
  the `section` prop on other routes — and `globals.css` maps that attribute to
  `--section-accent` / `--section-accent-hot`. **Components must read the section vars (or a
  local `--accent` aliased to a token), never a raw hue or `--cyan` directly.** The canvas
  carries the same four palettes in its vertex/backdrop shaders, blended across the same
  clock windows, so the particle field and the UI change colour together.
- **`SiteFooter` is shared by every route.** The hairline, AMED lockup, location/copyright
  stack and section links live there; `PitchFooter` renders it under the pitch CTA and
  `/companies` renders it inside its own `<footer>` shell with an extra `note` prop. Do not
  hand-roll a second footer.
- Motion signature: opacity + `blur()` + `translateY`, `var(--ease-out)`
  (`cubic-bezier(.23,1,.32,1)`), or the newer line-mask reveal at
  `cubic-bezier(.22,1,.36,1)`. **Controls never scale on hover** — colour change only.
  This is a Vesper rule and was enforced throughout.
- `prefers-reduced-motion` is honoured globally in `globals.css` and again per-component
  (canvas freezes time, counters snap to final value, pointer response off). Any new
  animation must handle it.

## 5. Assets

`docs/research/ASSET_PROVENANCE.md` is authoritative. Summary:

- All photography under `public/images/amed/` is **AI-generated** via Higgsfield
  (`gpt_image_2`), not licensed stock. The generating scripts with exact prompts are kept in
  `scripts/generate-amed-media.mjs`, `generate-leadership-v2.mjs`, `generate-leadership-v3.mjs`
  — keep them; they are the reproduction record. Leadership went through three passes
  (`leadership-founders`, `-v2`, `-v3`); **v3 is the one in use**.
- `public/videos/amed-hero.mp4` (Higgsfield `kling3_0`) is **currently orphaned** — the
  hero `<video>` was removed from `page.tsx` in the working tree.
- `public/brand/*` are client-approved lockups and were **never regenerated**.
  `amed-logo-white.png` is produced by `scripts/recolor-logo.mjs` for dark surfaces.
- Both `.png` and `.jpg` masters are kept; components reference the `.jpg`.

## 6. Build, quality gates and deployment

```
npm run dev        next dev
npm run build      next build && node scripts/prepare-sites-dist.mjs
npm run lint       eslint          ← currently FAILING, see §8
npm run typecheck  tsc --noEmit    ← passing
npm run check      lint + typecheck + build
```

- **Static export only.** `next.config.ts` sets `output: "export"`, `distDir: "dist/client"`,
  `images.unoptimized`. No server runtime exists — never add a route handler, server action,
  middleware, or dynamic `next/image` loader.
- `scripts/prepare-sites-dist.mjs` then copies `scripts/sites-static-worker.mjs` to
  `dist/server/index.js` and `.openai/hosting.json` to `dist/.openai/`. This is a
  **Cloudflare-Worker-compatible static bundle** created for OpenAI Sites hosting
  (`.openai/hosting.json` carries the project id). If deployment moves off that platform,
  this script and `.openai/` are the pieces to revisit.
- **Gotcha: never run `npm run build` / `npm run check` while `next dev` is running.** Both
  write to `distDir: dist/client`, so a production build wipes the dev server's
  `dist/client/dev/*` manifests and every request starts 500-ing. Stop dev first, or restart
  it after building.
- CI (`.github/workflows/ci.yml`) runs the same gates; Node baseline is 24 (`.nvmrc`).
- Fonts (General Sans via Fontshare, Mulish via Google) are loaded with plain `<link>` tags
  in `src/app/layout.tsx`, with an ESLint disable at the top of the file. `next/font` was not
  used — General Sans is not a Google font.
- `index.html` at the repo root is the scraped AMED source page kept for reference. It is not
  part of the build.

## 7. Uncommitted work in progress (as of handoff)

The working tree contains a substantial unreviewed, uncommitted revision. Understand it
before you commit or revert anything. Themes:

1. **Line-mask heading reveals.** New untracked `src/components/AnimatedHeading.tsx` plus
   `.amed-heading-*` CSS. Headings are hand-split into `lines={[...]}` and each line rises
   from `translateY(105%)` behind an `overflow: hidden` mask, with an `sr-only` copy of the
   full string for accessibility. It replaced the per-letter blur reveal in `HeroOverlay`
   too. Note the line breaks are **manually authored per heading** — they do not reflow.
2. **New `ScrollCue` component** (untracked): fixed circular ↓ affordance. On `/a` it walks a
   `steps` list and retargets by observing section anchors; on `/companies` it is static.
3. **Animated metric counters** in `HeroOverlay` (`$0→$100M+`, `12+`, `5+`), with a
   reduced-motion snap path.
4. **Chrome trimmed:** loader removed, hero video removed, hero "Contact Us" CTA removed
   (only "Explore Portfolio" remains), the co-investor wall removed from `FocusOverlay`
   (its CSS is now dead), and the header contact dot removed.
5. **Buttons shrunk substantially** — `.amed-button` went `3.542vw` → `2.48vw` tall,
   `1.111vw` → `.78vw` type; the hero's buttons shrink further to `.5vw`. Verify this is
   intended, it is aggressive at 1440px.
6. **Active-section highlighting** in `SiteHeader` (hash-driven) and a logo click handler
   that forces a full `/a` navigation.
7. **`PortfolioOverlay` repurposed**: its headings now repeat the hero copy
   ("Funding MedTech Innovations that Matter") and the CTA changed from
   `/companies` → `#portfolio`.
8. `/companies` darkened to `#020615` to match the landing page; leadership card and
   footer spacing tightened.

## 8. Known blockers and loose ends

**Resolved 2026-08-07 — `npm run check` (lint + typecheck + build) now passes.** The four
ESLint errors the WIP left behind were fixed as follows; the patterns are worth reusing:

- `react-hooks/set-state-in-effect` in `AnimatedHeading.tsx` — the effect re-published the
  `reveal` prop into state, but render already reads `reveal ?? revealed`. The effect now
  simply bails out when `reveal` is supplied and only self-observes otherwise.
- `react-hooks/set-state-in-effect` in `HeroOverlay.tsx` (`AnimatedMetric`) — the
  reduced-motion fast path called `setValue(target)` synchronously. Reduced motion is now
  read *during render* through the new `src/hooks/usePrefersReducedMotion.ts`
  (`useSyncExternalStore`, server snapshot `false`), the counter effect skips entirely when
  it is set, and render substitutes the final value. **Prefer this hook over
  `window.matchMedia(...)` inside effects for any new motion work.**
- `@next/next/no-html-link-for-pages` in `src/app/companies/page.tsx` — the two closing CTAs
  now use `next/link`. Rule of thumb: **route targets (`/a`, `/a#contact`, `/companies`) use
  `next/link`; same-page hash targets stay as raw `<a>`.**

**Non-blocking loose ends:**

- ~~`/companies` unreachable from the landing page~~ — resolved 2026-08-07. The
  `PortfolioOverlay` CTA is back to "View All Companies →" pointing at `/companies`, now via
  `next/link`; the button was widened to `11.6vw` + `white-space: nowrap` to fit the longer
  label. It remains the **only** entry point to that route.
- ~~A11y: overlays were `aria-hidden` while still containing tabbable links~~ — resolved
  2026-08-07. **The single policy is now the `inert` attribute on the overlay container**,
  paired with the existing `aria-hidden`: `HeroOverlay` (gated on its own `interactive`
  flag), `FocusOverlay`, `PortfolioOverlay`, and the `SiteHeader` mobile menu. React 19
  renders boolean `inert` natively. The per-link `tabIndex={menuOpen ? 0 : -1}` in the mobile
  menu was removed as redundant. **Do not hand-manage `tabIndex` on overlay children — put
  `inert={!active}` on the container.**
- Dead code from the trim: `Loader.tsx` + `Loader.module.css`, the `amed-hero.mp4` asset,
  `.investors` / `.wordmarks` rules in `FocusOverlay.module.css`, `.media video` rules were
  already dropped from `page.module.css`.
- ~~`PortfolioOverlay` duplicating the hero headline~~ — resolved 2026-08-07. Section copy is
  now portfolio-specific ("Proof, not promise." + a supporting line). The support line went
  back to a plain `<p>` because `.secondary` already animates through the module CSS; it does
  not need `AnimatedHeading`, and a wrapping paragraph inside a fixed-height line mask would
  clip. **Rule: use `AnimatedHeading` for display headings with hand-authored line breaks,
  not for body copy that reflows.** Its mobile sizing was still display-scale from before the
  class changed to `amed-body`; that was corrected too.
- `docs/research/BEHAVIORS.md` and the component specs in `docs/research/components/`
  describe the **pre-WIP** behaviour (loader, letter reveal, co-investor wall, "View All
  Companies" CTA, Lenis). They are now partly stale. Update them alongside whatever you
  decide about §7 — they are the spec of record.
- `public/.DS_Store` and `public/images/.DS_Store` are tracked and should be removed.
- Template leftovers: `package.json` name/description/repository, `README.md`, `CHANGELOG.md`
  and `LICENSE` attribution all still point at the upstream template.

## 9. Working agreements Codex followed

- Commit subjects are short and imperative ("Refine focus section labels"); bodies were left
  empty. If you keep the style, at least record non-obvious *why* — the absence of it is the
  main reason this handoff document was needed.
- Design changes were validated against the reference screenshots in
  `docs/design-references/` at desktop **and** mobile before committing; new screenshots
  were added there as evidence (`amed-build-*`).
- Copy is real client copy. Do not paraphrase headlines, metrics, focus-area descriptions,
  or portfolio company names without being asked.
- `9a21e3e "Apply Apple-inspired design system"` was **reverted** the same day (`5105a59`).
  Redesigns away from the Vesper language were tried and rejected; stay inside the
  established language unless the user explicitly asks otherwise.
- Read `node_modules/next/dist/docs/` before using an unfamiliar Next.js 16 API — this
  version differs from older App Router conventions.
