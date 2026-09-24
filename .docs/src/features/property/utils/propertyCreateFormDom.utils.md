# File Overview

Host DOM patches for `@abdoun/abdoun-library` `PropertyForm` on Add Property. The library does not expose props for these UAT-required host behaviors.

**Source:** `src/features/property/utils/propertyCreateFormDom.utils.ts`

# Responsibilities

- Keep the library-owned `reference_number` input native `readOnly` so a backend value cannot be typed or pasted.
- Hide the Reference Number field while empty **or** while it still holds the host pending sentinel (`PENDING_PROPERTY_REFERENCE_NUMBER`). Show the read-only field once draft save or hydration returns a real backend value.
- Hide the Built-up Area **Unit** select (`name="built_up_area_unit"`) so the form accepts square metres only.
- Replace hardcoded library copy `Owner Document` / `Owner Documents` with the host i18n label **Owner ID or Passport**.
- Promote any still-visible Floor Number identification input (`name="floor_number"`) to `type="number"` (host DLS Floor field sets this directly).
- Sync identification field visibility: Create Property passes an **empty** visible list so **library** free-text identification is hidden. Host DLS inputs (`[data-dls-field-id]` / `[data-property-location-dls-portal]`) reuse those `name`s and stay visible (Parcel Number, Plot Number, Building, Floor, Apartment). Still clears Basin Number and the empty-array placeholder when present.
- Hide the Land host placeholder row on Review (zero-width label `dt`).

# Imports

- `PENDING_PROPERTY_REFERENCE_NUMBER` from property form constants
- Identification key catalogs from `propertyIdentification.constants`

# Exports

- `applyPropertyCreateFormDomPatches(container, { ownerDocumentsLabel, hasReferenceNumber, visibleIdentificationKeys })`

# Props / Parameters

| Param | Purpose |
| --- | --- |
| `container` | `PropertyForm` host wrapper element |
| `ownerDocumentsLabel` | Localized `propertyList.propertyCreate.form.ownerDocumentsLabel` |
| `hasReferenceNumber` | `true` when host form state has a real (non-pending) `reference_number` |
| `visibleIdentificationKeys` | Keys whose library inputs stay visible; Create Property uses `[]` |

# Flow Description

1. New create seeds `reference_number` with `PENDING_PROPERTY_REFERENCE_NUMBER` so library Step 3 validation can pass (server owns the real value).
2. DOM patches keep the pending/empty field hidden.
3. After draft save or hydration, host merges the server reference; patches show it read-only.
4. Outbound mappers omit the pending sentinel so PATCH does not send a fake reference.
5. On Location, library identification inputs stay hidden; host DLS Inputs are excluded from that hide so Parcel Number / Plot Number / Building / Floor / Apartment remain visible. Review still uses `config.identificationFields` labels with hydrated values.

# Notes

- Preferred long-term fix is library props that stop requiring `reference_number` until the server mints one, plus treating empty `identificationFields: []` as intentional (use `Array.isArray` instead of `.length`), and a Location DLS slot so host portal/DOM patches are unnecessary.
