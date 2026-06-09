# File Overview

Static config for protected sidebar sections and items.

**Source:** `src/layouts/protected-layout/protectedSidebarNav.config.ts`

# Current sections

| Section key | Items |
| --- | --- |
| `sidebarSectionMain` | Dashboard → `/dashboard` (`DASHBOARD`) |
| `sidebarSectionProperty` | Manage Listings → `/manage-listings` (`MANAGE_LISTINGS`), My Favourites → `/favourites`, My Saved Searches → `/saved-searches` (`PROFILE`) |

# Extending

Add sections to `PROTECTED_SIDEBAR_NAV_SECTIONS` with `titleKey`, `href`, `icon`, and `permission`. Add matching keys to all `common.json` locales.
