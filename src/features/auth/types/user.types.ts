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

/** Agency summary nested on `/auth/me` for agency portal users. */
export type LoggedInUserAgency = {
  agency_id: string;
  agency_name: string;
  agency_trade_name: string;
  email: string;
  phone: string;
  website: string | null;
};

export type LoggedInUser = {
  agency?: LoggedInUserAgency | null;
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
