# Version C — V3 Investment Focus Specification

## Overview
- **Target:** Version C homepage, replacing the former Philosophy paired panel.
- **Source:** `http://localhost:3002/v3#investment-focus`
- **Source implementation:** `/Users/kuan/Documents/Codex/08-05-amedventure-kuan-3/src/components/FocusSection.tsx`
- **Interaction model:** hover/focus-driven expanding focus cards; horizontal snap carousel on mobile.

## DOM Structure
- Cream full-width section.
- 1480px maximum-width centered container.
- Twelve-column ruled heading: small label spans 3 columns; headline spans 9.
- Two real client-copy paragraphs indented to column 4.
- Four interactive medical focus cards.
- Ruled footer row with eight focus-area pills.

## Exact Source Values
- Section padding top: 72px desktop, 48px mobile.
- Section padding bottom: 115.2px desktop, 76.8px mobile.
- Heading: `clamp(44px, 6vw, 88px)`, line-height 1, tracking `-.02em`.
- Main horizontal rules: `rgba(6,16,29,.16)`.
- Intro paragraph: 20px desktop / 18px mobile, line-height 1.62, ink at 74%.
- Cards begin 64px below copy on desktop, 48px below on mobile.
- Desktop cards share available flex width; active card grows from 1 to 1.35 over 700ms.
- Artwork height: `clamp(240px,18vw,304px)`.
- Card title: `clamp(19.2px,1.7vw,26.4px)`, line-height 1.1.
- Description: 18px, line-height 1.55.

## Content
- Heading: `Innovation with the potential to improve patient outcomes.`
- Areas: Neurovascular Technologies, Cardiovascular Technologies, Surgical Technologies, Digital Health.
- Intro paragraphs and focus pills must remain the client's exact existing copy.

## Assets
- `focus-neurovascular-geometry.svg`
- `focus-cardiovascular-geometry.svg`
- `focus-surgical-geometry.svg`
- `focus-intelligence-geometry.svg`

## Responsive Behavior
- Desktop: four expanding cards in one row.
- Tablet: two-column grid with no horizontal overflow.
- Mobile: each card is 82vw wide in a mandatory horizontal snap strip; scrollbar hidden.

## Accessibility
- Each card is a button with `aria-pressed`.
- Hover and keyboard focus select the same state.
- Flex-grow motion is removed for `prefers-reduced-motion`.
