# Layouts (`src/layouts/`)

Route-level layout shells (not Next.js `layout.tsx` files).

| Folder | Status | README |
| --- | --- | --- |
| `public-layout/` | Active — header, footer, auth modal | [public-layout/README.md](./public-layout/README.md) |
| `landing-layout/` | Active scaffold — separate landing entry files | [landing-layout/README.md](./landing-layout/README.md) |
| `protected-layout/` | Active scaffold — `(main)` route group wrapper | [protected-layout/README.md](./protected-layout/README.md) |

## Usage

`app/[locale]/(main)/layout.tsx` wraps children with `ProtectedLayout`, while `(property)/layout.tsx` uses `PublicLayout`.

## vs App Router layouts

- **App** `layout.tsx`: fonts, providers, i18n.
- **src/layouts**: marketing chrome (nav, profile, footer).
