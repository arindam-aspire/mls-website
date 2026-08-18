# resolvePropertyClosePermissions

### File Overview

**Source:** `src/features/property/utils/resolvePropertyClosePermissions.ts`

Role-based helpers for property listing deal-closure status visibility.

### Responsibilities

- Expose `canViewCloseStatus` for agency and super administrators.
- Detect deal-closure status keys (`deal_closure_requested`, `deal_closed`).
- Mask close statuses to `active` for agents in listing tables and detail panels.

### Exports

- `resolvePropertyClosePermissions`
- `PropertyClosePermissions`
- `isPropertyCloseStatusKey`
- `maskPropertyListingStatusKeyForViewer`

### Dependencies

- `agentPropertiesList.mapper.ts`
- `useAgentListingsTable.ts`
- `useAdminPropertySubmissionsTable.ts`
- `usePropertyDetails.ts`
