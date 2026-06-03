# File Overview

`src/features/unauthorized/screens/UnauthorizedScreen.tsx` is the client-side 401 unauthorized page UI for locale routes.

## Responsibilities

- Present a clear unauthorized state using the same visual pattern as `ComingSoonCard`.
- Provide a primary CTA that returns users to locale home.
- Load all user-facing copy from the `unauthorized` message namespace.

## Imports

- `Home`, `ShieldAlert` from `lucide-react`
- `useTranslations` from `next-intl` (`unauthorized` namespace)
- `Button` from `@/src/components/ui/button`
- `useRouter` from `@/src/i18n/navigation`
- `cn` from `@/src/lib/cn`
- `comingSoonTitleClasses`, `comingSoonBodyClasses`, `displayEyebrowClasses` from `@/src/lib/typography`

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

- **Back home** button click: navigates to locale home.

### Inputs / Validation / Toggles

- No form inputs, validations, or show/hide toggles.

## UI Details

- Matches `ComingSoonCard` layout: `bg-surface` section, `max-w-2xl` centered column, dashed circular icon badge (`bg-tertiary-light/50`, `text-tertiary-dark`, `border-tertiary-dark/30`), `displayEyebrowClasses` eyebrow with `text-secondary` override, `bg-secondary-dark` divider, `comingSoonTitleClasses` / `comingSoonBodyClasses` for title and body.
- CTA: primary solid `Button` with `Home` icon (`rounded-lg`, `gap-2` via button styles) at `mt-8 sm:mt-10` (same slot as ComingSoon footer row).
- **Theme:** semantic tokens only; works in light and dark.

## Flow Description

1. Page mounts on unauthorized route.
2. Screen displays icon, eyebrow (includes status code in copy), title, and description.
3. User clicks back home to navigate to locale root.

## Dependencies

- Route entry: `app/[locale]/(system)/unauthorized/page.tsx`
- Messages: `src/messages/<locale>/unauthorized.json`
- Design reference: `src/components/common/ComingSoonCard.tsx`
- Layout: `PublicLayout` via `(system)` layout

## Notes

- `code` remains in message files for optional use; eyebrow strings include `401` for display.
