# File Overview

`src/layouts/protected-layout/index.tsx` defines the `ProtectedLayout` shell composer. It stitches together placeholder header, sidebar/drawer, mobile menu, main content area, and footer for future authenticated route groups.

## Responsibilities

- Provide the root protected layout wrapper.
- Compose child protected layout sections in a predictable order.
- Render route content through `children` inside `ProtectedMain`.

## Imports

- `ProtectedHeader`
- `ProtectedSidebar`
- `ProtectedDrawer`
- `ProtectedMobileMenu`
- `ProtectedMain`
- `ProtectedFooter`

## Exports

- Default export: `ProtectedLayout`

## State Management

- No global or local state yet.

## API Usage

- No API calls in this file.

## Navigation

- No direct navigation behavior yet. This layout is intended to be mounted by locale-aware App Router groups (for example `/en/...`).

## Props / Parameters

| Prop | Type | Description |
| --- | --- | --- |
| `children` | `React.ReactNode` | Page content rendered inside `ProtectedMain`. |

## Actions / Inputs

- No direct user inputs or actions are handled in this composer.

## UI Details

- Uses semantic tokens: `bg-page`, `text-text`.
- Uses responsive utility classes and flex layout.
- Delegates card/control radii to child placeholders (`rounded-xl` containers, `rounded-lg` controls where applicable).
- Theme-safe in both light and dark modes due to semantic token usage.

## Flow Description

1. The layout renders a full-height container.
2. Desktop sidebar and drawer placeholders mount.
3. Header and mobile menu placeholders render above content.
4. `children` is rendered inside `ProtectedMain`.
5. Footer placeholder renders at the bottom.

## Dependencies

- Source siblings in `src/layouts/protected-layout/`.
- Parent docs index: `.docs/src/layouts/protected-layout/README.md`.

## Notes

- Placeholder-only scaffold.
- Not yet wired to App Router route groups.
