# Route group `(main)` — `app/[locale]/(main)/`

Primary public routes with `PublicLayout`. Group name does **not** appear in the URL.

## Layout

[layout.md](./layout.md) → `PublicLayout` (header, auth modal, footer).

## Pages

| File | URL | Screen |
| --- | --- | --- |
| [page.md](./page.md) | `/en/` | `LandingScreen` |
| [dashboard/page.md](./dashboard/page.md) | `/en/dashboard` | `DashboardScreen` |
| [my-profile/page.md](./my-profile/page.md) | `/en/my-profile` | `ProfileScreen` |

## Architecture

```
/en/*
  layout.tsx (PublicLayout)
  page.tsx → landing
  dashboard/page.tsx
  my-profile/page.tsx
```

## Related

- [property route group](../(property)/README.md)
- [locale layout](../layout.md)
