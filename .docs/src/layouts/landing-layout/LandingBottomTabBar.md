# File Overview

Fixed bottom tab bar for landing layout on mobile and `sm` viewports.

**Source:** `src/layouts/landing-layout/LandingBottomTabBar.tsx`

Rendered from `src/layouts/landing-layout/index.tsx` below `LandingFooter`.

# Responsibilities

- Provide primary property navigation on viewports below `md` (hidden from `md` up).
- Show four tabs with icons: Buy, Rent, Sell, Off-Plan.
- Highlight the active route from `usePathname`.

# Imports

- `Link`, `usePathname` from `src/i18n/navigation`
- `useTranslations` from `next-intl`
- Lucide icons: `Home`, `KeyRound`, `Tag`, `Building2`

# Exports

- `LandingBottomTabBar`

# Navigation

- Locale-prefixed links via `Link` (`/en/buy`, etc.).
- Active when `pathname === path` or `pathname.startsWith(\`${path}/\`)`.

# Actions / Inputs

| Tab | Path | Icon |
| --- | --- | --- |
| Buy | `/buy` | Home |
| Rent | `/rent` | KeyRound |
| Sell | `/sell` | Tag |
| Off-Plan | `/off-plan` | Building2 |

# UI Details

- Fixed to bottom: `fixed inset-x-0 bottom-0 z-40`, `md:hidden`.
- Surface: `bg-page/95 backdrop-blur-md`, top border `border-secondary/15`.
- Tabs: icon + truncated label (`text-[11px] sm:text-xs`), min tap height `min-h-11`, `rounded-lg`.
- Active tab: `text-primary`; inactive: `text-muted hover:text-text`.
- Safe area: `pb-[max(0.5rem,env(safe-area-inset-bottom))]`.
- Light/dark via semantic tokens.

# Flow Description

1. User on mobile/`sm` sees tab bar pinned above the home indicator.
2. Tap tab → navigates to listing route; active state updates from pathname.
3. Desktop (`md+`) — tab bar hidden; nav remains in `LandingDesktopNav`.

# Dependencies

- Parent layout: [index.md](./index.md)
- [LandingMobileMenu.md](./LandingMobileMenu.md) — Buy/Rent/Sell/Off-Plan removed from drawer; About Us stays in menu.
- [LandingMain.md](./LandingMain.md), [LandingFooter.md](./LandingFooter.md) — bottom padding so content is not obscured.

# Notes

- Tab order: Buy → Rent → Sell → Off-Plan (per product request).
- i18n: `common.bottomTabNav` for `aria-label`; tab labels reuse `navBuy`, `navRent`, `navSell`, `navOffPlan`.
