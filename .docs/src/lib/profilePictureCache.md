# File Overview

Same-browser cache of the last uploaded profile photo (IndexedDB), used when MLS stores a non-loadable `dev://` URL.

**Source:** `src/lib/profilePictureCache.ts`

# Responsibilities

- Store the uploaded `File`/`Blob` keyed by user id.
- Return a `blob:` object URL for `Avatar`.
- Clear the entry when the user removes their photo.

# Exports

| Function | Purpose |
| --- | --- |
| `cacheProfilePictureFile(userId, file)` | Persist bytes and return a `blob:` URL |
| `getCachedProfilePictureSrc(userId)` | Restore a `blob:` URL after login / reload |
| `clearCachedProfilePicture(userId)` | Delete on remove-photo |

# State Management

Module-level map of object URLs plus IndexedDB store `mls-profile-picture-cache` / `pictures`.

# Notes

- Browser-only (`indexedDB`). No-ops on the server.
- Does not sync across devices. A real HTTP(S) `profile_picture_url` from MLS is still preferred when it is loadable.
