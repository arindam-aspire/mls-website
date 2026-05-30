# Typography (`src/lib/typography.ts`)

Central text-size tokens for the app. Mobile-first: compact below `sm`, full scale from `sm` up.

**Source:** `src/lib/typography.ts`

## Control text

| Export | Use |
| --- | --- |
| `controlTextClasses` | Buttons, inputs, selects, toggles (`sm` / `md` / `lg` tiers) |
| `fieldLabelSizeClasses` | Form labels |
| `fieldErrorSizeClasses` | Field errors |
| `fieldHintSizeClasses` | Field hints |
| `textDropdownPanelClasses` | Dropdown panel body text |
| `textDropdownOptionClasses` | Dropdown option text |

## Body & headings

| Export | Scale |
| --- | --- |
| `bodyTextClasses` | `text-xs sm:text-sm` |
| `bodySmallTextClasses` | `text-[11px] sm:text-sm` |
| `bodyLargeTextClasses` | `text-sm sm:text-base` |
| `headingPageClasses` | `text-lg sm:text-xl` |
| `headingAuthClasses` | `text-xl sm:text-2xl` |
| `headingSectionClasses` | `text-base sm:text-lg` |

## Semantic component tokens

| Export | Used by |
| --- | --- |
| `modalTitleClasses`, `modalDescriptionClasses` | `ui/modal` |
| `cardTitleClasses`, `cardDescriptionClasses` | `ui/card` |
| `popoverTitleClasses`, `popoverPanelTextClasses` | `ui/popover` |
| `toastTitleClasses`, `toastDescriptionClasses` | `ui/toaster` |
| `avatarSizeTextClasses` | `ui/avatar` |
| `overlineLabelClasses`, `currencyBadgeTextClasses`, `checkboxLabelClasses` | search/filter controls |
| `otpDigitTextClasses` | OTP code inputs |
| `authBadgeClasses`, `authFormOverlineClasses`, `authFormTextClasses` | auth screens/forms |

## Navigation & layout

| Export | Used by |
| --- | --- |
| `navBrandClasses`, `navMenuItemClasses`, `navDesktopLinkClasses`, `navDrawerLinkClasses` | landing/public headers & nav |
| `themeToggleLabelClasses` | theme toggle label |
| `profileNameClasses`, `profileEmailClasses` | profile popovers |
| `footerLinkTextClasses`, `footerMutedTextClasses`, `appStoreBadgeSmallClasses`, `appStoreBadgeLabelClasses` | site footers |

## Display / marketing

Larger bespoke scale (kept intentionally bigger than body), centralized so marketing surfaces stay consistent:

| Export | Scale |
| --- | --- |
| `displayHeadingClasses` | `font-serif text-3xl sm:text-4xl lg:text-5xl` |
| `displayEyebrowClasses` | `text-xs sm:text-sm` uppercase, tracked |
| `displayLeadClasses` | `text-base sm:text-lg` |
| `displayCaptionClasses` | `text-xs sm:text-sm` tracked |
| `displayModalTitleClasses` | `font-serif text-2xl sm:text-3xl` |
| `notFoundCodeClasses` | `text-4xl sm:text-5xl` |
| `landingHeroTitleClasses` | `font-serif text-4xl sm:text-5xl lg:text-6xl` |
| `landingHeroEyebrowClasses`, `landingHeroTaglineClasses` | hero eyebrow / tagline |
| `comingSoon*`, `notFound*`, `landingSection*`, `hero*` | aliases mapping to the display tokens above |

Consumers: `ComingSoonCard`, `UpcomingFeatureModal`, `DetailsSection`, `HeroSection`, `NotFoundScreen`.

Re-exported through [responsiveSizes.md](../components/ui/responsiveSizes.md) where combined with control heights. UI shells (modal, card, toast, popover) and feature screens import semantic tokens directly from `@/src/lib/typography`.

## Notes

- Edit typography here for app-wide text density; edit `responsiveSizes.ts` for control heights/padding only.
- Display/marketing copy (large serif headings, hero, 404 code) uses dedicated display tokens rather than the compact body scale, so it stays large but still centralized.
