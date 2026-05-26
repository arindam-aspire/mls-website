export type SignInFormValues = {
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

export type Permission = {
  code: string;
  description: string;
  id: string;
  created_at: string;
};

export type Role = {
  name: string;
  description: string;
  id: string;
  permissions: Permission[];
  created_at: string;
};

export type LoggedInUser = {
  email: string;
  full_name: string;
  phone_number: string;
  id: string;
  is_active: boolean;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  profile_picture_url: string | null;
  roles: Role[];
  created_at: string;
  requires_password_set: boolean;
  status: string;
};

export type LoggedInUserResponse = {
  success: boolean;
  message: string | null;
  data: LoggedInUser;
  error: unknown;
  meta: Record<string, unknown>;
};