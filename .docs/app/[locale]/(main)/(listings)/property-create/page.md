# File Overview

Next.js App Router page for `[locale]/property-create`. Create-listing route for owners and agents (coming soon).

**Source:** `app/[locale]/(main)/(listings)/property-create/page.tsx`

# Responsibilities

- `usePageTitle("propertyCreate")` sets document title.
- `useAuthorize("PROPERTY_CREATE")` before rendering `PropertyCreateScreen`.

# Navigation

- Public URL: `/en/property-create` (new draft) or `/en/property-create?submission_id={uuid}` after first draft save
- Guard: owner or agent (`PROPERTY_CREATE`)

# Dependencies

- `PropertyCreateScreen.tsx`
- `proxy.ts` — requires `access_token` cookie
