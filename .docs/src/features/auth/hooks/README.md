# Auth hooks (`src/features/auth/hooks/`)

Feature hooks own **logic and data** for auth screens and forms. Screens under `screens/` are UI-only and call the matching `use*Screen` hook.

## Screen hooks

| Hook | Screen |
| --- | --- |
| `useAccountChooseScreen` | `AccountChooseScreen` |
| `useSignInScreen` | `SignInScreen` |
| `useAgencyEmailSignInScreen` | `AgencyEmailSignInScreen` |
| `useAgencySignInScreen` | `AgencySignInScreen` |
| `useAgencyRegistrationScreen` | `AgencyRegistrationScreen` |
| `useSocialSignInScreen` | `SocialSignInScreen` |
| `useSocialRegistrationScreen` | `SocialRegistrationScreen` |
| `useUserRegistrationScreen` | `UserRegistrationScreen` |
| `useForgotPasswordScreen` | `ForgotPasswordScreen` |
| `useResetPasswordScreen` | `ResetPasswordScreen` |
| `useSignInWithOTPScreen` | `SignInWithOTPScreen` |
| `useOTPVerificationScreen` | `OTPVerificationScreen` |
| `useConfirmSignUpScreen` | `ConfirmSignUpScreen` |

## Form / utility hooks

| Hook | Used by |
| --- | --- |
| `useChooseAccountForm` | `ChooseAccountForm` |
| `useAuthPortal` / `useIsAgentSignInPortal` | Agency/agent flows (URL `portal` query) |
| `authScreen.utils` | Shared `resolveAuthReturnView`, `resolveOtpFlow`, `useAuthScreenLegalFooter` |

## Conventions

- Follow hook section order from workspace `components-hooks-architecture` rule.
- Navigation via `useRouter` / `usePathname` from `@/src/i18n/navigation` and `buildAuthModalUrl` from `authViews.ts`.
- Mutations from `mutations/auth.mutation.ts`; session flow state from `store/auth.store.ts`.
