# Messages (`src/messages/`)

Per-locale translation JSON aggregated by `index.ts` for next-intl.

## Locales

| Folder | Language |
| --- | --- |
| `en/` | English (default) |
| `ar/` | Arabic (RTL) |
| `es/` | Spanish |
| `fr/` | French |

## Namespaces (per locale)

| JSON | Namespace | Typical use |
| --- | --- | --- |
| `auth.json` | `auth` | Auth modal, forms |
| `common.json` | `common` | Header, footer, loading, profile menu, `backHome` |
| `home.json` | `home` | Landing / hero |
| `notFound.json` | `notFound` | 404 page (`code`, `eyebrow`, `title`, `description`, `backHome`) |
| `unauthorized.json` | `unauthorized` | 401 page (`code`, `eyebrow`, `title`, `description`, `backHome`) |

## Barrel

Each locale exports:

```ts
// src/messages/en/index.ts
export default { auth, common, home, notFound, unauthorized };
```

Loaded in [i18n/request.md](../i18n/request.md).

## Usage

```tsx
const t = useTranslations("notFound");
const u = useTranslations("unauthorized");
```

## Docs

- [en/index.md](./en/index.md) — pattern mirrored for `ar`, `es`, `fr`
