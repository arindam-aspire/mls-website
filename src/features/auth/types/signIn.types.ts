export type SignInFormValues = {
  username: string;
  password: string;
  rememberMe: boolean;
};

export type SignInRequest = {
  username: string;
  password: string;
  rememberMe: boolean;
};

export type SignInTokens = {
  access_token: string;
  refresh_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
  requires_password_set: boolean;
  remember_me_cookie: boolean;
};

export type SignInResponse = {
  success: boolean;
  message: string;
  data: SignInTokens;
  error: unknown;
  meta: Record<string, unknown>;
};
