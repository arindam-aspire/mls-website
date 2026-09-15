# Profile modals (`src/features/profile/modals/`)

Modal shells owned by the profile feature. `SelectAgencyModal` remains available for agency picking (for example a legacy `/property-create?agency_id=` continue URL). Owner **Add Property** now goes straight to create and uses **Verify through Agency** on Step 8.

## Files

| File | Role |
| --- | --- |
| [SelectAgencyModal.md](./SelectAgencyModal.md) | Agency list picker (`GET /agency/list`); optional pre-create continue URL |

## Conventions

- Modal UI uses `@/src/components/ui/modal` (`rounded-xl` panel).
- Business logic lives in matching hooks under `../hooks/`.
- Copy uses `profile.*` namespaces via `next-intl`.
