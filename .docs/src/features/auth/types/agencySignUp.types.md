# File Overview

Agency registration request/response types for `POST /agency/register`.

**Source:** `src/features/auth/types/agencySignUp.types.ts`

# Exports

- `AgencySignUpRequest` — API payload fields (multipart)
- `AgencySignUpResponse`
- `AgencySignUpSubmitValues` — form submit shape before mapping to API

# API Usage

| Field | Source |
| --- | --- |
| `agency_name` | Agency legal name |
| `agency_trade_name` | Trade / DBA name |
| `email` | Agency email |
| `phone_number` | `{dialCode}{nationalNumber}` (no space) |
| `password` | Account password |
| `legal_document` | Uploaded PDF/JPG/PNG file (max 10 MB) |

Endpoint: `POST /agency/register` (`multipart/form-data`).

# Dependencies

- [AgencySignUpForm.md](../components/AgencySignUpForm.md)
- [AgencyRegistrationScreen.md](../screens/AgencyRegistrationScreen.md)
