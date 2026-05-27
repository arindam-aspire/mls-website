# Public layout (`src/layouts/public-layout/`)

Default shell for `(main)` and `(property)` route groups.

## Structure

```
PublicLayout (index.tsx)
├── PublicHeader
│   ├── DesktopNav
│   ├── DesktopActions (theme, locale, sign-in / profile)
│   └── ProfilePopover (when authenticated)
├── AuthModal (Suspense)
├── PublicMain (children)
└── PublicFooter
```

## Files

| File | Role |
| --- | --- |
| [index.md](./index.md) | Composes header, modal, main, footer |
| [PublicHeader.md](./PublicHeader.md) | Sticky header, mobile menu, auth entry |
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

Header nav pushes `/buy`, `/rent`, … (not all implemented as pages yet).
