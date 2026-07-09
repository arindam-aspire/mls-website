# File Overview

Strips a leading locale segment from internal paths so **next-intl** `router.push` does not duplicate the prefix (e.g. `/en/dashboard` → `/dashboard`).

**Source:** `src/i18n/stripLocalePrefixFromPath.ts`

# Exports

| Function | Purpose |
| --- | --- |
| `stripLocalePrefixFromPath` | Normalize pathname + search + hash |
| `stripLocalePrefixFromHref` | Parse absolute/relative href, then strip locale |

# Usage

- [navigation.md](./navigation.md) — `useRouter().push` / `replace` normalize href before navigation.
- [usePropertyCreateUnsavedChanges.md](../features/property/hooks/usePropertyCreateUnsavedChanges.md) — captured `<a href="/en/...">` values from the DOM are stripped before discard/save navigation.
- [navigation.utils.md](../utils/navigation.utils.md) — imperative `navigateTo` / `navigateReplace`.

# Dependencies

- [routing.md](./routing.md) — `routing.locales` list used to detect locale segment.
