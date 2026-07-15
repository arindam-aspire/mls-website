# `resolveInvitationFullName`

**Source:** `src/features/user/utils/resolveInvitationFullName.ts`

## File Overview

Normalizes the invitation validate API `fullName` before hydrating the onboarding form.

## Responsibilities

- Return an empty string when `fullName` is missing
- Return an empty string when `fullName` equals the invited `email` (case-insensitive)
- Return an empty string when `fullName` looks like an email (`@` present)
- Otherwise return the trimmed real name

## Why

On invite, the backend seeds `User.full_name` from the invited email when no name was supplied. Validate then returns that value as `fullName`, which must not appear in the required Full Name input.

## Exports

- `resolveInvitationFullName(fullName, email) → string`

## Consumers

- `validateAgentInvitation` in `agent.service.ts`
- `buildInitialFormValues` in `useAgentInviteScreen.ts`
