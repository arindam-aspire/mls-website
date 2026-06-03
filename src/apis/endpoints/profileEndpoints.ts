export const profileEndpoints = {
  UPDATE_PROFILE: "/auth/me",
  REQUEST_PROFILE_UPDATE: "/auth/me/profile/request",
  VERIFY_PROFILE_UPDATE: "/auth/me/profile/verify",
  UPLOAD_PROFILE_PICTURE: "/auth/me/profile-picture",
  DELETE_PROFILE_PICTURE: "/auth/me/profile-picture",
} as const;
