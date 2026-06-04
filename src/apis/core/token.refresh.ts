import axios from "axios";
import { authEndpoints } from "@/src/apis/endpoints/authEndpoints";
import { tokenStore } from "./token.store";
import { API_BASE_URL } from "@/src/configs/environment.config";

let refreshing = false;
let refreshPromise: Promise<boolean> | null = null;

type RefreshTokenRequestBody = {
  username: string;
  refresh_token?: string;
};

type RefreshTokenPayload = {
  access_token: string;
  refresh_token?: string | null;
  remember_me_cookie?: boolean;
};

/** Remember me true → `{ username }`; false → `{ username, refresh_token }`. */
function buildRefreshTokenBody(): RefreshTokenRequestBody | null {
  const username = tokenStore.getUsername();
  if (!username) return null;

  if (tokenStore.getRememberMe()) {
    return { username };
  }

  const refreshTokenValue = tokenStore.getRefreshToken();
  if (!refreshTokenValue) return null;

  return { username, refresh_token: refreshTokenValue };
}

function parseRefreshPayload(data: unknown): RefreshTokenPayload | null {
  if (!data || typeof data !== "object") return null;

  const root = data as Record<string, unknown>;
  const nested = root.data;
  const payload =
    nested && typeof nested === "object"
      ? (nested as Record<string, unknown>)
      : root;

  if (typeof payload.access_token !== "string") return null;

  return {
    access_token: payload.access_token,
    refresh_token:
      typeof payload.refresh_token === "string"
        ? payload.refresh_token
        : payload.refresh_token === null
          ? null
          : undefined,
    remember_me_cookie:
      typeof payload.remember_me_cookie === "boolean"
        ? payload.remember_me_cookie
        : undefined,
  };
}

export async function refreshToken(): Promise<boolean> {
  if (refreshing && refreshPromise) return refreshPromise;

  if (!tokenStore.canRefreshSession()) return false;

  refreshing = true;

  refreshPromise = (async () => {
    try {
      const body = buildRefreshTokenBody();
      if (!body) {
        tokenStore.clearTokens();
        return false;
      }

      const res = await axios.post(
        `${API_BASE_URL}${authEndpoints.REFRESH}`,
        body,
        { withCredentials: true },
      );

      const payload = parseRefreshPayload(res.data);
      if (!payload) {
        tokenStore.clearTokens();
        return false;
      }

      const rememberMeCookie =
        payload.remember_me_cookie ?? tokenStore.getRememberMe();

      tokenStore.setSessionTokens({
        accessToken: payload.access_token,
        refreshToken: payload.refresh_token,
        rememberMeCookie,
      });

      return true;
    } catch {
      tokenStore.clearTokens();
      return false;
    } finally {
      refreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
