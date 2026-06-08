# MLS Website — Application Reference

Complete reference for the **Multiple Listing Service (MLS)** web application: architecture, routes, features, APIs, auth, UI conventions, and project conventions.

> **Related docs:** [README.md](./README.md) (doc index) · [folder-structure.md](./folder-structure.md) · [packages.md](./packages.md)

### Mirrored file-level documentation

Every `src/` and `app/` source file has (or should have) a matching doc under `.docs/`:

`src/features/auth/components/SignInForm.tsx` → `.docs/src/features/auth/components/SignInForm.md`

Folder **README.md** files describe architecture per module. Update mirrored docs by hand when source changes. Rule: `.cursor/rules/docs-sync.mdc`.

---

## Table of contents

1. [Overview](#overview)
2. [Tech stack](#tech-stack)
3. [Getting started](#getting-started)
4. [Architecture](#architecture)
5. [Internationalization (i18n)](#internationalization-i18n)
6. [Routing](#routing)
7. [Layouts](#layouts)
8. [Features](#features)
9. [Authentication](#authentication)
10. [API layer](#api-layer)
11. [State management](#state-management)
12. [Providers](#providers)
13. [UI system](#ui-system)
14. [Shared components](#shared-components)
15. [Hooks & utilities](#hooks--utilities)
16. [Environment configuration](#environment-configuration)
17. [Naming conventions](#naming-conventions)
18. [Cursor / workspace rules](#cursor--workspace-rules)

---

## Overview

| Item | Value |
| --- | --- |
| **Project name** | `mls_website` |
| **Purpose** | Public MLS platform: property search, listings, user accounts (buyers, owners, agencies), and authenticated user areas |
| **Framework** | Next.js 16 (App Router) |
| **UI** | React 19, Tailwind CSS v4, Headless UI |
| **Package manager** | npm |

The app is **locale-first**: every user-facing URL includes a locale segment (`/en`, `/ar`, `/es`, `/fr`). The root `/` redirects to `/en`.

---

## Tech stack

| Area | Libraries |
| --- | --- |
| Framework | Next.js 16.2.6, React 19.2.4 |
| Styling | Tailwind CSS 4, `tailwindcss-animate` |
| i18n | next-intl 4.12 |
| Server state | TanStack React Query 5 |
| Client state | Zustand 5 |
| HTTP | Axios 1.16 |
| Cookies | js-cookie |
| UI primitives | @headlessui/react |
| Icons | lucide-react |

See [packages.md](./packages.md) for the full dependency table.

---

## Getting started

**Private package:** `@abdoun/abdoun-library` comes from Azure Artifacts (see root [`.npmrc`](../.npmrc)). Public packages still use `registry.npmjs.org`. CI uses `npmAuthenticate@0` in `azure-pipelines.yml`.

**If `npm install` fails with `E401`:** credentials are missing or expired in your **user** npmrc, not in the repo.

1. Remove any old Verdaccio lines from `%USERPROFILE%\.npmrc` (e.g. `registry=http://localhost:4873/` or `//localhost:4873/` tokens).
2. Azure DevOps → **User settings** → **Personal access tokens** → **New Token** → scope **Packaging → Read**.
3. Add auth to `%USERPROFILE%\.npmrc` using the template in [`.npmrc.user.example`](../.npmrc.user.example) (base64-encode the PAT only; username `VssSessionToken`).
4. Or, from the repo root after installing the tool once: `npx vsts-npm-auth -config .npmrc -F` (refreshes tokens in your user npmrc).

Then run `npm install` again.

```bash
npm install
npm run dev    # http://localhost:3000 → redirects to /en
npm run build
npm run start
npm run lint
```

**Environment variable (API):**

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL (defaults to dev API in `environment.config.ts`) |

---

## Architecture

```
app/                    Next.js App Router (pages, layouts)
src/
  apis/                 HTTP clients, interceptors, endpoints
  components/           ui/ (design system), common/ (app-wide)
  configs/              environment
  features/             Domain modules (auth, landing, property, …)
  hooks/                Shared React hooks
  i18n/                 next-intl routing & navigation
  initializers/         App bootstrapping (navigation ref)
  layouts/              public-layout, protected-layout
  lib/auth/             Roles, permissions map, useAuthorize hook
  messages/             Translation JSON per locale
  providers/            React context providers
  types/                Shared TypeScript types
  utils/                Helpers (navigation, …)
proxy.ts                next-intl + cookie guard for protected paths
```

**Data flow (typical feature):**

1. **Screen** (`src/features/<name>/screens/`) — page-level UI  
2. **Components** — feature-specific UI  
3. **Query / mutation** — React Query (`query/`, `mutations/`)  
4. **Service** — calls `authClient` or `apiClient`  
5. **Endpoints** — path constants in `src/apis/endpoints/`

---

## Internationalization (i18n)

| Setting | Value |
| --- | --- |
| **Locales** | `en`, `ar`, `es`, `fr` |
| **Default locale** | `en` |
| **Locale prefix** | `always` (e.g. `/en/dashboard`) |
| **Locale detection** | disabled |
| **RTL** | `ar` only (`isRtlLocale`) |

**Config files:**

- `src/i18n/routing.ts` — locale list and routing config  
- `src/i18n/request.ts` — loads messages per locale  
- `src/i18n/navigation.ts` — `Link`, `useRouter`, `usePathname`, `redirect`, `getPathname`

**Messages:** `src/messages/<locale>/`

| File | Namespace (typical use) |
| --- | --- |
| `auth.json` | Auth modal, forms |
| `common.json` | Header, footer, profile menu, nav, `backHome` |
| `home.json` | Landing / hero |
| `notFound.json` | 404 page (`eyebrow`, `title`, `description`, `backHome`) |
| `profile.json` | Profile page (`pageTitle`, field labels, roles, verification) |
| `unauthorized.json` | 401 page (`eyebrow`, `title`, `description`, `backHome`) |
| `index.ts` | Re-exports namespaces |

**Usage in components:**

```tsx
import { useTranslations } from "next-intl";
const t = useTranslations("common");
```

**Navigation (locale-aware):**

```tsx
import { Link, useRouter } from "@/src/i18n/navigation";
router.push("/listing");
router.replace("/");
```

---

## Routing

### Root

| Path | File | Behavior |
| --- | --- | --- |
| `/` | `app/page.tsx` | Redirects to `/en` |
| `/[locale]/...` | `app/[locale]/layout.tsx` | Wraps with `NextIntlClientProvider` |

### Route groups under `app/[locale]/`

Route groups `(landing)`, `(main)`, `(property)`, `(auth)`, `(public)` do **not** appear in the URL.

| Group | Layout | Purpose |
| --- | --- | --- |
| `(landing)` | `LandingLayout` | Locale root landing page |
| `(main)` | `ProtectedLayout` | Dashboard, my-profile, saved-searches, favourites |
| `(property)` | `PublicLayout` | User property-related pages |
| `(auth)` | *(empty — reserved)* | Future auth routes |
| `(public)` | *(empty — reserved)* | Future public routes |
| `(system)` | `PublicLayout` on unauthorized | Unauthorized / system pages |

### Implemented pages

All paths below are **without** locale; prepend `/<locale>` (e.g. `/en/listing`).

| URL path | App route file | Screen / component |
| --- | --- | --- |
| `/` | `(landing)/page.tsx` | `LandingScreen` |
| `/dashboard` | `(main)/dashboard/page.tsx` | `DashboardScreen` — guarded by `useAuthorize("DASHBOARD")` |
| `/my-profile` | `(main)/my-profile/page.tsx` | `ProfileScreen` — guarded by `useAuthorize("PROFILE")` |
| `/saved-searches` | `(main)/saved-searches/page.tsx` | `SavedSearchScreen` — guarded by `useAuthorize("PROFILE")` |
| `/favourites` | `(main)/favourites/page.tsx` | `FavouritePropertyScreen` — guarded by `useAuthorize("PROFILE")` |
| `/listing` | `(property)/listing/page.tsx` | `ListingPropertyScreen` (Coming Soon) |
| `/property-list` | `(property)/property-list/page.tsx` | `PropertyListScreen` (`PropertyCardList`) |
| `/propert-details/:id` | `(property)/propert-details/[id]/page.tsx` | `PropertyDetailsScreen` (`PropertyView`) |
| `/recently-viewed` | `(property)/recently-viewed/page.tsx` | `RecentlyViewedScreen` (Coming Soon) |
| `/inquiries` | `(property)/inquiries/page.tsx` | `InquiriesScreen` (Coming Soon) |
| `/unauthorized` | `(system)/unauthorized/page.tsx` | `UnauthorizedScreen` |

### Header navigation (not yet implemented as routes)

Defined in `DesktopNav` / mobile menu — `router.push` only:

| Path | Label key |
| --- | --- |
| `/buy` | `navBuy` |
| `/rent` | `navRent` |
| `/off-plan` | `navOffPlan` |
| `/sell` | `navSell` |
| `/about-us` | `navAboutUs` |

### Catch-all & errors

| Path | File | Screen |
| --- | --- | --- |
| `/[...rest]` | `[locale]/[...rest]/page.tsx` | Catch-all |
| 404 | `[locale]/not-found.tsx` | `NotFoundScreen` |
| 401 | `[locale]/(system)/unauthorized/page.tsx` | `UnauthorizedScreen` |

### Profile popover → routes

Defined in `ProfilePopover.tsx` (`PROFILE_MENU_ITEMS`):

| Menu label (i18n key) | Path |
| --- | --- |
| `profile` | `/my-profile` |
| `myListings` | `/listing` |
| `myFavourites` | `/favourites` |
| `mySavedSearches` | `/saved-searches` |
| `myRecentlyViewed` | `/recently-viewed` |
| `myInquiries` | `/inquiries` |

Uses `UiLink` + `router.push(path)` and `useClose()` to dismiss the popover.

---

## Layouts

### Root — `app/layout.tsx`

- Fonts: Geist Sans, Geist Mono, Tajawal (Arabic)  
- Providers: `QueryProvider` → `ThemeProvider` → `ToastProvider` → `AuthProvider`  
- `NavigationInitializer` — registers Next.js `useRouter` for imperative navigation  
- `html` `lang` / `dir` from locale; body uses semantic theme classes  

### Locale — `app/[locale]/layout.tsx`

- Validates locale, `setRequestLocale`, loads messages into `NextIntlClientProvider`

### Public layout — `src/layouts/public-layout/`

Used by `(property)` route group.

| File | Role |
| --- | --- |
| `index.tsx` | Shell: header, `AuthModal`, main, footer |
| `PublicHeader.tsx` | Logo, nav, locale, theme, sign-in / profile |
| `DesktopNav.tsx` | Desktop nav links |
| `DesktopActions.tsx` | Theme, locale select, profile or sign-in |
| `ProfilePopover.tsx` | Avatar menu, logout, profile links |
| `PublicHeaderThemeButton.tsx` | Light/dark toggle |
| `PublicFooter.tsx` | Footer |
| `PublicMain.tsx` | Main content wrapper; property list bypasses outer container for sticky filters |

### Landing layout — `src/layouts/landing-layout/`

Used by `(landing)` route group.

| File | Role |
| --- | --- |
| `index.tsx` | Shell: landing header, `AuthModal`, main, footer |
| `LandingHeader.tsx` | Landing-prefixed header module |
| `LandingDesktopNav.tsx` | Landing-prefixed desktop nav module |
| `LandingDesktopActions.tsx` | Landing-prefixed desktop actions module |
| `LandingProfilePopover.tsx` | Landing-prefixed profile popover module |
| `LandingHeaderThemeButton.tsx` | Landing-prefixed theme toggle module |
| `LandingFooter.tsx` | Landing-prefixed footer module |
| `LandingMain.tsx` | Landing-prefixed main content wrapper |

### Protected layout — `src/layouts/protected-layout/`

Used by `(main)` route group.

---

## Features

### `auth`

**Purpose:** Sign-in, sign-up, OTP, forgot/reset password, agency flows — all via **URL-driven modal** on the current page.

| Area | Location |
| --- | --- |
| Views & query helpers | `authViews.ts` |
| Types | `types/` — `signUp`, `signIn`, `signInOtp`, `forgotPassword`, `chooseAccount`, `user`, `logout` modules; barrel `index.ts` / `auth.types.ts` |
| Hooks | `hooks/` — one `use*Screen` per screen; `useChooseAccountForm`; `useAuthPortal`; `authScreen.utils.ts` |
| Store | `store/auth.store.ts` |
| Service | `services/auth.service.ts` |
| Mutations | `mutations/auth.mutation.ts` |
| Modal shell | `components/AuthModal.tsx` |

**Screens:**

| Screen | Auth view constant |
| --- | --- |
| `AccountChooseScreen` | `choose-account` |
| `SocialSignInScreen` | `user-social-sign-in`, `owner-social-sign-in` |
| `SocialRegistrationScreen` | `user-social-sign-up`, `owner-social-sign-up` |
| `SignInScreen` | `user-sign-in`, `owner-sign-in` |
| `UserRegistrationScreen` | `user-sign-up`, `owner-sign-up` |
| `AgencySignInScreen` | `agency-sign-in` |
| `AgencyRegistrationScreen` | `agency-sign-up` |
| `AgencyEmailSignInScreen` | `agency-email-sign-in` |
| `ForgotPasswordScreen` | `forgot-password` |
| `ResetPasswordScreen` | `reset-password` |
| `SignInWithOTPScreen` | `signin-otp` |
| `OTPVerificationScreen` | `otp-verify` |
| `ConfirmSignUpScreen` | `confirm-sign-up` |

**Forms / UI:** `SignInForm`, `SignUpForm`, `SignInWithOTPForm`, `OTPVerificationForm`, `ForgotPasswordForm`, `ResetPasswordForm`, `ChooseAccountForm`, `AccountTypeCard`, `SocialAuthForm`, `AgencyAuthForm`, `AgencySignUpForm`, `AuthModalHeader`, `OtpVerificationTitle`.

**Screens** compose modal UI only; business logic lives in matching hooks under `hooks/` (see [hooks/README.md](./src/features/auth/hooks/README.md)). Full screen-switching flow: [auth-screen-flow.md](./src/features/auth/auth-screen-flow.md).

**Account types:** `user`, `owner`, `agency` (and `agent` in resolver — limited support).

---

### `landing`

**Purpose:** Home page hero, search bar, property taxonomy, marketing copy.

| File | Role |
| --- | --- |
| `screens/LandingScreen.tsx` | Composes hero + details |
| `components/HeroSection.tsx` | Full-screen hero with search |
| `components/HeroSearchBar.tsx` | Search UI |
| `components/DetailsSection.tsx` | “Why MLS” section |
| `mutations/landing.mutation.ts` | `useGetPropertyTaxonomy` |
| `services/landing.service.ts` | Fetches taxonomy API |
| `types/propertyTaxonomy.types.ts` | Taxonomy types |

---

### `property`

**Purpose:** Property listing, details, favourites, saved searches, etc.

| Screen | Status |
| --- | --- |
| `PropertyListScreen` | Stub |
| `PropertyDetailsScreen` | Property detail (`PropertyView`, `/propert-details/:id`) |
| `ListingPropertyScreen` | Coming Soon |
| `FavouritePropertyScreen` | Favourites list (`GET /favorites`, `PropertyCardList`) |
| `RecentlyViewedScreen` | Coming Soon |
| `InquiriesScreen` | Coming Soon |

`components/`, `hooks/` — reserved. `mutations/property.mutation.ts` — `useGetPropertyList`. `services/property.service.ts` — `getPropertyList`. `store/property.store.ts` — property list filters/response state. `types/property.types.ts` — list params/response for `/properties`.

---

### `profile`

| File | Role |
| --- | --- |
| `screens/ProfileScreen.tsx` | `ProfileScreen` — toolbar, profile card, change password, separate edit email/phone modals |
| `services/profile.service.ts` | `PATCH /auth/me/profile/request` + `POST /auth/me/profile/verify` (email/phone OTP); `POST` / `DELETE /auth/me/profile-picture`; `GET` / `PUT /agency/{id}`; `POST` / `DELETE /agency/{id}/logo`; `POST /agency/{id}/legal-document`; `PATCH /auth/me` (legacy combined update) |
| `hooks/useProfileAvatarUpload.ts` | File picker, validation, `useUploadProfilePicture` |
| `screens/EditEmailModal.tsx` | Two-step email change: request OTP → confirm |
| `screens/EditPhoneModal.tsx` | Two-step phone change: request OTP → confirm (E.164 `phone_number`) |

---

### `dashboard`

| File | Role |
| --- | --- |
| `screens/index.tsx` | `DashboardScreen` — Coming Soon |

---

### `not-found`

| File | Role |
| --- | --- |
| `screens/NotFoundScreen.tsx` | 404 UI (ComingSoon-style layout, `SearchX` icon, danger badge, `notFound` i18n) |

---

### `unauthorized`

| File | Role |
| --- | --- |
| `screens/UnauthorizedScreen.tsx` | 401 UI (ComingSoon-style layout, `ShieldAlert` icon, tertiary badge, `unauthorized` i18n) |

---

### `loading`

| File | Role |
| --- | --- |
| `screens/index.tsx` | Root App Router loading screen (re-exported by `app/loading.tsx`) |

---

## Authentication

### Opening the auth modal

Auth modal state is **not** in the URL. `useAuthStore` (Zustand) owns modal visibility, a `screenStack` for navigation, and transient flow data persisted in `sessionStorage` (`auth_transient`).

Header / layout CTAs open auth with:

```ts
useAuthStore.getState().openAuth(AUTH_VIEW.chooseAccount);
```

`AuthModal` (in `PublicLayout` / `LandingLayout`) reads `isOpen` and the top of `screenStack` to render the active screen. See `.docs/src/features/auth/auth-screen-flow.md`.

### Token storage

- `src/apis/core/token.store.ts` — access/refresh tokens (cookies via js-cookie)  
- `AuthProvider` — on load, if access token exists and no user, calls `GET /auth/me`  
- On failure → `clearAuth()`

### Auth store (`auth.store.ts`)

Combines **logged-in session** and **modal flow** state.

| State | Purpose |
| --- | --- |
| `user` | Logged-in user profile |
| `access_token`, `refresh_token` | In-memory mirror of tokens |
| `isLoadingUser` | Profile fetch loading |
| `isOpen`, `screenStack` | Modal open + navigation stack |
| `agentPortal`, `otpFlow` | Agent portal badge; OTP flow kind |
| `pendingEmail`, `pendingPhone`, `pendingPhoneCountry` | OTP / forgot-password contact |
| `otpSession`, `otpCode` | OTP session handoff |
| `pendingSignUp`, `pendingAgencySignUp` | Registration confirm step |

| Actions | Purpose |
| --- | --- |
| `setAuth`, `setUser`, `clearAuth` | Session lifecycle (logout) |
| `openAuth`, `closeAuth`, `push`, `pop` | Modal navigation |
| `setPendingEmail`, `setOtpSession`, etc. | Transient flow data (+ sessionStorage) |

Session persistence helpers: `src/features/auth/store/authModalStorage.ts`.

### Logout

1. `POST /auth/logout` (authenticated)  
2. `clearAuth()` in `useLogout` `onSuccess`  
3. `navigateTo(\`/${locale}\`)` via `navigation.utils` (Next.js router registered in `NavigationInitializer`)

**Note:** `ProfilePopover` unmounts when `user` is cleared; do not rely on effects in that component for post-logout navigation.

### Client route guards (`src/lib/auth/`)

| Module | Role |
| --- | --- |
| `roles.ts` | `UserRole` enum — API names: `admin`, `agent`, `owner`, `registered_user` |
| `permissions.ts` | `PERMISSIONS` map: `PROFILE`, `DASHBOARD` → allowed roles |
| `authorize.ts` | `useAuthorize(permission)` — client hook used by `(main)` pages |

**`PERMISSIONS` (current):**

| Key | Allowed roles |
| --- | --- |
| `PROFILE` | agency, agent, owner, user |
| `DASHBOARD` | agency, agent, owner |

**`useAuthorize` behavior:**

1. Waits while `isLoadingUser` is true (`AuthProvider` hydrating `/auth/me`).
2. No `user` → `router.replace("/")`.
3. User lacks permission → `router.replace("/unauthorized")`.
4. Returns `{ user }` for guarded pages; pages typically `if (!user) return null`.

**Protected pages:** `app/[locale]/(main)/dashboard/page.tsx`, `app/[locale]/(main)/my-profile/page.tsx`.

### React Query mutations (`auth.mutation.ts`)

| Hook | API |
| --- | --- |
| `useSignInWithPassword` | Login + fetch user |
| `useLogout` | Logout + clear + redirect home |
| `useSignUp` | Register |
| `useConfirmSignUp` | Verify signup OTP |
| `useSignInWithOtpRequest` | Request login OTP |
| `useSignInWithOtpVerify` | Verify login OTP |
| `useForgotPassword` | Forgot password request |
| `useChangePassword` | Authenticated password change (`/auth/change-password`) |

---

## API layer

### Base URL

From `src/configs/environment.config.ts` → `API_BASE_URL` (env: `NEXT_PUBLIC_API_BASE_URL`).

### Clients

| Client | Default `auth` on requests |
| --- | --- |
| `authClient` | `false` (opt-in per call) |
| `apiClient` | `true` |

### Interceptors (`axios.interceptor.ts`)

- **Request:** Adds `Authorization: Bearer <access>` when `auth: true`; redirects to `/` if tokens missing  
- **Response:** On `401`, attempts refresh; on failure → `navigateTo('/')`

### Endpoints

**Auth** (`authEndpoints.ts`):

| Constant | Method | Path |
| --- | --- | --- |
| `SIGN_IN_WITH_PASSWORD` | POST | `/auth/login/password` |
| `SIGN_IN_WITH_OTP` | POST | `/auth/login/otp/request` |
| `SIGN_IN_WITH_OTP_VERIFY` | POST | `/auth/login/otp/verify` |
| `LOGGED_IN_USER` | GET | `/auth/me` |
| `FORGOT_PASSWORD` | POST | `/auth/forgot-password/request` |
| `FORGOT_PASSWORD_CONFIRM` | POST | `/auth/forgot-password/confirm` — `{ email, code, new_password }` |
| `CHANGE_PASSWORD` | POST | `/auth/change-password` — `{ password, previous_password }` (auth required) |
| `REFRESH` | POST | `/auth/refresh` |
| `LOGOUT` | POST | `/auth/logout` |
| `USER_SIGN_UP` | POST | `/auth/signup` — `{ full_name, email, phone_number, password, role }` (`registered_user` or `owner`) |
| `CONFIRM_SIGN_UP_OTP` | POST | `/auth/confirm-signup` |

**Public** (`publicEndpoints.ts`):

| Constant | Path |
| --- | --- |
| `CATEGORY_PROPERTY_LIST` | `/property-taxonomy` |
| `LOCATION_TAXONOMY` | `/location-taxonomy` |

**Property** (`propertyEndpoints.ts`):

| Constant | Path |
| --- | --- |
| `PROPERTY_LIST` | `/properties` — query may include `city`, `locations` (names from location taxonomy), plus existing filters |
| `FAVORITE_LIST` | `/favorites` — `page`, `pageSize` (auth required) |
| `FAVORITE_REMOVE` | `/favorites/:propertyHash` — DELETE (auth required) |

Types: `src/features/property/types/property.types.ts` (`Property`, `PropertyListResponse`, …).

### Images (remote)

Allowed host in `next.config.ts`: `abdoun-dev-assets-usw2.s3.amazonaws.com`

---

## State management

| Layer | Tool | Usage |
| --- | --- | --- |
| Server/async | TanStack Query | Auth mutations, landing taxonomy |
| Client global | Zustand | `auth.store` |
| Theme | React Context | `ThemeProvider` |
| Toasts | React Context | `ToastProvider` / `useToast` |

`ReduxProvider` and `SocketProvider` exist in `src/providers/` but are not mounted in root layout currently.

---

## Providers

| Provider | File | Role |
| --- | --- | --- |
| `QueryProvider` | `QueryProvider.tsx` | React Query client |
| `ThemeProvider` | `ThemeProvider.tsx` | `light` / `dark` on `<html>`, localStorage `mls-theme` |
| `ToastProvider` | `ToastProvider.tsx` | Toast notifications |
| `AuthProvider` | `AuthProvider.tsx` | Hydrate user from token |

---

## UI system

### Theme tokens (`app/globals.css`)

Semantic Tailwind colors — use these, not raw grays:

| Token | Usage |
| --- | --- |
| `bg-page`, `bg-surface` | Page / card surfaces |
| `text-text`, `text-muted` | Body / secondary text |
| `bg-primary`, `text-primary-dark`, `bg-primary-light` | Brand green |
| `bg-secondary`, `text-secondary-dark`, … | Brand teal |
| `bg-tertiary`, … | Accent yellow |
| `bg-success`, `bg-danger`, `bg-info` | Status |
| `text-hero-on-image` | White text on hero image |

`html` has `.light` or `.dark` (also system preference when no explicit class).

### Responsive control sizing

Shared tokens in `src/components/ui/responsiveSizes.ts`: controls use **three viewport steps** — moderate default (< 640px), standard (`sm:` ≥ 640px), roomy (`lg:` ≥ 1024px). This is separate from the component `size="sm" | "md" | "lg"` prop.

### Border radius (project rule)

| Class | Use for |
| --- | --- |
| `rounded-xl` | Cards, modals, popover panels |
| `rounded-lg` | Buttons, inputs, selects, chips |
| `rounded-full` | Icon-only pills, avatars |

### UI components (`src/components/ui/`)

Exported from `src/components/ui/index.tsx`:

| Component | Notes |
| --- | --- |
| `Avatar` | User image / initials |
| `Button`, `IconButton`, `ToggleButton`, `ButtonGroup` | Actions |
| `Card`, `CardHeader`, `CardTitle`, … | Content containers |
| `Modal`, `ModalBackdrop`, `ModalPanel`, … | Dialogs |
| `Popover`, `PopoverButton`, `PopoverPanel`, … | Headless UI wrappers |
| `Link` | Styled **button** (not anchor) — use with `onClick` or wrap navigation |
| `Input`, `Textarea`, `PhoneInput`, `Select`, `SelectDropdown` | Forms |
| `Skeleton` | Loading placeholders |
| `Toaster` | Toast UI |

Shared field styles: `fieldVariants.ts`.

### `cn` helper

`src/lib/cn.ts` — joins class names (filters falsy values).

---

## Shared components

| Component | Path | Purpose |
| --- | --- | --- |
| `ComingSoonCard` | `common/ComingSoonCard.tsx` | Placeholder pages (MLS-styled: serif title, eyebrow, accent bar) |
| `ConfirmModal` | `common/ConfirmModal.tsx` | Confirm/cancel dialog (logout, etc.) |
| `UpcomingFeatureModal` | `common/UpcomingFeatureModal.tsx` | Modal for upcoming feature actions (Advance/Save Search, etc.) |
| `PasswordStrengthIndicator` | `common/PasswordStrengthIndicator.tsx` | Sign-up, agency sign-up, and reset-password strength |

### Coming Soon pages (current)

All use `ComingSoonCard` with custom `title` / `description`:

- Dashboard, Profile, Listing, Favourites, Saved Searches, Recently Viewed, Inquiries

---

## Hooks & utilities

| Hook / util | Location | Purpose |
| --- | --- | --- |
| `useForm` | `hooks/useForm.ts` | Form state helper |
| `useToast` | `hooks/useToast.tsx` | Show toasts |
| `navigateTo`, `navigateReplace`, `navigateBack` | `utils/navigation.utils.ts` | Imperative nav (uses router from `NavigationInitializer`) |
| `initializeNavigation` | Same | Called once at app boot |

**Important:** `NavigationInitializer` uses `useRouter` from `next/navigation`, while feature code should prefer `useRouter` from `@/src/i18n/navigation` for locale-aware paths.

---

## Environment configuration

`src/configs/environment.config.ts`:

| Export | Description |
| --- | --- |
| `getEnvironmentConfig()` | Returns `baseUrl` + `environment` |
| `API_BASE_URL` | Used by Axios factory |

Default API: `https://dev-api-abdn.wpsitedesigner.com/api/v1`

---

## Naming conventions

| Kind | Convention | Example |
| --- | --- | --- |
| Components | PascalCase file = export name | `UserCard.tsx` → `UserCard` |
| Screens | `*Screen.tsx` | `LandingScreen.tsx` |
| Hooks | `use*.ts` | `useAuth.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Types module | `*.types.ts` | `auth.types.ts` |
| Next.js routes | `page.tsx`, `layout.tsx` | Fixed by framework |

Path alias: `@/` → project root (see `tsconfig.json`).

---

## Cursor / workspace rules

Enforced via `.cursor/rules/`:

| Rule | Summary |
| --- | --- |
| `ui-border-radius.mdc` | `rounded-xl` for cards/modals/popovers; `rounded-lg` for controls |
| `responsive-design.mdc` | Mobile-first, responsive layouts |
| `light-dark-theme.mdc` | Semantic color tokens only |
| `nextjs-naming-conventions.mdc` | File naming as above |
| `folder-structure-sync.mdc` | Update `.docs/folder-structure.md` when tree changes |
| `packages-docs-sync.mdc` | Update `.docs/packages.md` when `package.json` changes |

---

## Middleware (`proxy.ts`)

Exports `proxy` (Next.js 16 middleware entry). Flow:

1. Run **next-intl** middleware (`createMiddleware(routing)`).
2. Strip locale prefix from pathname and check **protected routes**: `/dashboard`, `/my-profile`.
3. If protected and no `access_token` cookie → redirect to `/` (same origin).
4. Otherwise return the i18n response.

Matcher excludes `api`, `_next`, `_vercel`, and static files with extensions.

**Note:** Client `useAuthorize` still enforces role permissions; middleware only checks for a session cookie on protected paths.

---

## Assets

`src/assets/images/`:

| File | Use |
| --- | --- |
| `MLS_Light_Logo.png` | Header (default / scrolled) |
| `MLS_Dark_Logo.png` | Header on home hero |
| `MLS_Home_Image.png` | Hero background |
| `favicon.png`, `icon.svg` | Branding |

---

## Scripts summary

| Script | Command |
| --- | --- |
| Development | `npm run dev` |
| Production build | `npm run build` |
| Production server | `npm run start` |
| Lint | `npm run lint` |

---

## Document maintenance

Update this file when you add:

- New routes or route groups  
- New auth views or API endpoints  
- New features or providers  
- Changes to profile menu paths or navigation behavior  

Keep [folder-structure.md](./folder-structure.md) in sync with the on-disk tree.

---

*Last aligned with repository structure and implemented routes as of project development.*
