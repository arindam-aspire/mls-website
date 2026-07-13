# File Overview

Maps property details API owner data into the shape expected by `@abdoun/abdoun-library` `PropertyView`.

**Source:** `src/features/property/mappers/mapPropertyDetailsForPropertyView.ts`

# Responsibilities

- Read API `owners[]` (`PropertyOwner`) and/or library `owner` on `PropertyDetails`.
- Normalize API `agent` and/or flat agent fields (`agent_name`, `agent_email`, `agent_phone`) into library `agent` for `PropertyView.showAgent`.
- Normalize to library owner objects (`id`, `name`, `phone`, `email`, `is_private`).
- For a **single** owner, set `propertyDetails.owner` for `PropertyView.showOwner`.
- Normalize `handover` from the API: trim, capitalize first letter, set `null` when empty (library renders `HandoverBadge` only when non-null).

# Exports

- `resolvePropertyViewOwners(propertyDetails)` — visible owners for the details view
- `resolvePropertyViewAgent(propertyDetails)` — visible listing agent for the details view
- `mapPropertyDetailsForPropertyView(propertyDetails)` — details payload passed to `PropertyView`

# Dependencies

- [../types/property.types.md](../types/property.types.md)
- [../hooks/usePropertyDetails.md](../hooks/usePropertyDetails.md)
- [../screens/PropertyDetailsScreen.md](../screens/PropertyDetailsScreen.md)

# Notes

- Handover badge styling and variant colors are handled by `@abdoun/abdoun-library` `HandoverBadge` (`propertyDetails.handover`).
- Agent strings are normalized to `""` when missing so library `AgentDetailsRow` can safely call `.trim()` on `phone`.
