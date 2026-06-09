# File Overview

Screen hook for `RecentlyViewedScreen`: localized labels and initial `GET /users/recent-views` fetch on mount.

**Source:** `src/features/property/hooks/useRecentlyViewedScreen.ts`

# Exports

- `useRecentlyViewedScreen`

# API Usage

- `useGetRecentViewsList` → `getRecentViewsList` → `GET /users/recent-views?page=1&pageSize=10` (`auth: true`) on mount

# Return values

| Key | i18n | Purpose |
| --- | --- | --- |
| `pageTitle` | `propertyList.recentlyViewed.pageTitle` | Page `h1` and `ComingSoonCard` title |
| `pageSubtitle` | `propertyList.recentlyViewed.pageSubtitle` | Muted subtitle under title |
| `comingSoonEyebrow` | `propertyList.recentlyViewed.comingSoonEyebrow` | `ComingSoonCard` eyebrow |
| `comingSoonDescription` | `propertyList.recentlyViewed.comingSoonDescription` | `ComingSoonCard` body |

# Dependencies

- `useTranslations("propertyList")` with `recentlyViewed.*` keys in `en`, `ar`, `es`, `fr`
- [property.service.md](../services/property.service.md) — `getRecentViewsList`
