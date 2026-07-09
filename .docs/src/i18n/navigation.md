# File Overview

Locale-aware Next.js navigation from **next-intl**, with a wrapped `useRouter` that runs [navigationGuard.md](../navigation/navigationGuard.md) interceptors before programmatic navigation.

**Source:** `src/i18n/navigation.ts`

# Responsibilities

- Re-export `Link`, `redirect`, `usePathname`, and `getPathname` from `createNavigation(routing)`.
- Export **`useRouter()`** that wraps the next-intl router:
  - **`push`** / **`replace`** — normalize href with [stripLocalePrefixFromPath.md](./stripLocalePrefixFromPath.md), run interceptors, then navigate.
  - **`back`** — run interceptors with `{ href: "", action: "back" }`.

# Imports

- `createNavigation` from `next-intl/navigation`
- `runNavigationInterceptors` from `@/src/navigation/navigationGuard`
- `routing` from `./routing`

# Exports

- `Link`, `redirect`, `usePathname`, `getPathname`, `useRouter`

# Notes

- `<Link>` clicks are still captured separately on Create Property via document-level capture when the unsaved-changes guard is active; the router wrapper covers `router.push` / profile menu / drawer navigation paths.

# Dependencies

- [routing.md](./routing.md)
- [navigationGuard.md](../navigation/navigationGuard.md)
