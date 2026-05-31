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
| `useAuthPortal` / `useIsAgentSignInPortal` | Agency/agent flows (`agentPortal` in store) |
| `useAuthModalNavigation` | `canGoBack`, `onBack` from `screenStack` |
| `authScreen.utils` | `useAuthFlowContext`, `useAuthScreenLegalFooter` |
| `authStack.utils` | `getAuthContextFromStack`, `isAgencyContextFromStack` |

## Conventions

- Follow hook section order from workspace `components-hooks-architecture` rule.
- Navigation via `useAuthStore`: `openAuth`, `navigate`, `pop`, `closeAuth` — **no URL query params**.
- `navigate()` uses `SCREEN_NAV_TYPE` (`auth.navigation.ts`) so toggling account type or sign-in/sign-up does not grow the stack.
- Transient data via store setters (sessionStorage-backed).
- Mutations from `mutations/auth.mutation.ts`.
