# File Overview

Portaled fixed-position dropdown anchored to a trigger element.

**Source:** `src/components/search/AnchoredDropdown.tsx`

# Exports

- `AnchoredDropdown`

# Responsibilities

- `createPortal` to `document.body`.
- Position 8px below trigger; clamp to viewport; min width default 300px.
- Recalculate on scroll (listeners on anchor scroll parents + `resize`) and when the panel resizes (`ResizeObserver`); skip state updates when position is unchanged.
- Flip above the trigger when there is not enough space below (uses measured panel height).
- Close on `pointerdown` outside panel and trigger (capture phase + `contains` checks); `Escape` closes as well. `onClose` is stored in a ref so the document listener is not re-registered every parent render.
- Panel wrapper uses `overflow-visible` so nested suggestion lists are not clipped.
