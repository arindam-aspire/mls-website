# File Overview

English locale message namespace barrel for next-intl.

**Source:** `src/messages/en/index.ts`

# Responsibilities

- Import JSON namespaces and export a single `messages` object for `en`.

# Imports

- `auth.json` → `auth`
- `common.json` → `common`
- `home.json` → `home`
- `notFound.json` → `notFound`
- `unauthorized.json` → `unauthorized`

# Exports

- `default` — `{ auth, common, home, notFound, unauthorized }`

# Dependencies

- Loaded by `src/i18n/request.ts` for locale `en`.
- Mirrored by `ar/index.ts`, `es/index.ts`, `fr/index.ts`.

# Notes

- Add a new JSON file here and in every other locale when introducing a namespace.
