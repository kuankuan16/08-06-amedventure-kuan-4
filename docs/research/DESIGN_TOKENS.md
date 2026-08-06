# AMED × Vesper Design Tokens

## Source language

- Vesper reference viewport: 1440 × 900; full page height 8318px.
- Header: fixed 713 × 51px glass pill, black at 80%, 1px white/10% border, 999px radius.
- Display: General Sans 300, 80px/72px at 1440px, -4.5% tracking.
- Labels: Mulish uppercase, 16px/1.2.
- Primary controls: 51px tall, square corners, no hover scale; ink changes through color only.
- Motion: opacity/blur letter reveal, 26ms stagger, 1000ms ease `cubic-bezier(.23,1,.32,1)`; cards rise with `scale(.94) rotateX(12deg)` over 1200ms.

## AMED translation

- `--navy-950`: `#050b23`
- `--navy-900`: `#10163c`
- `--indigo-brand`: `#3f3f80`
- `--cyan-brand`: `#0aafcf`
- `--cyan-hot`: `#76efff`
- `--ice`: `#f7f9fc`
- `--chalk`: `#ffffff`
- `--ink`: `#071022`
- `--line-dark`: `rgba(255,255,255,.14)`
- `--line-light`: `rgba(7,16,34,.15)`
- Desktop gutters: `1.667vw` (24px at 1440).
- Content cards: `96.667vw`, deliberately inset to expose the live shader.
- Display family: General Sans 300; labels: Mulish 400; body: General Sans 400.
- Canvas gradient: cyan `#0aafcf` → ice `#76efff` → indigo `#3f3f80`.

