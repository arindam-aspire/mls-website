# Unauthorized feature (`src/features/unauthorized/`)

Unauthorized-access screen module used by the locale route `app/[locale]/unauthorized.tsx`.

## Files

| Path | Role |
| --- | --- |
| [screens/UnauthorizedScreen.md](./screens/UnauthorizedScreen.md) | 401-style unauthorized UI with back-home action |

## Route

- `/en/unauthorized` (and other locales via `/[locale]/unauthorized`) renders this feature screen inside `PublicLayout`.

## Notes

- This feature mirrors the `not-found` feature pattern: route file stays thin and delegates page UI to a `*Screen` component.
