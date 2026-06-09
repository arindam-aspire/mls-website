# File Overview



Screen hook for `RecentlyViewedScreen`: paginated recent views, favourite flags, clear-all, and list handlers.



**Source:** `src/features/property/hooks/useRecentlyViewedScreen.ts`



# API Usage



- `GET /users/recent-views?page=&pageSize=` — mapped via `mapRecentViewsListResponse`

- `DELETE /users/recent-views/{propertyId}` — per-card delete (after `ConfirmModal` confirm)
- `DELETE /users/recent-views` — clear all from toolbar (after `ConfirmModal` confirm)

- Favourites: `usePropertyFavouriteToggle` (same add/remove flow as `usePropertyList`)



# Return values



| Key | Purpose |

| --- | --- |

| `listings` | `PropertyListing[]` with favourite flags |

| `pageTitle` / `pageSubtitle` | Header copy |

| `clearRecentViewsLabel` / `onClearRecentViews` / `clearConfirmModal` | Clear toolbar opens confirm modal; `isClearingRecentViews` on modal |

| `isLoading` | Until first fetch or while list mutation pending |

| `pagination` | Page/size controls |

| `noDataFound` | Empty-state copy + browse CTA label |

| `onBrowseProperties` / `onClickProperty` | Navigation |

| `toggleFavourite` | Heart toggle via global favourites APIs |

| `onClickDelete` | Opens delete confirm modal (`pendingDeleteItem`) |

| `deleteConfirmModal` | `{ open, title, description, confirmLabel, cancelLabel, deletingLabel, isLoading, onClose, onConfirm }` |

| `onClickEmail` / `onClickCall` / `onClickWhatsApp` | Upcoming feature modal |

| `upcomingFeatureModal` | `{ open, onClose }` |

