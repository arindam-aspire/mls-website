# `app/` — Next.js App Router

Next.js 16 App Router entry: layouts, pages, and locale segment.

## Routing model

| Path | Description |
| --- | --- |
| `/` | `app/page.tsx` → redirects to `/en` |
| `/[locale]/...` | All localized routes (`en`, `ar`, `es`, `fr`) |

`localePrefix` is **always** (see `src/i18n/routing.ts`).

## Route groups (URL-invisible)

| Group | Layout | Routes |
| --- | --- | --- |
| `(main)` | `ProtectedLayout` | `/dashboard`, `/my-profile`, `/saved-searches`, `/favourites` |
| `(property)` | `PublicLayout` | `/listing`, `/property-list`, `/propert-details/:id`, `/recently-viewed`, `/inquiries` |
| `(auth)` | *(reserved)* | — |
| `(public)` | *(reserved)* | — |

## Layout hierarchy

```
app/layout.tsx          → providers, fonts, AuthProvider, NavigationInitializer
  app/[locale]/layout.tsx → NextIntlClientProvider
    (main)|(property)/layout.tsx → PublicLayout (header, AuthModal, footer)
      page.tsx → feature screen
```

## Middleware

`proxy.ts` at repo root runs next-intl middleware for locale handling.

## Child documentation

- [locale/README.md](./[locale]/README.md)
- Per-page: mirrored under `.docs/app/[locale]/...`
