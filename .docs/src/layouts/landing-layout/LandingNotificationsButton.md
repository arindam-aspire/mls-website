# File Overview

Shared notifications bell for the landing header (mobile and desktop).

**Source:** `src/layouts/landing-layout/LandingNotificationsButton.tsx`

# Responsibilities

- Render the primary solid rounded `IconButton` with bell icon.
- Apply hero override styling when `overHero` is true.

# Exports

- `LandingNotificationsButton`
- `LandingNotificationsButtonProps`

# Props / Parameters

| Prop | Type | Purpose |
| --- | --- | --- |
| `overHero` | `boolean` | Hero header styling (`bg-surface` pill on hero) |
| `onClick` | `() => void` | Opens notifications / upcoming feature modal |

# UI Details

- `IconButton`: `color="primary"`, `variant="solid"`, `isRounded`, `size="md"`.
- Icon: `Bell` at `size-5`.
- Hero: `!bg-surface !text-inherit hover:!bg-surface/80 rounded-full`.

# Dependencies

- Used by [LandingHeader.md](./LandingHeader.md) (mobile, logged in) and [LandingProfilePopover.md](./LandingProfilePopover.md) (desktop).

# Notes

- Parent components own `UpcomingFeatureModal` state; this button is presentational + click handler only.
