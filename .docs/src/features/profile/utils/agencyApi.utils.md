# File Overview

Agency API response normalizers used by profile services.

**Source:** `src/features/profile/utils/agencyApi.utils.ts`

# `normalizeAgencyListResponse`

`GET /agency/list` response shape:

```json
{
  "success": true,
  "data": [ { "id", "agency_name", "agency_trade_name", "logo_url", ... } ],
  "meta": {}
}
```

- `data` is a **direct array** (not `{ items: [] }`).
- `meta` may be empty; `total` falls back to `data.length`.
- Blank `logo_url` strings normalize to `null`.

Maps each row to `AgencyListItem` (`id`, `agency_name`, `logo_url`, `email`, `phone`) for the select-agency modal.

# Dependencies

- [useSelectAgencyModal.md](../hooks/useSelectAgencyModal.md)
- [profile.service.md](../services/profile.service.md)
