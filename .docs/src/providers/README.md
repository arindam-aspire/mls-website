# Providers (`src/providers/`)

React context providers mounted in `app/layout.tsx` (unless noted).

## Mount order (root layout)

```
QueryProvider
  └── ThemeProvider
        └── ToastProvider (app wrapper)
              └── AuthProvider
                    └── NavigationInitializer
```

| Provider | File | Role |
| --- | --- | --- |
| [QueryProvider.md](./QueryProvider.md) | TanStack Query client |
| [ThemeProvider.md](./ThemeProvider.md) | `light` / `dark` on `<html>`, `mls-theme` localStorage |
| [ToastProvider.md](./ToastProvider.md) | Wraps hook provider + `Toaster` UI |
| [AuthProvider.md](./AuthProvider.md) | Hydrate user from token |

## Not mounted (reserved)

| Provider | File |
| --- | --- |
| [ReduxProvider.md](./ReduxProvider.md) | Empty stub |
| [SocketProvider.md](./SocketProvider.md) | Empty stub |

## Hooks

- Theme: `useTheme()` from `ThemeProvider.tsx`
- Toast: `useToast()` from `@/src/hooks/useToast.tsx` (requires `ToastProvider`)
