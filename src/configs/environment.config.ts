// Environment configuration for client (Vite)

export interface EnvironmentConfig {
  baseUrl: string;
  environment: 'development' | 'production' | 'staging';
}

export function getEnvironmentConfig(): EnvironmentConfig {
  const environment = (process.env.NEXT_PUBLIC_API_BASE_URL || 'development') as
    | 'development'
    | 'production'
    | 'staging';

  const configs: Record<string, EnvironmentConfig> = {
    development: {
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev-api-abdn.wpsitedesigner.com/api/v1',
      environment: 'development',
    },
    production: {
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev-api-abdn.wpsitedesigner.com/api/v1',
      environment: 'production',
    },
    staging: {
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL|| 'https://dev-api-abdn.wpsitedesigner.com/api/v1',
      environment: 'staging',
    },
  };

  return configs[environment] || configs.development;
}

// Convenience exports with safe defaults for use across the app
const envConfig = getEnvironmentConfig();

export const API_BASE_URL = envConfig.baseUrl;

export const GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

/** Public frontend origin (`NEXT_PUBLIC_APP_URL`). Empty when unset — never a hardcoded host. */
export const APP_URL = trimTrailingSlash(process.env.NEXT_PUBLIC_APP_URL ?? '');

export type SocialOAuthPublicConfig = {
  /** Cognito hosted UI host, with or without a scheme. */
  cognitoDomain: string;
  cognitoAppClientId: string;
  /** Identity provider name configured on the Cognito app client. */
  googleIdentityProvider: string;
  facebookIdentityProvider: string;
  /** Space-separated OAuth scopes. Empty uses the OIDC default in the authorize helper. */
  oauthScopes: string;
  /** Exact registered redirect URI. Empty uses the current origin and locale callback path. */
  redirectUriOverride: string;
  /** Full authorize URL. Empty derives `https://{domain}/oauth2/authorize`. */
  authorizeUrlOverride: string;
  /** Allowed Cognito sign-out URL. Empty skips the hosted-UI logout redirect. */
  logoutUri: string;
};

function readPublicEnv(value: string | undefined): string {
  return (value ?? '').trim();
}

/**
 * Public Cognito hosted-UI settings. The app client secret is never read here.
 * Each `NEXT_PUBLIC_*` name must be a direct property access so Next.js inlines it
 * into the browser bundle. A dynamic `process.env[name]` lookup stays empty on the client.
 */
export function readSocialOAuthPublicConfig(): SocialOAuthPublicConfig {
  return {
    cognitoDomain: readPublicEnv(process.env.NEXT_PUBLIC_COGNITO_DOMAIN),
    cognitoAppClientId: readPublicEnv(process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID),
    googleIdentityProvider: readPublicEnv(process.env.NEXT_PUBLIC_COGNITO_GOOGLE_IDENTITY_PROVIDER),
    facebookIdentityProvider: readPublicEnv(process.env.NEXT_PUBLIC_COGNITO_FACEBOOK_IDENTITY_PROVIDER),
    oauthScopes: readPublicEnv(process.env.NEXT_PUBLIC_COGNITO_OAUTH_SCOPES),
    redirectUriOverride: readPublicEnv(process.env.NEXT_PUBLIC_SOCIAL_OAUTH_REDIRECT_URI),
    authorizeUrlOverride: readPublicEnv(process.env.NEXT_PUBLIC_COGNITO_OAUTH_AUTHORIZE_URL),
    logoutUri: readPublicEnv(process.env.NEXT_PUBLIC_COGNITO_LOGOUT_URI),
  };
}

/**
 * Origin used in invitation emails and rewritten agency deep links.
 * Prefers `NEXT_PUBLIC_APP_URL`; otherwise the current browser origin.
 */
export function getPublicAppOrigin(): string {
  if (APP_URL) {
    return APP_URL;
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  return '';
}

