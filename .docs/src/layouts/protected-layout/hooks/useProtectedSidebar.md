# File Overview

Client hook: protected sidebar visibility, collapse state, and brand image source.

**Source:** `src/layouts/protected-layout/hooks/useProtectedSidebar.ts`

# Return value

| Key | Description |
| --- | --- |
| `isVisible` | Agency/agent only |
| `isLoadingUser` | Auth hydration |
| `isCollapsed` | Narrow vs expanded rail |
| `toggleCollapsed` | Toggle + `localStorage` |
| `collapseLabel` / `expandLabel` | Toggle `aria-label` |
| `navLabel` | Aside `aria-label` |
| `logoAlt` | `common.brand` for image alt |
| `logoSrc` | `StaticImageData` — favicon when collapsed; light/dark full logo when expanded |

# Logo selection

```text
isCollapsed → favicon.png
else theme === "dark" → MLS_Dark_Logo.png
else → MLS_Light_Logo.png
```

# Dependencies

- `useAuthStore`, `useTheme`, `hasProtectedSidebarAccess`, asset imports
