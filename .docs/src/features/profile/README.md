# Profile feature (`src/features/profile/`)

User profile area scaffolded with a feature-first folder structure.

## Architecture

```text
profile/
  components/  Feature UI blocks
  hooks/       Profile logic hooks
  mutations/   React Query write hooks
  screens/     Route-level screens
  services/    API interaction layer
  store/       Feature state modules
  types/       Profile TypeScript types
  utils/       Feature-local helpers
```

## Files and folders

| Path | Role |
| --- | --- |
| [screens/index.md](./screens/index.md) | `ProfileScreen` — current Coming Soon route screen |
| [screens/ChangePasswordModal.md](./screens/ChangePasswordModal.md) | Change-password modal screen component |
| [components/README.md](./components/README.md) | Profile component folder docs |
| [components/ChangePasswordForm.md](./components/ChangePasswordForm.md) | Change-password form component |
| [hooks/README.md](./hooks/README.md) | Profile hooks folder docs |
| [mutations/README.md](./mutations/README.md) | Profile mutation folder docs |
| [services/README.md](./services/README.md) | Profile services folder docs |
| [store/README.md](./store/README.md) | Profile store folder docs |
| [types/README.md](./types/README.md) | Profile type folder docs |
| [utils/README.md](./utils/README.md) | Profile utility folder docs |

## Route

- `/en/my-profile` — `app/[locale]/(main)/my-profile/page.tsx`

## Status

- Only the route-level screen is implemented.
- Remaining folders are intentionally scaffolded to match other feature modules.

## Future

Profile edit, avatar upload, account settings, and profile verification views.
