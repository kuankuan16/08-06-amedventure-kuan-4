# Behavior Bible

- Loader: time-driven 900ms progress, 260ms hold, 900ms warp exit; hero intro begins 90ms into exit.
- Header: fixed glass pill; links shift to cyan on hover without scale. Mobile menu is click-driven and keyboard reachable.
- Scroll: Lenis smooth wheel; same rAF updates Lenis first, then scroll clock. Clock trails target with a frame-independent spring.
- Hero: fixed overlay fades by clock 0.08→0.28. Display letters reveal once with blur only. Metrics sit in a ruled bottom band.
- Focus: fixed overlay is active clock .45→2.05. Copy and four focus rows reverse when leaving. Pointer produces a cyan void in the flow field on capable tiers.
- Portfolio: fixed overlay is active clock 2.55→3.7. Cards reveal with stagger and border/color hover; no transform scaling.
- Leadership: IntersectionObserver toggles card `scale(.94) rotateX(12deg)` ↔ identity; image unmasks top→bottom.
- Pitch: opens a compact modal form. Escape and backdrop click close it; submit is a local stub.
- Reduced motion: reveals resolve instantly, pointer response is off, shader time freezes, static particles still illustrate the forms.
- Responsive: 1440 desktop artboard, 768 stacked tablet, 390 single-column phone; metric and portfolio grids collapse from 4/2 columns to 2/1.
# Proposal C V7 fixed-film hero (2026-08-13)

- The home hero is a time-driven four-film carousel with an `8200ms` interval.
- Videos crossfade for `1400ms`; the active video receives a subtle nine-second Ken Burns scale.
- The four ruled controls are both progress indicators and direct slide selectors. Hover pauses the current timer; click selects and resets it.
- A `168dvh` runway keeps the film frame fixed/sticky while the hero content fades and rises.
- The project adaptation retains a deep AMED navy film grade. Mid-scroll, a distinct white-on-black brand statement takes over and then travels upward as the following light section pushes directly into view.
- Reduced motion disables timed cycling, video playback, Ken Burns transforms and reveal translations.
