# File Overview

Root Next.js config for the MLS website. Wraps App Router settings with `next-intl`, allows LAN origins in development, allowlists remote image hosts, transpiles the local `@abdoun/abdoun-library` package, and expands the bundler root so that `file:../abdoun-library` can be resolved.

**Source:** `next.config.ts`  
**Where used:** Loaded by `next dev`, `next build`, and `next start`.

# Responsibilities

- Load next-intl via `createNextIntlPlugin("./src/i18n/request.ts")`.
- Transpile `@abdoun/abdoun-library` so its ESM `dist` output runs in the Next.js compiler.
- Set `turbopack.root` and `outputFileTracingRoot` to the parent of this app (`azure/`) so a `file:../abdoun-library` symlink is inside the module-resolution root. Turbopack does not resolve files outside that root.
- Disable webpack `resolve.symlinks` so webpack production builds treat the package as living under `node_modules/` instead of following the junction outside the app.
- Parse `NEXT_ALLOWED_DEV_ORIGINS` (comma-separated) with a built-in LAN fallback list.
- Restrict `next/image` remote hosts to Abdoun S3 buckets and FlagCDN (`flagcdn.com/w40/**`).

# Imports

- `node:path` — resolve the workspace root (`..` from this config file).
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
| `outputFileTracingRoot` | Parent directory of `mls_website` and `abdoun-library` so file tracing can include the linked package. |
| `turbopack.root` | Same parent path; required for Turbopack (`next dev` and Turbopack builds) to resolve `file:` / `npm link` packages. |
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
2. Module resolution root is the parent folder that contains both `mls_website` and `abdoun-library`.
3. Imports of `@abdoun/abdoun-library` resolve through `node_modules/@abdoun/abdoun-library` (symlink to `../abdoun-library`). The library must already have a built `dist/` (`index.js` / `index.cjs`).
4. Dev server accepts the configured origins. Production image requests are limited to the S3 and FlagCDN patterns.

# Dependencies

- Sibling package `../abdoun-library` when `package.json` uses `"@abdoun/abdoun-library": "file:../abdoun-library"`.
- `src/i18n/request.ts` (next-intl plugin path).
- `app/globals.css` imports `@abdoun/abdoun-library` CSS entry points.

# Notes

- If the library is installed from the Gitea registry as a real `node_modules` copy (not a `file:` link), the expanded root is harmless; resolution still works.
- Do not edit `@abdoun/abdoun-library` from this repo. Rebuild the sibling library (`npm run build` in `abdoun-library`) when its sources change, then rebuild this app.
- Stop `npm run dev` before `npm run build` when possible; `scripts/clean-next-build-cache.mjs` skips a locked `.next/dev` cache.
