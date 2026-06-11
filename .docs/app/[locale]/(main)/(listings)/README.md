# Route group `(listings)` — `app/[locale]/(main)/(listings)/`



Nested route group under `(main)` for owner and agency/agent listing screens. Group name does **not** appear in the URL.



## Pages



| File | URL | Screen | Guard |

| --- | --- | --- | --- |

| [my-listings/page.md](./my-listings/page.md) | `/en/my-listings` | `ListingPropertyScreen` | `useAuthorize("MY_LISTINGS")` |

| [manage-listings/page.md](./manage-listings/page.md) | `/en/manage-listings` | `ManageListingsScreen` | `useAuthorize("MANAGE_LISTINGS")` |

| [draft-listings/page.md](./draft-listings/page.md) | `/en/draft-listings` | `DraftListingsScreen` | `useAuthorize("DRAFT_LISTINGS")` |

| [property-create/page.md](./property-create/page.md) | `/en/property-create` | `PropertyCreateScreen` | `useAuthorize("PROPERTY_CREATE")` |

| [property-update/page.md](./property-update/page.md) | `/en/property-update` | `PropertyUpdateScreen` | `useAuthorize("MY_LISTINGS")` |



## Architecture



```

(main)/layout.tsx (ProtectedLayout)

  (listings)/

    my-listings/page.tsx

    manage-listings/page.tsx

    draft-listings/page.tsx

    property-create/page.tsx

    property-update/page.tsx

```

