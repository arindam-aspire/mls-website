# Landing layout (`src/layouts/landing-layout/`)

Landing-specific layout shell mirroring the public layout file surface.

## Purpose

- Hold components/composition logic that should apply only to landing routes when extracted from `public-layout`.

## Files

| File | Role |
| --- | --- |
| [index.md](./index.md) | Landing layout entry component |
| [LandingHeader.md](./LandingHeader.md) | Landing header module |
| [LandingMobileMenu.md](./LandingMobileMenu.md) | Single-file mobile drawer (shell, sections, footer, pickers) |
| [LandingBottomTabBar.md](./LandingBottomTabBar.md) | Landing mobile bottom tab bar |
| [LandingMain.md](./LandingMain.md) | Landing main wrapper |
| [LandingFooter.md](./LandingFooter.md) | Landing footer module |
| [LandingDesktopNav.md](./LandingDesktopNav.md) | Landing desktop nav module |
| [LandingDesktopActions.md](./LandingDesktopActions.md) | Landing desktop actions module |
| [LandingNotificationsButton.md](./LandingNotificationsButton.md) | Shared notifications bell (mobile + desktop) |
| [LandingProfilePopover.md](./LandingProfilePopover.md) | Landing profile popover module |
| [LandingHeaderThemeButton.md](./LandingHeaderThemeButton.md) | Landing theme toggle module |

## Status

- Created as separate entry files under `landing-layout`.
- Current implementation contains full landing-owned component code (no re-export wrappers).
- Files can now be customized independently for landing-specific behavior.
