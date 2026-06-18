# Features (`src/features/`)

Domain-driven modules for the MLS application. Each feature owns screens, components, and (when needed) queries, mutations, services, stores, and types.

## Architecture

```
src/features/<feature>/
  screens/       Route-level views (*Screen.tsx or index.tsx)
  components/    Feature-specific UI (optional)
  query/         TanStack Query hooks (optional)
  mutations/     TanStack Query mutations (optional)
  services/      API calls via authClient / apiClient
  store/         Zustand stores (optional)
  types/         *.types.ts
```

**Data flow:** App Router `page.tsx` → **Screen** → Components → Query/Mutation → Service → Endpoints.

## Features

| Feature | Purpose | README |
| --- | --- | --- |
| `auth` | URL-driven auth modal (sign-in, sign-up, OTP, agency) | [auth/README.md](./auth/README.md) |
| `landing` | Home hero, taxonomy search, marketing | [landing/README.md](./landing/README.md) |
| `property` | Listings, favourites, saved searches, inquiries | [property/README.md](./property/README.md) |
| `profile` | My profile (placeholder) | [profile/README.md](./profile/README.md) |
| `user` | User management: `/users/*`, agent list, admin Owners/Agents screens | [user/README.md](./user/README.md) |
| `dashboard` | Dashboard (placeholder) | [dashboard/README.md](./dashboard/README.md) |
| `not-found` | 404 content | [not-found/README.md](./not-found/README.md) |
| `unauthorized` | 401 unauthorized content | [unauthorized/README.md](./unauthorized/README.md) |
| `loading` | Root App Router loading UI | [loading/README.md](./loading/README.md) |

## Routing

Features do not define routes directly. Routes live under `app/[locale]/` and import screens from here. All user URLs are locale-prefixed (`/en/`, `/ar/`, etc.).

## Conventions

- Screen files: `PascalCase` + `Screen` suffix (e.g. `LandingScreen.tsx`).
- Use `useRouter` / `Link` from `@/src/i18n/navigation` for locale-aware navigation.
- Auth flows use query param `?auth=<view>` — see [auth/authViews.md](./auth/authViews.md).

## Related docs

- [application.md](../../application.md) — routes, auth, APIs
- [app/[locale]/README.md](../../app/[locale]/README.md) — App Router structure
