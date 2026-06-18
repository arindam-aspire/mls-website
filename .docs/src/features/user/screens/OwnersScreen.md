# File Overview

Placeholder **Owners** screen for admin user management. Rendered at `/owners`.

**Source:** `src/features/user/screens/OwnersScreen.tsx`

# Responsibilities

- Display a localized coming-soon placeholder until owner management is implemented.

# Imports

- `ComingSoonCard` from `@/src/components/common/ComingSoonCard`
- `useTranslations` from `next-intl`

# Exports

- `OwnersScreen`

# Navigation

- Route: `/en/owners` (locale-prefixed)
- Linked from protected sidebar and mobile drawer (admin only)

# UI Details

- Centered `ComingSoonCard` with `user.owners.*` copy and `common.upcomingFeature.subtitle`
- Responsive padding; works in light and dark themes via semantic tokens on `ComingSoonCard`

# Dependencies

- [owners/page.md](../../../../app/[locale]/(main)/owners/page.md)
