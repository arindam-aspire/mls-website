# File Overview

`src/features/loading/screens/index.tsx` renders the global MLS loading screen used by `app/loading.tsx`.

**Source:** `src/features/loading/screens/index.tsx` (Server Component)

## Responsibilities

- Full-screen loading overlay with brand logo, title, animated dots, and progress bar.
- Fixed English copy (`Multiple Listing Service`, `Loading…`) regardless of locale.

## Imports

- `next/image`
- MLS logo assets from `src/assets/images/`

## Exports

- Default export: `LoadingScreen` (server component)

## UI Details

- Semantic tokens: `bg-page`, `text-text`, `text-muted`, `bg-primary`, `bg-primary-light`
- Light/dark logo swap (`MLS_Light_Logo` / `MLS_Dark_Logo`)
- Animations: `animate-logo-breathe`, `animate-loading-dot`, `animate-loading-bar`

## Dependencies

- `app/loading.tsx` re-exports this module as the route loading UI.
