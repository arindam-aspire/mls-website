# File Overview

`app/[locale]/unauthorized.tsx` defines the locale-aware unauthorized route page.

## Responsibilities

- Render the unauthorized route using the feature screen component.
- Keep page chrome consistent by wrapping content with `PublicLayout`.

## Imports

- `PublicLayout` from `src/layouts/public-layout`.
- `UnauthorizedScreen` from `src/features/unauthorized/screens/UnauthorizedScreen`.

## Exports

- Default export: `UnauthorizedPage`.

## State Management

- No local or global state.

## API Usage

- No API calls in this file.

## Navigation

- Locale-aware route path: `/en/unauthorized`, `/ar/unauthorized`, `/fr/unauthorized`, `/es/unauthorized`.
- No imperative navigation in this initial placeholder.

## Props / Parameters

- No props.

## Actions / Inputs

- Delegates actions (Back Home CTA) to `UnauthorizedScreen`.

## UI Details

- Uses layout-level semantic tokens/styles via `PublicLayout`.
- Page-specific UI and responsive status-card design are implemented in `UnauthorizedScreen`.

## Flow Description

1. Route resolves to unauthorized page.
2. `PublicLayout` renders shared app chrome.
3. `UnauthorizedScreen` renders the 401 UI and actions.

## Dependencies

- `src/layouts/public-layout/index.tsx`
- `src/features/unauthorized/screens/UnauthorizedScreen.tsx`
- `.docs/app/[locale]/layout.md`

## Notes

- This is a placeholder unauthorized experience and can be extended with CTA buttons (for example, back to home or sign in).
