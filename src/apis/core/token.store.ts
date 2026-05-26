import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

const cookieOptions: Cookies.CookieAttributes = {
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
  expires: 7, // days
};

export const tokenStore = {
  // Access token
  getAccessToken: (): string | undefined => {
    return Cookies.get(ACCESS_TOKEN_KEY);
  },
  setAccessToken: (token: string): void => {
    Cookies.set(ACCESS_TOKEN_KEY, token, {
      ...cookieOptions,
      expires: 1, // 1 day for access token
    });
  },
  removeAccessToken: (): void => {
    Cookies.remove(ACCESS_TOKEN_KEY);
  },

  // Refresh token
  getRefreshToken: (): string | undefined => {
    return Cookies.get(REFRESH_TOKEN_KEY);
  },
  setRefreshToken: (token: string): void => {
    Cookies.set(REFRESH_TOKEN_KEY, token, {
      ...cookieOptions,
      expires: 7, // 7 days for refresh token
    });
  },
  removeRefreshToken: (): void => {
    Cookies.remove(REFRESH_TOKEN_KEY);
  },

  // Clear all tokens (logout)
  clearTokens: (): void => {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
  },
};