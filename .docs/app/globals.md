# File Overview

Global Tailwind CSS v4 entry point for application theme tokens, shared animations, and narrowly scoped integration styles.

**Source:** `app/globals.css`

# Responsibilities

- Load Tailwind and the shared Abdoun library theme/integration styles.
- Define semantic light/dark theme variables used throughout the application.
- Provide global animation utilities and reduced-motion behavior.
- Scope app-specific compatibility styling for third-party UI integrations.

# Imports

- Tailwind CSS
- `@abdoun/abdoun-library/theme.css`
- `@abdoun/abdoun-library/integration.css`

# UI Details

- Theme colors use semantic variables consumed by utilities such as `bg-page`, `bg-surface`, `text-text`, and `text-muted`.
- The `.property-details-view` scope adjusts the library Neighborhood card and property contact-card layout on the property details screen.
- Neighborhood cards use a consistent `1rem` inset on every viewport size.
- When the library renders its empty neighborhood status, the empty details column is hidden and the map column becomes a single full-width block.
- Existing map iframe sizing, rounded corners, Open in Maps link, loading, and URL behavior remain owned by the library.
- Neighborhoods with actual local highlights or lifestyle content keep the library's responsive two-column desktop layout.
- The price summary, Listing Agent, and Owner Details render as independent `rounded-xl` card surfaces with the same semantic background and shadow.
- The same structure applies to the loading skeleton, avoiding a layout shift when property data resolves.
- Card padding remains mobile-first (`1rem`, then `1.25rem` and `1.5rem`) and the library sidebar keeps its existing sticky desktop behavior.

# Flow Description

1. The root layout loads this stylesheet.
2. Tailwind and semantic theme styles apply across the application.
3. `PropertyDetailsScreen` passes `property-details-view` to `PropertyView`.
4. CSS `:has()` detects the empty neighborhood status inside that scoped view.
5. The empty column is removed from layout and the existing map fills the card's inner width on mobile, tablet, and desktop.
6. Scoped contact-card selectors remove the shared visual shell without changing the library DOM, data, or callbacks.
7. The price, agent, and owner groups each receive the same card surface; agent and owner are never presented in one visual card.

# Dependencies

- `app/layout.tsx`
- `src/features/property/screens/PropertyDetailsScreen.tsx`
- `@abdoun/abdoun-library`

# Notes

- The Neighborhood and contact-card overrides are intentionally structural and scoped; they do not change property data, contact actions, visibility rules, or API behavior.
- Modern browsers supported by Next.js 16 provide the required `:has()` selector support.
