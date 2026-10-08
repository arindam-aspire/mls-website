import { NextResponse } from "next/server";
import {
  APP_URL,
  readSocialOAuthPublicConfig,
} from "@/src/configs/environment.config";
import {
  isAllowedSocialRedirectUri,
  isSocialOAuthProvider,
  resolveCognitoTokenEndpoint,
} from "@/src/features/auth/utils/socialOAuth";

export const dynamic = "force-dynamic";

const MAX_CODE_LENGTH = 2048;
const MAX_VERIFIER_LENGTH = 128;

function readBoundedString(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) return "";
  return trimmed;
}

function jsonError(code: string, status: number) {
  return NextResponse.json({ code }, { status });
}

function readServerEnv(name: string): string {
  return (process.env[name] ?? "").trim();
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("SOCIAL_TOKEN_INVALID", 400);
  }

  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : null;
  const provider = readBoundedString(record?.provider, 32).toLowerCase();
  const code = readBoundedString(record?.code, MAX_CODE_LENGTH);
  const codeVerifier = readBoundedString(record?.codeVerifier, MAX_VERIFIER_LENGTH);
  const redirectUri = readBoundedString(record?.redirectUri, 500);

  if (!isSocialOAuthProvider(provider) || !code || !codeVerifier || !redirectUri) {
    return jsonError("SOCIAL_TOKEN_MISSING", 400);
  }

  const publicConfig = readSocialOAuthPublicConfig();
  const requestOrigin = new URL(request.url).origin;
  if (
    !isAllowedSocialRedirectUri(redirectUri, {
      appUrl: APP_URL || requestOrigin,
      override: publicConfig.redirectUriOverride,
    })
  ) {
    return jsonError("SOCIAL_TOKEN_INVALID", 400);
  }

  const clientId = readServerEnv("COGNITO_APP_CLIENT_ID") || publicConfig.cognitoAppClientId;
  const clientSecret = readServerEnv("COGNITO_APP_CLIENT_SECRET");
  const domain = readServerEnv("COGNITO_DOMAIN") || publicConfig.cognitoDomain;
  const tokenUrl = resolveCognitoTokenEndpoint({
    domain,
    tokenUrlOverride: readServerEnv("COGNITO_OAUTH_TOKEN_URL"),
  });

  if (!clientId || !tokenUrl) {
    return jsonError("SOCIAL_PROVIDER_NOT_CONFIGURED", 503);
  }

  let tokenEndpoint: URL;
  try {
    tokenEndpoint = new URL(tokenUrl);
  } catch {
    return jsonError("SOCIAL_PROVIDER_NOT_CONFIGURED", 503);
  }

  const form = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    code,
    code_verifier: codeVerifier,
    grant_type: "authorization_code",
  });
  if (clientSecret) {
    form.set("client_secret", clientSecret);
  }

  let tokenResponse: Response;
  try {
    tokenResponse = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: form,
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });
  } catch {
    return jsonError("SOCIAL_PROVIDER_UNAVAILABLE", 503);
  }

  let payload: unknown = null;
  try {
    payload = await tokenResponse.json();
  } catch {
    payload = null;
  }

  const tokenRecord =
    payload && typeof payload === "object" ? (payload as Record<string, unknown>) : null;

  if (!tokenResponse.ok || !tokenRecord) {
    const providerError = typeof tokenRecord?.error === "string" ? tokenRecord.error : "";
    if (providerError === "invalid_grant") {
      return jsonError("SOCIAL_TOKEN_EXPIRED", 401);
    }
    if (providerError === "invalid_client") {
      return jsonError("SOCIAL_PROVIDER_NOT_CONFIGURED", 503);
    }
    return jsonError("SOCIAL_TOKEN_INVALID", 401);
  }

  const idToken = readBoundedString(tokenRecord.id_token, 10000);
  if (!idToken) {
    return jsonError("SOCIAL_TOKEN_MISSING", 401);
  }

  return NextResponse.json({ id_token: idToken });
}
