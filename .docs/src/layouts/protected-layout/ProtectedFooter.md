# File Overview

`src/layouts/protected-layout/ProtectedFooter.tsx` renders a standalone protected-layout footer with legal links and copyright text.

## Responsibilities

- Render a compact bottom bar matching the protected-shell design.
- Show legal links and copyright text in a single responsive row.

## Imports

- `getTranslations` from `next-intl/server`.
- `Link` from `@/src/i18n/navigation`.
- `footerLinkTextClasses`, `footerMutedTextClasses` from `src/lib/typography`.

## Exports

- `ProtectedFooter`

## State Management

- No state.

## API Usage

- None.

## Navigation

- Uses locale-aware `Link` components for legal-link placeholders (`terms`, `privacy`).

## Props / Parameters

- No props.

## Actions / Inputs

- Users can click legal links (`Terms and Conditions`, `Privacy Policy`).

## UI Details

- Styled as a compact dark footer strip using `bg-inherit-color` + `text-white`.
- Uses semantic and typography utility classes for consistency and light/dark safety.
- Responsive layout stacks on small screens and becomes left/right aligned from `sm+`.

## Flow Description

1. Protected layout renders `ProtectedFooter`.
2. Footer resolves localized labels from the `common` translation namespace.
3. Footer displays legal links on the left and copyright on the right (desktop).

## Dependencies

- Used by `src/layouts/protected-layout/index.tsx`.
- Depends on `src/messages/*/common.json` keys for legal and copyright strings.

## Notes

- This file intentionally does not reuse `PublicFooter` so protected and public shells can evolve independently.
