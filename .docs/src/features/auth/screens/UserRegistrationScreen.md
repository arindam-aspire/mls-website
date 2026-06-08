# File Overview

Route-level screen component composing feature UI.

**Source:** `src/features/auth/screens/UserRegistrationScreen.tsx` (Client Component)

# Responsibilities

- Route-level screen component composing feature UI.

# Imports

- `import { usePathname, useRouter } from "@/src/i18n/navigation"`
- `import { AUTH_QUERY_KEY, AUTH_VIEW, buildAuthModalUrl } from "@/src/features/auth/authViews"`
- `import { AuthModalHeader } from "../components/AuthModalHeader"`
- `import { SignUpForm } from "../components/SignUpForm"`
- `import type { SocialAccountType } from "../components/SocialAuthForm"`
- `import type { SignUpFormValues } from "../types/auth.types"`
- `import { useSignUp } from "../mutations/auth.mutation"`
- `import { useAuthStore } from "../store/auth.store"`

# Exports

- `UserRegistrationScreen`

# State Management

- **Zustand** `useAuthStore`

# API Usage

- `useUserRegistrationScreen` → `POST /auth/signup` via `useSignUp` with `role` from account type (`user` → `registered_user`, `owner` → `owner`).

# Navigation

- Use **`Link`**, **`useRouter`**, **`redirect`** from `@/src/i18n/navigation` for locale-prefixed paths (e.g. `/en/listing`).
- Auth modal: query `?auth=<view>` on current pathname (see `authViews.ts`).

# Props / Parameters

- See component/handler props in source (TypeScript interfaces).

# Actions / Inputs

## Inputs

_No explicit inputs detected._

## Actions

_No explicit actions detected._

## Validations

_No explicit validations detected._

## Show/Hide Controls

_No explicit show/hide controls detected._

# UI Details

- **Theme:** semantic tokens (`bg-page`, `bg-surface`, `text-text`, `text-muted`, `bg-primary`, `border-secondary/15`).
- **Light/dark:** via `ThemeProvider` / `html.light` | `html.dark`.
- **Radius:** `rounded-lg` controls; `rounded-xl` cards/modals/popovers; `rounded-full` avatars/pills.
- **Responsive:** mobile-first (`sm:`, `md:`, `lg:`).
- Uses **`Modal`** from UI kit (`rounded-xl`).

# Flow Description

See source in `src/features/auth/screens/UserRegistrationScreen.tsx` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/features/auth/screens/UserRegistrationScreen.tsx` changes.
