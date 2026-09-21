# File Overview

Locale-less agent invitation deep link.

**Source:** `app/agent-invite/page.tsx`

# Responsibilities

Redirect `/agent-invite?token=` to `/en/agent-invite?token=`.

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

- `app/[locale]/(landing)/agent-invite/page.tsx`

# Notes

Matches the unprefixed agency invitation / password-setup redirects.
