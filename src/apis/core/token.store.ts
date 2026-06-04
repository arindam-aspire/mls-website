import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const REMEMBER_ME_KEY = "rememberMe";
const USERNAME_KEY = "username";

const cookieOptions: Cookies.CookieAttributes = {
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
};

const persistentCookieOptions: Cookies.CookieAttributes = {
  ...cookieOptions,
  expires: 7,
};

function rememberMeCookieOptions(rememberMe: boolean): Cookies.CookieAttributes {
  return rememberMe ? persistentCookieOptions : cookieOptions;
}

export const tokenStore = {
  // Access token
  getAccessToken: (): string | undefined => {
    return Cookies.get(ACCESS_TOKEN_KEY);
  },
  setAccessToken: (token: string): void => {
    Cookies.set(ACCESS_TOKEN_KEY, token, {
      ...cookieOptions,
      expires: 1,
    });
  },
  removeAccessToken: (): void => {
    Cookies.remove(ACCESS_TOKEN_KEY);
  },

  // Refresh token
  getRefreshToken: (): string | undefined => {
    return Cookies.get(REFRESH_TOKEN_KEY);
  },
  setRefreshToken: (token: string, rememberMe = true): void => {
    Cookies.set(REFRESH_TOKEN_KEY, token, rememberMeCookieOptions(rememberMe));
  },
  removeRefreshToken: (): void => {
    Cookies.remove(REFRESH_TOKEN_KEY);
  },

  // Mirrors API `remember_me_cookie` (server HttpOnly refresh vs client refresh_token cookie)
  getRememberMe: (): boolean => {
    return Cookies.get(REMEMBER_ME_KEY) === "true";
  },
  getUsername: (): string | undefined => {
    return Cookies.get(USERNAME_KEY);
  },
  setAuthPreferences: (rememberMe: boolean, username: string): void => {
    const options = rememberMeCookieOptions(rememberMe);
    Cookies.set(REMEMBER_ME_KEY, rememberMe ? "true" : "false", options);
    Cookies.set(USERNAME_KEY, username, options);
  },
  removeAuthPreferences: (): void => {
    Cookies.remove(REMEMBER_ME_KEY);
    Cookies.remove(USERNAME_KEY);
  },

  /**
   * Apply tokens after login or refresh.
   * `rememberMeCookie` true → drop client refresh_token; refresh POST body is `{ username }`.
   * `rememberMeCookie` false → persist `refreshToken` when provided; refresh body is `{ username, refresh_token }`.
   */
  setSessionTokens(params: {
    accessToken: string;
    refreshToken?: string | null;
    rememberMeCookie: boolean;
    username?: string;
  }): void {
    const { accessToken, refreshToken, rememberMeCookie, username } = params;

    this.setAccessToken(accessToken);

    if (rememberMeCookie) {
      this.removeRefreshToken();
    } else if (refreshToken) {
      this.setRefreshToken(refreshToken, false);
    }
    // remember_me_cookie false with null refresh in response: keep existing client refresh_token

    if (username) {
      this.setAuthPreferences(rememberMeCookie, username);
    }
  },

  /** Whether an authenticated API request may proceed. */
  hasAuthCredentials(): boolean {
    const accessToken = this.getAccessToken();
    if (!accessToken) return false;
    if (this.getRememberMe()) return true;
    return !!this.getRefreshToken();
  },

  /** Whether a refresh call can be attempted (see `token.refresh.ts` body rules). */
  canRefreshSession(): boolean {
    if (!this.getUsername()) return false;
    if (this.getRememberMe()) return true;
    return !!this.getRefreshToken();
  },

  // Clear all tokens and auth preferences (logout / refresh failure)
  clearTokens: (): void => {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    Cookies.remove(REMEMBER_ME_KEY);
    Cookies.remove(USERNAME_KEY);
  },
};
