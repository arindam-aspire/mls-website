# Breadcrumb (`src/components/ui/breadcrumb/`)

Dynamic breadcrumb navigation built from an `items` array. Uses locale-aware `Link` from `@/src/i18n/navigation`.

## Exports

- `Breadcrumb`
- `BreadcrumbItem`, `BreadcrumbProps`

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `items` | `BreadcrumbItem[]` | Ordered trail segments |
| `ariaLabel` | `string` | Accessible name for the `<nav>` |
| `className` | `string` | Optional wrapper classes (e.g. `hidden md:flex`) |

## `BreadcrumbItem`

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Stable React key |
| `label` | `string?` | Visible text |
| `href` | `string?` | Locale-prefixed path for links |
| `icon` | `LucideIcon?` | Optional leading icon |
| `isCurrent` | `boolean?` | Current page (non-link, `aria-current="page"`) |
| `ariaLabel` | `string?` | Required for icon-only links |

## UI Details

- Separator: `ChevronRight` (`text-muted`)
- Links: `text-sm text-muted hover:text-text`, `rounded-lg` focus ring
- Current segment: `font-medium text-text`
- Truncation on long labels via `truncate`

## Usage

```tsx
<Breadcrumb
  items={[
    { id: "home", href: "/dashboard", icon: Home, ariaLabel: t("protectedTabHome") },
    { id: "listings", href: "/my-listings", icon: List, label: t("myListings") },
    { id: "create", label: t("breadcrumbCreate"), isCurrent: true },
  ]}
  ariaLabel={t("breadcrumbAriaLabel")}
  className="hidden md:flex"
/>
```

## Dependencies

- `@/src/i18n/navigation` — `Link`
- `lucide-react` — `ChevronRight` and item icons
