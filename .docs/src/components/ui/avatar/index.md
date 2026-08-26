# File Overview

Feature or shared UI component.

**Source:** `src/components/ui/avatar/index.tsx` (Client Component)

# Responsibilities

- Feature or shared UI component.

# Imports

- `import { useEffect, useState } from "react"`
- `import Image from "next/image"`
- `import { cn } from "@/src/lib/cn"`
- `import { isUsableNextImageSrc, shouldUnoptimizeImageSrc } from "@/src/lib/shouldUnoptimizeImageSrc"`
- `import type { AvatarProps, AvatarSize } from "./types"`

# Exports

- `Avatar`

# State Management

| State | Purpose |
| --- | --- |
| `imageFailed` | After `next/image` `onError`, fall back to initials until `src` changes. |

# UI Details

- Circular `rounded-full` shell; image uses `object-cover`.
- Initials fallback uses `bg-primary/10 text-primary`.

# Flow Description

1. If `src` is a usable image URL (`http(s)`, site-relative `/...`, `blob:`, or `data:`), render `next/image`.
2. Backend placeholders such as `dev://profile-pictures/...` are treated as missing `src`.
3. Remote, blob, and data URLs set `unoptimized` so the optimizer is not required (user avatars come from S3 or a local object URL).
4. If the image fails to load, render initials from `name` (or `?`).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/components/ui/avatar/index.tsx` changes.
- See [shouldUnoptimizeImageSrc.md](../../lib/shouldUnoptimizeImageSrc.md) for URL gating.
