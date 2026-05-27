# Layouts (`src/layouts/`)

Route-level layout shells (not Next.js `layout.tsx` files).

| Folder | Status | README |
| --- | --- | --- |
| `public-layout/` | Active — header, footer, auth modal | [public-layout/README.md](./public-layout/README.md) |
| `protected-layout/` | Reserved — not wired | — |

## Usage

`app/[locale]/(main)/layout.tsx` and `(property)/layout.tsx` wrap children with `PublicLayout`.

## vs App Router layouts

- **App** `layout.tsx`: fonts, providers, i18n.
- **src/layouts**: marketing chrome (nav, profile, footer).
