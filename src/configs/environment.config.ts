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

