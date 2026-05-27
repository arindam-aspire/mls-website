# Not found feature (`src/features/not-found/`)

404 page content used by App Router `not-found.tsx` and catch-all.

## Files

| Path | Role |
| --- | --- |
| [screens/NotFoundScreen.md](./screens/NotFoundScreen.md) | Translated 404 UI + “Back home” button |

## Routes

- Invalid locale or unknown paths → `notFound()` → `app/[locale]/not-found.tsx` wraps screen in `PublicLayout`.
- Catch-all `[...rest]/page.tsx` calls `notFound()`.

## i18n

Namespace: `notFound` in `src/messages/*/notFound.json`.
