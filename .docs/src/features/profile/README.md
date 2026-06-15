# Profile feature (`src/features/profile/`)

User profile area scaffolded with a feature-first folder structure.

## Architecture

```text
profile/
  components/  Feature UI blocks
  hooks/       Profile logic hooks
  modals/      Cross-feature modal shells (e.g. SelectAgencyModal)
  mutations/   React Query write hooks
  screens/     Route-level screens and screen-local modals
  services/    API interaction layer
  store/       Feature state modules
  types/       Profile TypeScript types
  utils/       Feature-local helpers
```

## Files and folders

| Path | Role |
| --- | --- |
| [hooks/useProfileScreen.md](./hooks/useProfileScreen.md) | Toolbar labels and modal state |
| [modals/SelectAgencyModal.md](./modals/SelectAgencyModal.md) | Agency picker shell (My Listings Add Property gate) |
| [components/SelectAgencyListItem.md](./components/SelectAgencyListItem.md) | Selectable agency row |
| [components/SelectAgencyModalSkeleton.md](./components/SelectAgencyModalSkeleton.md) | Agency list loading skeleton |
| [hooks/useSelectAgencyModal.md](./hooks/useSelectAgencyModal.md) | Select agency modal labels and close |
| [screens/ProfileScreen.md](./screens/ProfileScreen.md) | `ProfileScreen` — toolbar + modals |
| [components/ProfilePageToolbar.md](./components/ProfilePageToolbar.md) | Page title, subtitle, action buttons |
| [components/MyProfileCard.md](./components/MyProfileCard.md) | Profile summary card |
| [components/README.md](./components/README.md) | Profile components index |
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

- Page toolbar with title, subtitle, **Change Password**, and **Edit** (upcoming modal).
- `ChangePasswordForm` used by `ChangePasswordModal`.

## Future

Profile edit, avatar upload, account settings, and profile verification views.
