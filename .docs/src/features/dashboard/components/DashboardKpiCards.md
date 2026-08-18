# File Overview

**Source:** `src/features/dashboard/components/DashboardKpiCards.tsx`

Responsive presentation for the seven dashboard KPI cards.

# Responsibilities

- Render localized labels and locale-formatted counts.
- Map metric ids to semantic-color Lucide icons.
- Show `↑`/`↓` and absolute percentage for the four metrics with a trend.
- Supply localized trend descriptions to assistive technology.

# Props / Parameters

`metrics`, `locale`, `sectionAriaLabel`, and `trendAriaLabel`.

# UI Details

Mobile-first one-column grid grows to two, three, and four columns. Cards use `rounded-xl`, controls/icon wells use `rounded-lg`, and semantic theme tokens support light/dark mode.

# Exports

- `DashboardKpiCards`
- `DashboardKpiMetric`
- `DashboardKpiMetricId`
