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
| `common.json` | `common` | Header, footer, loading, profile |
| `home.json` | `home` | Landing / hero |
| `notFound.json` | `notFound` | 404 page |

## Barrel

Each locale exports:

```ts
// src/messages/en/index.ts
export default { auth, common, home, notFound };
```

Loaded in [i18n/request.md](../i18n/request.md).

## Usage

```tsx
const t = useTranslations("common");
```

## Docs

- [en/index.md](./en/index.md) — pattern mirrored for `ar`, `es`, `fr`
