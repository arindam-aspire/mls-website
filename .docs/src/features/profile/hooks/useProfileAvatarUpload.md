# File Overview

Client hook for personal profile photo upload and removal on `/en/my-profile`.

**Source:** `src/features/profile/hooks/useProfileAvatarUpload.ts`

# Responsibilities

- Open the hidden file picker, validate the file (`validateProfileImageFile`), and run `useUploadProfilePicture` / `useDeleteProfilePicture`.
- Show the selected file immediately as a `blob:` object URL on the auth-store user so `Avatar` can render it while the presign/PUT/`GET /auth/me` round-trip runs.
- Persist the file in IndexedDB (`cacheProfilePictureFile`) so the header avatar still shows after login / reload when MLS stored `dev://…`.
- Keep that preview when MLS stores a non-loadable `dev://…` placeholder. Replace it when `GET /auth/me` (or the upload payload) returns a real HTTP(S) URL.
- Restore the previous URL and revoke the object URL if upload fails.

# Imports

- `useAuthStore` — optimistic `profile_picture_url` on the logged-in user
- `cacheProfilePictureFile`
- `useUploadProfilePicture` / `useDeleteProfilePicture`
- `isUsableNextImageSrc` — decide whether the API URL can replace the blob preview
- `validateProfileImageFile`

# Exports

- `useProfileAvatarUpload()`

# State Management

| State | Purpose |
| --- | --- |
| Auth store `user.profile_picture_url` | Display src for `MyProfileCard` and header avatars |
| `previewObjectUrlRef` | Object URL to revoke when replaced or unused |

# API Usage

- `POST /auth/me/profile-picture` then PUT to `upload_url` unless `dev://`
- `GET /auth/me` to refresh the user
- `DELETE /auth/me/profile-picture` on remove

# Return values

Same shape as `ProfileAvatarUploadBindings` (`fileInputRef`, handlers, `isUploading`, `isRemoving`, loading labels).

# Flow Description

1. Camera click → file picker.
2. Valid file → `URL.createObjectURL` → `setUser({ …, profile_picture_url: blobUrl })` so the photo appears immediately.
3. Mutation uploads. On success, if the stored URL is HTTP(S)/blob/data, the blob preview is revoked; if MLS returned `dev://`, the blob stays on the user for this session.
4. On error, previous `profile_picture_url` is restored.
5. Remove calls `DELETE` and revokes any leftover object URL.

# Dependencies

- [useProfileScreen.md](./useProfileScreen.md) — passes bindings into `MyProfileCard`
- [profile.service.md](../services/profile.service.md)
- [ProfileAvatarUpload.md](../components/ProfileAvatarUpload.md)

# Notes

- A `blob:` preview and the IndexedDB cache survive login on **this browser**. A visible photo on another device needs a real HTTP(S) `profile_picture_url` from MLS.
