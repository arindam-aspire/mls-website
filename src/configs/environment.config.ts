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

