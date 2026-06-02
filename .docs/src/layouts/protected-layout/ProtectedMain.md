# File Overview

`src/layouts/protected-layout/ProtectedMain.tsx` wraps protected route content in a themed main surface.

## Responsibilities

- Render the `<main>` region for protected pages.
- Provide consistent inner spacing and surface container for children.

## Imports

- No external imports.

## Exports

- `ProtectedMain`

## State Management

- No state.

## API Usage

- None.

## Navigation

- No direct navigation.

## Props / Parameters

| Prop | Type | Description |
| --- | --- | --- |
| `children` | `React.ReactNode` | Protected page content. |

## Actions / Inputs

- No direct user inputs.

## UI Details

- Mobile-first padding (`px-4 py-4`) with larger spacing on `sm+`.
- Semantic token surfaces (`bg-page`, `bg-surface`) with tokenized border.
- Uses `rounded-xl` for the main content container.

## Flow Description

1. Render `<main>` as a flex column.
2. Render a full-width inner surface card.
3. Inject `children` into that surface.

## Dependencies

- Used by `src/layouts/protected-layout/index.tsx`.

## Notes

- Component is presentational and can host future loading/empty wrappers if needed.
