# File Overview

Static config for protected sidebar sections and items.

**Source:** `src/layouts/protected-layout/protectedSidebarNav.config.ts`

# Current sections

| Section key | Items |
| --- | --- |
| `sidebarSectionMain` | Dashboard → `/dashboard` (`DASHBOARD`) |
| `sidebarSectionProperty` | My Listings → `/listing`, My Favourites → `/favourites` (`PROFILE`) |

# Extending

Add sections to `PROTECTED_SIDEBAR_NAV_SECTIONS` with `titleKey`, `href`, `icon`, and `permission`. Add matching keys to all `common.json` locales.
