# File Overview

`src/features/not-found/screens/NotFoundScreen.tsx` is the client-side 404 not-found page UI for locale routes.

## Responsibilities

- Present a clear not-found state using the same visual pattern as `UnauthorizedScreen` / `ComingSoonCard`.
- Provide a primary CTA that returns users to locale home.
- Load all user-facing copy from the `notFound` message namespace.

## Imports

- `SearchX`, `Home` from `lucide-react`
- `useTranslations` from `next-intl` (`notFound` namespace)
- `Button` from `@/src/components/ui/button`
- `useRouter` from `@/src/i18n/navigation`
- `cn` from `@/src/lib/cn`
- `comingSoonTitleClasses`, `comingSoonBodyClasses`, `displayEyebrowClasses` from `@/src/lib/typography`

## Exports

- `NotFoundScreen`

## State Management

- No local state.

## API Usage

- No API calls.

## Navigation

- Uses locale-aware `router.push("/")` from `@/src/i18n/navigation` to send users to locale root (for example `/en`).

## Props / Parameters

- No props.

## Actions / Inputs

### Actions

- **Back home** button click: navigates to locale home.

### Inputs / Validation / Toggles

- No form inputs, validations, or show/hide toggles.

## UI Details

- Matches `ComingSoonCard` / `UnauthorizedScreen` layout: `bg-surface` section, `max-w-2xl` centered column, dashed circular icon badge (`bg-danger/10`, `text-danger`, `border-danger/30`), `displayEyebrowClasses` eyebrow with `text-secondary`, `bg-secondary-dark` divider, `comingSoonTitleClasses` / `comingSoonBodyClasses` for title and body.
- CTA: primary solid `Button` with `iconStart` `Home` icon at `mt-8 sm:mt-10`.
- **Theme:** semantic tokens only; works in light and dark.

## Flow Description

1. Page mounts on not-found route (`not-found.tsx` or catch-all).
2. Screen displays icon, eyebrow, title, and description.
3. User clicks back home to navigate to locale root.

## Dependencies

- Route entries: `app/[locale]/not-found.tsx`, `app/[locale]/[...rest]/page.tsx`
- Messages: `src/messages/<locale>/notFound.json`
- Design reference: `src/components/common/ComingSoonCard.tsx`, `UnauthorizedScreen`

## Notes

- Keep in sync when `src/features/not-found/screens/NotFoundScreen.tsx` changes.
