# File Overview



User-scoped API path builders (authenticated).



**Source:** `src/apis/endpoints/userEndpoints.ts`



# Exports



| Constant | Method | Path | Auth |

| --- | --- | --- | --- |

| `RECENT_VIEWS` | POST | `/users/recent-views` body `{ property_hash_id }` | Yes |
| `RECENT_VIEWS` | DELETE | `/users/recent-views` (clear all) | Yes |
| `RECENT_VIEW_REMOVE(propertyId)` | DELETE | `/users/recent-views/{propertyId}` | Yes |
| `RECENT_VIEWS_LIST(params)` | GET | `/users/recent-views?page=&pageSize=` | Yes |



# Dependencies



- Consumed by `getRecentViewsList` and `addRecentView` in `src/features/property/services/property.service.ts`

