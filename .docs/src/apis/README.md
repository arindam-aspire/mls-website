# API layer (`src/apis/`)

HTTP infrastructure: Axios instances, auth interceptors, token cookies, endpoint constants, and typed clients.

## Architecture

```
apis/
  clients/api.client.ts    authClient, apiClient
  core/                    factory, interceptors, tokens, refresh, errors
  endpoints/               Path constants (auth, public, property)
```

## Request flow

1. Feature **service** calls `authClient.request` or `apiClient.request`.
2. `BaseApiClient` creates Axios instance, applies interceptors.
3. Request interceptor adds Bearer token when `auth: true`.
4. On 401, `refreshToken()` retries once; failure → `navigateTo('/')`.
5. Errors normalized via `normalizeAxiosError`.

## Clients

| Client | Default `auth` |
| --- | --- |
| `authClient` | `false` (opt-in per call) |
| `apiClient` | `true` |

## Subfolders

| Folder | README |
| --- | --- |
| [core/](./core/README.md) | Interceptors, tokens, refresh, errors |
| [clients/](./clients/README.md) | `api.client.ts` |
| [endpoints/](./endpoints/README.md) | Path maps |

## Config

Base URL: `API_BASE_URL` from `src/configs/environment.config.ts` (`NEXT_PUBLIC_API_BASE_URL`).
