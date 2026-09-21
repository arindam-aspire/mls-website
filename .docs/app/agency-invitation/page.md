# File Overview

Locale-less agency invitation deep link.

**Source:** `app/agency-invitation/page.tsx`

# Responsibilities

Redirect `/agency-invitation?token=` to `/en/agency-invitation?token=` so email links without a locale still work.

# Imports

- `redirect` from `next/navigation`

# Exports

Default server page.

# State Management

N/A.

# API Usage

N/A.

# Navigation

Server redirect to English locale.

# Props / Parameters

`searchParams.token`

# Actions / Inputs

N/A.

# UI Details

N/A.

# Flow Description

Preserve `token` query when present.

# Dependencies

- `app/[locale]/(landing)/agency-invitation/page.tsx`

# Notes

Default locale for unprefixed email links is `en`.
