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
| `onSocialProviderClick` | `() => void?` | When set, Google/Facebook/Apple buttons call this instead of performing OAuth |

# Actions / Inputs

## Actions

- **Account type toggle** — switches user/owner and updates `?auth=` view.
- **Google / Facebook / Apple** — invokes `onSocialProviderClick` when provided; otherwise no-op.
- **Email** — navigates to email sign-in or sign-up view for the active account type.
- **One-time code** (sign-in only) — navigates to OTP sign-in flow.

# Flow Description

Parent screens pass `onSocialProviderClick` when social OAuth is not yet wired (e.g. `SocialRegistrationScreen` opens `UpcomingFeatureModal`). Email and OTP paths navigate via `authViews` helpers as before.

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/features/auth/components/SocialAuthForm.tsx` changes.
