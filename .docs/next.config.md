# File Overview

Root Next.js config for the MLS website. Wraps App Router settings with `next-intl`, allows LAN origins in development, allowlists remote image hosts, transpiles `@abdoun/abdoun-library`, and pins the Turbopack workspace root to this app.

**Source:** `next.config.ts`  
**Where used:** Loaded by `next dev`, `next build`, and `next start`.

# Responsibilities

- Load next-intl via `createNextIntlPlugin("./src/i18n/request.ts")`.
- Transpile `@abdoun/abdoun-library` so its ESM `dist` output runs in the Next.js compiler.
- Pin `turbopack.root` and `outputFileTracingRoot` to this app directory (`mls_website/`). The parent `azure/` folder contains other Next.js apps; using it as the Turbopack root prevents App Router discovery and makes `GET /en` 404.
- Disable webpack `resolve.symlinks` so webpack production builds treat the package as living under `node_modules/` instead of following the junction outside the app.
- Parse `NEXT_ALLOWED_DEV_ORIGINS` (comma-separated) with a built-in LAN fallback list.
- Restrict `next/image` remote hosts to Abdoun S3 buckets and FlagCDN (`flagcdn.com/w40/**`).

# Imports

- `node:path` — resolve this app directory (`__dirname`).
- `next` — `NextConfig` type.
- `next-intl/plugin` — `createNextIntlPlugin`.

# Exports

- Default export: `withNextIntl(nextConfig)`.

# State Management

_N/A — build-time config only._

# API Usage

_N/A._

# Navigation

_N/A._ Locale-prefixed routing is configured in `src/i18n/routing.ts`, not here.

# Props / Parameters

| Option | Purpose |
| --- | --- |
| `transpilePackages` | Compile `@abdoun/abdoun-library` with Next.js (required for the local ESM package). |
| `outputFileTracingRoot` | This app directory (`mls_website/`), so Next does not infer the parent `azure/` workspace. |
| `turbopack.root` | Same app directory. Required so `/en` and other `app/[locale]` routes are discovered. |
| `webpack` | Sets `resolve.symlinks = false` for webpack-based `next build`. |
| `allowedDevOrigins` | Hosts allowed to reach the dev server (env `NEXT_ALLOWED_DEV_ORIGINS` or hardcoded LAN IPs). |
| `images.remotePatterns` | HTTPS hosts for `next/image`. |

# Actions / Inputs

## Inputs

- Environment: `NEXT_ALLOWED_DEV_ORIGINS` — optional comma-separated host list for `next dev`.

## Actions

_N/A._

## Validations

_N/A._

## Show/Hide Controls

_N/A._

# UI Details

_N/A — not a UI module._ Image `remotePatterns` affect which listing/profile images `next/image` will load.

# Flow Description

1. Next loads `next.config.ts` and applies the next-intl plugin (request config at `src/i18n/request.ts`).
2. Module resolution root is this app (`mls_website/`). `@abdoun/abdoun-library` resolves from `node_modules`.
3. Imports of `@abdoun/abdoun-library` use the installed package `dist/` (`index.js` / `index.cjs`).
4. Dev server accepts the configured origins. Production image requests are limited to the S3 and FlagCDN patterns.

# Dependencies

- `src/i18n/request.ts` (next-intl plugin path).
- `app/globals.css` imports `@abdoun/abdoun-library` CSS entry points.

# Notes

- Do not set `turbopack.root` to the parent `azure/` folder. That directory also contains `abdoun_website` and other apps; Next then fails to register `app/[locale]/(landing)/page.tsx` and `GET /en` returns 404.
- `@abdoun/abdoun-library` is installed from the private registry into `node_modules`. Do not edit it from this repo. If you temporarily switch to `"file:../abdoun-library"`, keep `turbopack.root` on this app and rely on `transpilePackages`.
- `scripts/clean-next-build-cache.mjs` (npm `prebuild`) always deletes `.next/dev/types` before `next build`. Stale or truncated `validator.ts` there is type-checked via `tsconfig.json` include and fails with `Cannot find name 'AppRoutes'`. If the rest of `.next` is locked by `npm run dev`, the script still drops those types and warns; stop the dev server for a fully clean cache.
