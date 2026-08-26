# File Overview

Helpers that decide whether a URL can be passed to `next/image` and whether it must skip the optimizer.

**Source:** `src/lib/shouldUnoptimizeImageSrc.ts`

# Responsibilities

- Reject backend placeholder URLs such as `dev://profile-pictures/...` so they are not passed to `next/image`.
- Allow real HTTP(S) URLs, site-relative paths (`/...`), `blob:`, and `data:` URLs.
- Mark private/presigned S3 URLs, `blob:`, and `data:` as `unoptimized` so the browser loads them directly (optimizer would 403 or cannot fetch).
- Pick the first displayable candidate from stored + preview URLs (`resolveDisplayableImageSrc`).

# Imports

_None._

# Exports

| Function | Purpose |
| --- | --- |
| `isUsableNextImageSrc(src)` | `true` when `src` is safe for `next/image`. |
| `resolveDisplayableImageSrc(...candidates)` | First usable candidate; skips `dev://` and empty values. |
| `shouldUnoptimizeImageSrc(src)` | `true` for S3 hosts, presigned query params, `blob:`, or `data:`. |

# State Management

_N/A — pure helpers._

# API Usage

_N/A._

# Navigation

_N/A._

# Props / Parameters

| Function | Parameter | Behavior |
| --- | --- | --- |
| `isUsableNextImageSrc` | `src: string \| null \| undefined` | Empty, `dev://`, and other non-http schemes return `false`. |
| `resolveDisplayableImageSrc` | `...candidates` | Returns the first usable trimmed URL, or `null`. |
| `shouldUnoptimizeImageSrc` | `src: string` | Parses protocol/hostname/search; `blob:`/`data:` and S3/presigned return `true`; invalid URLs return `false`. |

# Actions / Inputs

_N/A._

# UI Details

Used by `Avatar` (`src/components/ui/avatar/index.tsx`). Invalid srcs fall back to initials instead of crashing the layout.

# Flow Description

1. `Avatar` trims `src` and calls `isUsableNextImageSrc`.
2. If unusable (including `dev://` upload placeholders), render initials.
3. If usable, render `next/image` with `unoptimized` for S3/presigned/`blob:`/`data:` **or** any non-site-relative URL (avoids `images.remotePatterns` failures). On load error, fall back to initials.

# Dependencies

- `src/components/ui/avatar/index.tsx`

# Notes

- `dev://` is a backend storage placeholder in local/dev mode, not a browser-loadable URL. Adding it to `next.config` `images.remotePatterns` would not make it load.
