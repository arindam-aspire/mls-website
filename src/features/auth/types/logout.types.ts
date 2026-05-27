export type LogoutResponse = {
  success: boolean;
  message: string;
  data: boolean;
  error: unknown;
  meta: Record<string, unknown>;
};
