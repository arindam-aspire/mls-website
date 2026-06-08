# notification-icons.ts

**Source:** `src/features/notifications/constants/notification-icons.ts`

## File Overview

Lucide icon map for notification event categories. Keys are semantic notification types (e.g. `SAVED_SEARCH_CREATED`, `PROPERTY_APPROVED`).

## Exports

| Export | Description |
| --- | --- |
| `notificationIcons` | `as const` map of notification type → `LucideIcon` |
| `NotificationIconKey` | Union of keys in `notificationIcons` |
| `NOTIFICATION_DEFAULT_ICON` | `Bell` fallback |
| `getNotificationIcon(typeKey, eventType?)` | Resolves API `typeKey` / `eventType` (e.g. `saved_search.created`) to icon |

## Type key mapping

API keys use dot notation (`saved_search.created`); icon keys use `SCREAMING_SNAKE_CASE` (`SAVED_SEARCH_CREATED`). `getNotificationIcon` normalizes dots to underscores and uppercases before lookup.

## Icon groups

| Group | Keys |
| --- | --- |
| Property | `PROPERTY_SUBMISSION`, `PROPERTY_EDITED`, `PROPERTY_DEACTIVATED`, `PROPERTY_APPROVED`, `PROPERTY_REJECTED`, `PROPERTY_EXPIRY`, `PROPERTY_STATUS_UPDATE` |
| Lead | `LEAD_CREATED`, `LEAD_ASSIGNED`, `LEAD_STATUS_CHANGED`, `LEAD_MESSAGE`, `LEAD_CLOSURE_*` |
| Deal | `DEAL_CLOSURE_REQUEST`, `DEAL_CLOSURE_APPROVED`, `DEAL_CLOSURE_REJECTED` |
| Saved search | `SAVED_SEARCH_CREATED`, `SAVED_SEARCH_MATCH` |
| Account / system | `CONTACT_US_MESSAGE`, `SUBSCRIPTION_*`, `PAYMENT_*`, `AGENT_INVITATION`, `PASSWORD_RESET`, `LOGIN_ALERT`, `ACCOUNT_UPDATE`, `SYSTEM_ANNOUNCEMENT`, `MAINTENANCE_NOTIFICATION` |

## Usage

```tsx
import { notificationIcons } from "../constants/notification-icons";

const Icon = notificationIcons.SAVED_SEARCH_CREATED;
<Icon className="size-5" aria-hidden />
```

## Notes

- Map API `typeKey` / `eventType` strings to `NotificationIconKey` in a separate util when wiring list UI.
