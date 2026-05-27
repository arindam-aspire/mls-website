# `src/` — Application source

All client and shared application logic lives under `src/`, organized by **feature** and **layer**.

## Structure

| Path | Role |
| --- | --- |
| `features/` | Domain modules (auth, landing, property, profile, dashboard, not-found) |
| `components/` | Shared UI (`ui/`) and cross-feature widgets (`common/`) |
| `layouts/` | Route layouts (`public-layout/`) |
| `apis/` | HTTP clients, interceptors, endpoint constants |
| `providers/` | React context providers (query, theme, toast, auth) |
| `i18n/` | next-intl routing and navigation wrappers |
| `messages/` | Locale JSON namespaces |
| `hooks/` | Shared hooks (`useForm`, `useToast`) |
| `initializers/` | App boot (`NavigationInitializer`) |
| `configs/` | Environment / API base URL |
| `lib/` | Utilities (`cn`) |
| `types/` | Shared types (e.g. toast) |
| `utils/` | Imperative navigation helpers |
| `assets/` | Static images |

## Data flow (typical feature)

```
Screen → Component → mutation/query → service → apiClient/authClient → API
                ↓
           auth.store / local state
```

## Locale

All user-facing navigation should use `@/src/i18n/navigation` (`Link`, `useRouter`) so URLs include the locale prefix (`/en/...`).

## Child documentation

- [features/README.md](./features/README.md)
- [components/README.md](./components/README.md)
- [apis/README.md](./apis/README.md)
- [layouts/README.md](./layouts/README.md)
- [providers/README.md](./providers/README.md)
- [i18n/README.md](./i18n/README.md)
