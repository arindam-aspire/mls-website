# Internationalization (`src/i18n/`)

next-intl configuration for locale routing and navigation.

| File | Role |
| --- | --- |
| [routing.md](./routing.md) | Locales `en`, `ar`, `es`, `fr`; `localePrefix: always`; RTL helper |
| [request.md](./request.md) | Server request config — loads `src/messages/<locale>` |
| [navigation.md](./navigation.md) | `Link`, `useRouter`, `redirect`, `getPathname` |

## Locales

All public URLs include locale: `/en/listing`, `/ar/listing`, etc. Root `/` redirects to `/en`.

## RTL

`ar` uses `dir="rtl"` on `<html>` via `isRtlLocale` in root layout.

## Usage in features

```tsx
import { Link, useRouter } from "@/src/i18n/navigation";
```

Do **not** use raw `next/navigation` router for user-facing navigation (except `NavigationInitializer`).

## Messages

See [messages/README.md](../messages/README.md).

## Middleware

`proxy.ts` at repo root — next-intl middleware.
