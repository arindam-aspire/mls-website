import type { SocialOAuthPublicConfig } from "../../../configs/environment.config";
import { routing, type AppLocale } from "../../../i18n/routing";
import {
  isSocialAccountRole,
  type SocialAccountRole,
} from "../types/socialLogin.types";

export const SOCIAL_OAUTH_CALLBACK_PATH = "/auth/social/callback";
export const SOCIAL_OAUTH_EXCHANGE_PATH = "/api/auth/social/exchange";

const PENDING_STORAGE_KEY = "mls_social_oauth_pending";
const HOSTED_SESSION_KEY = "mls_cognito_hosted_session";
/** Browsing-context name for the provider window. It survives the hop to Cognito and back. */
export const SOCIAL_OAUTH_WINDOW_NAME = "mls-social-oauth";
export const SOCIAL_OAUTH_RESULT_KEY = "mls_social_oauth_result";
const PENDING_TTL_MS = 15 * 60 * 1000;
/** OIDC scopes Cognito must issue so the ID token can carry email and profile. */
export const COGNITO_OIDC_SCOPES = "openid email profile";
const COGNITO_AUTHORIZE_PATH = "/oauth2/authorize";
const COGNITO_TOKEN_PATH = "/oauth2/token";
const COGNITO_LOGOUT_PATH = "/logout";

export type SocialOAuthProvider = "google" | "facebook";

export type SocialOAuthPending = {
  state: string;
  provider: SocialOAuthProvider;
  role: SocialAccountRole;
  codeVerifier: string;
  redirectUri: string;
  locale: AppLocale;
  createdAt: number;
};

export type SocialOAuthCallbackQuery = {
  code: string | null;
  state: string | null;
  error: string | null;
};

export type SocialOAuthExchangeResult =
  | { ok: true; idToken: string }
  | { ok: false; code: string };

type KeyValueStore = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

function browserStore(): KeyValueStore | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function browserLocalStore(): KeyValueStore | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/** Hosted-UI origin plus a Cognito OAuth path. The host always comes from configuration. */
export function resolveCognitoEndpoint(domain: string, pathname: string): string | null {
  const trimmed = domain.trim().replace(/\/+$/, "");
  if (!trimmed || !pathname.startsWith("/")) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let url: URL;
  try {
    url = new URL(withProtocol);
  } catch {
    return null;
  }

  if (url.username || url.password || url.search || url.hash) return null;
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (url.pathname !== "/" && url.pathname !== "") return null;

  return `${url.protocol}//${url.host}${pathname}`;
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function randomToken(byteLength = 32): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return bytesToBase64Url(bytes);
}

async function sha256Base64Url(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return bytesToBase64Url(new Uint8Array(digest));
}

export function isSocialOAuthProvider(value: string): value is SocialOAuthProvider {
  return value === "google" || value === "facebook";
}

export function isAppLocale(value: string): value is AppLocale {
  return (routing.locales as readonly string[]).includes(value);
}

export function resolveSocialRedirectUri(input: {
  origin: string;
  locale: string;
  override: string;
}): string | null {
  const override = input.override.trim();
  if (override) {
    return override;
  }

  const origin = trimTrailingSlash(input.origin.trim());
  if (!origin || !isAppLocale(input.locale)) {
    return null;
  }

  return `${origin}/${input.locale}${SOCIAL_OAUTH_CALLBACK_PATH}`;
}

export function isAllowedSocialRedirectUri(
  redirectUri: string,
  options: { appUrl: string; override: string },
): boolean {
  let url: URL;
  try {
    url = new URL(redirectUri);
  } catch {
    return false;
  }

  if (url.username || url.password || url.hash || url.search) {
    return false;
  }

  if (!/^\/(en|ar|es|fr)\/auth\/social\/callback\/?$/.test(url.pathname)) {
    return false;
  }

  const normalized = trimTrailingSlash(`${url.origin}${url.pathname}`);
  const override = options.override.trim();
  if (override) {
    try {
      const expected = new URL(override);
      const expectedNormalized = trimTrailingSlash(`${expected.origin}${expected.pathname}`);
      return normalized === expectedNormalized;
    } catch {
      return false;
    }
  }

  const appUrl = trimTrailingSlash(options.appUrl.trim());
  if (appUrl) {
    return trimTrailingSlash(url.origin) === appUrl;
  }

  return url.protocol === "https:" || url.protocol === "http:";
}

export function parseSocialOAuthCallback(search: string): SocialOAuthCallbackQuery {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const read = (key: string) => {
    const value = params.get(key)?.trim() ?? "";
    return value || null;
  };

  return {
    code: read("code"),
    state: read("state"),
    error: read("error") ?? read("error_reason"),
  };
}

export function isSocialOAuthCancellation(error: string | null): boolean {
  if (!error) return false;
  const normalized = error.trim().toLowerCase();
  return normalized === "access_denied" || normalized === "user_denied" || normalized === "user_cancelled";
}

export async function createSocialAuthorizeRequest(input: {
  provider: SocialOAuthProvider;
  config: SocialOAuthPublicConfig;
  redirectUri: string;
  role: SocialAccountRole;
  locale: AppLocale;
}): Promise<{ url: string; pending: SocialOAuthPending } | null> {
  if (!isSocialAccountRole(input.role)) {
    return null;
  }

  const clientId = input.config.cognitoAppClientId.trim();
  const identityProvider = (
    input.provider === "google"
      ? input.config.googleIdentityProvider
      : input.config.facebookIdentityProvider
  ).trim();
  const authorizeUrl =
    input.config.authorizeUrlOverride.trim() ||
    resolveCognitoEndpoint(input.config.cognitoDomain, COGNITO_AUTHORIZE_PATH) ||
    "";
  const scope = input.config.oauthScopes.trim() || COGNITO_OIDC_SCOPES;

  if (!clientId || !identityProvider || !authorizeUrl || !input.redirectUri) {
    return null;
  }

  let endpoint: URL;
  try {
    endpoint = new URL(authorizeUrl);
  } catch {
    return null;
  }

  const state = randomToken();
  const codeVerifier = randomToken(48);
  const codeChallenge = await sha256Base64Url(codeVerifier);

  endpoint.searchParams.set("client_id", clientId);
  endpoint.searchParams.set("redirect_uri", input.redirectUri);
  endpoint.searchParams.set("response_type", "code");
  endpoint.searchParams.set("scope", scope);
  endpoint.searchParams.set("identity_provider", identityProvider);
  endpoint.searchParams.set("state", state);
  endpoint.searchParams.set("code_challenge", codeChallenge);
  endpoint.searchParams.set("code_challenge_method", "S256");

  const pending: SocialOAuthPending = {
    state,
    provider: input.provider,
    role: input.role,
    codeVerifier,
    redirectUri: input.redirectUri,
    locale: input.locale,
    createdAt: Date.now(),
  };

  return { url: endpoint.toString(), pending };
}

function parsePending(raw: string | null): SocialOAuthPending | null {
  if (!raw) return null;

  try {
    const value = JSON.parse(raw) as Partial<SocialOAuthPending>;
    if (
      typeof value.state !== "string" ||
      !value.state ||
      typeof value.provider !== "string" ||
      !isSocialOAuthProvider(value.provider) ||
      typeof value.role !== "string" ||
      !isSocialAccountRole(value.role) ||
      typeof value.codeVerifier !== "string" ||
      !value.codeVerifier ||
      typeof value.redirectUri !== "string" ||
      !value.redirectUri ||
      typeof value.locale !== "string" ||
      !isAppLocale(value.locale) ||
      typeof value.createdAt !== "number"
    ) {
      return null;
    }

    if (Date.now() - value.createdAt > PENDING_TTL_MS) {
      return null;
    }

    return {
      state: value.state,
      provider: value.provider,
      role: value.role,
      codeVerifier: value.codeVerifier,
      redirectUri: value.redirectUri,
      locale: value.locale,
      createdAt: value.createdAt,
    };
  } catch {
    return null;
  }
}

export function saveSocialOAuthPending(
  pending: SocialOAuthPending,
  storage: KeyValueStore | null = browserStore(),
): void {
  storage?.setItem(PENDING_STORAGE_KEY, JSON.stringify(pending));
}

export function readSocialOAuthPending(
  storage: KeyValueStore | null = browserStore(),
): SocialOAuthPending | null {
  const pending = parsePending(storage?.getItem(PENDING_STORAGE_KEY) ?? null);
  if (!pending && storage?.getItem(PENDING_STORAGE_KEY)) {
    storage.removeItem(PENDING_STORAGE_KEY);
  }
  return pending;
}

/** Returns the pending login once. A second read with the same state does not repeat the API call. */
export function consumeSocialOAuthPending(
  state: string,
  storage: KeyValueStore | null = browserStore(),
): SocialOAuthPending | null {
  const pending = readSocialOAuthPending(storage);
  if (!pending || pending.state !== state) {
    return null;
  }
  storage?.removeItem(PENDING_STORAGE_KEY);
  return pending;
}

export function clearSocialOAuthPending(storage: KeyValueStore | null = browserStore()): void {
  storage?.removeItem(PENDING_STORAGE_KEY);
}

export type SocialOAuthPopupResult =
  | {
      status: "success";
      locale: AppLocale;
      role: SocialAccountRole;
      requiresPasswordSet: boolean;
      rememberMeCookie: boolean;
      at: number;
    }
  | {
      status: "error";
      title: string;
      description: string;
      at: number;
    }
  | { status: "cancelled"; at: number };

/** Opens a blank provider window during the click, before any async work, so the browser allows it. */
export function openSocialOAuthWindow(): Window | null {
  const width = 520;
  const height = 720;
  const left = Math.max(window.screenX + (window.outerWidth - width) / 2, 0);
  const top = Math.max(window.screenY + (window.outerHeight - height) / 2, 0);
  const popup = window.open(
    "about:blank",
    SOCIAL_OAUTH_WINDOW_NAME,
    `popup=yes,width=${width},height=${height},left=${Math.round(left)},top=${Math.round(top)}`,
  );
  if (!popup) return null;
  popup.name = SOCIAL_OAUTH_WINDOW_NAME;
  return popup;
}

export function isSocialOAuthPopup(): boolean {
  return window.name === SOCIAL_OAUTH_WINDOW_NAME;
}

export function publishSocialOAuthPopupResult(result: SocialOAuthPopupResult): void {
  window.localStorage.setItem(SOCIAL_OAUTH_RESULT_KEY, JSON.stringify(result));
}

export function takeSocialOAuthPopupResult(): SocialOAuthPopupResult | null {
  const raw = window.localStorage.getItem(SOCIAL_OAUTH_RESULT_KEY);
  if (!raw) return null;
  window.localStorage.removeItem(SOCIAL_OAUTH_RESULT_KEY);
  return parseSocialOAuthPopupResult(raw);
}

export function parseSocialOAuthPopupResult(raw: string): SocialOAuthPopupResult | null {
  try {
    const value = JSON.parse(raw) as Partial<SocialOAuthPopupResult>;
    if (!value || typeof value !== "object" || typeof value.at !== "number") return null;
    if (value.status === "cancelled") return { status: "cancelled", at: value.at };
    if (value.status === "error") {
      if (typeof value.title !== "string" || typeof value.description !== "string") return null;
      return { status: "error", title: value.title, description: value.description, at: value.at };
    }
    if (value.status === "success") {
      if (typeof value.locale !== "string" || !isAppLocale(value.locale)) return null;
      if (typeof value.role !== "string" || !isSocialAccountRole(value.role)) return null;
      return {
        status: "success",
        locale: value.locale,
        role: value.role,
        requiresPasswordSet: value.requiresPasswordSet === true,
        rememberMeCookie: value.rememberMeCookie === true,
        at: value.at,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function closeSocialOAuthPopup(): void {
  if (!isSocialOAuthPopup()) return;
  window.close();
}

/** Remember that this browser completed Cognito hosted UI, so logout can clear that session too. */
export function markCognitoHostedSession(storage: KeyValueStore | null = browserLocalStore()): void {
  storage?.setItem(HOSTED_SESSION_KEY, "1");
}

export function takeCognitoHostedSession(storage: KeyValueStore | null = browserLocalStore()): boolean {
  if (storage?.getItem(HOSTED_SESSION_KEY) !== "1") return false;
  storage.removeItem(HOSTED_SESSION_KEY);
  return true;
}

export function buildCognitoLogoutUrl(input: {
  domain: string;
  clientId: string;
  logoutUri: string;
}): string | null {
  const clientId = input.clientId.trim();
  const logoutUri = input.logoutUri.trim();
  const endpoint = resolveCognitoEndpoint(input.domain, COGNITO_LOGOUT_PATH);
  if (!endpoint || !clientId || !logoutUri) return null;

  let url: URL;
  try {
    url = new URL(endpoint);
    url.searchParams.set("client_id", clientId);
    url.searchParams.set("logout_uri", logoutUri);
  } catch {
    return null;
  }

  return url.toString();
}

export function resolveCognitoTokenEndpoint(input: {
  domain: string;
  tokenUrlOverride: string;
}): string | null {
  const override = input.tokenUrlOverride.trim();
  if (override) {
    try {
      const url = new URL(override);
      if (url.username || url.password || url.hash) return null;
      if (url.protocol !== "https:" && url.protocol !== "http:") return null;
      return url.toString();
    } catch {
      return null;
    }
  }

  return resolveCognitoEndpoint(input.domain, COGNITO_TOKEN_PATH);
}

export function readEmailFromIdToken(idToken: string): string | null {
  try {
    const segment = idToken.split(".")[1];
    if (!segment) return null;
    const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const payload = JSON.parse(atob(padded)) as { email?: unknown };
    return typeof payload.email === "string" && payload.email.includes("@")
      ? payload.email
      : null;
  } catch {
    return null;
  }
}

export async function exchangeSocialAuthorizationCode(input: {
  provider: SocialOAuthProvider;
  code: string;
  codeVerifier: string;
  redirectUri: string;
}): Promise<SocialOAuthExchangeResult> {
  let response: Response;
  try {
    response = await fetch(SOCIAL_OAUTH_EXCHANGE_PATH, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        provider: input.provider,
        code: input.code,
        codeVerifier: input.codeVerifier,
        redirectUri: input.redirectUri,
      }),
    });
  } catch {
    return { ok: false, code: "NETWORK_ERROR" };
  }

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  const record =
    payload && typeof payload === "object" ? (payload as Record<string, unknown>) : null;

  if (!response.ok) {
    const code = typeof record?.code === "string" ? record.code : "SOCIAL_TOKEN_INVALID";
    return { ok: false, code };
  }

  const idToken = typeof record?.id_token === "string" ? record.id_token : "";
  if (!idToken) {
    return { ok: false, code: "SOCIAL_TOKEN_MISSING" };
  }

  return { ok: true, idToken };
}
