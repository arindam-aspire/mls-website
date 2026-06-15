# Profile modals (`src/features/profile/modals/`)

Modal shells owned by the profile feature. Used from profile screens and cross-feature entry points (e.g. My Listings **Add Property** when the owner has no linked agency).

## Files

| File | Role |
| --- | --- |
| [SelectAgencyModal.md](./SelectAgencyModal.md) | Agency list picker (`GET /agency/list`) before property create |

## Conventions

- Modal UI uses `@/src/components/ui/modal` (`rounded-xl` panel).
- Business logic lives in matching hooks under `../hooks/`.
- Copy uses `profile.*` namespaces via `next-intl`.
