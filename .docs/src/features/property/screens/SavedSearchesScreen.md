# File Overview

Coming-soon stub screen for saved searches (property feature). Mirrors `RecentlyViewedScreen` layout: page header + `ComingSoonCard`.

**Source:** `src/features/property/screens/SavedSearchesScreen.tsx`

# Responsibilities

- Page toolbar: localized `h1` title + muted subtitle.
- Render `ComingSoonCard` below the header until wired to the saved-searches feature route.

# Imports

- `ComingSoonCard` from `@/src/components/common/ComingSoonCard`
- `useSavedSearchesScreen` from `../hooks/useSavedSearchesScreen`
- Typography utilities (`headingPageClasses`, `bodyLargeTextClasses`)

# Exports

- `SavedSearchesScreen`
- `default`

# State Management

- `useSavedSearchesScreen` — resolves `propertyList.savedSearches` labels.

# API Usage

_N/A unless extended._

# Navigation

_Not currently mounted by an App Router page; live saved searches UI is `SavedSearchScreen` at `/en/saved-searches`._

# Props / Parameters

_None._

# Actions / Inputs

_No user inputs or actions._

# UI Details

- Header stack: `gap-2 md:gap-4 lg:gap-6` (matches favourites / recently viewed).
- **Theme:** semantic tokens (`text-text`, `text-muted`).
- **Radius:** `rounded-xl` on `ComingSoonCard` shell.
- **Responsive:** mobile-first (`sm:`, `md:`, `lg:`).

# Flow Description

1. Hook resolves `pageTitle` (`Saved Searches` in `en`), subtitle, and coming-soon copy.
2. Screen renders `h1` + subtitle, then `ComingSoonCard` reusing `pageTitle` as card heading.

# Dependencies

- [useSavedSearchesScreen.md](../hooks/useSavedSearchesScreen.md)

# Notes

- Distinct from `src/features/saved-searches/screens/SavedSearchScreen.tsx` (full saved-searches implementation).
- Keep in sync when `src/features/property/screens/SavedSearchesScreen.tsx` changes.
