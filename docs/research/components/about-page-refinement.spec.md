# About Page Refinement Specification

## Overview

- **Target files:** `src/app/c/about/page.tsx`, `src/app/c/page.module.css`
- **Interaction model:** scroll reveal plus non-click hover responses on the four principles.

## Reading sequence

1. Compact ABOUT label and two-column founding conviction.
2. Branded quotation-shaped image, aligned with the statement rather than floating as a small aside.
3. “Built for the founders…” editorial introduction with more deliberate baseline alignment.
4. Joined experience-and-image feature panel.
5. Four equal investment-principle cells as the section close.

## Refinement rules

- Preserve all existing client copy verbatim.
- Use the existing cool neutral About background throughout.
- Increase hierarchy contrast between serif statements and sans-serif evidence copy.
- Use one consistent 12-column desktop artboard, restrained hairlines, and AMED cyan for labels and the animated mark.
- Remove redundant visual pauses by tightening the gaps between related intro elements while keeping stronger separation before the feature and principles.
- The animated AMED mark sits lower and gathers next to, not on top of, the image subject.

## Responsive behaviour

- **Desktop:** statement occupies seven columns; image occupies five. Intro and feature follow the same column alignment.
- **Tablet:** balanced two-column statement; feature remains two columns.
- **Mobile:** all blocks stack; image follows the statement; feature image follows its copy; principles become a single column.

## Motion and accessibility

- Blur + translate reveals use `var(--ease-out)`.
- Principle hover uses a white background sweep and text shift only; cursor remains default.
- `prefers-reduced-motion` resolves all elements in their final state.
