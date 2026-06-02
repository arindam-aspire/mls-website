# File Overview

`src/layouts/protected-layout/ProtectedHeader.tsx` is a placeholder top bar for authenticated pages.

## Responsibilities

- Render a sticky header region for protected pages.
- Reserve space for title and header actions.

## Imports

- No external imports.

## Exports

- `ProtectedHeader`

## State Management

- No state.

## API Usage

- None.

## Navigation

- No links or router calls yet.

## Props / Parameters

- No props.

## Actions / Inputs

- No user inputs yet.

## UI Details

- Semantic tokens: `bg-page`, `text-text`, `text-muted`, `border-secondary/15`.
- Responsive sizing: `h-16` then `sm:h-20`; mobile-first paddings.
- Sticky placement with top offset for persistent page header behavior.

## Flow Description

1. Render header container.
2. Show left placeholder heading.
3. Show right placeholder actions text.

## Dependencies

- Used by `src/layouts/protected-layout/index.tsx`.

## Notes

- Intended to host real user/account actions in future implementation.
