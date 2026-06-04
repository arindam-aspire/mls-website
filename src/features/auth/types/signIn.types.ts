export type SignInFormValues = {
  username: string;
  password: string;
  rememberMe: boolean;
};

export type SignInRole = "admin" | "owner" | "registered_user" | "agent";

export type SignInAccountType = "user" | "owner" | "agency" | "agent";

export function resolveSignInRole(type: SignInAccountType): SignInRole {
  switch (type) {
    case "agency":
      return "admin";
    case "owner":
      return "owner";
    case "user":
      return "registered_user";
    case "agent":
      return "agent";
  }
}

export type SignInRequest = {
  username: string;
  password: string;
  rememberMe: boolean;
  role: SignInRole;
};

export type SignInTokens = {
  access_token: string;
  /** Present when `remember_me_cookie` is false; null when server holds refresh via HttpOnly cookie. */
  refresh_token: string | null;
  id_token: string;
  token_type: string;
  expires_in: number;
  requires_password_set: boolean;
  /** When true, refresh uses `{}` + credentials; when false, client stores `refresh_token` for refresh body. */
  remember_me_cookie: boolean;
};

export type SignInResponse = {
  success: boolean;
  message: string;
  data: SignInTokens;
  error: unknown;
  meta: Record<string, unknown>;
};
