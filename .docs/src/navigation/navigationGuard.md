# File Overview

Global navigation interceptor registry used to block programmatic route changes until a host feature (e.g. Create Property unsaved-changes guard) resolves user intent.

**Source:** `src/navigation/navigationGuard.ts`

# Responsibilities

- Maintain a set of `NavigationInterceptor` callbacks.
- `registerNavigationInterceptor` — add/remove interceptors (typically from a feature hook `useEffect` cleanup).
- `runNavigationInterceptors` — return `false` if any interceptor blocks the intent; `true` when all allow navigation.

# Navigation intent

| Field | Values |
| --- | --- |
| `action` | `push`, `replace`, `back`, `reload` |
| `href` | Target path for push/replace; empty for back/reload |

Interceptors return **`false`** to block and **`true`** to allow.

# Integration

- [navigation.md](../i18n/navigation.md) — wrapped `useRouter()` runs interceptors before `push` / `replace` / `back`.
- [navigation.utils.md](../utils/navigation.utils.md) — `navigateTo`, `navigateReplace`, `navigateBack` run interceptors before imperative navigation.
- [usePropertyCreateUnsavedChanges.md](../features/property/hooks/usePropertyCreateUnsavedChanges.md) — registers interceptor + link/back/keyboard handlers; opens custom modal instead of browser alerts.

# Dependencies

- Consumed by i18n router wrapper and navigation utils; no React dependency.
