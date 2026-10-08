import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { SocialOAuthPublicConfig } from "../../../configs/environment.config.ts";
import {
  buildCognitoLogoutUrl,
  consumeSocialOAuthPending,
  createSocialAuthorizeRequest,
  isAllowedSocialRedirectUri,
  isSocialOAuthCancellation,
  parseSocialOAuthCallback,
  readEmailFromIdToken,
  resolveCognitoEndpoint,
  resolveCognitoTokenEndpoint,
  resolveSocialRedirectUri,
  saveSocialOAuthPending,
  type SocialOAuthPending,
} from "./socialOAuth.ts";
import { isSocialAccountRole } from "../types/socialLogin.types.ts";

const config: SocialOAuthPublicConfig = {
  cognitoDomain: "auth.example.test",
  cognitoAppClientId: "cognito-client",
  googleIdentityProvider: "Google",
  facebookIdentityProvider: "Facebook",
  oauthScopes: "",
  redirectUriOverride: "",
  authorizeUrlOverride: "",
  logoutUri: "https://mls.example.test/en",
};

function memoryStore() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
    removeItem: (key: string) => {
      values.delete(key);
    },
  };
}

describe("social oauth", () => {
  it("builds a Google authorize URL without the selected role or a client secret", async () => {
    const redirectUri = "https://mls.example.test/en/auth/social/callback";
    const request = await createSocialAuthorizeRequest({
      provider: "google",
      config,
      redirectUri,
      role: "owner",
      locale: "en",
    });

    assert.ok(request);
    const url = new URL(request.url);
    assert.equal(url.origin + url.pathname, "https://auth.example.test/oauth2/authorize");
    assert.equal(url.searchParams.get("client_id"), "cognito-client");
    assert.equal(url.searchParams.get("identity_provider"), "Google");
    assert.equal(url.searchParams.get("redirect_uri"), redirectUri);
    assert.equal(url.searchParams.get("response_type"), "code");
    assert.equal(url.searchParams.get("code_challenge_method"), "S256");
    assert.equal(url.searchParams.get("scope"), "openid email profile");
    assert.equal(url.searchParams.has("client_secret"), false);
    assert.equal(url.searchParams.has("role"), false);
    assert.equal(request.pending.role, "owner");
    assert.equal(request.pending.provider, "google");
  });

  it("sends Facebook through the same Cognito client", async () => {
    const request = await createSocialAuthorizeRequest({
      provider: "facebook",
      config,
      redirectUri: "https://mls.example.test/ar/auth/social/callback",
      role: "registered_user",
      locale: "ar",
    });

    assert.ok(request);
    const url = new URL(request.url);
    assert.equal(url.origin + url.pathname, "https://auth.example.test/oauth2/authorize");
    assert.equal(url.searchParams.get("client_id"), "cognito-client");
    assert.equal(url.searchParams.get("identity_provider"), "Facebook");
    assert.equal(url.searchParams.has("role"), false);
    assert.equal(request.pending.role, "registered_user");
  });

  it("returns null when the Cognito client or provider name is missing", async () => {
    const redirectUri = "https://mls.example.test/ar/auth/social/callback";
    assert.equal(
      await createSocialAuthorizeRequest({
        provider: "facebook",
        config: { ...config, facebookIdentityProvider: "" },
        redirectUri,
        role: "registered_user",
        locale: "ar",
      }),
      null,
    );
    assert.equal(
      await createSocialAuthorizeRequest({
        provider: "google",
        config: { ...config, cognitoAppClientId: "" },
        redirectUri,
        role: "owner",
        locale: "en",
      }),
      null,
    );
  });

  it("builds Cognito token and logout URLs from the configured domain", () => {
    assert.equal(
      resolveCognitoEndpoint("auth.example.test", "/oauth2/token"),
      "https://auth.example.test/oauth2/token",
    );
    assert.equal(
      resolveCognitoTokenEndpoint({
        domain: "https://auth.example.test",
        tokenUrlOverride: "",
      }),
      "https://auth.example.test/oauth2/token",
    );
    assert.equal(
      buildCognitoLogoutUrl({
        domain: "auth.example.test",
        clientId: "cognito-client",
        logoutUri: "https://mls.example.test/en",
      }),
      "https://auth.example.test/logout?client_id=cognito-client&logout_uri=https%3A%2F%2Fmls.example.test%2Fen",
    );
    assert.equal(
      buildCognitoLogoutUrl({
        domain: "auth.example.test",
        clientId: "cognito-client",
        logoutUri: "",
      }),
      null,
    );
  });

  it("keeps the redirect on the locale callback path", () => {
    assert.equal(
      resolveSocialRedirectUri({
        origin: "https://mls.example.test/",
        locale: "fr",
        override: "",
      }),
      "https://mls.example.test/fr/auth/social/callback",
    );
    assert.equal(
      resolveSocialRedirectUri({
        origin: "https://mls.example.test",
        locale: "en",
        override: "https://mls.example.test/en/auth/social/callback",
      }),
      "https://mls.example.test/en/auth/social/callback",
    );
  });

  it("rejects a redirect URI for another site when the app origin is set", () => {
    assert.equal(
      isAllowedSocialRedirectUri("https://evil.example/en/auth/social/callback", {
        appUrl: "https://mls.example.test",
        override: "",
      }),
      false,
    );
    assert.equal(
      isAllowedSocialRedirectUri("https://mls.example.test/es/auth/social/callback", {
        appUrl: "https://mls.example.test",
        override: "",
      }),
      true,
    );
  });

  it("treats provider cancellation as a cancel and not a token", () => {
    assert.equal(isSocialOAuthCancellation("access_denied"), true);
    assert.equal(isSocialOAuthCancellation("user_denied"), true);
    assert.equal(
      parseSocialOAuthCallback("?error=access_denied&state=abc").error,
      "access_denied",
    );
    assert.equal(parseSocialOAuthCallback("?code=abc&state=xyz").code, "abc");
  });

  it("consumes a pending User or Owner role only once", () => {
    const storage = memoryStore();
    const pending: SocialOAuthPending = {
      state: "state-1",
      provider: "facebook",
      role: "registered_user",
      codeVerifier: "verifier",
      redirectUri: "https://mls.example.test/en/auth/social/callback",
      locale: "en",
      createdAt: Date.now(),
    };
    saveSocialOAuthPending(pending, storage);
    assert.equal(consumeSocialOAuthPending("state-1", storage)?.role, "registered_user");
    assert.equal(consumeSocialOAuthPending("state-1", storage), null);
  });

  it("does not accept agency or agent as a social role", () => {
    assert.equal(isSocialAccountRole("owner"), true);
    assert.equal(isSocialAccountRole("registered_user"), true);
    assert.equal(isSocialAccountRole("admin"), false);
    assert.equal(isSocialAccountRole("agent"), false);
  });

  it("reads an email claim without throwing on a malformed token", () => {
    const payload = Buffer.from(JSON.stringify({ email: "owner@example.com" })).toString("base64url");
    assert.equal(readEmailFromIdToken(`header.${payload}.sig`), "owner@example.com");
    assert.equal(readEmailFromIdToken("not-a-token"), null);
  });
});
