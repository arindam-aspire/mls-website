# File Overview

Locale-prefixed public agency invitation page.

**Source:** `app/[locale]/(landing)/agency-invitation/page.tsx`

# Responsibilities

Render `AgencyInvitationScreen` under `LandingLayout`.

# Imports

- `AgencyInvitationScreen`

# Exports

Default page component.

# State Management

N/A.

# API Usage

N/A (screen/hook).

# Navigation

`/en/agency-invitation?token=…` (and `ar` / `es` / `fr`).

# Props / Parameters

None.

# Actions / Inputs

N/A.

# UI Details

N/A.

# Flow Description

Landing layout → invitation screen.

# Dependencies

- `AgencyInvitationScreen`

# Notes

Unprefixed `/agency-invitation` is redirected by `app/agency-invitation/page.tsx`.
