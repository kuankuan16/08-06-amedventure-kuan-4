# Version C Philosophy Hover Specification

## Source

- Reference: `http://localhost:3002/v3#top`
- Local source inspected: `08-05-amedventure-kuan-3/src/components/ValueSection.tsx`
- Target: Version C About pillars and Investment Focus feature cards
- Interaction model: hover-only visual feedback; these items do not navigate or trigger an action

## Extracted reference motion

- A full-cell colour layer starts at `scaleY(0)` with `transform-origin: bottom`.
- Hover changes the layer to `scaleY(1)`.
- Duration: `600ms`.
- Easing: `cubic-bezier(.22,1,.36,1)`.
- Heading translates upward by `4px` over the same 600ms easing.
- Supporting copy translates upward by `4px`; its colour gains contrast over `500ms`.
- Reduced-motion mode removes transitions and leaves content readable.

## Version C adaptation

- Use a pure white wipe rather than the v3 chartreuse on both About and Investment Focus.
- Do not add the reference outbound arrow because the Version C items have no destination.
- About pillars remain semantic `article` elements.
- Investment Focus feature items change from buttons to semantic `article` elements because hover/focus does not perform an action.
- Explicitly use `cursor: default` for both groups.
- Existing Focus image expansion and light-blue state dot may remain; the new text rise and colour wipe layer on top of that established behaviour.
