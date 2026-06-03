# File Overview

`src/lib/auth/authorize.ts` is a client hook that guards protected UI using `useAuthStore` and locale-aware navigation.

## Responsibilities

- Read `user` and `isLoadingUser` from `useAuthStore`.
- Resolve allowed roles from `PERMISSIONS[requiredPermission]`.
- Redirect unauthenticated users to `/` (locale-aware home via `useRouter().replace` from `@/src/i18n/navigation`).
- Redirect users without the required permission to `/unauthorized` (locale-aware).
- Expose auth state for guarded screens.

## Exports

- `useAuthorize(requiredPermission: PermissionKey)`

## Return value

- `user`: `LoggedInUser | null` (current user from auth store)

## Parameters

| Param | Type | Description |
| --- | --- | --- |
| `requiredPermission` | `PermissionKey` | Permission key from `PERMISSIONS` (e.g. `DASHBOARD`, `PROFILE`). |

## Navigation

- Uses `useRouter().replace()` and `usePathname()` from `@/src/i18n/navigation`. Paths are **without** locale prefix (`/`, `/unauthorized`); the router adds the active locale.
- Skips redirect when already on the target path to avoid loops.

## Usage

```tsx
"use client";

import { useAuthorize } from "@/src/lib/auth/authorize";

export function ProtectedScreen() {
  const { user } = useAuthorize("DASHBOARD");
  if (!user) return null;

  return <div>{user.full_name}</div>;
}
```

## Notes

- Client-only (`"use client"`); call from client components or other hooks.
- Waits for `isLoadingUser` before redirecting so `AuthProvider` can hydrate the user.
