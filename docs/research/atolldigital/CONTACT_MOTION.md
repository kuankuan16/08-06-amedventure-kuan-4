# atolldigital.com/contact — motion spec

Extracted from the theme source rather than the rendered page: the site gates its content behind a
GSAP preloader that never completes under automation, so the DOM is empty to a headless browser.
Source of truth: `https://atolldigital.com/wp-content/themes/atoll/assets/js/main.js?ver=1.0.425`.

## Stack

| Concern | Library |
| --- | --- |
| Tweening | GSAP 3.12.5 + ScrollTrigger |
| Text splitting | Osmo build of SplitText |
| Page transitions | Barba 2.9.7 |
| Scrolling | Lenis, driven from `gsap.ticker` with `lagSmoothing(0)` |

## The contact page's entrance timeline

`animationOnPageLoad()`, branch `#page_contact`:

```js
tl.set('#header_sticky > div',     {autoAlpha: 0})
tl.set('[data-header-bottom-line]',{width: 0})
tl.set('.lang-vertical-line',      {height: 0})

tl.to('[full-line-contact]',       {duration: 1.3, width: '100%',  ease: 'power4.inOut'}, '<')
tl.to('[data-header-bottom-line]', {duration: 1.3, width: '100%',  ease: 'power4.inOut'}, '<')
tl.to('#header_sticky > div',      {duration: 1.3, autoAlpha: 1,   ease: 'power4.inOut'}, '>-=1')
tl.to('[data-anim-opacity]',       {duration: 1.3, y: 0, autoAlpha: 1, stagger: -0.2, ease: 'power4'}, '<+=.2')
tl.to('.lang-vertical-line',       {duration: 1.3, height: '100%', ease: 'power4.inOut'}, '<-=.4')
```

The details that give it its character:

1. **Rules draw rather than fade.** Every divider animates `width: 0 → 100%` (or `height` for the
   vertical one) over **1.3s** on **power4.inOut**, and they all start together at time 0.
2. **One duration for everything.** 1.3s across the whole page — nothing is quick, nothing drags.
3. **Negative stagger.** `stagger: -0.2` on `[data-anim-opacity]` runs the blocks **in reverse
   document order**: the last block leaves first and the cascade travels back up the page.
4. **Blocks rise and fade together** (`y → 0` with `autoAlpha`), on **power4** (out), starting
   `+0.2s` after the rules.
5. The oversized word is **SVG lettering** (`.title_page` → `.letter-path`), kept hidden on the page
   and reused by the Barba transition, which is why nothing in the CSS animates the headline itself.

## CSS equivalents for the GSAP eases

| GSAP | CSS |
| --- | --- |
| `power4` / `power4.out` (easeOutQuart) | `cubic-bezier(0.25, 1, 0.5, 1)` |
| `power4.inOut` (easeInOutQuart) | `cubic-bezier(0.76, 0, 0.24, 1)` |
| `power3.inOut` | `cubic-bezier(0.65, 0, 0.35, 1)` |

## What proposal B takes from it

Ported in `src/app/b/page.module.css` / `page.tsx`, without adding GSAP:

- 1.3s as the single duration for the contact entrance, on the quart curves above.
- Dividers draw open from the left instead of appearing.
- The two content blocks rise and fade with a reverse cascade (form first, then the text).
- The oversized CONTACT keeps the three-beat sequence the client asked for — out of the floor,
  hold, then up into the title position — retimed onto the same quart easing.
