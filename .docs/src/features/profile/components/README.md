# Profile components (`src/features/profile/components/`)

Presentational UI for the profile feature.

## Files

| Path | Role |
| --- | --- |
| [ProfilePageToolbar.md](./ProfilePageToolbar.md) | Page title, subtitle, change-password button |
| [MyProfileCard.md](./MyProfileCard.md) | User profile summary card |
| [EditProfileForm.md](./EditProfileForm.md) | Email + phone form (`EditProfileModal`) |
| [ProfileAvatarUpload.md](./ProfileAvatarUpload.md) | Rounded avatar with camera upload button |
| [ChangePasswordForm.md](./ChangePasswordForm.md) | Change-password form (`ChangePasswordModal`) |

## Usage

Import by file path (no barrel `index.ts`).

## Notes

- `ProfileScreen` composes `ProfilePageToolbar`; additional layout components can be added when design continues.
