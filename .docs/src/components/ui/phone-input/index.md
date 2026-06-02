# File Overview

Composite phone field: country flag/dial-code popover + national number input. Used in auth sign-up, OTP, forgot-password, and agency flows.

**Source:** `src/components/ui/phone-input/index.tsx` (Client Component)

# Responsibilities

- Render labeled phone field with country selector (Headless UI `Popover`) and numeric national input.
- Sanitize national input to digits only; emit `{ country, nationalNumber }` on change.
- Support controlled/uncontrolled `countryCode` and `nationalNumber`.
- Apply inset inner-track layout so the solid country segment does not overlap the shell border.

# Imports

- `@/src/lib/cn`, `@/src/lib/typography`, `@/src/i18n/routing`
- `../fieldVariants` — outline shell styles
- `../popover` — country list dropdown
- `../responsiveSizes` — shell, track, country segment, divider, field padding tokens
- `./countries` — country list and flag URLs

# Exports

- `PhoneInput`
- `countryFlagUrl`, `DEFAULT_PHONE_INPUT_COUNTRY_CODE`, `getPhoneInputCountryByCode`, `PHONE_INPUT_COUNTRIES`, `PhoneInputCountry`

# State Management

- **React** `useState` — internal country/national values (uncontrolled), country search query

# API Usage

_N/A_

# Navigation

_No direct navigation._

# Props / Parameters

| Prop | Purpose |
| --- | --- |
| `variant` | `outline` (default) — bordered shell; `ghost` — transparent shell |
| `countryCode` / `nationalNumber` | Controlled values |
| `defaultCountryCode` / `defaultNationalNumber` | Uncontrolled defaults |
| `onChange` | `{ country, nationalNumber }` payload |
| `showPhoneIcon` | Trailing phone icon inside shell (default `true`; auth forms use `false`) |
| `countrySegmentClassName` | Optional override for country wrapper (prefer `variant`) |
| `searchPlaceholder`, `emptySearchLabel` | Country popover copy |
| `label`, `error`, `hint`, `isRequired`, `fullWidth`, `dir` | Standard field chrome |

# Actions / Inputs

## Inputs

- Country search field inside popover
- National number tel input (digits only)

## Actions

- Open country popover (flag + chevron)
- Select country from list
- Type national number

# UI Details

- **Shell:** `phoneInputShellSizeClasses` — shared control height, `rounded-xl`, `overflow-hidden`.
- **Inner track:** `phoneInputTrackClasses` — `p-1` inset (same pattern as bordered `ToggleButton`).
- **Country segment (`variant="outline"`):** `phoneInputCountrySegmentSolidClasses` — horizontal padding only (no background); inset track prevents border overlap.
- **Divider:** full-height `w-px` between country segment and number field.
- **Theme:** semantic tokens; light/dark via `ThemeProvider`.

# Flow Description

1. User sees flag + chevron and national number placeholder.
2. Clicking flag opens popover with search + country list.
3. Selecting a country updates dial context and closes search state.
4. Typing in the national field strips non-digits and notifies parent.

# Dependencies

- Auth forms: `SignUpForm`, `SignInWithOTPForm`, `ForgotPasswordForm`, `AgencySignUpForm`
- [responsiveSizes.md](../responsiveSizes.md) — phone input size tokens

# Notes

- Do not use negative margin hacks (e.g. `-ms-3`) on the country segment; inset is built into the component.
- Keep in sync when `src/components/ui/phone-input/index.tsx` changes.
