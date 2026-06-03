# Unauthorized feature (`src/features/unauthorized/`)

401 unauthorized screen used by `app/[locale]/(system)/unauthorized/page.tsx` and `useAuthorize` redirects.

## Files

| Path | Role |
| --- | --- |
| [screens/UnauthorizedScreen.md](./screens/UnauthorizedScreen.md) | Translated 401 UI (ComingSoon-style layout) + back-home button |

## Route

- `/en/unauthorized` (and other locales) → `(system)/unauthorized/page.tsx` inside `PublicLayout`.

## i18n

Namespace: `unauthorized` in `src/messages/<locale>/unauthorized.json`.

## UI

- Same layout pattern as `ComingSoonCard` and `NotFoundScreen`.
- Icon: `ShieldAlert` with **tertiary** tokens (`bg-tertiary-light/50`, `text-tertiary-dark`, `border-tertiary-dark/30`).
- Eyebrow: `text-secondary` override on `displayEyebrowClasses`.

## Auth integration

`useAuthorize` calls `router.replace("/unauthorized")` when the signed-in user lacks the required `PERMISSIONS` role.
