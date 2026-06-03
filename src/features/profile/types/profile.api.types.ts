import type { LoggedInUserResponse } from "@/src/features/auth/types/user.types";

export type UpdateProfileRequest = {
  email: string;
  phone_number: string;
};

export type UpdateProfileResponse = LoggedInUserResponse;
