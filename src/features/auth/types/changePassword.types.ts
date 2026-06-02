export type ChangePasswordRequest = {
  password: string;
  previous_password: string;
};

export type ChangePasswordResponse = {
  success: boolean;
  message: string;
  data: unknown;
  error: unknown;
  meta: Record<string, unknown>;
};
