# File Overview

Next.js App Router page for `[locale]/property-update`. Owner update-listing route (coming soon).

**Source:** `app/[locale]/(main)/(listings)/property-update/page.tsx`

# Responsibilities

- `usePageTitle("propertyUpdate")` sets document title.
- `useAuthorize("MY_LISTINGS")` before rendering `PropertyUpdateScreen`.

# Navigation

- Public URL: `/en/property-update`
- Guard: owner only (`MY_LISTINGS`)

# Dependencies

- `PropertyUpdateScreen.tsx`
- `proxy.ts` — requires `access_token` cookie
