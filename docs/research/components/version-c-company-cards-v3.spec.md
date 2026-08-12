# Version C — company card behaviour

## Reference

- Visual/interaction reference: `https://amedventure-kuan-3.vercel.app/v3`
- Exact local source used for implementation:
  `/Users/kuan/Documents/Codex/08-05-amedventure-kuan-3/src/components/PortfolioSection.tsx`

## Structure

- Desktop portfolio grid uses four equal columns so every company card reads as a substantial
  editorial module rather than a small logo tile.
- The card rests as a quiet white plate with only the company mark visible.
- Hover and keyboard focus reveal a full-card information layer containing:
  - focus area;
  - company name;
  - company description;
  - location and founded year;
  - realized status when applicable.
- Clicking the card continues to open the existing Version C company-detail dialog.

## Behaviour

- Information is kept in the DOM and revealed through opacity, so keyboard focus receives the
  same state as pointer hover.
- Logo and detail layers cross-fade over 300ms. Controls never scale on hover.
- On pointer-less devices the resting logo remains visible and a tap opens the complete dialog;
  the hidden copy remains available to assistive technology through the button's accessible name.
- Reduced-motion removes reveal and hover transitions without removing information or function.

## Responsive layout

- `>= 1024px`: four columns.
- `641–1023.98px`: two columns.
- `<= 640px`: one column with a shorter landscape-leaning card height; tapping opens the dialog.

## Version C adaptation

- Uses existing Version C colour tokens, typography, logo optical-sizing table, filters and
  detail dialog.
- The reference site's external-link card action is intentionally replaced by the current
  Version C dialog action, preserving the established user journey.
