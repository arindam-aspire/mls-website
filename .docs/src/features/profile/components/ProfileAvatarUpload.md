# File Overview

Rounded profile avatar with camera button overlay for photo upload.

**Source:** `src/features/profile/components/ProfileAvatarUpload.tsx`

# Props / Parameters

| Prop | Type |
| --- | --- |
| `src` | `string \| null` |
| `name` | `string` |
| `uploadLabel` | `string` — `aria-label` for camera button |
| `onUploadClick` | `() => void` |

# UI Details

- `Avatar` `size="xl"` with override `!size-24 sm:!size-28` (was default `size-20`).
- Camera control: `rounded-full` pill on bottom-end of avatar.

# Dependencies

- [MyProfileCard.md](./MyProfileCard.md)
