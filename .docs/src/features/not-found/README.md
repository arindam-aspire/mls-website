# Not found feature (`src/features/not-found/`)

404 page content used by App Router `not-found.tsx` and catch-all.

## Files

| Path | Role |
| --- | --- |
| [screens/NotFoundScreen.md](./screens/NotFoundScreen.md) | Translated 404 UI (ComingSoon-style layout) + back-home button |

## Routes

- Invalid locale or unknown paths → `notFound()` → `app/[locale]/not-found.tsx` wraps screen in `PublicLayout`.
- Catch-all `[...rest]/page.tsx` calls `notFound()`.

## i18n

Namespace: `notFound` in `src/messages/<locale>/notFound.json` (`eyebrow`, `title`, `description`, `backHome`).

## UI

- Matches `ComingSoonCard` / `UnauthorizedScreen` structure: surface section, dashed icon circle, eyebrow, divider, serif title, lead body, primary CTA.
- Icon: `SearchX` with **danger** tokens (`bg-danger/10`, `text-danger`, `border-danger/30`).
- Eyebrow uses `displayEyebrowClasses` + `text-secondary`.
