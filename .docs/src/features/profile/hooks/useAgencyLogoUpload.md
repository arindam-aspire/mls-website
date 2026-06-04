# File Overview

Client hook for agency logo upload and removal on the profile screen. Mirrors `useProfileAvatarUpload` but calls `POST` / `DELETE /agency/{agencyId}/logo` and updates the TanStack Query `["agency", agencyId]` cache.

**Source:** `src/features/profile/hooks/useAgencyLogoUpload.ts`

# Responsibilities

- File picker, validation (`validateProfileImageFile`), upload/remove mutations.
- Disable actions when `agencyId` is empty or a mutation is pending.

# API Usage

- `uploadAgencyLogo` / `deleteAgencyLogo` in `profile.service.ts`
- Mutations: `useUploadAgencyLogo`, `useDeleteAgencyLogo` in `profile.mutation.ts`

# Return values

Same shape as `ProfileAvatarUploadBindings` (`fileInputRef`, handlers, `isUploading`, `isRemoving`, loading labels).

# Dependencies

- [useProfileScreen.md](./useProfileScreen.md) — passes bindings into `AgencyProfileCard`
- [AgencyProfileCard.md](../components/AgencyProfileCard.md) — UI consumer
