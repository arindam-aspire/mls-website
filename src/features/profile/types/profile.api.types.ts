import type { LoggedInUserResponse } from "@/src/features/auth/types/user.types";

export type UpdateProfileRequest = {
  email: string;
  phone_number: string;
};

export type UpdateProfileResponse = LoggedInUserResponse;

export type ProfileUpdateRequestBody = {
  email?: string;
  phone_number?: string;
};

export type ProfileUpdateRequestData = {
  message: string;
  requires_verification: boolean;
  verification_fields: string[];
  dev_phone_otp: string | null;
  dev_email_otp: string | null;
  otp: string | null;
};

export type ProfileUpdateRequestResponse = {
  success: boolean;
  message: string | null;
  data: ProfileUpdateRequestData;
  error: unknown;
  meta: Record<string, unknown>;
};

export type ProfilePhoneVerifyBody = {
  phone_number: string;
  phone_otp: string;
};

export type ProfileEmailVerifyBody = {
  email: string;
  email_otp: string;
};

export type ProfileUpdateVerifyBody = ProfilePhoneVerifyBody | ProfileEmailVerifyBody;

export type ProfileUpdateVerifyData = {
  message: string;
};

export type ProfileUpdateVerifyResponse = {
  success: boolean;
  message: string | null;
  data: ProfileUpdateVerifyData;
  error: unknown;
  meta: Record<string, unknown>;
};

export type ProfilePictureUploadRequest = {
  file_name: string;
  content_type: string;
  file_size: number;
};

export type ProfilePictureUploadData = {
  upload_url: string;
};

export type ProfilePictureUploadResponse = {
  success: boolean;
  message: string | null;
  data: ProfilePictureUploadData;
  error: unknown;
  meta: Record<string, unknown>;
};

export type DeleteProfilePictureResponse = LoggedInUserResponse;
