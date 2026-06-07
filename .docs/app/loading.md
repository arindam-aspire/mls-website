# File Overview

Root App Router `loading.tsx` — thin re-export of the loading feature screen.

**Source:** `app/loading.tsx`

# Responsibilities

- Satisfy Next.js root `loading` boundary.
- Delegate UI to `src/features/loading/screens/index.tsx`.

# Imports

- `import LoadingScreen from "@/src/features/loading/screens"`

# Exports

- `Loading` (default, async server component wrapper)

# State Management

_No client state._

# API Usage

_N/A._

# Navigation

_N/A — global loading overlay, not a route._

# UI Details

See [loading/screens/index.md](../src/features/loading/screens/index.md): full-screen `bg-page`, MLS logos, fixed English brand/loading copy, animated dots and progress bar.

# Flow Description

1. Next.js shows this UI while a segment is loading.
2. `LoadingScreen` server component renders branded overlay.

# Dependencies

- `src/features/loading/screens/index.tsx`

# Notes

- Implementation lives in the `loading` feature; this file stays a one-line re-export.
