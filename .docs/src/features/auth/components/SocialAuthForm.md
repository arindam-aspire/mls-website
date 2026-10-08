# File Overview

Feature or shared UI component.

**Source:** `src/features/auth/components/SocialAuthForm.tsx` (Client Component)

# Responsibilities

- Feature or shared UI component.

# Imports

- `import { Button, ToggleButton } from "@/src/components/ui"`
- `import { cn } from "@/src/lib/cn"`
- `import { usePathname, useRouter } from "@/src/i18n/navigation"`

# Exports

- `SocialAuthForm`
- `SocialAccountType`
- `SocialAuthFlow`
- `SocialAuthProvider`

# State Management

_No significant state; presentational or config module._

# API Usage

_N/A unless extended._

# Navigation

- Use **`Link`**, **`useRouter`**, **`redirect`** from `@/src/i18n/navigation` for locale-prefixed paths (e.g. `/en/listing`).
- Auth modal: query `?auth=<view>` on current pathname (see `authViews.ts`).

# Props / Parameters

| Prop | Type | Purpose |
| --- | --- | --- |
| `flow` | `"signin"` \| `"signup"` | Labels and email/OTP routing |
| `accountType` | `"user"` \| `"owner"` | Toggle value and auth view resolution |
| `className` | `string?` | Optional root wrapper classes |
| `onSocialProviderClick` | `(provider) => void?` | `google`, `facebook`, or `apple` |
| `pendingProvider` | `"google"` \| `"facebook"` \| `null` | Disables the social buttons and shows the loading label on the active provider |

# Actions / Inputs

## Actions

- **Account type toggle** — switches user/owner and updates `?auth=` view.
- **Google / Facebook** — calls `onSocialProviderClick` with that provider. While `pendingProvider` is set, all three social buttons are disabled.
- **Apple** — calls `onSocialProviderClick("apple")`. The parent opens the upcoming-feature modal.
- **Email** — navigates to email sign-in or sign-up view for the active account type.
- **One-time code** (sign-in only) — navigates to OTP sign-in flow.

# Flow Description

Parent screens pass `onSocialProviderClick`. Google and Facebook start OAuth from `useSocialProviderAuth`. Apple still opens `UpcomingFeatureModal`. Email and OTP paths navigate via `authViews` helpers as before.

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/features/auth/components/SocialAuthForm.tsx` changes.
