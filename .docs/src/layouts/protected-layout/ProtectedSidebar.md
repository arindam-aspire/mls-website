# File Overview

`src/layouts/protected-layout/ProtectedSidebar.tsx` is a desktop-only sidebar placeholder for protected routes.

## Responsibilities

- Reserve sidebar area for authenticated navigation.
- Provide a visual container placeholder for future sidebar items.

## Imports

- No external imports.

## Exports

- `ProtectedSidebar`

## State Management

- No state.

## API Usage

- None.

## Navigation

- No routing actions yet.

## Props / Parameters

- No props.

## Actions / Inputs

- No actions yet.

## UI Details

- Hidden below `lg` and visible at `lg+`.
- Semantic tokens ensure light/dark support (`bg-surface`, `bg-page`, `text-muted`).
- Uses `rounded-xl` for the inner sidebar card placeholder.

## Flow Description

1. On desktop (`lg+`), render left rail.
2. Render inner placeholder card content.
3. On smaller screens, component does not render.

## Dependencies

- Used by `src/layouts/protected-layout/index.tsx`.

## Notes

- Real navigation links and active-state logic are not implemented yet.
