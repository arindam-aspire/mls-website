# File Overview

Maps `GET /auth/me` into a browser-loadable `profile_picture_url` for header and profile avatars.

**Source:** `src/features/auth/utils/normalizeLoggedInUser.ts`

# Responsibilities

- Coerce picture fields that MLS may return as a string or nested `{ url, signed_read_url, file_url }`.
- Prefer signed/read URLs over a raw `profile_picture_url`.
- Skip unsigned private S3 URLs when a same-browser IndexedDB cache exists (unsigned objects often 403).
- Overlay `blob:` URLs from [profilePictureCache.md](../../../lib/profilePictureCache.md) when MLS stored `dev://…` or another non-loadable reference.

# Exports

- `withDisplayableProfilePicture(user): Promise<LoggedInUser>`

# Flow Description

1. Read `profile_picture_signed_url`, `profile_picture_read_url`, `signed_read_url`, `avatar_url`, then `profile_picture_url`.
2. If that value is HTTP(S) and not an unsigned S3 object, use it.
3. Else use the cached file for `user.id` when present.
4. `AuthProvider` and sign-in (`getLoggedInUser`) apply this so the landing header avatar shows after login.

# Dependencies

- [auth.service.md](../services/auth.service.md)
- [profilePictureCache.md](../../../lib/profilePictureCache.md)
- [shouldUnoptimizeImageSrc.md](../../../lib/shouldUnoptimizeImageSrc.md)
