# Route group `(main)` — `app/[locale]/(main)/`

Primary authenticated-main routes with `ProtectedLayout`. Group name does **not** appear in the URL.

## Layout

[layout.md](./layout.md) → `ProtectedLayout` (protected shell scaffolding).

## Pages

| File | URL | Screen |
| --- | --- | --- |
| [dashboard/page.md](./dashboard/page.md) | `/en/dashboard` | `DashboardScreen` |
| [my-profile/page.md](./my-profile/page.md) | `/en/my-profile` | `ProfileScreen` |

## Architecture

```
/en/*
  layout.tsx (ProtectedLayout)
  dashboard/page.tsx
  my-profile/page.tsx
```

## Related

- [property route group](../(property)/README.md)
- [locale layout](../layout.md)
