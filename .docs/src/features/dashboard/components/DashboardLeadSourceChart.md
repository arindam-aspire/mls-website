# File Overview

**Source:** `src/features/dashboard/components/DashboardLeadSourceChart.tsx`

Donut visualization and legend for dashboard lead-source distribution.

# Responsibilities

- Pair `leadSourceLabels` and `leadSourceValues`.
- Compute totals, percentages, and conic-gradient segments.
- Format values for the active locale.
- Render a localized empty state when all values are zero or absent.

# UI Details

The chart stacks on mobile and switches to a side-by-side legend at `sm`. It uses semantic CSS variables, `rounded-xl` cards, and a screen-readable text legend.

# Exports

- `DashboardLeadSourceChart`
