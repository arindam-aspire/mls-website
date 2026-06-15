# File Overview

Modal for admin to enter a rejection reason and submit `POST /admin/property-submissions/{submissionId}/review` with `{ "action": "reject", "reason": "…" }`.

**Source:** `src/features/property/components/RejectSubmissionModal.tsx`

# Props

| Prop | Type | Description |
| --- | --- | --- |
| `open` | `boolean` | Modal visibility |
| `listingTitle` | `string` | Shown in description |
| `isSubmitting` | `boolean` | Disables form during mutation |
| `onClose` | `() => void` | Cancel / close |
| `onSubmit` | `(reason: string) => void` | Confirm with trimmed reason |

# UI

- `Textarea` for rejection reason (`rounded-lg` override on control)
- **Reject** button (`danger`, `XCircle` icon)
- i18n: `propertyList.manageListings.rejectSubmissionModal.*`

# Dependencies

- [useRejectSubmissionModal.md](../hooks/useRejectSubmissionModal.md)
- [useAdminPropertySubmissionsTable.md](../hooks/useAdminPropertySubmissionsTable.md)
