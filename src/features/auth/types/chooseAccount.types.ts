export type ChooseAccountMode = "signin" | "signup";

export const CHOOSE_ACCOUNT_TYPES = [
  "agency",
  "owner",
  "user",
  "agent",
] as const;

export type ChooseAccountType = (typeof CHOOSE_ACCOUNT_TYPES)[number];
