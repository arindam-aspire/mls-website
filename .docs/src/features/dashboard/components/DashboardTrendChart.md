# File Overview

**Source:** `src/features/dashboard/components/DashboardTrendChart.tsx`

Dependency-free responsive SVG line chart used for user, listing, and lead growth.

# Responsibilities

- Pair labels and numeric values safely using their shared length.
- Normalize points into a responsive SVG view box.
- Render semantic-token line/grid colors.
- Provide a screen-reader value list and a localized empty state.
- Memoize chart geometry and the exported component.

# Props / Parameters

Title, labels, values, empty-state copy, locale, and semantic chart color (`primary`, `secondary`, or `info`).

# UI Details

The SVG fills a fluid card and avoids horizontal overflow at 320px, 768px, and desktop widths. Cards use `rounded-xl` and theme variables work in light/dark mode.

# Exports

- `DashboardTrendChart`
