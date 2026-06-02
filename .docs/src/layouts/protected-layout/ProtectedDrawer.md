# File Overview

`src/layouts/protected-layout/ProtectedDrawer.tsx` is a placeholder off-canvas/drawer surface for large protected layouts.

## Responsibilities

- Reserve a dedicated left-side drawer region for future advanced nav or tools.
- Provide a placeholder card in a fixed-position container.

## Imports

- No external imports.

## Exports

- `ProtectedDrawer`

## State Management

- No open/close state yet (static placeholder).

## API Usage

- None.

## Navigation

- No routing interactions yet.

## Props / Parameters

- No props.

## Actions / Inputs

- No user actions currently.

## UI Details

- Hidden until `xl` breakpoint.
- Fixed-position left panel with semantic token styling.
- Uses `rounded-xl` inside drawer content.

## Flow Description

1. On `xl+`, mount fixed drawer panel.
2. Render inner placeholder content card.
3. On smaller widths, component is hidden.

## Dependencies

- Used by `src/layouts/protected-layout/index.tsx`.

## Notes

- Current `pointer-events-none` keeps it non-interactive until functional UI is added.
