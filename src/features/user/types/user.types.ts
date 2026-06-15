/** Request body for `PATCH /users/agency`. */
export type AssignUserAgencyRequest = {
  agencyId: string;
};

export type AssignUserAgencyResponse = {
  success: boolean;
  message: string | null;
  data: unknown;
  error: unknown;
  meta: Record<string, unknown>;
};
