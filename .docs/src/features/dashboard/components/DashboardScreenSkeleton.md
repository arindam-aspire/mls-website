# File Overview

**Source:** `src/features/dashboard/components/DashboardScreenSkeleton.tsx`

Layout-matched loading state for dashboard API hydration.

# Responsibilities

- Mirror the hero, seven KPI cards, two growth cards, and three lower dashboard panels.
- Use the shared `Skeleton` primitive instead of a spinner.
- Stay decorative through `aria-hidden`.

# UI Details

The skeleton uses the same mobile-first grids and card shells as loaded content: one column on mobile, expanding at `sm`, `lg`, and `xl`. Cards use `rounded-xl` and semantic skeleton colors support both themes.

# Exports

- `DashboardScreenSkeleton`
