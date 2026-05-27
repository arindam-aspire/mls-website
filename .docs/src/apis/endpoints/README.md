# API endpoints (`src/apis/endpoints/`)

Central path constants for backend routes.

| File | Contents |
| --- | --- |
| [authEndpoints.md](./authEndpoints.md) | Login, OTP, me, logout, signup, … |
| [publicEndpoints.md](./publicEndpoints.md) | `/property-taxonomy` |
| [propertyEndpoints.md](./propertyEndpoints.md) | Reserved (empty) |
| [index.md](./index.md) | Re-exports all endpoint modules |

## Usage

```ts
import { authEndpoints } from "@/src/apis/endpoints/authEndpoints";
```

Do not hardcode paths in services — import from here.
