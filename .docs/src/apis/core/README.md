# API core (`src/apis/core/`)

Low-level HTTP plumbing.

| File | Role |
| --- | --- |
| [axios.factory.md](./axios.factory.md) | `createAxiosInstance` with base URL |
| [axios.interceptor.md](./axios.interceptor.md) | Bearer header, 401 refresh retry |
| [token.store.md](./token.store.md) | Cookie read/write for access & refresh tokens |
| [token.refresh.md](./token.refresh.md) | POST refresh, dedupe in-flight refresh |
| [error.normalizer.md](./error.normalizer.md) | `ApiError`, `normalizeAxiosError` |

## Token cookies

- Keys: `access_token`, `refresh_token`
- `sameSite: Strict`, `secure` in production

## Imperative navigation

Interceptor and missing-token paths use `navigateTo('/')` from `navigation.utils` (non-locale path).
