# File Overview

Client hook that returns a debounced copy of a value after a delay.

**Source:** `src/hooks/useDebounce.ts` (Client Component)

# Responsibilities

- Delay updating the returned value until `delayMs` has elapsed without `value` changing.
- When `delayMs <= 0`, return `value` immediately (no debounce).

# Exports

- `useDebounce<T>(value: T, delayMs: number): T`

# Dependencies

- Used by [search-input/index.md](../components/ui/search-input/index.md) for debounced `onChange`.

# Notes

- Cleans up the timeout on value change or unmount.
