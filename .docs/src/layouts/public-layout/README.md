# Public layout (`src/layouts/public-layout/`)

Default shell for `(main)` and `(property)` route groups. Mobile UX mirrors [landing-layout](../landing-layout/README.md).

## Structure

```
PublicLayout (index.tsx)
├── PublicHeader
│   ├── DesktopNav
│   ├── DesktopActions (theme, locale, sign-in / profile)
│   └── ProfilePopover (when authenticated)
├── PublicMobileMenu (slide drawer, single file)
├── AuthModal (Suspense)
├── PublicMain (children)
├── PublicFooter
└── PublicBottomTabBar (< md)
```

## Files

| File | Role |
| --- | --- |
| [index.md](./index.md) | Composes header, modal, main, footer, bottom tabs |
| [PublicHeader.md](./PublicHeader.md) | Sticky header, mobile drawer trigger |
| [PublicMobileMenu.md](./PublicMobileMenu.md) | Single-file slide drawer (sections + footer) |
| [PublicBottomTabBar.md](./PublicBottomTabBar.md) | Buy / Rent / Sell / Off-Plan tabs |
| [PublicNotificationsButton.md](./PublicNotificationsButton.md) | Shared bell (mobile header + desktop profile row) |
| [PublicMain.md](./PublicMain.md) | Main content flex wrapper |
| [PublicFooter.md](./PublicFooter.md) | Footer links/copy |
| [DesktopNav.md](./DesktopNav.md) | Buy/rent/off-plan/sell/about |
| [DesktopActions.md](./DesktopActions.md) | Theme, locale, profile CTA |
| [ProfilePopover.md](./ProfilePopover.md) | Avatar menu, logout, property links |
| [PublicHeaderThemeButton.md](./PublicHeaderThemeButton.md) | Light/dark toggle |

## Auth modal

`AuthModal` requires `Suspense` because it uses `useSearchParams`.

## Navigation paths

Profile menu → `/en/my-profile`, `/en/listing`, `/en/favourites`, etc. (locale from router).

Buy/Rent/Sell/Off-Plan on mobile: bottom tab bar; drawer holds account, general, preferences.
