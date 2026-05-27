# Initializers (`src/initializers/`)

App bootstrapping that must run inside the React tree.

| File | Role |
| --- | --- |
| [NavigationInitializer.md](./NavigationInitializer.md) | Registers Next.js `useRouter` for `navigation.utils` |

## Why it exists

Axios interceptors and logout need imperative `router.push` outside React components. `initializeNavigation(router)` stores a ref used by `navigateTo`, `navigateReplace`, `navigateBack`.

Mounted once in `app/layout.tsx` (client component).

## Note

Feature code should prefer `@/src/i18n/navigation` for locale-aware paths. `navigateTo` is used where locale is passed explicitly (e.g. logout → `/${locale}`).
