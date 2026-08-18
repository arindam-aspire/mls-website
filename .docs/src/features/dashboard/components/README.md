# Dashboard components

Presentational building blocks for the dashboard summary. `DashboardScreenSkeleton` mirrors the loaded layout; `DashboardKpiCards` renders counts/trends; chart components visualize growth and lead sources; activity and health components render operational feeds.

Components receive typed, localized props from `DashboardScreen` and do not fetch data. They use semantic theme tokens, mobile-first layouts, `rounded-xl` containers, and accessible text alternatives/empty states.
