# File Overview

Removes all TanStack Query notification caches (list + unread count) when the session ends.

**Source:** `src/features/notifications/utils/clearNotificationQueryCache.ts`

# Responsibilities

- Call `queryClient.removeQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] })` so list and unread-count queries are dropped together.

# Exports

- `clearNotificationQueryCache(queryClient: QueryClient): void`

# Usage

| Caller | When |
| --- | --- |
| `useLogout` (`auth.mutation.ts`) | After successful `POST /auth/logout`, before `clearAuth()` |
| `AuthProvider` | When `GET /auth/me` fails, before `clearAuth()` |

# Notes

- Notifications use React Query, not Zustand. Without this, `staleTime: Infinity` on unread count leaves the bell badge visible after logout.
