# File Overview

`src/features/unauthorized/screens/UnauthorizedScreen.tsx` is the client-side 401 unauthorized page UI for locale routes.

## Responsibilities

- Present a clear unauthorized state with status code, title, and supporting text.
- Provide a CTA button that returns users to locale home.
- Reuse shared typography utilities to keep visual parity with `NotFoundScreen`.

## Imports

- `ShieldAlert` icon from `lucide-react`
- `useTranslations` from `next-intl`
- `Button` from `@/src/components/ui/button`
- `useRouter` from `@/src/i18n/navigation`
- `cn` from `@/src/lib/cn`
- `notFoundCodeClasses`, `notFoundTitleClasses`, `notFoundBodyClasses` from `@/src/lib/typography`

## Exports

- `UnauthorizedScreen`

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

- `Back Home` button click: navigates to locale home.

### Inputs / Validation / Toggles

- No form inputs, validations, or show/hide toggles.

## UI Details

- Surface container uses `bg-surface`, `border-secondary/15`, `rounded-xl`.
- Icon badge uses `bg-danger/15` + `text-danger` for warning emphasis.
- Text styling uses semantic tokens (`text-muted`) and shared typography classes.
- Mobile-first spacing with `sm:` enhancements.

## Flow Description

1. Page mounts on unauthorized route.
2. Screen displays status icon, code `401`, title, and message.
3. User can click `Back Home` to navigate to locale root.

## Dependencies

- Route entry: `app/[locale]/unauthorized.tsx`
- Layout wrapper: `src/layouts/public-layout/index.tsx`

## Notes

- This screen follows the same route-to-screen decomposition used by `not-found`.
