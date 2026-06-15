# User feature (`src/features/user/`)

Cross-cutting **user** API domain (`/users/*`). Owns services and types that are not profile UI but operate on the authenticated user resource.

## Architecture

```text
user/
  hooks/       Future hooks for `/users/*` flows
  mutations/   Future TanStack Query mutations
  services/    API calls via `apiClient` / `authClient`
  store/       Optional feature state
  types/       User API request/response types
  utils/       Feature-local helpers
```

## Current scope

| API | Service | Consumers |
| --- | --- | --- |
| `PATCH /users/agency` | `assignUserAgency`, `assignUserAgencyAndRefreshUser` | `useSelectAgencyModal` (profile), `profile.service` re-export |

Future candidates (endpoints already in `userEndpoints.ts`):

- `GET /users/recent-views` — may move from `property` feature when consolidated.

## Files and folders

| Path | Role |
| --- | --- |
| [services/user.service.md](./services/user.service.md) | Agency assignment + auth refresh |
| [types/user.types.md](./types/user.types.md) | `AssignUserAgency*` types |
| [services/README.md](./services/README.md) | Services index |
| [types/README.md](./types/README.md) | Types index |
| [hooks/README.md](./hooks/README.md) | Hooks placeholder |
| [mutations/README.md](./mutations/README.md) | Mutations placeholder |
| [store/README.md](./store/README.md) | Store placeholder |
| [utils/README.md](./utils/README.md) | Utils placeholder |

## Related features

- **profile** — UI for agency selection (`SelectAgencyModal`); imports user services directly.
- **auth** — `getLoggedInUser` after agency assign to refresh `has_agency`.
- **property** — recently viewed listings still call `/users/recent-views` via `property.service` until migrated.

## Conventions

- Import user services from `@/src/features/user/services/user.service` (or barrel `@/src/features/user/services`).
- `profile.types` re-exports `AssignUserAgency*` for backward compatibility.
