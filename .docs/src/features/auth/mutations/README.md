# Auth mutations (`src/features/auth/mutations/`)

TanStack React Query **mutation hooks** wrapping `auth.service` functions. Handle success/error toasts, Zustand updates, and post-logout navigation.

## Files

| File | Hooks |
| --- | --- |
| [auth.mutation.md](./auth.mutation.md) | `useSignInWithPassword`, `useLogout`, `useSignUp`, `useConfirmSignUp`, `useSignInWithOtpRequest`, `useSignInWithOtpVerify`, `useForgotPassword` |

## Lifecycle pattern

1. Component calls `mutate(values)`.
2. Service POST/GET via `authClient`.
3. **onSuccess:** set tokens/user in `useAuthStore`; optional `getLoggedInUser()`; toast success.
4. **onError:** `toast.error` with `ApiError.message`.
5. **Logout onSuccess:** `clearAuth()` + `navigateTo(\`/${locale}\`)`.

## State

- Reads/writes `useAuthStore` (not React Query cache for user).
- Uses `useLocale()` for logout redirect path.

## API

See [services/README.md](../services/README.md) and [authEndpoints](../../../apis/endpoints/authEndpoints.md).
